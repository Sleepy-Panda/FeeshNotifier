import * as triggers from '../../constants/triggers';
import settings from "../../settings";
import { persistentData } from "../../data/data";
import { overlayCoordsData } from "../../data/overlayCoords";
import { CRIMSON_ISLE, KUUDRA } from "../../constants/areas";
import { FISHING_PROFIT_ITEMS } from "../../constants/fishingProfitItems";
import { AQUA, BOLD, GOLD, GRAY, RESET, WHITE, YELLOW, RED, EPIC, LEGENDARY, RARE, UNCOMMON, COMMON, MYTHIC, GREEN, BLUE } from "../../constants/formatting";
import { EntityFishHook } from "../../constants/javaTypes";
import { getAuctionItemPrices } from "../../utils/auctionPrices";
import { getBazaarItemPrices } from "../../utils/bazaarPrices";
import { formatElapsedTime, getCleanItemName, getItemsAddedToSacks, isInChatOrInventoryGui, isInSacksGui, isInSupercraftGui, toShortNumber } from "../../utils/common";
import { getLastAuctionGuiClosedAt, getLastOdgerGuiClosedAt, getLastSacksGuiClosedAt, getLastSupercraftGuiClosedAt, getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";

let previousInventory = [];
let isSessionActive = false;
let lastHookSeenAt = null;
let displayTrackerData = {
    entriesToShow: [],
    entriesToHide: [],
    totalCheapItemsProfit: 0,
    elapsedTime: 0,
    totalProfit: 0
};

// Items added to the sacks
register("Chat", (event) => onAddedToSacks(event)).setCriteria('&6[Sacks] &r&a+').setStart();
// Items that go to the inventory (not to the sacks)
register('step', () => detectInventoryChanges()).setFps(5);

triggers.COINS_FISHED_TRIGGERS.forEach(trigger => {
    register("Chat", (coins, event) => onCoinsFished(coins)).setCriteria(trigger.trigger);
});

// &r&aYour &r&5Ender Dragon &r&aleveled up to level &r&981&r&a!&r
// &r&aYour &r&6Mammoth &r&aleveled up to level &r&92&r&a!&r
register("Chat", (petDisplayName, level, event) => onPetReachedMaxLevel(+level, petDisplayName))
    .setCriteria(`${RESET}${GREEN}Your ${RESET}` + "${petDisplayName}" + ` ${RESET}${GREEN}leveled up to level ${RESET}${BLUE}` + "${level}" + `${RESET}${GREEN}!${RESET}`)
    .setContains();

register("step", () => detectPlayersFishingHook()).setFps(2);
register('step', () => refreshPrices()).setDelay(30);
register('step', () => refreshElapsedTime()).setDelay(1);
register('step', () => refreshTrackerDisplayData()).setDelay(1);
register('renderOverlay', () => renderTrackerOverlay());


let isWorldLoaded = false;
// World.isLoaded() doesn't give the same result for some reason
// Items in the inventory are re-added to the profit tracker when swapping lobbies (probably inventory is partially empty when world is unloaded)
register("worldUnload", () => {
    isWorldLoaded = false;
    previousInventory = [];
    lastHookSeenAt = null;
    isSessionActive = false;
});
register("worldLoad", () => {
    isWorldLoaded = true;
}); 


// DisplayLine is initialized once in order to avoid multiple method calls on click.
let buttonsDisplay = new Display().hide();

let pauseTrackerDisplayLine = new DisplayLine(`${YELLOW}[Click to pause]`).setShadow(true);
pauseTrackerDisplayLine.registerClicked((x, y, mouseButton, buttonState) => {
    if (mouseButton === 0 && buttonState === false) { // When left mouse button is UP. 0 is left mouse button, false is UP, true is DOWN. 
        pauseFishingProfitTracker();
    }
});
buttonsDisplay.addLine(pauseTrackerDisplayLine);

let resetTrackerDisplayLine = new DisplayLine(`${RED}[Click to reset]`).setShadow(true);
resetTrackerDisplayLine.registerClicked((x, y, mouseButton, buttonState) => {
    if (mouseButton === 0 && buttonState === false) { // When left mouse button is UP. 0 is left mouse button, false is UP, true is DOWN. 
        resetFishingProfitTracker(false);
    }
});
buttonsDisplay.addLine(resetTrackerDisplayLine);

export function resetFishingProfitTracker(isConfirmed) {
    try {
        if (!isConfirmed) {
            new Message(
                new TextComponent(`${GOLD}[FeeshNotifier] ${WHITE}Do you want to reset Fishing profit tracker? ${RED}${BOLD}[Click to confirm]`)
                    .setClickAction('run_command')
                    .setClickValue('/feeshResetProfitTracker noconfirm')
            ).chat();
            return;
        }

        previousInventory = [];
        lastHookSeenAt = null;
        isSessionActive = false;

        displayTrackerData = {
            entriesToShow: [],
            entriesToHide: [],
            totalCheapItemsProfit: 0,
            elapsedTime: 0,
            totalProfit: 0
        };

        persistentData.fishingProfit = {
            profitTrackerItems: {},
            totalProfit: 0,
            elapsedSeconds: 0
        };
        persistentData.save();

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Fishing profit tracker was reset.`);    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to reset Fishing profit tracker.`);
	}
}

