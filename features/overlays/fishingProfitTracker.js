import * as triggers from '../../constants/triggers';
import settings from "../../settings";
import { persistentData } from "../../data/data";
import { overlayCoordsData } from "../../data/overlayCoords";
import { CRIMSON_ISLE, JERRY_WORKSHOP, KUUDRA } from "../../constants/areas";
import { FISHING_PROFIT_ITEMS } from "../../constants/fishingProfitItems";
import { AQUA, BOLD, GOLD, GRAY, RESET, WHITE, YELLOW, RED, GREEN, BLUE } from "../../constants/formatting";
import { getAuctionItemPrices, getPetRarityCode } from "../../utils/auctionPrices";
import { getBazaarItemPrices } from "../../utils/bazaarPrices";
import { formatElapsedTime, getCleanItemName, getItemsAddedToSacks, getLore, isFishingHookActive, isInChatOrInventoryGui, isInSacksGui, isInSupercraftGui, splitArray, toShortNumber } from "../../utils/common";
import { getLastGuisClosed, getLastKatUpgrade, getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";
import { playRareDropSound } from '../../utils/sound';

let isVisible = false;
let areActionsVisible = false;
let previousInventory = [];
let isSessionActive = false;
let lastHookSeenAt = null;

register("Chat", (event) => onAddedToSacks(event)).setCriteria('&6[Sacks] &r&a+').setStart(); // Items added to the sacks
register('step', () => detectInventoryChanges()).setFps(4); // Items added to the inventory

triggers.COINS_FISHED_TRIGGERS.forEach(trigger => { register("Chat", (coins, event) => onCoinsFished(coins)).setCriteria(trigger.trigger); });
triggers.ICE_ESSENCE_FISHED_TRIGGERS.forEach(trigger => { register("Chat", (count, event) => onIceEssenceFished(count)).setCriteria(trigger.trigger); });

// &r&aYour &r&5Ender Dragon &r&aleveled up to level &r&981&r&a!&r
// &r&aYour &r&6Mammoth &r&aleveled up to level &r&92&r&a!&r
register("Chat", (petDisplayName, level, event) => onPetReachedMaxLevel(+level, petDisplayName))
    .setCriteria(`${RESET}${GREEN}Your ${RESET}` + "${petDisplayName}" + ` ${RESET}${GREEN}leveled up to level ${RESET}${BLUE}` + "${level}" + `${RESET}${GREEN}!${RESET}`)
    .setContains();

register('step', () => {
    activateSessionOnPlayersFishingHook();
    refreshIsVisible();
    refreshAreActionsVisible();
}).setFps(2);
register('step', () => refreshElapsedTime()).setFps(1);
register('step', () => refreshPrices()).setDelay(30);
register('step', () => { if (settings.fishingProfitTrackerOverlayGui.isOpen()) refreshTrackerDisplayData(); }).setFps(4); // Handle move/resize

let isWorldLoaded = false;
// World.isLoaded() doesn't give the same result for some reason
// Items in the inventory are re-added to the profit tracker when swapping lobbies (probably inventory is partially empty when world is unloaded)
register("worldUnload", () => {
    isWorldLoaded = false;
    pause();
});
register("worldLoad", () => {
    isWorldLoaded = true;
}); 

register('guiClosed', (gui) => {
    if (gui?.toString()?.includes('vigilance')) { // Settings menu is closed, probably some settings have changed
        refreshPrices();
        refreshTrackerDisplayData();
    }
});

register("gameUnload", () => {
    if (settings.fishingProfitTrackerOverlay && settings.resetFishingProfitTrackerOnGameClosed && (Object.keys(persistentData.fishingProfit.profitTrackerItems).length || persistentData.fishingProfit.elapsedSeconds)) {
        resetFishingProfitTracker(true);
    }
});

let profitTrackerDisplay = new Display().hide();

export function resetFishingProfitTracker(isConfirmed) {
    try {
        if (!isConfirmed) {
            new Message(new TextComponent(`${GOLD}[FeeshNotifier] ${WHITE}Do you want to reset Fishing profit tracker? ${RED}${BOLD}[Click to confirm]`)
                .setClickAction('run_command')
                .setClickValue('/feeshResetProfitTracker noconfirm')
            ).chat();
            return;
        }

        isVisible = false;
        areActionsVisible = false;
        
        pause();

        persistentData.fishingProfit = {
            profitTrackerItems: {},
            totalProfit: 0,
            elapsedSeconds: 0
        };
        persistentData.save();

        refreshTrackerDisplayData();

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Fishing profit tracker was reset.`);    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to reset Fishing profit tracker.`);
	}
}

