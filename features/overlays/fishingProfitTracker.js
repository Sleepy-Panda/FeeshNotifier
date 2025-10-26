import * as triggers from '../../constants/triggers';
import settings, { allOverlaysGui } from "../../settings";
import { persistentData } from "../../data/data";
import { overlayCoordsData } from "../../data/overlayCoords";
import { CRIMSON_ISLE, JERRY_WORKSHOP } from "../../constants/areas";
import { FISHING_PROFIT_ITEMS } from "../../constants/fishingProfitItems";
import { AQUA, BOLD, GOLD, GRAY, RESET, WHITE, RED, YELLOW } from "../../constants/formatting";
import { getAuctionItemPrices, getPetRarityCode } from "../../utils/auctionPrices";
import { getBazaarItemPrices } from "../../utils/bazaarPrices";
import { formatElapsedTime, getCleanItemName, getItemsAddedToSacks, getLore, isFishingHookActive, isInChatOrInventoryGui, isInFishingWorld, isInSacksGui, isInSupercraftGui, isPlayerMovingItem, logError, splitArray, toShortNumber } from "../../utils/common";
import { getLastFishingHookSeenAt, getLastGuisClosed, getLastKatUpgrade, getWorldName, isInSkyblock } from "../../utils/playerState";
import { playRareDropSound } from '../../utils/sound';
import { registerIf } from '../../utils/registers';
import { CTRL_LEFT_CLICK_TYPE, CTRL_MIDDLE_CLICK_TYPE, CTRL_RIGHT_CLICK_TYPE, LEFT_CLICK_TYPE, Overlay, OverlayButtonLine, OverlayTextLine } from '../../utils/overlays';
import { SESSION_VIEW_MODE, TOTAL_VIEW_MODE } from '../../constants/viewModes';

let previousInventory = null;
let isSessionActive = false;
let areButtonsVisible = false;

registerIf(
    register('step', () => {
        activateSessionOnPlayersFishingHook();
        refreshOverlay(); // To show/hide when visibility condition changed
    }).setFps(2),
    () => settings.fishingProfitTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
);

registerIf(
    register('step', () => refreshElapsedTime()).setFps(1), // To refresh timer  
    () => settings.fishingProfitTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
);

registerIf(
    register('step', () => refreshTotalItemsProfits()).setDelay(30), // Handle BZ/AH prices changing over time
    () => settings.fishingProfitTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
);

registerIf(
    register('guiOpened', (_) => onSomeGuiToggled()), // To refresh visibility of buttons
    () => settings.fishingProfitTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
);

registerIf(
    register('guiClosed', (_) => onSomeGuiToggled()), // To refresh visibility of buttons
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

const ITEMS_ADDED_VIA_CHAT = [
    {
        messages: [triggers.GOOD_CATCH_COINS_MESSAGE, triggers.GREAT_CATCH_COINS_MESSAGE, triggers.OUTSTANDING_CATCH_COINS_MESSAGE],
        callback: (coins) => onCoinsFished(coins)
    },
    {
        messages: [triggers.GOOD_CATCH_ICE_ESSENCE_MESSAGE, triggers.GREAT_CATCH_ICE_ESSENCE_MESSAGE, triggers.OUTSTANDING_CATCH_ICE_ESSENCE_MESSAGE],
        callback: (count) => onIceEssenceFished(count)
    },
    {
        messages: [triggers.GOOD_CATCH_SHARD_MESSAGE],
        callback: (shardText) => onShardFished(shardText)
    },
    {
        messages: [triggers.BLACK_HOLE_SHARD_MESSAGE],
        callback: (shardsText) => onShardCaughtInBlackHole(shardsText)
    },
    {
        messages: [triggers.CHARM_NAGA_SALT_SHARD_MESSAGE],
        callback: (mobNameText) => onShardsCharmed(mobNameText, 1)
    },
    {
        messages: [triggers.CHARM_NAGA_SALT_SHARDS_MESSAGE],
        callback: (mobNameText, shardsCount) => onShardsCharmed(mobNameText, +(shardsCount.removeFormatting()))
    },
    {
        messages: [triggers.LOOTSHARED_SHARD_MESSAGE],
        callback: (shardsText) => onShardLootshared(shardsText)
    },
    {
        messages: [triggers.PET_LEVEL_UP_MESSAGE],
        callback: (petDisplayName, level) => onPetReachedMaxLevel(+level, petDisplayName)
    },
];

ITEMS_ADDED_VIA_CHAT.forEach(trigger => {
    trigger.messages.forEach(message => {
        registerIf(
            register("Chat", trigger.callback).setCriteria(message).setContains(),
            () => settings.fishingProfitTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
        );
    })
});

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

settings.getConfig().onCloseGui(() => refreshTotalItemsProfits());

// Migration - copy the outdated data into new Total
register("gameLoad", () => {
    if (persistentData.fishingProfit.profitTrackerItems) {
        persistentData.fishingProfit = {
            session: {
                profitTrackerItems: {},
                totalProfit: 0,
                elapsedSeconds: 0
            },
            total: {
                profitTrackerItems: JSON.parse(JSON.stringify(persistentData.fishingProfit.profitTrackerItems)),
                totalProfit: persistentData.fishingProfit.totalProfit,
                elapsedSeconds: persistentData.fishingProfit.elapsedSeconds,
            }
        };
        delete persistentData.fishingProfit.profitTrackerItems;
        delete persistentData.fishingProfit.totalProfit;
        delete persistentData.fishingProfit.elapsedSeconds;
        persistentData.save();
    }
});

register("gameUnload", () => {
    if (
        settings.fishingProfitTrackerOverlay && settings.resetFishingProfitTrackerOnGameClosed &&
        (Object.keys(persistentData.fishingProfit.session.profitTrackerItems).length || persistentData.fishingProfit.session.elapsedSeconds)
    ) {
        resetFishingProfitTracker(true, SESSION_VIEW_MODE);
    }
});

const overlay = new Overlay(() => settings.fishingProfitTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName()))
    .setPositionData(overlayCoordsData.fishingProfitTrackerOverlay)
    .setIsClickable(true)
    .setViewModes([ SESSION_VIEW_MODE, TOTAL_VIEW_MODE ]);