function pauseFishingProfitTracker() {
    try {
        if (!settings.fishingProfitTrackerOverlay || !isInSkyblock() || !hasFishingRodInHotbar() || !isSessionActive) {
            return;
        }
    
        previousInventory = [];
        lastHookSeenAt = null;
        isSessionActive = false;
        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Fishing profit tracker is paused. Continue fishing to resume it.`);       
    } catch (e) {
        console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to pause Fishing profit tracker.`);
    }
}

function detectPlayersFishingHook() {
    try {
        if (!settings.fishingProfitTrackerOverlay || !isWorldLoaded || !isInSkyblock() || !hasFishingRodInHotbar() || getWorldName() === KUUDRA) {
            return;
        }
    
        const playerHook = World.getAllEntitiesOfType(EntityFishHook).find(e => Player.getPlayer().field_71104_cf == e.getEntity()); // field_71104_cf = fishEntity
        if (!playerHook) {
            return;
        }
    
        const heldItem = Player.getHeldItem();
        if (heldItem?.getName()?.includes('Carnival Rod')) {
            return;
        }

        if (playerHook.isInWater() || playerHook.isInLava()) { // For rods, the player's hook must be in lava or water
            lastHookSeenAt = new Date();
            return;
        }

        const loreLines = heldItem?.getLore() || [];
        const isDirtRod = loreLines.length ? loreLines[0].includes('Dirt Rod') : false;
        if (isDirtRod) { // For dirt rod, the player's hook can be in dirt
            lastHookSeenAt = new Date();
        }
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to track player's fishing hook.`);
	}
}