function pauseFishingProfitTracker() {
    try {
        if (!isVisible || !isSessionActive) {
            return;
        }

        pause();
        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Fishing profit tracker is paused. Continue fishing to resume it.`);       
    } catch (e) {
        console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to pause Fishing profit tracker.`);
    }
}

function pause() {
    previousInventory = [];
    lastHookSeenAt = null;
    isSessionActive = false;
}

function refreshIsVisible() {
    const previousIsVisible = isVisible;

    if (!settings.fishingProfitTrackerOverlay ||
        !persistentData || !persistentData.fishingProfit ||
        (!persistentData.fishingProfit.totalProfit && !Object.keys(persistentData.fishingProfit.profitTrackerItems).length && !persistentData.fishingProfit.elapsedSeconds) ||
        !isInSkyblock() ||
        getWorldName() === KUUDRA ||
        !hasFishingRodInHotbar() ||
        settings.allOverlaysGui.isOpen()
    ) {
        isVisible = false;
        pause();
    } else {
        isVisible = true;
    }

    if (previousIsVisible !== isVisible) {
        refreshPrices();
        refreshTrackerDisplayData();
    }
}

function refreshAreActionsVisible() {
    const previousAreActionsVisible = areActionsVisible;

    if (isVisible && isInChatOrInventoryGui()) {
        areActionsVisible = true;
    } else {
        areActionsVisible = false;
    }

    if (areActionsVisible || previousAreActionsVisible !== areActionsVisible) { // Handle removal/increase/decrease amount of items
        refreshPrices();
        refreshTrackerDisplayData();
    }
}

function changeItemAmount(itemId, isDelete, difference) {
    try {
        if (!isVisible) {
            return;
        }

        const item = persistentData.fishingProfit.profitTrackerItems[itemId];
        if (!item) {
            return;
        }

        if (isDelete) {
            delete persistentData.fishingProfit.profitTrackerItems[itemId];
            ChatLib.chat(`${GOLD}[FeeshNotifier] ${GRAY}${item.amount}x ${item.itemDisplayName} ${WHITE}removed from the Fishing profit tracker.`);   
        } else {
            const newAmount = persistentData.fishingProfit.profitTrackerItems[itemId].amount + difference;
            if (!newAmount) {
                delete persistentData.fishingProfit.profitTrackerItems[itemId];
            } else {
                persistentData.fishingProfit.profitTrackerItems[itemId].amount = newAmount;
            }
            ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Changed amount of ${item.itemDisplayName} ${WHITE}to ${GRAY}${newAmount}x ${WHITE}in the Fishing profit tracker.`);   
        }

        persistentData.save();
    } catch (e) {
        console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to remove item from Fishing profit tracker.`);
    }
}

function activateSessionOnPlayersFishingHook() {
    try {
        if (!settings.fishingProfitTrackerOverlay || !isWorldLoaded || !isInSkyblock() || !hasFishingRodInHotbar() || getWorldName() === KUUDRA) {
            return;
        }
    
        const isHookActive = isFishingHookActive();

        if (isHookActive) {
            activateTimer();
        }
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to track player's fishing hook.`);
	}

    function activateTimer() {
        lastHookSeenAt = new Date();
        isSessionActive = true;

        if (!persistentData.fishingProfit.elapsedSeconds) {
            persistentData.fishingProfit.elapsedSeconds = 1;
            persistentData.save();
        }
    }
}

