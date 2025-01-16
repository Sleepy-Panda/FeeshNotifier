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
import { formatElapsedTime, isInChatOrInventoryGui } from "../../utils/common";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";

let previousInventory = [];
let isSessionActive = false;
let lastHookSeenAt = null;
let lastSacksGuiClosedAt = null;
let lastOdgerGuiClosedAt = null;


// TODOs:
// - Items claimed from AH added to the tracker
// - Not enough time to kill reindrake, session is inactive when Prosperity book is dropped
// - Items re-added to tracker when using slot locking from NEU
// - Double-check items NPC price
// - Test tracker for all possible locations


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

register('step', () => refreshProfits()).setDelay(30);
register("step", () => detectPlayersFishingHook()).setFps(2);
register('step', () => refreshElapsedTime()).setDelay(1);

register('renderOverlay', () => renderTrackerOverlay());


let isWorldLoaded = false;
// World.isLoaded() doesn't give the same result for some reason
// Items in the inventory are re-added to the profit tracker when swapping lobbies (probably inventory is partially empty when world is unloaded)
register("worldUnload", () => {
    isWorldLoaded = false;
    lastHookSeenAt = null;
    isSessionActive = false;
});
register("worldLoad", () => {
    isWorldLoaded = true;
}); 


register("guiClosed", (gui) => {
    if (!gui) {
        return;
    }

    const chestName = gui.field_147002_h?.func_85151_d()?.func_145748_c_()?.text;
    if (!chestName) {
        return;
    }

    if (chestName.includes('Sack')) {
        lastSacksGuiClosedAt = new Date();
    } else if (chestName.includes('Trophy Fishing')) {
        lastOdgerGuiClosedAt = new Date();
    }
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

        lastHookSeenAt = null;
        lastSacksGuiClosedAt = null;
        lastOdgerGuiClosedAt = null;
        isSessionActive = false;
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
        if (!settings.fishingProfitTrackerOverlay || !isInSkyblock() || !hasFishingRodInHotbar() || getWorldName() === KUUDRA || !isSessionActive) {
            return;
        }
    
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
    
        if (playerHook.isInWater() || playerHook.isInLava()) { // For rods, the player's hook must be in lava or water
            lastHookSeenAt = new Date();
            return;
        }

        const heldItem = Player.getHeldItem();
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

        const maxSecondsElapsedSinceLastAction = 120; // Enough time to kill Lord Jawbus?
        const elapsedSecondsSinceLastAction = (new Date() - lastHookSeenAt) / 1000;

        if (lastHookSeenAt && elapsedSecondsSinceLastAction < maxSecondsElapsedSinceLastAction) {
            isSessionActive = true;
            persistentData.fishingProfit.elapsedSeconds += 1; // TODO: save?
        } else {
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
    
        if (isInSacks() || new Date() - lastSacksGuiClosedAt < 10 * 1000) { // Sacks closed < 10 seconds ago
            return;
        }

        const addedItemsMessage = new Message(EventLib.getMessage(event))
            .getMessageParts()
            .find(part => part.getHoverValue()?.includes('Added items:'))?.hoverValue || '';
    
        if (!addedItemsMessage) {
            return;
        }
    
        const addedItemsRegex = new RegExp(/(\+[\d,]+) (.+) \((.+)\)/, "g"); // +1,344 Pufferfish (Fishing Sack)
        let match = addedItemsRegex.exec(addedItemsMessage);
    
        while (!!match) {
            const difference = +match[1]?.removeFormatting()?.replace(/\+/g, '')?.replace(/,/g, '') || 0;
            const itemName = getCleanItemName(match[2]);
            const sackName = match[3]?.removeFormatting();
        
            if (!difference || !itemName) {
                match = addedItemsRegex.exec(addedItemsMessage);
                continue;
            }
    
            const item = getItemByName(itemName);
            const itemId = item?.itemId;
    
            if (!item || !itemId) {
                match = addedItemsRegex.exec(addedItemsMessage);
                continue;
            }
    
            if (itemId?.startsWith('MAGMA_FISH') && lastOdgerGuiClosedAt && new Date() - lastOdgerGuiClosedAt < 10 * 1000) { // User probably just filleted trophy fish
                match = addedItemsRegex.exec(addedItemsMessage);
                continue;
            }

            const currentAmount = persistentData.fishingProfit.profitTrackerItems[itemId] ? persistentData.fishingProfit.profitTrackerItems[itemId].amount : 0;
            const newAmount = currentAmount + difference;
    
            persistentData.fishingProfit.profitTrackerItems[itemId] = {
                itemName: itemName,
                itemDisplayName: item.itemDisplayName,
                itemId: itemId,
                amount: newAmount,
            };
            persistentData.save();
            refreshProfits();
    
            match = addedItemsRegex.exec(addedItemsMessage);
        }
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to handle adding to the sacks.`);
	}

    function isInSacks() {
        if (Client.Companion.isInGui() && Client.currentGui?.getClassName() === 'GuiChest') {
            const chestName = Client.currentGui?.get()?.field_147002_h?.func_85151_d()?.func_145748_c_()?.text;
            if (chestName && chestName.includes('Sack')) {
                return true;
            }
        }
        return false;
    }
}

function refreshProfits() {
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
            return item.amountOfMagmaFish * magmaFishBazaarPrices?.sellOffer;
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
        refreshProfits();   
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
        const itemIdMaxLevel = baseItemId + ';' + rarityCode + '+100'; // FLYING_FISH;4+100
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
        refreshProfits();   
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to track pet level maxed.`);
	}
}