function refreshElapsedTime() {
    try {
        if (!settings.fishingProfitTrackerOverlay || !isInSkyblock() || !hasFishingRodInHotbar() || getWorldName() === KUUDRA) {
            return;
        }

        const maxSecondsElapsedSinceLastAction = 60 * 6; // Time to kill any mob before despawn, e.g. Jawbus
        const elapsedSecondsSinceLastAction = (new Date() - lastHookSeenAt) / 1000;

        if (lastHookSeenAt && elapsedSecondsSinceLastAction < maxSecondsElapsedSinceLastAction) {
            isSessionActive = true;
            persistentData.fishingProfit.elapsedSeconds += 1; // TODO: save more often?
        } else {
            previousInventory = [];
            isSessionActive = false;
        }
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to refresh elapsed time.`);
	}
}

function onAddedToSacks(event) {
    try {
        if (!settings.fishingProfitTrackerOverlay || !isSessionActive || !isInSkyblock() || getWorldName() === KUUDRA || !hasFishingRodInHotbar()) {
            return;
        }
    
        const lastSacksGuiClosedAt = getLastSacksGuiClosedAt();
        if (isInSacksGui() || new Date() - lastSacksGuiClosedAt < 15 * 1000) { // Sacks closed < 15 seconds ago
            return;
        }

        const lastSupercraftGuiClosedAt = getLastSupercraftGuiClosedAt();
        if (isInSupercraftGui() || new Date() - lastSupercraftGuiClosedAt < 15 * 1000) { // Supercraft closed < 10 seconds ago
            return;
        }

        const itemsAddedToSacks = getItemsAddedToSacks(EventLib.getMessage(event));
        
        for (let itemAddedToSack of itemsAddedToSacks) {
            const itemName = getCleanItemName(itemAddedToSack.itemName);

            if (!itemAddedToSack.difference || !itemName) {
                continue;
            }

            const item = getFishingProfitItemByName(itemName);
            const itemId = item?.itemId;
            if (!item || !itemId) {
                continue;
            }
    
            const lastOdgerGuiClosedAt = getLastOdgerGuiClosedAt();
            if (itemId?.startsWith('MAGMA_FISH') && lastOdgerGuiClosedAt && new Date() - lastOdgerGuiClosedAt < 15 * 1000) { // User probably just filleted trophy fish
                continue;
            }

            const currentAmount = persistentData.fishingProfit.profitTrackerItems[itemId] ? persistentData.fishingProfit.profitTrackerItems[itemId].amount : 0;
            const newAmount = currentAmount + itemAddedToSack.difference;
    
            persistentData.fishingProfit.profitTrackerItems[itemId] = {
                itemName: itemName,
                itemDisplayName: item.itemDisplayName,
                itemId: itemId,
                amount: newAmount,
            };
            persistentData.save();
            refreshPrices();
            refreshTrackerDisplayData();
        }
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to handle adding to the sacks.`);
	}
}

function refreshPrices() {
    try {
        if (!settings.fishingProfitTrackerOverlay || !persistentData || !persistentData.fishingProfit || !isInSkyblock() || getWorldName() === KUUDRA || !hasFishingRodInHotbar()) {
            return;
        }
    
        Object.entries(persistentData.fishingProfit.profitTrackerItems).forEach(([key, value]) => {
            const item = FISHING_PROFIT_ITEMS.find(i => i.itemId === key);
            if (!item) {
                return;
            }
            const itemPrice = getItemPrice(item);
            value.totalItemProfit = value.amount * itemPrice;
        });
    
        const total = Object.values(persistentData.fishingProfit.profitTrackerItems).reduce((accumulator, currentValue) => {
            return accumulator + currentValue.totalItemProfit
        }, 0);
        persistentData.fishingProfit.totalProfit = total;
        persistentData.save();
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to refresh profits.`);
	}

    function getItemPrice(item) {
        if (!item) {
            return 0;
        }
    
        if (item.amountOfMagmaFish) { // Trophy Fish
            const magmaFishBazaarPrices = getBazaarItemPrices('MAGMA_FISH');
            const magmaFishPrice = settings.fishingProfitTrackerMode === 1 ? magmaFishBazaarPrices?.instaSell : magmaFishBazaarPrices?.sellOffer;
            return item.amountOfMagmaFish * (magmaFishPrice || 0);
        }
    
        if (settings.calculateProfitInCrimsonEssence && item.salvage && item.salvage.essenceType === 'ESSENCE_CRIMSON') { // Salvageable
            const essenceBazaarPrices = getBazaarItemPrices(item.salvage.essenceType);
            const essencePrice = settings.fishingProfitTrackerMode === 1 ? essenceBazaarPrices?.instaSell : essenceBazaarPrices?.sellOffer;
            return item.salvage.essenceCount * (essencePrice || 0);
        }

        const itemId = item.itemId;
        const bazaarPrices = getBazaarItemPrices(itemId);
    
        let itemPrice = settings.fishingProfitTrackerMode === 1 ? bazaarPrices?.instaSell : bazaarPrices?.sellOffer;
    
        if (!bazaarPrices) {
            const auctionPrices = getAuctionItemPrices(itemId);
            itemPrice = auctionPrices?.lbin;
    
            if (!auctionPrices) {
                const npcPrices = item.npcPrice;
                itemPrice = npcPrices;
            }
        }
    
        return itemPrice || 0;
    }
}

function onCoinsFished(coins) {
    try {
        if (!settings.fishingProfitTrackerOverlay || !coins || !isInSkyblock() || getWorldName() === KUUDRA || !hasFishingRodInHotbar()) {
            return;
        }
    
        const itemId = 'FISHED_COINS';
        const coinsWithoutSeparator = +(coins.replace(/,/g, ''));
        const item = persistentData.fishingProfit.profitTrackerItems[itemId];
    
        const currentAmount = item?.amount || 0;
        const currentProfit = item?.totalItemProfit || 0;
    
        persistentData.fishingProfit.profitTrackerItems[itemId] = {
            itemName: 'Fished Coins',
            itemDisplayName: `${GOLD}Fished Coins`,
            itemId: itemId,
            amount: currentAmount + 1,
            totalItemProfit: currentProfit + coinsWithoutSeparator,
        };
        persistentData.save();
        refreshPrices();
        refreshTrackerDisplayData();  
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to track fished coins.`);
	}
}