export function resetFishingProfitTracker(isConfirmed, resetViewMode) {
    try {
        if (!resetViewMode) resetViewMode = getCurrentViewMode();
        const viewModeText = overlay.getViewModeDisplayText(resetViewMode);

        if (!isConfirmed) {
            new Message(new TextComponent(`${GOLD}[FeeshNotifier] ${WHITE}Do you want to reset Fishing profit tracker ${viewModeText}${WHITE}? ${RED}${BOLD}[Click to confirm]`)
                .setClickAction('run_command')
                .setClickValue(getResetAction(resetViewMode))
            ).chat();
            return;
        }
       
        previousInventory = null;
        isSessionActive = false;
        areButtonsVisible = false;

        if (resetViewMode === SESSION_VIEW_MODE) resetSession();
        else if (resetViewMode === TOTAL_VIEW_MODE) resetTotal();

        refreshOverlay();
        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Fishing profit tracker ${viewModeText} ${WHITE}was reset.`);    
    } catch (e) {
		logError(e, 'Failed to reset Fishing profit tracker.');
	}

    function getResetAction(viewMode) {
        const actions = {
            [SESSION_VIEW_MODE]: '/feeshResetProfitTracker noconfirm',
            [TOTAL_VIEW_MODE]: '/feeshResetProfitTrackerTotal noconfirm'
        };
        return actions[viewMode] || '';
    }

    function resetSession() {
        persistentData.fishingProfit.session = {
            profitTrackerItems: {},
            totalProfit: 0,
            elapsedSeconds: 0
        };
        persistentData.save();
    }

    function resetTotal() {
        persistentData.fishingProfit.total = {
            profitTrackerItems: {},
            totalProfit: 0,
            elapsedSeconds: 0
        };
        persistentData.save();
    }
}

export function pauseFishingProfitTracker() {
    try {
        if (!isSessionActive || !isTrackerVisible()) return;

        pause();
        refreshOverlay();
        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Fishing profit tracker is paused. Continue fishing to resume it.`);
    } catch (e) {
        logError(e, 'Failed to pause Fishing profit tracker.');
    }
}

function pause() {
    previousInventory = null;
    isSessionActive = false;
}

