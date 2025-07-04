import * as triggers from '../../constants/triggers';
import settings, { allOverlaysGui } from "../../settings";
import { persistentData } from "../../data/data";
import { overlayCoordsData } from "../../data/overlayCoords";
import { CRIMSON_ISLE, JERRY_WORKSHOP } from "../../constants/areas";
import { FISHING_PROFIT_ITEMS } from "../../constants/fishingProfitItems";
import { AQUA, BOLD, GOLD, GRAY, RESET, WHITE, RED, YELLOW } from "../../constants/formatting";
import { getAuctionItemPrices, getPetRarityCode } from "../../utils/auctionPrices";
import { getBazaarItemPrices } from "../../utils/bazaarPrices";
import { formatElapsedTime, getCleanItemName, getItemsAddedToSacks, getLore, isFishingHookActive, isInChatOrInventoryGui, isInFishingWorld, isInSacksGui, isInSupercraftGui, splitArray, toShortNumber } from "../../utils/common";
import { getLastFishingHookSeenAt, getLastGuisClosed, getLastKatUpgrade, getWorldName, isInSkyblock } from "../../utils/playerState";
import { playRareDropSound } from '../../utils/sound';
import { registerIf } from '../../utils/registers';
import { CTRL_LEFT_CLICK_TYPE, CTRL_MIDDLE_CLICK_TYPE, CTRL_RIGHT_CLICK_TYPE, LEFT_CLICK_TYPE, Overlay, OverlayButtonLine, OverlayTextLine } from '../../utils/overlays';

let previousInventory = [];
let isSessionActive = false;

registerIf(
    register('step', () => {
        activateSessionOnPlayersFishingHook();
        refreshOverlay();
    }).setFps(2),
    () => settings.fishingProfitTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
);

registerIf(
    register('step', () => refreshElapsedTime()).setFps(1),    
    () => settings.fishingProfitTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
);

registerIf(
    register('step', () => {
        refreshPrices();
        refreshOverlay();
    }).setDelay(30),
    () => settings.fishingProfitTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
);

registerIf(
    register("Chat", (event) => onAddedToSacks(event)).setCriteria('&6[Sacks] &r&a+').setStart(), // Items added to the sacks
    () => settings.fishingProfitTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
);

registerIf(
    register('step', () => detectInventoryChanges()).setFps(4), // Items added to the inventory
    () => settings.fishingProfitTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
);

triggers.COINS_FISHED_TRIGGERS.forEach(trigger => {
    registerIf(
        register("Chat", (coins, event) => onCoinsFished(coins)).setCriteria(trigger.trigger),
        () => settings.fishingProfitTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
    );
});

triggers.ICE_ESSENCE_FISHED_TRIGGERS.forEach(trigger => {
    registerIf(
        register("Chat", (count, event) => onIceEssenceFished(count)).setCriteria(trigger.trigger),
        () => settings.fishingProfitTrackerOverlay && isInSkyblock() && getWorldName() === JERRY_WORKSHOP
    );
});

triggers.SHARD_FISHED_TRIGGERS.forEach(trigger => {
    registerIf(
        register("Chat", (shard, event) => onShardFished(shard)).setCriteria(trigger.trigger),
        () => settings.fishingProfitTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
    );
});

registerIf(
    register("Chat", (petDisplayName, level, event) => onPetReachedMaxLevel(+level, petDisplayName))
        .setCriteria(triggers.PET_LEVEL_UP_MESSAGE)
        .setContains(),
    () => settings.fishingProfitTrackerOverlay && isInSkyblock() && getWorldName() === CRIMSON_ISLE
);

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

settings.getConfig().onCloseGui(() => {
    refreshPrices();
    refreshOverlay();
});

register("gameUnload", () => {
    if (settings.fishingProfitTrackerOverlay && settings.resetFishingProfitTrackerOnGameClosed && (Object.keys(persistentData.fishingProfit.profitTrackerItems).length || persistentData.fishingProfit.elapsedSeconds)) {
        resetFishingProfitTracker(true);
    }
});

const profitTrackerOverlay = new Overlay(() => settings.fishingProfitTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName()))
    .setPositionData(overlayCoordsData.fishingProfitTrackerOverlay)
    .setIsClickable(true);

export function resetFishingProfitTracker(isConfirmed) {
    try {
        if (!isConfirmed) {
            new Message(new TextComponent(`${GOLD}[FeeshNotifier] ${WHITE}Do you want to reset Fishing profit tracker? ${RED}${BOLD}[Click to confirm]`)
                .setClickAction('run_command')
                .setClickValue('/feeshResetProfitTracker noconfirm')
            ).chat();
            return;
        }
       
        pause();

        persistentData.fishingProfit = {
            profitTrackerItems: {},
            totalProfit: 0,
            elapsedSeconds: 0
        };
        persistentData.save();

        refreshOverlay();

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Fishing profit tracker was reset.`);    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to reset Fishing profit tracker.`);
	}
}