function onPetReachedMaxLevel(level, petDisplayName) {
    try {
        if (level !== 100 && level !== 200) {
            return;
        }

        if (!settings.fishingProfitTrackerOverlay || !petDisplayName || !isSessionActive || !isInSkyblock() || getWorldName() !== CRIMSON_ISLE || !hasFishingRodInHotbar()) {
            return;
        }
    
        const petName = petDisplayName.removeFormatting();
        const rarityColorCode = petDisplayName.substring(0, 2);
        const rarityCode = (function (rarityColorCode) {
            switch (rarityColorCode) {
                case COMMON: return 0;
                case UNCOMMON: return 1;
                case RARE: return 2;
                case EPIC: return 3;
                case LEGENDARY: return 4;
                case MYTHIC: return 5;
                default: return 0;
            }
        })(rarityColorCode);
        
        const baseItemId = petName.split(' ').join('_').toUpperCase();
        const itemIdMaxLevel = baseItemId + ';' + rarityCode + '+' + level; // FLYING_FISH;4+100 GOLDEN_DRAGON;4+200
        //const itemIdFirstLevel = baseItemId + ';' + rarityCode;

        const item = persistentData.fishingProfit.profitTrackerItems[itemIdMaxLevel];
        const auctionPrices = getAuctionItemPrices(itemIdMaxLevel);
        const itemPrice = auctionPrices?.lbin;

        const currentAmount = item?.amount || 0;
        const currentProfit = item?.totalItemProfit || 0;

        persistentData.fishingProfit.profitTrackerItems[itemIdMaxLevel] = {
            itemName: petName,
            itemDisplayName: `${GRAY}[Lvl ${level}] ${petDisplayName}`,
            itemId: itemIdMaxLevel,
            amount: currentAmount + 1,
            totalItemProfit: currentProfit + itemPrice,
        };
        persistentData.save();
        refreshPrices();
        refreshTrackerDisplayData();   
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to track pet level maxed.`);
	}
}

function detectInventoryChanges() {
    try {
        if (!settings.fishingProfitTrackerOverlay || !isWorldLoaded || !isSessionActive || !isInSkyblock() || getWorldName() === KUUDRA || !hasFishingRodInHotbar()) {
            previousInventory = [];
            return;
        }

        if (!previousInventory || !previousInventory.length) {
            const currentInventory = getCurrentInventory();
            previousInventory = currentInventory;
        }

        const heldItem = Player.getPlayer()?.field_71071_by?.func_70445_o();
        if (heldItem) {
            var item = new Item(heldItem);
            if (item) {
                return; // Do not recalculate inventory while a player is moving an item
            }
        }

        const currentInventory = getCurrentInventory();

        let isInChest = Client.isInGui() && Client.currentGui?.getClassName() === 'GuiChest';
        if (!isInChest) {
            const uniqueItemIds = currentInventory.map(i => i.itemId).filter(id => !!id).filter((x, i, a) => a.indexOf(x) == i);
            for (let itemId of uniqueItemIds) {
                const previousTotal = previousInventory.filter(i => i.itemId === itemId).reduce((partialSum, a) => partialSum + a.amount, 0);
                const currentTotal = currentInventory.filter(i => i.itemId === itemId).reduce((partialSum, a) => partialSum + a.amount, 0);

                if (currentTotal > previousTotal) {
                    onItemAddedToInventory(itemId, previousTotal, currentTotal);
                }
            }    
        }

        previousInventory = currentInventory;
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to track inventory state.`);
	}

    function getCurrentInventory() {
        let currentInventory = [];
        const inventorySlots = Player?.getInventory()?.getItems() || [];
    
        for (var slotIndex = 0; slotIndex < inventorySlots.length; slotIndex++) {
            if (slotIndex >= 36) { // Armor slots 36-39
                continue;
            }

            let item = inventorySlots[slotIndex];
            if (!item) {
                currentInventory[slotIndex] = { itemId: null, amount: 0 };
                continue;
            }
    
            let slotItemName = getCleanItemName(item?.getName());

            if (slotItemName === 'Attribute Shard' || slotItemName === 'Enchanted Book') {
                const loreLines = item.getLore();
                const description = loreLines[1].removeFormatting();
                slotItemName += ` (${description})`;
            }

            if (slotItemName === 'Fishing Exp Boost') {
                const loreLines = item.getLore();
                const description = loreLines.find(line => line.endsWith('PET ITEM')).removeFormatting().split(' ')[0];
                slotItemName += ` (${description})`;
            }

            if (slotItemName.startsWith('[Lvl 1] ')) {
                const extraAttributes = item?.getNBT()?.getCompoundTag('tag')?.getCompoundTag('ExtraAttributes');
                const nbtId = extraAttributes?.getString('id');
                if (!nbtId || nbtId !== 'PET') {
                    continue;
                }
                const petInfo = JSON.parse(extraAttributes?.getString('petInfo'));
                const rarity = petInfo?.tier;
                slotItemName += ` (${rarity?.toUpperCase()})`;
            }

            const itemId = getFishingProfitItemByName(slotItemName)?.itemId;  
            if (itemId) {
                currentInventory[slotIndex] = { itemId: itemId, amount: item.getStackSize() || 0 };
            } else {
                currentInventory[slotIndex] = { itemId: null, amount: 0 };
            }
        }
    
        return currentInventory;
    }

    function onItemAddedToInventory(itemId, previousCount, newCount) {
        const lastOdgerGuiClosedAt = getLastOdgerGuiClosedAt();
        if (itemId?.startsWith('MAGMA_FISH') && lastOdgerGuiClosedAt && new Date() - lastOdgerGuiClosedAt < 1000) { // User probably just filleted trophy fish
            return;
        }

        const lastAuctionGuiClosedAt = getLastAuctionGuiClosedAt();
        if (lastAuctionGuiClosedAt && new Date() - lastAuctionGuiClosedAt < 1000) { // Something is probably claimed from AH
            return;
        }

        const item = FISHING_PROFIT_ITEMS.find(i => i.itemId === itemId);
        if (!item) {
            return;
        }

        const difference = newCount - previousCount;
        if (difference > 0) {
            const currentAmount = persistentData.fishingProfit.profitTrackerItems[itemId] ? persistentData.fishingProfit.profitTrackerItems[itemId].amount : 0;
            const newAmount = currentAmount + difference;
    
            persistentData.fishingProfit.profitTrackerItems[itemId] = {
                itemName: item.itemName,
                itemDisplayName: item.itemDisplayName,
                itemId: itemId,
                amount: newAmount,
            };
            persistentData.save();
            refreshPrices();
            refreshTrackerDisplayData();
        }
    }
}