function isTrackerVisible() {
    const viewMode = getCurrentViewMode();
    const isVisible = settings.fishingProfitTrackerOverlay &&
        persistentData && persistentData.fishingProfit &&
        (
            (viewMode === SESSION_VIEW_MODE && (persistentData.fishingProfit.session.totalProfit || Object.keys(persistentData.fishingProfit.session.profitTrackerItems).length || persistentData.fishingProfit.session.elapsedSeconds)) ||
            (viewMode === TOTAL_VIEW_MODE && (persistentData.fishingProfit.total.totalProfit || Object.keys(persistentData.fishingProfit.total.profitTrackerItems).length || persistentData.fishingProfit.total.elapsedSeconds))
        ) &&
        isInSkyblock() &&
        isInFishingWorld(getWorldName()) &&
        !(new Date() - getLastFishingHookSeenAt() > 10 * 60 * 1000) &&
        !allOverlaysGui.isOpen();
    return isVisible;
}

function onSomeGuiToggled() {
    if (!isTrackerVisible()) {
        areButtonsVisible = false;
        return;
    }

    Client.scheduleTask(2, () => {
        const prev = areButtonsVisible;
        const current = isInChatOrInventoryGui();
        areButtonsVisible = current;
        if (prev !== current) refreshOverlay(); // When chat/inventory opened/closed, we want to show/hide buttons instantly
    });
}

function changeItemAmount(itemId, isDelete, difference) {
    try {
        if (!isTrackerVisible()) return;

        const viewMode = getCurrentViewMode();
        const viewModeText = overlay.getViewModeDisplayText(viewMode);
        const sourceObj = getSourceObject(viewMode);
        const item = sourceObj.profitTrackerItems[itemId];
        if (!item) return;

        if (isDelete) {
            delete sourceObj.profitTrackerItems[itemId];
            ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Removed ${GRAY}${item.amount}x ${item.itemDisplayName} ${WHITE}from the Fishing profit tracker ${viewModeText}${WHITE}.`);   
        } else {
            const newAmount = sourceObj.profitTrackerItems[itemId].amount + difference;
            if (!newAmount && !isDelete) return; // Prevent unintended deletion because of missclick

            sourceObj.profitTrackerItems[itemId].amount = newAmount;
            ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Changed amount of ${item.itemDisplayName} ${WHITE}to ${GRAY}${newAmount}x ${WHITE}in the Fishing profit tracker ${viewModeText}${WHITE}.`);   
        }
        persistentData.save();
        refreshTotalItemsProfits();
    } catch (e) {
        logError(e, 'Failed to change item amount in Fishing profit tracker.');
    }
}

function activateSessionOnPlayersFishingHook() {
    try {
        if (!settings.fishingProfitTrackerOverlay || !isWorldLoaded || !isInSkyblock() || !isInFishingWorld(getWorldName())) return;
    
        const isHookActive = isFishingHookActive();
        if (isHookActive) {
            isSessionActive = true;
            activateTimerInMode(SESSION_VIEW_MODE);
            activateTimerInMode(TOTAL_VIEW_MODE);
            refreshTotalItemsProfits();
        }
    } catch (e) {
        logError(e, 'Failed to track player\'s bobber to activate Fishing profit tracker.');
	}

    function activateTimerInMode(viewMode) {
        const sourceObj = getSourceObject(viewMode);
        if (!sourceObj.elapsedSeconds) {
            sourceObj.elapsedSeconds = 1;
            persistentData.save();
        }
    }
}

function refreshElapsedTime() {
    try {
        if (!isSessionActive || !isTrackerVisible()) return;

        const maxSecondsElapsedSinceLastAction = 60 * 6; // Time to kill any mob before despawn, e.g. Jawbus
        const lastHookSeenAt = getLastFishingHookSeenAt();
        const elapsedSecondsSinceLastAction = (new Date() - lastHookSeenAt) / 1000;

        if (lastHookSeenAt && elapsedSecondsSinceLastAction < maxSecondsElapsedSinceLastAction) {
            persistentData.fishingProfit.session.elapsedSeconds += 1;
            persistentData.fishingProfit.total.elapsedSeconds += 1;
        } else {
            pause();
        }
        refreshOverlay();
    } catch (e) {
        logError(e, 'Failed to refresh elapsed time in Fishing profit tracker.');
	}
}