export function pauseFishingProfitTracker() {
    try {
        if (!isTrackerVisible() || !isSessionActive) {
            return;
        }

        pause();
        refreshOverlay();
        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Fishing profit tracker is paused. Continue fishing to resume it.`);
    } catch (e) {
        console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to pause Fishing profit tracker.`);
    }
}

function pause() {
    previousInventory = [];
    isSessionActive = false;
}

function isTrackerVisible() {
    return settings.fishingProfitTrackerOverlay &&
        persistentData && persistentData.fishingProfit &&
        (persistentData.fishingProfit.totalProfit || Object.keys(persistentData.fishingProfit.profitTrackerItems).length || persistentData.fishingProfit.elapsedSeconds) &&
        isInSkyblock() &&
        isInFishingWorld(getWorldName()) &&
        !(new Date() - getLastFishingHookSeenAt() > 10 * 60 * 1000) &&
        !allOverlaysGui.isOpen();
}

function changeItemAmount(itemId, isDelete, difference) {
    try {
        if (!isTrackerVisible()) {
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
            if (!newAmount && !isDelete) {
                return; // Prevent unintended deletion because of missclick
            } else {
                persistentData.fishingProfit.profitTrackerItems[itemId].amount = newAmount;
            }
            ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Changed amount of ${item.itemDisplayName} ${WHITE}to ${GRAY}${newAmount}x ${WHITE}in the Fishing profit tracker.`);   
        }

        persistentData.save();

        refreshPrices();
        refreshOverlay();
    } catch (e) {
        console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to remove item from Fishing profit tracker.`);
    }
}

function activateSessionOnPlayersFishingHook() {
    try {
        if (!settings.fishingProfitTrackerOverlay || !isWorldLoaded || !isInSkyblock() || !isInFishingWorld(getWorldName())) {
            return;
        }
    
        const isHookActive = isFishingHookActive();
        if (isHookActive) {
            activateTimer();
            refreshPrices();
        }
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to track player's fishing hook.`);
	}

    function activateTimer() {
        isSessionActive = true;

        if (!persistentData.fishingProfit.elapsedSeconds) {
            persistentData.fishingProfit.elapsedSeconds = 1;
            persistentData.save();
        }
    }
}