function getFishingProfitItemByName(itemName) {
    return FISHING_PROFIT_ITEMS.find(i => i.itemName?.toLowerCase() === itemName?.toLowerCase());
}

function refreshTrackerDisplayData() {
    try {
        if (!settings.fishingProfitTrackerOverlay ||
            !persistentData || !persistentData.fishingProfit ||
            (!persistentData.fishingProfit.totalProfit && !persistentData.fishingProfit.profitTrackerItems.length && !persistentData.fishingProfit.elapsedSeconds) ||
            !isInSkyblock() ||
            getWorldName() === KUUDRA ||
            !hasFishingRodInHotbar()) {
            return;
        }
    
        const entries = Object.entries(persistentData.fishingProfit.profitTrackerItems)
            .map(([key, value]) => {
                return { item: value.itemDisplayName, amount: value.amount, profit: value.totalItemProfit };
            })
            .sort((a, b) => b.profit - a.profit); // Most expensive at the top
    
        const MIN_PRICE = +settings.fishingProfitTracker_hideCheaperThan || 0;
        const TOP_N = settings.fishingProfitTracker_showTop || 50;
    
        const expensiveEntries = entries.filter(e => e.profit >= MIN_PRICE || e.item.includes('Dye'));
        const cheapEntries = entries.filter(e => e.profit < MIN_PRICE && !e.item.includes('Dye'));
        const [toShow, toHide] = splitArray(expensiveEntries, TOP_N);
    
        displayTrackerData.entriesToShow = toShow;
        displayTrackerData.entriesToHide = toHide.concat(cheapEntries);
        displayTrackerData.elapsedTime = persistentData.fishingProfit.elapsedSeconds;
        displayTrackerData.totalProfit = persistentData.fishingProfit.totalProfit;

        if (displayTrackerData.entriesToHide.length) {
            displayTrackerData.totalCheapItemsProfit = displayTrackerData.entriesToHide.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.profit
            }, 0);
        } else {
            displayTrackerData.totalCheapItemsProfit = 0;
        }    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to refresh tracker data.`);
	}
}

function renderTrackerOverlay() {
    try {
        if (!settings.fishingProfitTrackerOverlay ||
            (!displayTrackerData.entriesToShow.length && !displayTrackerData.entriesToHide.length && !displayTrackerData.elapsedTime && !displayTrackerData.totalProfit) ||
            !isInSkyblock() ||
            getWorldName() === KUUDRA ||
            !hasFishingRodInHotbar()
        ) {
            buttonsDisplay.hide();
            return;
        }
    
        let overlayText = `${AQUA}${BOLD}Fishing profit tracker\n`;

        displayTrackerData.entriesToShow.forEach((entry) => {
            overlayText += `${GRAY}- ${WHITE}${entry.amount}${GRAY}x ${entry.item}: ${GOLD}${toShortNumber(entry.profit)}\n`;
        });
    
        if (displayTrackerData.entriesToHide.length) {
            overlayText += `${GRAY}- ${WHITE}${displayTrackerData.entriesToHide.length}${GRAY}x Cheap items: ${GOLD}${toShortNumber(displayTrackerData.totalCheapItemsProfit)}\n`;
        }
    
        overlayText += `\n${AQUA}Total: ${GOLD}${toShortNumber(displayTrackerData.totalProfit)}\n`;
        overlayText += `\n${AQUA}Elapsed time: ${WHITE}${formatElapsedTime(displayTrackerData.elapsedTime)}`;  
    
        const overlay = new Text(overlayText, overlayCoordsData.fishingProfitTrackerOverlay.x, overlayCoordsData.fishingProfitTrackerOverlay.y)
            .setShadow(true)
            .setScale(overlayCoordsData.fishingProfitTrackerOverlay.scale);
        overlay.draw();
    
        const shouldShowButtons = isInChatOrInventoryGui();
        if (shouldShowButtons) {
            resetTrackerDisplayLine.setScale(overlayCoordsData.fishingProfitTrackerOverlay.scale - 0.2);
            pauseTrackerDisplayLine.setScale(overlayCoordsData.fishingProfitTrackerOverlay.scale - 0.2);
            buttonsDisplay
                .setRenderX(overlayCoordsData.fishingProfitTrackerOverlay.x)
                .setRenderY(overlayCoordsData.fishingProfitTrackerOverlay.y + overlay.getHeight() + 2).show();
        } else {
            buttonsDisplay.hide();
        }    
    }
    catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to render tracker overlay.`);
	}
}

function splitArray(array, count) {
    if (!array || !array.length) {
        return [[], []];
    }
    return [array.slice(0, count), array.slice(count)]
}