function refreshTotalItemsProfits() {
    try {
        if (!isTrackerVisible()) return; 
        refreshTotalItemsProfitsInMode(SESSION_VIEW_MODE);
        refreshTotalItemsProfitsInMode(TOTAL_VIEW_MODE);
        refreshOverlay();
    } catch (e) {
        logError(e, 'Failed to refresh total items profits in Fishing profit tracker.');
	}

    function refreshTotalItemsProfitsInMode(viewMode) {
        const sourceObj = getSourceObject(viewMode);
        Object.entries(sourceObj.profitTrackerItems).forEach(([key, value]) => {
            if (value.itemDisplayName.removeFormatting().startsWith('[Lvl 100]') || value.itemDisplayName.removeFormatting().startsWith('[Lvl 200]')) { // Maxed level pets, e.g. FLYING_FISH;4+100 or GOLDEN_DRAGON;4+200
                const itemIdMaxLevel = key;
                const itemIdFirstLvl = itemIdMaxLevel.split('+')[0]; // Remove +100 or +200
                const firstLvlPrice = getAuctionItemPrices(itemIdFirstLvl)?.lbin || 0;
                const maxLvlPrice = getAuctionItemPrices(itemIdMaxLevel)?.lbin || 0;
                const profitPerPet = firstLvlPrice && maxLvlPrice ? maxLvlPrice - firstLvlPrice : 0;  // Calculate pet price as difference between lvl1 and max lvl
                value.totalItemProfit = value.amount * profitPerPet;
            } else {
                const fishingProfitItem = FISHING_PROFIT_ITEMS.find(i => i.itemId === key);
                if (!fishingProfitItem) return;
                const itemPrice = getItemPrice(fishingProfitItem);
                value.totalItemProfit = value.amount * itemPrice;  
            }
        });
    
        const total = Object.values(sourceObj.profitTrackerItems).reduce((accumulator, currentValue) => { return accumulator + currentValue.totalItemProfit }, 0);
        sourceObj.totalProfit = total;
        persistentData.save();
    }

    function getItemPrice(fishingProfitItem) {
        if (!fishingProfitItem) return 0;
    
        if (fishingProfitItem.amountOfMagmaFish) { // Trophy Fish
            const magmaFishBazaarPrices = getBazaarItemPrices('MAGMA_FISH');
            const magmaFishPrice = settings.fishingProfitTrackerMode === 1 ? magmaFishBazaarPrices?.instaSell : magmaFishBazaarPrices?.sellOffer;
            return fishingProfitItem.amountOfMagmaFish * (magmaFishPrice || 0);
        }
    
        if (settings.calculateProfitInCrimsonEssence && fishingProfitItem.salvage && fishingProfitItem.salvage.essenceType === 'ESSENCE_CRIMSON') { // Salvageable
            const essenceBazaarPrices = getBazaarItemPrices(fishingProfitItem.salvage.essenceType);
            const essencePrice = settings.fishingProfitTrackerMode === 1 ? essenceBazaarPrices?.instaSell : essenceBazaarPrices?.sellOffer;
            return fishingProfitItem.salvage.essenceCount * (essencePrice || 0);
        }

        const itemId = fishingProfitItem.itemId;
        const bazaarPrices = getBazaarItemPrices(itemId);
    
        let itemPrice = settings.fishingProfitTrackerMode === 1 ? bazaarPrices?.instaSell : bazaarPrices?.sellOffer;
    
        if (!bazaarPrices) {
            const auctionPrices = getAuctionItemPrices(itemId);
            itemPrice = auctionPrices?.lbin;
    
            if (!auctionPrices) {
                const npcPrices = fishingProfitItem.npcPrice;
                itemPrice = npcPrices;
            }
        }
    
        return itemPrice || 0;
    }
}

function onAddedToSacks(event) {
    try {
        if (!event || !isSessionActive || !isTrackerVisible()) return;
    
        const lastGuisClosed = getLastGuisClosed();
        if (isInSacksGui() || new Date() - lastGuisClosed.lastSacksGuiClosedAt < 15 * 1000) return; // Sacks closed < 15 seconds ago
        if (isInSupercraftGui() || new Date() - lastGuisClosed.lastSupercraftGuiClosedAt < 15 * 1000) return; // Supercraft closed < 15 seconds ago

        const itemsAddedToSacks = getItemsAddedToSacks(EventLib.getMessage(event));
        let isUpdated = false;

        for (let itemAddedToSack of itemsAddedToSacks) {
            const itemName = getCleanItemName(itemAddedToSack.itemName);

            if (!itemAddedToSack.difference || !itemName) continue;

            const fishingProfitItem = getFishingProfitItemByName(itemName);
            const itemId = fishingProfitItem?.itemId;
            if (!fishingProfitItem || !itemId) continue;
    
            if (itemId?.startsWith('MAGMA_FISH') && lastGuisClosed.lastOdgerGuiClosedAt && new Date() - lastGuisClosed.lastOdgerGuiClosedAt < 40 * 1000) {
                continue; // User probably just filleted trophy fish
            }

            addProfitTrackerItem(itemId, itemName, fishingProfitItem.itemDisplayName, itemAddedToSack.difference, null, true);
            isUpdated = true;
        }

        if (isUpdated) {
            refreshTotalItemsProfits();
        }
    } catch (e) {
        logError(e, 'Failed to handle adding to sacks in Fishing profit tracker.');
	}
}