function refreshElapsedTime() {
    try {
        if (!isVisible || !isSessionActive) {
            return;
        }

        const maxSecondsElapsedSinceLastAction = 60 * 6; // Time to kill any mob before despawn, e.g. Jawbus
        const elapsedSecondsSinceLastAction = (new Date() - lastHookSeenAt) / 1000;

        if (lastHookSeenAt && elapsedSecondsSinceLastAction < maxSecondsElapsedSinceLastAction) {
            persistentData.fishingProfit.elapsedSeconds += 1;

            const elapsedTimeLine = profitTrackerDisplay.getLines().find(l => l.getText().getString().includes('Elapsed time:'));
            if (elapsedTimeLine) {
                elapsedTimeLine.setText(getElapsedTimeLineText(persistentData.fishingProfit.elapsedSeconds)).setShadow(true).setScale(overlayCoordsData.fishingProfitTrackerOverlay.scale);
            }
        } else {
            pause();
        }
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to refresh elapsed time.`);
	}
}

function refreshPrices() {
    try {
        if (!isVisible) {
            return;
        }
    
        Object.entries(persistentData.fishingProfit.profitTrackerItems).forEach(([key, value]) => {
            const item = FISHING_PROFIT_ITEMS.find(i => i.itemId === key);
            if (!item) {
                return;
            }

            if (item.itemId === 'ORB_OF_ENERGY') { // Calculate Orbs of Energy price as Pulse Rings + remainder in Orb of Energy
                const pulseRingPrices = getAuctionItemPrices('PULSE_RING');
                const pulseRingPrice = pulseRingPrices?.lbin || 0;
                const pulseRingsCount = pulseRingPrice ? Math.floor(value.amount / 256) : 0;
                const remainder = pulseRingsCount ? value.amount % 256 : value.amount;

                const itemPrice = getItemPrice(item);
                value.totalItemProfit = (pulseRingsCount * pulseRingPrice) + (remainder * itemPrice);
            } else {
                const itemPrice = getItemPrice(item);
                value.totalItemProfit = value.amount * itemPrice;    
            }
        });
    
        const total = Object.values(persistentData.fishingProfit.profitTrackerItems).reduce((accumulator, currentValue) => { return accumulator + currentValue.totalItemProfit }, 0);
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

function onAddedToSacks(event) {
    try {
        if (!isVisible || !event || !isSessionActive) {
            return;
        }
    
        const lastGuisClosed = getLastGuisClosed();
        if (isInSacksGui() || new Date() - lastGuisClosed.lastSacksGuiClosedAt < 15 * 1000) { // Sacks closed < 15 seconds ago
            return;
        }

        if (isInSupercraftGui() || new Date() - lastGuisClosed.lastSupercraftGuiClosedAt < 15 * 1000) { // Supercraft closed < 15 seconds ago
            return;
        }

        const itemsAddedToSacks = getItemsAddedToSacks(EventLib.getMessage(event));
        let isUpdated = false;

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
    
            if (itemId?.startsWith('MAGMA_FISH') && lastGuisClosed.lastOdgerGuiClosedAt && new Date() - lastGuisClosed.lastOdgerGuiClosedAt < 15 * 1000) { // User probably just filleted trophy fish
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
            isUpdated = true;
        }

        if (isUpdated) {
            refreshTrackerDisplayData();
        }
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to handle adding to the sacks.`);
	}
}