function detectInventoryChanges() {
    try {
        if (!settings.fishingProfitTrackerOverlay || !isWorldLoaded || !isSessionActive || !isInSkyblock() || getWorldName() === KUUDRA || !hasFishingRodInHotbar()) {
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

        let isInChest = false;

        if (Client.Companion.isInGui() && Client.currentGui?.getClassName() === 'GuiChest') {
            isInChest = true;
        }

        if (!isInChest) {
            const uniqueItemIds = currentInventory.map(i => i.itemId).filter(id => !!id).filter((x, i, a) => a.indexOf(x) == i);
            for (const itemId of uniqueItemIds) {
                const previousTotal = previousInventory.filter(i => i.itemId === itemId).reduce((partialSum, a) => partialSum + a.amount, 0);
                const currentTotal = currentInventory.filter(i => i.itemId === itemId).reduce((partialSum, a) => partialSum + a.amount, 0);

                if (currentTotal > previousTotal) {
                    console.log(itemId + ' ' + previousTotal + ' ' + currentTotal)
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

            const itemId = getItemByName(slotItemName)?.itemId;
    
            if (itemId) {
                currentInventory[slotIndex] = { itemId: itemId, amount: item.getStackSize() || 0 };
            } else {
                currentInventory[slotIndex] = { itemId: null, amount: 0 };
            }
        }
    
        return currentInventory;
    }

    function onItemAddedToInventory(itemId, previousCount, newCount) {
        if (itemId?.startsWith('MAGMA_FISH') && lastOdgerGuiClosedAt && new Date() - lastOdgerGuiClosedAt < 1000) { // User probably just filleted trophy fish
            return;
        }

        const difference = newCount - previousCount;
        const item = FISHING_PROFIT_ITEMS.find(i => i.itemId === itemId);

        if (!item) {
            return;
        }

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
            refreshProfits();
        }
    }
}

function getCleanItemName(itemName) {
    if (itemName && /.+ §8x[\d]+$/.test(itemName)) { // Booster cookie menu or NPCs append the amount to the item name - e.g. §9Fish Affinity Talisman §8x1
        const itemNameParts = itemName.split(' ');
        itemNameParts.pop();
        itemName = itemNameParts.join(' ');
    }
    const cleanItemName = itemName?.removeFormatting()?.replace(/§L/g, ''); // For some reason, §L is not deleted when calling removeFormatting (trophy fish) 
    return cleanItemName || '';
}

function getItemByName(itemName) {
    return FISHING_PROFIT_ITEMS.find(i => i.itemName?.toLowerCase() === itemName?.toLowerCase());
}

function renderTrackerOverlay() {
    try {
        if (!settings.fishingProfitTrackerOverlay ||
            !persistentData ||
            !persistentData.fishingProfit ||
            (!persistentData.fishingProfit.totalProfit && !persistentData.fishingProfit.profitTrackerItems.length && !persistentData.fishingProfit.elapsedSeconds) ||
            !isInSkyblock() ||
            getWorldName() === KUUDRA ||
            !hasFishingRodInHotbar()
        ) {
            buttonsDisplay.hide();
            return;
        }
    
        let overlayText = `${AQUA}${BOLD}Fishing profit tracker\n`;
    
        const entries = Object.entries(persistentData.fishingProfit.profitTrackerItems)
            .map(([key, value]) => {
                return { item: value.itemDisplayName, amount: value.amount, profit: value.totalItemProfit };
            })
            .sort((a, b) => b.profit - a.profit); // Most expensive at the top
    
        const MIN_PRICE = 20000;
        const expensiveEntries = entries.filter(e => e.profit >= MIN_PRICE || e.item.includes('Dye'));
        const cheapEntries = entries.filter(e => e.profit < MIN_PRICE && !e.item.includes('Dye'));
        const entriesToShow = entries.length > 20 ? expensiveEntries : entries;
        const entriesToHide = entries.length > 20 ? cheapEntries : [];
    
        entriesToShow.forEach((entry) => {
            overlayText += `${GRAY}- ${WHITE}${entry.amount}${GRAY}x ${entry.item}: ${GOLD}${formatNumberToPretty(entry.profit)}\n`;
        });
    
        if (entriesToHide.length) {
            const totalCheapItemsProfit = entriesToHide.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.profit
            }, 0);
            overlayText += `${GRAY}- ${WHITE}${entriesToHide.length}${GRAY}x Other cheap items: ${GOLD}${formatNumberToPretty(totalCheapItemsProfit)}\n`;
        }
    
        overlayText += `\n`;
        overlayText += `${AQUA}Total: ${GOLD}${formatNumberToPretty(persistentData.fishingProfit.totalProfit)}\n`;
        overlayText += `\n`;
        overlayText += `${AQUA}Elapsed time: ${WHITE}${formatElapsedTime(persistentData.fishingProfit.elapsedSeconds)}`;  
    
        const overlay = new Text(overlayText, overlayCoordsData.fishingProfitTrackerOverlay.x, overlayCoordsData.fishingProfitTrackerOverlay.y)
            .setShadow(true)
            .setScale(overlayCoordsData.fishingProfitTrackerOverlay.scale);
        overlay.draw();
    
        const shouldShowReset = isInChatOrInventoryGui();
        if (shouldShowReset) {
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

    function formatNumberToPretty(number) {
        number = Math.floor(number);
    
        if (number >= 1000000000) {
            return (number / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
        }
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (number >= 1000) {
            return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
    
        return number;
    }
}