function onCoinsFished(coins) {
    try {
        if (!coins || !isSessionActive || !isTrackerVisible()) return;
        const coinsWithoutSeparator = +(coins.replace(/,/g, ''));
        const itemId = 'FISHED_COINS', itemName = 'Fished Coins', itemDisplayName = `${GOLD}Fished Coins`;
        addProfitTrackerItem(itemId, itemName, itemDisplayName, 1, coinsWithoutSeparator);
    } catch (e) {
        logError(e, 'Failed to track fished coins in Fishing profit tracker.');
	}
}

function onIceEssenceFished(count) {
    try {
        if (!count || !isSessionActive || getWorldName() !== JERRY_WORKSHOP || !isTrackerVisible()) return;
        const essenceCountWithoutSeparator = +(count.replace(/,/g, ''));
        findAndAddProfitTrackerItem(i => i.itemId === 'ESSENCE_ICE', essenceCountWithoutSeparator);
    } catch (e) {
        logError(e, 'Failed to track caught Ice Essence in Fishing profit tracker.');
	}
}

/**
 * @param {*} shardText "an Abyssal Lanternfish", "a Cod", "a Shinyfish"
 */
function onShardFished(shardText) {
    try {
        if (!shardText || !isSessionActive || !isTrackerVisible()) return;
        const [article, ...shardNameParts] = shardText.removeFormatting().split(' ');
        const shardName = shardNameParts.join(' ') + ' Shard';
        findAndAddProfitTrackerItem(i => i.itemName === shardName.removeFormatting(), 1);
    } catch (e) {
        logError(e, 'Failed to track fished Shard in Fishing profit tracker.');
	}
}

/**
 * @param {*} shardsText "a Sea Archer", "an Ent", "x4 Sea Emperor"
 */
function onShardCaughtInBlackHole(shardsText) {
    try {
        if (!shardsText || !isSessionActive || !isTrackerVisible()) return;
        const [countText, ...shardNameParts] = shardsText.removeFormatting().split(' ');
        const count = countText === 'a' || countText === 'an' ? 1 : +(countText.replace('x', ''));
        const shardName = shardNameParts.join(' ') + ' Shard';
        findAndAddProfitTrackerItem(i => i.itemName === shardName, count);
    } catch (e) {
        logError(e, 'Failed to track Black Hole Shard in Fishing profit tracker.');
	}
}

/**
 * @param {string} mobNameText "a &fSea Archer", "an &aEnt"
 * @param {number} shardsCount Charmed shards count to add to the tracker
 */
function onShardsCharmed(mobNameText, shardsCount) {
    try {
        if (!mobNameText || !shardsCount || !isSessionActive || !isTrackerVisible()) return;
        const [article, ...mobNameParts] = mobNameText.removeFormatting().split(' ');
        const shardName = mobNameParts.join(' ') + ' Shard';
        findAndAddProfitTrackerItem(i => i.itemName === shardName, shardsCount);
    } catch (e) {
        logError(e, 'Failed to track charmed Shard in Fishing profit tracker.');
	}
}

/**
 * @param {string} shardsText "a Bogged", "2 Titanoboa"
 */
function onShardLootshared(shardsText) {
    try {
        if (!shardsText || !isSessionActive || !isTrackerVisible()) return;
        const [countText, ...shardNameParts] = shardsText.removeFormatting().split(' ');
        const count = countText === 'a' || countText === 'an' ? 1 : +(countText);
        const shardName = shardNameParts.join(' ') + ' Shard';
        findAndAddProfitTrackerItem(i => i.itemName === shardName, count);
    } catch (e) {
        logError(e, 'Failed to track lootshared Shard in Fishing profit tracker.');
	}
}