function refreshElapsedTime() {
    try {
        if (!isTrackerVisible() || !isSessionActive) {
            return;
        }

        const maxSecondsElapsedSinceLastAction = 60 * 6; // Time to kill any mob before despawn, e.g. Jawbus
        const lastHookSeenAt = getLastFishingHookSeenAt();
        const elapsedSecondsSinceLastAction = (new Date() - lastHookSeenAt) / 1000;

        if (lastHookSeenAt && elapsedSecondsSinceLastAction < maxSecondsElapsedSinceLastAction) {
            persistentData.fishingProfit.elapsedSeconds += 1;
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
        if (!isTrackerVisible()) {
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
        if (!isTrackerVisible() || !event || !isSessionActive) {
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
            refreshOverlay();
        }
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to handle adding to the sacks.`);
	}
}

function onCoinsFished(coins) {
    try {
        if (!isTrackerVisible() || !coins || !isSessionActive) {
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
        refreshOverlay();  
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to track fished coins.`);
	}
}

function onIceEssenceFished(count) {
    try {
        if (!isTrackerVisible() || !count || !isSessionActive || getWorldName() !== JERRY_WORKSHOP) {
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
        refreshOverlay();  
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to track fished ice essence.`);
	}
}

function onShardFished(shard) {
    try {
        if (!isTrackerVisible() || !shard || !isSessionActive) {
            return;
        }

        const fishingProfitItem = FISHING_PROFIT_ITEMS.find(i => i.itemName === shard.removeFormatting());
        const itemId = fishingProfitItem?.itemId;
        if (!fishingProfitItem || !itemId) {
            return;
        }

        const item = persistentData.fishingProfit.profitTrackerItems[itemId];
        const currentAmount = item?.amount || 0;

        persistentData.fishingProfit.profitTrackerItems[itemId] = {
            itemName: fishingProfitItem.itemName,
            itemDisplayName: fishingProfitItem.itemDisplayName,
            itemId: itemId,
            amount: currentAmount + 1,
        };
        persistentData.save();

        refreshPrices();
        refreshOverlay();  
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to track fished shard.`);
	}
}

function onPetReachedMaxLevel(level, petDisplayName) {
    try {
        if (level !== 100 && level !== 200) {
            return;
        }

        if (!isTrackerVisible() || !petDisplayName || !isSessionActive || getWorldName() !== CRIMSON_ISLE) {
            return;
        }
    
        const petName = petDisplayName.removeFormatting();
        const rarityColorCode = petDisplayName.substring(0, 2);
        const rarityCode = getPetRarityCode(rarityColorCode);
        const baseItemId = petName.split(' ').join('_').toUpperCase();
        const itemIdMaxLevel = baseItemId + ';' + rarityCode + '+' + level; // FLYING_FISH;4+100 GOLDEN_DRAGON;4+200
        const item = persistentData.fishingProfit.profitTrackerItems[itemIdMaxLevel];
        const auctionPrices = getAuctionItemPrices(itemIdMaxLevel);
        const itemPrice = auctionPrices?.lbin || 0;

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
        refreshOverlay();   
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to track pet level maxed.`);
	}
}

function detectInventoryChanges() {
    try {
        if (!isTrackerVisible() || !isWorldLoaded || !isSessionActive) {
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
                refreshPrices();
                refreshOverlay();
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

            if (slotItemName === 'Enchanted Book') {
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

function refreshOverlay() {
    try {
        profitTrackerOverlay.clear();

        if (!isTrackerVisible()) {
            pause();
            return;
        }

        const displayTrackerData = getDisplayTrackerData();
        
        const buttonLines = [];
        const areActionsVisible = isInChatOrInventoryGui();

        if (areActionsVisible) {
            buttonLines.push(new OverlayButtonLine().setText(`${YELLOW}${BOLD}[Click to pause]`).setIsSmallerScale(true).setOnClick(LEFT_CLICK_TYPE, () => pauseFishingProfitTracker()));
            buttonLines.push(new OverlayButtonLine().setText(`${RED}${BOLD}[Click to reset]`).setIsSmallerScale(true).setOnClick(LEFT_CLICK_TYPE, () => resetFishingProfitTracker(false)));
            profitTrackerOverlay.setButtonLines(buttonLines);
        }

        profitTrackerOverlay.addTextLine(new OverlayTextLine().setText(`${AQUA}${BOLD}Fishing profit tracker`));

        displayTrackerData.entriesToShow.forEach((entry) => {
            const line = new OverlayTextLine().setText(`${GRAY}- ${WHITE}${entry.amount}${GRAY}x ${entry.item}${GRAY}: ${GOLD}${toShortNumber(entry.profit)}`);
            if (areActionsVisible) {
                line.setOnClick(CTRL_MIDDLE_CLICK_TYPE, () => changeItemAmount(entry.itemId, true, 0));

                if (entry.itemId !== 'FISHED_COINS') {
                    line.setOnClick(CTRL_LEFT_CLICK_TYPE, () => changeItemAmount(entry.itemId, false, -1));
                    line.setOnClick(CTRL_RIGHT_CLICK_TYPE, () => changeItemAmount(entry.itemId, false, 1));
                }
            }
            profitTrackerOverlay.addTextLine(line);
        });

        if (displayTrackerData.entriesToHide.length) {
            const line = new OverlayTextLine().setText(`${GRAY}- ${WHITE}${displayTrackerData.totalCheapItemsCount}${GRAY}x Cheap items of ${WHITE}${displayTrackerData.totalCheapItemsTypesCount} ${GRAY}types: ${GOLD}${toShortNumber(displayTrackerData.totalCheapItemsProfit)}`);
            profitTrackerOverlay.addTextLine(line);
        }
     
        if (displayTrackerData.entriesToShow.length && areActionsVisible) {
            profitTrackerOverlay.addTextLine(new OverlayTextLine().setText(`\n${GRAY}[Ctrl + LCM a line for -1, Ctrl + RCM a line for +1]`).setIsSmallerScale(true));
            profitTrackerOverlay.addTextLine(new OverlayTextLine().setText(`${GRAY}[Ctrl + Middle Click a line to remove item]`).setIsSmallerScale(true));
        }

        profitTrackerOverlay.addTextLine(new OverlayTextLine().setText(`\n${AQUA}Total: ${GOLD}${BOLD}${toShortNumber(displayTrackerData.totalProfit)} ${RESET}${GRAY}(${GOLD}${toShortNumber(displayTrackerData.profitPerHour)}${GRAY}/h)`));
        profitTrackerOverlay.addTextLine(new OverlayTextLine().setText(getElapsedTimeLineText(displayTrackerData.elapsedTime)));
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to refresh tracker data.`);
	}

    function getElapsedTimeLineText(elapsedTime) {
        const pausedText = isSessionActive ? '' : ` ${GRAY}[Paused]`;
        return `\n${AQUA}Elapsed time: ${WHITE}${formatElapsedTime(elapsedTime)}${pausedText}`
    }
    
    function getDisplayTrackerData() {
        const displayTrackerData = {
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

        return displayTrackerData;
    }
}