function onCoinsFished(coins) {
    try {
        if (!isVisible || !coins || !isSessionActive) {
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

function onIceEssenceFished(count) {
    try {
        if (!isVisible || !count || !isSessionActive || getWorldName() !== JERRY_WORKSHOP) {
            return;
        }

        const fishingProfitItem = FISHING_PROFIT_ITEMS.find(i => i.itemId === 'ESSENCE_ICE');
        const itemId = fishingProfitItem?.itemId;
        if (!fishingProfitItem || !itemId) {
            return;
        }

        const essenceCountWithoutSeparator = +(count.replace(/,/g, ''));
        const item = persistentData.fishingProfit.profitTrackerItems[itemId];
        const currentAmount = item?.amount || 0;

        persistentData.fishingProfit.profitTrackerItems[itemId] = {
            itemName: fishingProfitItem.itemName,
            itemDisplayName: fishingProfitItem.itemDisplayName,
            itemId: itemId,
            amount: currentAmount + essenceCountWithoutSeparator,
        };
        persistentData.save();

        refreshPrices();
        refreshTrackerDisplayData();  
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to track fished ice essence.`);
	}
}

function onPetReachedMaxLevel(level, petDisplayName) {
    try {
        if (level !== 100 && level !== 200) {
            return;
        }

        if (!isVisible || !petDisplayName || !isSessionActive || getWorldName() !== CRIMSON_ISLE) {
            return;
        }
    
        const petName = petDisplayName.removeFormatting();
        const rarityColorCode = petDisplayName.substring(0, 2);
        const rarityCode = getPetRarityCode(rarityColorCode);
        const baseItemId = petName.split(' ').join('_').toUpperCase();
        const itemIdMaxLevel = baseItemId + ';' + rarityCode + '+' + level; // FLYING_FISH;4+100 GOLDEN_DRAGON;4+200
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
        if (!isVisible || !isWorldLoaded || !isSessionActive) {
            previousInventory = [];
            return;
        }

        if (!previousInventory || !previousInventory.length) {
            const currentInventory = getFishingProfitItemsInCurrentInventory();
            previousInventory = currentInventory;
        }

        const heldItem = Player.getPlayer()?.field_71071_by?.func_70445_o();
        if (heldItem) {
            var item = new Item(heldItem);
            if (item) {
                return; // Do not recalculate inventory while a player is moving an item
            }
        }

        const hasBarrier = (Player?.getInventory()?.getItems() || []).find(i => i?.getName() === 'Barrier'); // NEU slot binding replaces inventory items with Barriers
        if (hasBarrier) {
            return;
        }
        
        const currentInventory = getFishingProfitItemsInCurrentInventory();

        let isInChest = Client.isInGui() && Client.currentGui?.getClassName() === 'GuiChest';
        if (!isInChest) {
            const uniqueItemIds = currentInventory.map(i => i.itemId).filter(id => !!id).filter((x, i, a) => a.indexOf(x) == i);
            let isUpdated = false;
            for (let itemId of uniqueItemIds) {
                const previousTotal = previousInventory.filter(i => i.itemId === itemId).reduce((partialSum, a) => partialSum + a.amount, 0);
                const currentTotal = currentInventory.filter(i => i.itemId === itemId).reduce((partialSum, a) => partialSum + a.amount, 0);

                if (currentTotal > previousTotal) {
                    onItemAddedToInventory(itemId, previousTotal, currentTotal);
                    isUpdated = true;
                }
            }

            if (isUpdated) {
                refreshTrackerDisplayData();
            }
        }

        previousInventory = currentInventory;
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to track inventory state.`);
	}

    function getFishingProfitItemsInCurrentInventory() {
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
                const loreLines = getLore(item);
                const description = loreLines[0].removeFormatting();
                slotItemName += ` (${description})`;
            }

            if (slotItemName === 'Fishing Exp Boost') {
                const loreLines = getLore(item);
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
        const item = FISHING_PROFIT_ITEMS.find(i => i.itemId === itemId);
        if (!item) {
            return;
        }

        if (isInventoryPotentiallyDirty(itemId, item)) {
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

            if (settings.shouldAnnounceRareDropsWhenPickup && item.shouldAnnounceRareDrop) {
                const diffText = difference > 1 ? ` ${RESET}${GRAY}${difference}x` : '';
                ChatLib.chat(`${GOLD}[FeeshNotifier] ${GOLD}${BOLD}RARE DROP! ${RESET}${item.itemDisplayName}${diffText}`);
                playRareDropSound();
            }
        }
    }

    function isInventoryPotentiallyDirty(itemId, item) {
        const lastGuisClosed = getLastGuisClosed();

        if (itemId?.startsWith('MAGMA_FISH') && lastGuisClosed.lastOdgerGuiClosedAt && new Date() - lastGuisClosed.lastOdgerGuiClosedAt < 1000) { // User probably just filleted trophy fish
            return true;
        }

        if (lastGuisClosed.lastStorageGuiClosedAt && new Date() - lastGuisClosed.lastStorageGuiClosedAt < 1000) {
            return true;
        }

        if (lastGuisClosed.lastAuctionGuiClosedAt && new Date() - lastGuisClosed.lastAuctionGuiClosedAt < 3000) {
            return true;
        }

        if (lastGuisClosed.lastBazaarGuiClosedAt && new Date() - lastGuisClosed.lastBazaarGuiClosedAt < 1000) {
            return true;
        }

        if (lastGuisClosed.lastCraftGuiClosedAt && new Date() - lastGuisClosed.lastCraftGuiClosedAt < 1000) {
            return true;
        }

        if (lastGuisClosed.lastSupercraftGuiClosedAt && new Date() - lastGuisClosed.lastSupercraftGuiClosedAt < 1000) {
            return true;
        }

        const lastKatUpgrade = getLastKatUpgrade(); // Ignore pets that are claimed from Kat
        if (lastKatUpgrade.lastPetClaimedAt && new Date() - lastKatUpgrade.lastPetClaimedAt < 7 * 1000 &&
            item.itemDisplayName.removeFormatting().includes(lastKatUpgrade.petDisplayName?.removeFormatting())) { 
            return true;
        }

        return false;
    }
}

function getFishingProfitItemByName(itemName) {
    return FISHING_PROFIT_ITEMS.find(i => 
        i.itemName?.toLowerCase() === itemName?.toLowerCase() ||
        (i.itemAlternateNames && i.itemAlternateNames.some(itemAlternameName => itemAlternameName?.toLowerCase() === itemName?.toLowerCase()))
    );
}

function getElapsedTimeLineText(elapsedTime) {
    return `\n${AQUA}Elapsed time: ${WHITE}${formatElapsedTime(elapsedTime)}`
}

function refreshTrackerDisplayData() {
    try {
        if (!isVisible) {
            if (profitTrackerDisplay.getShouldRender()) {
                clearDisplay();
                profitTrackerDisplay.hide();  
            }
            return;
        }
    
        let displayTrackerData = {
            entriesToShow: [],
            entriesToHide: [],
            totalCheapItemsCount: 0,
            totalCheapItemsTypesCount: 0,
            totalCheapItemsProfit: 0,
            elapsedTime: 0,
            totalProfit: 0,
            profitPerHour: 0
        };

        const entries = Object.entries(persistentData.fishingProfit.profitTrackerItems)
            .map(([key, value]) => {
                return { itemId: value.itemId, item: value.itemDisplayName, amount: value.amount, profit: value.totalItemProfit };
            })
            .sort((a, b) => b.profit - a.profit); // Most expensive at the top
    
        const MIN_PRICE = +settings.fishingProfitTracker_hideCheaperThan || 0;
        const TOP_N = settings.fishingProfitTracker_showTop || 50;
    
        const expensiveEntries = entries.filter(e => e.profit >= MIN_PRICE || e.item.includes('Kuudra Key')); // Kuudra keys can't be sold but they're valuable to show in tracker
        const cheapEntries = entries.filter(e => e.profit < MIN_PRICE && !e.item.includes('Kuudra Key'));
        const [toShow, toHide] = splitArray(expensiveEntries, TOP_N);
    
        displayTrackerData.entriesToShow = toShow;
        displayTrackerData.entriesToHide = toHide.concat(cheapEntries);
        displayTrackerData.elapsedTime = persistentData.fishingProfit.elapsedSeconds;
        displayTrackerData.totalProfit = persistentData.fishingProfit.totalProfit;

        const elapsedHours = persistentData.fishingProfit.elapsedSeconds / 3600;
        displayTrackerData.profitPerHour = elapsedHours
            ? Math.floor(displayTrackerData.totalProfit / elapsedHours)
            : 0;

        displayTrackerData.totalCheapItemsTypesCount = displayTrackerData.entriesToHide.length;
        displayTrackerData.totalCheapItemsCount = displayTrackerData.entriesToHide.reduce((accumulator, currentValue) => { return accumulator + currentValue.amount }, 0);

        if (displayTrackerData.entriesToHide.length) {
            displayTrackerData.totalCheapItemsProfit = displayTrackerData.entriesToHide.reduce((accumulator, currentValue) => { return accumulator + currentValue.profit }, 0);
        } else {
            displayTrackerData.totalCheapItemsProfit = 0;
        }
        
        clearDisplay();
        profitTrackerDisplay.addLine(new DisplayLine(`${AQUA}${BOLD}Fishing profit tracker`).setShadow(true).setScale(overlayCoordsData.fishingProfitTrackerOverlay.scale));

        displayTrackerData.entriesToShow.forEach((entry) => {
            const line = new DisplayLine(`${GRAY}- ${WHITE}${entry.amount}${GRAY}x ${entry.item}${GRAY}: ${GOLD}${toShortNumber(entry.profit)}`).setShadow(true).setScale(overlayCoordsData.fishingProfitTrackerOverlay.scale);
            if (areActionsVisible) {
                line.registerClicked((x, y, mouseButton, buttonState) => {
                    if (buttonState === false && (Keyboard.isKeyDown(29) || Keyboard.isKeyDown(157))) { // buttonState = false is UP. 29 and 157 is LCTRL/RCTRL https://minecraft.fandom.com/wiki/Key_codes
                        if (mouseButton === 0 && entry.itemId !== 'FISHED_COINS') { // left mouse button
                            changeItemAmount(entry.itemId, false, -1);
                        } else if (mouseButton === 1 && entry.itemId !== 'FISHED_COINS') { // right
                            changeItemAmount(entry.itemId, false, 1);
                        } else if (mouseButton === 2) { // middle
                            changeItemAmount(entry.itemId, true, 0);
                        }
                    }
                });
            }
            profitTrackerDisplay.addLine(line);
        });

        if (displayTrackerData.entriesToHide.length) {
            const line = new DisplayLine(`${GRAY}- ${WHITE}${displayTrackerData.totalCheapItemsCount}${GRAY}x Cheap items of ${WHITE}${displayTrackerData.totalCheapItemsTypesCount} ${GRAY}types: ${GOLD}${toShortNumber(displayTrackerData.totalCheapItemsProfit)}`).setShadow(true).setScale(overlayCoordsData.fishingProfitTrackerOverlay.scale);
            profitTrackerDisplay.addLine(line);
        }
     
        if (displayTrackerData.entriesToShow.length && areActionsVisible) {
            let changeAmountTrackerDisplayLine = new DisplayLine(`\n${GRAY}[Ctrl + LCM a line for -1, Ctrl + RCM a line for +1]`).setShadow(true).setScale(overlayCoordsData.fishingProfitTrackerOverlay.scale - 0.2);
            profitTrackerDisplay.addLine(changeAmountTrackerDisplayLine);
            let removeTrackerDisplayLine = new DisplayLine(`${GRAY}[Ctrl + Middle Click a line to remove item]`).setShadow(true).setScale(overlayCoordsData.fishingProfitTrackerOverlay.scale - 0.2);
            profitTrackerDisplay.addLine(removeTrackerDisplayLine);
        }

        profitTrackerDisplay.addLine(new DisplayLine(`\n${AQUA}Total: ${GOLD}${BOLD}${toShortNumber(displayTrackerData.totalProfit)} ${RESET}${GRAY}(${GOLD}${toShortNumber(displayTrackerData.profitPerHour)}${GRAY}/h)`).setShadow(true).setScale(overlayCoordsData.fishingProfitTrackerOverlay.scale));
        profitTrackerDisplay.addLine(new DisplayLine(getElapsedTimeLineText(displayTrackerData.elapsedTime)).setShadow(true).setScale(overlayCoordsData.fishingProfitTrackerOverlay.scale));  

        if (areActionsVisible) {
            let pauseTrackerDisplayLine = new DisplayLine(`\n${YELLOW}[Click to pause]`).setShadow(true).setScale(overlayCoordsData.fishingProfitTrackerOverlay.scale - 0.2);
            pauseTrackerDisplayLine.registerClicked((x, y, mouseButton, buttonState) => {
                if (mouseButton === 0 && buttonState === false) { // When left mouse button is UP. 0 is left mouse button, false is UP, true is DOWN. 
                    pauseFishingProfitTracker();
                }
            });
            profitTrackerDisplay.addLine(pauseTrackerDisplayLine);
            
            let resetTrackerDisplayLine = new DisplayLine(`${RED}[Click to reset]`).setShadow(true).setScale(overlayCoordsData.fishingProfitTrackerOverlay.scale - 0.2);
            resetTrackerDisplayLine.registerClicked((x, y, mouseButton, buttonState) => {
                if (mouseButton === 0 && buttonState === false) {
                    resetFishingProfitTracker(false);
                }
            });
            profitTrackerDisplay.addLine(resetTrackerDisplayLine);
        }

        profitTrackerDisplay
            .setRenderX(overlayCoordsData.fishingProfitTrackerOverlay.x)
            .setRenderY(overlayCoordsData.fishingProfitTrackerOverlay.y)
            .show();
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to refresh tracker data.`);
	}

    function clearDisplay() {
        profitTrackerDisplay.getLines().forEach((line) => { line.unregisterClicked(); });
        profitTrackerDisplay.clearLines();
    }
}