function onPetReachedMaxLevel(level, petDisplayName) {
    try {
        if (level !== 100 && level !== 200) return;
        if (!petDisplayName || !isSessionActive || getWorldName() !== CRIMSON_ISLE || !isTrackerVisible()) return;
    
        const petName = petDisplayName.removeFormatting();
        const rarityColorCode = petDisplayName.substring(0, 2);
        const rarityCode = getPetRarityCode(rarityColorCode);
        const baseItemId = petName.split(' ').join('_').toUpperCase();
        const itemIdMaxLevel = baseItemId + ';' + rarityCode + '+' + level; // FLYING_FISH;4+100 GOLDEN_DRAGON;4+200
        const itemDisplayName = `${GRAY}[Lvl ${level}] ${petDisplayName}`;
        addProfitTrackerItem(itemIdMaxLevel, petName, itemDisplayName, 1, null);
    } catch (e) {
        logError(e, 'Failed to track maxed Pet level in Fishing profit tracker.');
	}
}

function findAndAddProfitTrackerItem(findItemFunc, amountToAdd) {
    const fishingProfitItem = FISHING_PROFIT_ITEMS.find(i => findItemFunc(i));
    const itemId = fishingProfitItem?.itemId;
    if (!fishingProfitItem || !itemId) return;

    addProfitTrackerItem(fishingProfitItem.itemId, fishingProfitItem.itemName, fishingProfitItem.itemDisplayName, amountToAdd, null);
}

function addProfitTrackerItem(itemId, itemName, itemDisplayName, amountToAdd, coinsToAdd, isBulk = false) {
    addProfitTrackerItemInMode(SESSION_VIEW_MODE, itemName, itemDisplayName, amountToAdd, coinsToAdd);
    addProfitTrackerItemInMode(TOTAL_VIEW_MODE, itemName, itemDisplayName, amountToAdd, coinsToAdd);
    if (!isBulk) refreshTotalItemsProfits(); // For bulk adding new items (e.g. multiple items added to sacks in one moment), refresh will be called manually

    function addProfitTrackerItemInMode(viewMode, itemName, itemDisplayName, amountToAdd, coinsToAdd) {
        const sourceObj = getSourceObject(viewMode);
        const item = sourceObj.profitTrackerItems[itemId] || null;
        const currentAmount = item?.amount || 0;
        const currentProfit = item?.totalItemProfit || 0;
    
        sourceObj.profitTrackerItems[itemId] = {
            itemName: itemName,
            itemDisplayName: itemDisplayName,
            itemId: itemId,
            amount: currentAmount + amountToAdd,
        };
        if (coinsToAdd) sourceObj.profitTrackerItems[itemId].totalItemProfit = currentProfit + coinsToAdd;
        persistentData.save();    
    }
}

function detectInventoryChanges() {
    try {
        if (!isWorldLoaded || !isSessionActive || !isTrackerVisible()) {
            previousInventory = null;
            return;
        }

        if (!previousInventory) {
            const currentInventory = getFishingProfitItemsInCurrentInventory();
            previousInventory = currentInventory;
        }

        if (isPlayerMovingItem()) return; // Do not recalculate inventory while a player is moving an item

        const hasBarrier = (Player?.getInventory()?.getItems() || []).find(i => i?.getName() === 'Barrier'); // NEU slot binding replaces inventory items with Barriers
        if (hasBarrier) return;
        
        const currentInventory = getFishingProfitItemsInCurrentInventory();

        let isInChest = Client.isInGui() && Client.currentGui?.getClassName() === 'GuiChest';
        if (isInChest) {
            previousInventory = currentInventory;
            return;
        }

        const uniqueItemIds = Object.keys(currentInventory) || [];
        let isUpdated = false;
        for (let itemId of uniqueItemIds) {
            const previousTotal = previousInventory[itemId] || 0;
            const currentTotal = currentInventory[itemId] || 0;

            if (currentTotal > previousTotal) {
                onItemAddedToInventory(itemId, previousTotal, currentTotal);
                isUpdated = true;
            }
        }

        previousInventory = currentInventory;

        if (isUpdated) refreshTotalItemsProfits(); 
    } catch (e) {
        logError(e, 'Failed to track Inventory state in Fishing profit tracker.');
	}

    function getFishingProfitItemsInCurrentInventory() {
        let currentInventory = {};
        const inventorySlots = Player?.getInventory()?.getItems() || [];
    
        for (var slotIndex = 0; slotIndex < inventorySlots.length; slotIndex++) {
            if (slotIndex >= 36) continue; // Armor slots 36-39

            let item = inventorySlots[slotIndex];
            if (!item) continue;
    
            let slotItemName = getCleanItemName(item?.getName());

            if (slotItemName === 'Enchanted Book') {
                const loreLines = getLore(item);
                const description = loreLines[0].removeFormatting();
                slotItemName += ` (${description})`;
            }

            if (slotItemName.endsWith('Exp Boost')) {
                const loreLines = getLore(item);
                const description = loreLines.find(line => line.endsWith('PET ITEM')).removeFormatting().split(' ')[0];
                slotItemName += ` (${description})`;
            }

            if (slotItemName.startsWith('[Lvl 1] ')) {
                const extraAttributes = item?.getNBT()?.getCompoundTag('tag')?.getCompoundTag('ExtraAttributes');
                const nbtId = extraAttributes?.getString('id');
                if (!nbtId || nbtId !== 'PET') continue;
                const petInfo = JSON.parse(extraAttributes?.getString('petInfo'));
                const rarity = petInfo?.tier;
                slotItemName += ` (${rarity?.toUpperCase()})`;
            }

            const itemId = getFishingProfitItemByName(slotItemName)?.itemId;
            if (itemId) {
                const amountInSlot = item.getStackSize() || 0;
                const totalAmount = (currentInventory[itemId] || 0) + amountInSlot;
                currentInventory[itemId] = totalAmount;
            }
        }
    
        return currentInventory;
    }

    function onItemAddedToInventory(itemId, previousCount, newCount) {
        const fishingProfitItem = FISHING_PROFIT_ITEMS.find(i => i.itemId === itemId);
        if (!fishingProfitItem) return;
        if (isInventoryPotentiallyDirty(itemId, fishingProfitItem)) return;

        const difference = newCount - previousCount;
        if (difference > 0) {
            addProfitTrackerItem(itemId, fishingProfitItem.itemName, fishingProfitItem.itemDisplayName, difference, null, true);

            if (settings.shouldAnnounceRareDropsWhenPickup && fishingProfitItem.shouldAnnounceRareDrop) {
                const diffText = difference > 1 ? ` ${RESET}${GRAY}${difference}x` : '';
                ChatLib.chat(`${GOLD}[FeeshNotifier] ${GOLD}${BOLD}RARE DROP! ${RESET}${fishingProfitItem.itemDisplayName}${diffText}`);
                playRareDropSound();
            }
        }
    }

    function isInventoryPotentiallyDirty(itemId, fishingProfitItem) {
        const now = new Date();
        const lastGuisClosed = getLastGuisClosed();

        if (itemId?.startsWith('MAGMA_FISH') && lastGuisClosed.lastOdgerGuiClosedAt && now - lastGuisClosed.lastOdgerGuiClosedAt < 1000) return true; // User probably just filleted trophy fish

        if (lastGuisClosed.lastStorageGuiClosedAt && now - lastGuisClosed.lastStorageGuiClosedAt < 1000) return true;

        if (lastGuisClosed.lastAuctionGuiClosedAt && now - lastGuisClosed.lastAuctionGuiClosedAt < 3000) return true;

        if (lastGuisClosed.lastBazaarGuiClosedAt && now - lastGuisClosed.lastBazaarGuiClosedAt < 1000) return true;

        if (lastGuisClosed.lastCraftGuiClosedAt && now - lastGuisClosed.lastCraftGuiClosedAt < 1000) return true;

        if (lastGuisClosed.lastSupercraftGuiClosedAt && now - lastGuisClosed.lastSupercraftGuiClosedAt < 1000) return true;

        const lastKatUpgrade = getLastKatUpgrade(); // Ignore pets that are claimed from Kat
        if (lastKatUpgrade.lastPetClaimedAt && now - lastKatUpgrade.lastPetClaimedAt < 7 * 1000 &&
            fishingProfitItem.itemDisplayName.removeFormatting().includes(lastKatUpgrade.petDisplayName?.removeFormatting())) { 
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

function toggleViewMode() {
    try {
        const currentViewMode = getCurrentViewMode();
        const newViewMode = overlay.getNextViewMode(currentViewMode);
        persistentData.fishingProfit.viewMode = newViewMode;
        persistentData.save();
        refreshOverlay();
    } catch (e) {
        logError(e, 'Failed to toggle view mode in Fishing profit tracker.');
	}
}

function getCurrentViewMode() {
    return persistentData.fishingProfit.viewMode || SESSION_VIEW_MODE;
}

function getSourceObject(viewMode) {
    switch (viewMode) {
        case SESSION_VIEW_MODE:
            return persistentData.fishingProfit.session;
        case TOTAL_VIEW_MODE:
            return persistentData.fishingProfit.total;
        default: {
            console.error(`[FeeshNotifier] Failed to get source object for '${viewMode}' view mode.`);
            return null;
        }
    }
}

function refreshOverlay() {
    try {
        overlay.clear();

        if (!isTrackerVisible()) {
            pause();
            return;
        }

        const displayTrackerData = getDisplayTrackerData();       
        const areActionsVisible = isInChatOrInventoryGui();
        const viewMode = getCurrentViewMode();
        const viewModeText = overlay.getViewModeDisplayText(viewMode);

        overlay.addTextLine(new OverlayTextLine().setText(`${AQUA}${BOLD}Fishing profit tracker ${viewModeText}`));

        displayTrackerData.entriesToShow.forEach((entry) => {
            const line = new OverlayTextLine().setText(`${GRAY}- ${WHITE}${entry.amount}${GRAY}x ${entry.item}${GRAY}: ${GOLD}${toShortNumber(entry.profit)}`);
            if (areActionsVisible) {
                line.setOnClick(CTRL_MIDDLE_CLICK_TYPE, () => changeItemAmount(entry.itemId, true, 0));

                if (entry.itemId !== 'FISHED_COINS') {
                    line.setOnClick(CTRL_LEFT_CLICK_TYPE, () => changeItemAmount(entry.itemId, false, -1));
                    line.setOnClick(CTRL_RIGHT_CLICK_TYPE, () => changeItemAmount(entry.itemId, false, 1));
                }
            }
            overlay.addTextLine(line);
        });

        if (displayTrackerData.entriesToHide.length) {
            const line = new OverlayTextLine().setText(`${GRAY}- ${WHITE}${displayTrackerData.totalCheapItemsCount}${GRAY}x Cheap items of ${WHITE}${displayTrackerData.totalCheapItemsTypesCount} ${GRAY}types: ${GOLD}${toShortNumber(displayTrackerData.totalCheapItemsProfit)}`);
            overlay.addTextLine(line);
        }
     
        if (displayTrackerData.entriesToShow.length && areActionsVisible) {
            overlay.addTextLine(new OverlayTextLine().setText(`\n${GRAY}[Ctrl + LCM a line for -1, Ctrl + RCM a line for +1]`).setIsSmallerScale(true));
            overlay.addTextLine(new OverlayTextLine().setText(`${GRAY}[Ctrl + Middle Click a line to remove item]`).setIsSmallerScale(true));
        }

        overlay.addTextLine(new OverlayTextLine().setText(`\n${AQUA}Total: ${GOLD}${BOLD}${toShortNumber(displayTrackerData.totalProfit)} ${RESET}${GRAY}(${GOLD}${toShortNumber(displayTrackerData.profitPerHour)}${GRAY}/h)`));
        overlay.addTextLine(new OverlayTextLine().setText(getElapsedTimeLineText(displayTrackerData.elapsedTime)));

        const buttonLines = [];
        if (areActionsVisible) {
            buttonLines.push(new OverlayButtonLine().setText(`${overlay.getNextViewModeButtonDisplayText(viewMode)}`).setIsSmallerScale(true).setOnClick(LEFT_CLICK_TYPE, () => toggleViewMode()));
            buttonLines.push(new OverlayButtonLine().setText(`${YELLOW}${BOLD}[Click to pause]`).setIsSmallerScale(true).setOnClick(LEFT_CLICK_TYPE, () => pauseFishingProfitTracker()));
            buttonLines.push(new OverlayButtonLine().setText(`${RED}${BOLD}[Click to reset]`).setIsSmallerScale(true).setOnClick(LEFT_CLICK_TYPE, () => resetFishingProfitTracker(false)));
            overlay.setButtonLines(buttonLines);
        }
    } catch (e) {
        logError(e, 'Failed to refresh tracker data for Fishing profit tracker.');
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

        const sourceObj = getSourceObject(getCurrentViewMode());
        const entries = Object.entries(sourceObj.profitTrackerItems)
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
        displayTrackerData.elapsedTime = sourceObj.elapsedSeconds;
        displayTrackerData.totalProfit = sourceObj.totalProfit;

        const elapsedHours = sourceObj.elapsedSeconds / 3600;
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
