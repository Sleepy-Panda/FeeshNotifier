import settings from "../../settings";
import { AQUA, BOLD, DARK_PURPLE, GOLD, GRAY, GREEN, RED, WHITE, YELLOW } from "../../constants/formatting";
import { getBazaarItemPrices } from "../../utils/bazaarPrices";
import { formatElapsedTime, formatNumberWithSpaces, hasDoubleHookInMessage, isInChatOrInventoryGui } from "../../utils/common";
import * as triggers from '../../constants/triggers';
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";
import { CRYSTAL_HOLLOWS } from "../../constants/areas";
import { overlayCoordsData } from "../../data/overlayCoords";
import { getAuctionItemPrices } from "../../utils/auctionPrices";

var totalMembranesCount = 0;
var totalChambersCount = 0;
var totalWormsCount = 0;
var lastAddedMembranesCount = 0;
var elapsedSeconds = 0;

var membranesPerHour = 0;
var chambersPerHour = 0;
var wormsPerHour = 0;
var membraneCoinsPerHourSellOffer = 0;
var membraneCoinsPerHourInstaSell = 0;
var chamberCoinsPerHour = 0;

var lastWormCaughtAt = null;
var lastMembraneDroppedAt = null;
var isSessionActive = false;

var previousInventory = [];
var previousInventoryTotal = 0;

const WORM_MEMBRANES_MODE = 0;
const GEMSTONE_CHAMBERS_MODE = 1;

triggers.WORM_CATCH_TRIGGERS.forEach(trigger => {
    register("Chat", (event) => {
        isDoubleHooked = hasDoubleHookInMessage();
        trackWormCatch(isDoubleHooked);
    }).setCriteria(trigger.trigger).setContains();
});

register('renderOverlay', () => renderWormMembraneProfitTrackerOverlay());

register('step', () => refreshElapsedTime()).setDelay(1);
register('step', () => refreshValuesPerHour()).setDelay(5);

register('step', () => comparePreviousAndCurrentInventory()).setFps(5);

// DisplayLine is initialized once in order to avoid multiple method calls on click.
let buttonsDisplay = new Display().hide();

let pauseTrackerDisplayLine = new DisplayLine(`${YELLOW}[Click to pause]`).setShadow(true);
pauseTrackerDisplayLine.registerClicked((x, y, mouseButton, buttonState) => {
    if (mouseButton === 0 && buttonState === false) { // When left mouse button is UP. 0 is left mouse button, false is UP, true is DOWN. 
        pauseWormMembraneProfitTracker();
    }
});
buttonsDisplay.addLine(pauseTrackerDisplayLine);

let resetTrackerDisplayLine = new DisplayLine(`${RED}[Click to reset]`).setShadow(true);
resetTrackerDisplayLine.registerClicked((x, y, mouseButton, buttonState) => {
    if (mouseButton === 0 && buttonState === false) { // When left mouse button is UP. 0 is left mouse button, false is UP, true is DOWN. 
        resetWormMembraneProfitTracker(false);
    }
});
buttonsDisplay.addLine(resetTrackerDisplayLine);

export function resetWormMembraneProfitTracker(isConfirmed) {
    try {
        if (!isConfirmed) {
            new Message(
                new TextComponent(`${GOLD}[FeeshNotifier] ${WHITE}Do you want to reset Worm profit tracker? ${RED}${BOLD}[Click to confirm]`)
                    .setClickAction('run_command')
                    .setClickValue('/feeshResetWormProfit noconfirm')
            ).chat();
            return;
        }
    
        totalMembranesCount = 0;
        totalChambersCount = 0;
        totalWormsCount = 0;
        lastAddedMembranesCount = 0;
        elapsedSeconds = 0;

        membranesPerHour = 0;
        chambersPerHour = 0;
        wormsPerHour = 0;
        membraneCoinsPerHourSellOffer = 0;
        membraneCoinsPerHourInstaSell = 0;
        chamberCoinsPerHour = 0;

        lastWormCaughtAt = null;
        lastMembraneDroppedAt = null;
        isSessionActive = false;

        previousInventory = [];
        previousInventoryTotal = 0;

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Worm profit tracker was reset.`);  
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to reset Worm profit tracker.`);
	}
}

function comparePreviousAndCurrentInventory() {
    try {
        if (!isSessionActive || !settings.wormProfitTrackerOverlay || !isInSkyblock() || !hasFishingRodInHotbar() || getWorldName() !== CRYSTAL_HOLLOWS) {
            previousInventory = [];
            previousInventoryTotal = 0;
            return;
        }
    
        if (!previousInventory || !previousInventory.length) {
            const currentInventory = getInventoryMembranes();
            previousInventory = currentInventory;
            previousInventoryTotal = previousInventory.reduce((partialSum, a) => partialSum + a, 0);
        }

        let isInStorageOrBaazar = false;

        var heldItem = Player.getPlayer()?.field_71071_by?.func_70445_o();
        if (heldItem) {
            var item = new Item(heldItem);
            if (item && item.getName()?.removeFormatting() === 'Worm Membrane') {
                return; // Do not recalculate inventory while a player is moving a membrane
            }
        }

        const currentInventory = getInventoryMembranes();
        const currentInventoryTotal = currentInventory.reduce((partialSum, a) => partialSum + a, 0);

        if (Client.Companion.isInGui() && Client.currentGui?.getClassName() === 'GuiChest') {
            const chestName = Client.currentGui?.get()?.field_147002_h?.func_85151_d()?.func_145748_c_()?.text;
            if (chestName && (
                chestName.includes('Ender Chest') ||
                chestName.includes('Backpack') ||
                chestName.includes('Bazaar Orders') ||
                chestName.includes('Order options') || // When we cancel sell offer
                chestName.includes('Worm Membrane ➜ Instant Buy')
            )) {
                isInStorageOrBaazar = true;
            }
        }

        if (currentInventoryTotal > previousInventoryTotal && !isInStorageOrBaazar) {
            onWormMembranesAddedToInventory(previousInventoryTotal, currentInventoryTotal);
        }

        previousInventory = currentInventory;
        previousInventoryTotal = currentInventoryTotal;
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track inventory state.`);
	}

    function onWormMembranesAddedToInventory(previousCount, newCount) {
        const now = new Date();

        if (!isSessionActive) {
            return;
        }

        const difference = newCount - previousCount;

        if (difference > 0) {
            totalMembranesCount += difference;
            totalChambersCount = Math.floor(totalMembranesCount / 100);

            if (now - lastMembraneDroppedAt < 10 * 1000) { // If players kill a cap slowly, the membranes are added a few times nearly at the same time
                lastAddedMembranesCount += difference;
            } else {
                lastAddedMembranesCount = difference;
            }

            lastMembraneDroppedAt = now;
            refreshValuesPerHour();
        }
    }
}

function pauseWormMembraneProfitTracker() {
    try {
        if (!settings.wormProfitTrackerOverlay || !isInSkyblock() || !hasFishingRodInHotbar() || getWorldName() !== CRYSTAL_HOLLOWS || !isSessionActive) {
            return;
        }
    
        isSessionActive = false;
        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Worm profit tracker is paused. Continue fishing to resume it.`);       
    } catch (e) {
        console.error(e);
		console.log(`[FeeshNotifier] Failed to pause worm profit tracker.`);
    }
}

function trackWormCatch(isDoubleHooked) {
    try {
        if (!settings.wormProfitTrackerOverlay || !isInSkyblock() || !hasFishingRodInHotbar() || getWorldName() !== CRYSTAL_HOLLOWS) {
            return;
        }

        isSessionActive = true;
        
        const diff = isDoubleHooked ? 2 : 1;
        totalWormsCount += diff;
        lastWormCaughtAt = new Date();
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track worm catch.`);
	}
}

function refreshElapsedTime() {
    try {
        if (!settings.wormProfitTrackerOverlay || !isInSkyblock() || !hasFishingRodInHotbar() || getWorldName() !== CRYSTAL_HOLLOWS || !isSessionActive) {
            return;
        }

        const maxSecondsElapsedSinceLastAction = 60;
        const elapsedSecondsSinceLastCatch = (new Date() - lastWormCaughtAt) / 1000;

        if (lastWormCaughtAt && elapsedSecondsSinceLastCatch < maxSecondsElapsedSinceLastAction) {
            isSessionActive = true;
            elapsedSeconds += 1;
        } else {
            isSessionActive = false;
        }
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to refresh elapsed time.`);
	}
}

function refreshValuesPerHour() {
    try {
        if (!settings.wormProfitTrackerOverlay || !isInSkyblock() || !hasFishingRodInHotbar() || getWorldName() !== CRYSTAL_HOLLOWS) {
            return;
        }

        const elapsedHours = elapsedSeconds / 3600;
        const membranePrices = getBazaarItemPrices('WORM_MEMBRANE');
        const chamberPrices = getAuctionItemPrices('GEMSTONE_CHAMBER');

        membranesPerHour = elapsedHours
            ? Math.floor(totalMembranesCount / elapsedHours)
            : 0;
        wormsPerHour = elapsedHours
            ? Math.floor(totalWormsCount / elapsedHours)
            : 0;

        membraneCoinsPerHourSellOffer = elapsedHours
            ? membranesPerHour * Math.floor(membranePrices?.sellOffer || 0)
            : 0;
        membraneCoinsPerHourInstaSell = elapsedHours
            ? membranesPerHour * Math.floor(membranePrices?.instaSell || 0)
            : 0;
        
        chambersPerHour = Math.floor(membranesPerHour / 100);     
        chamberCoinsPerHour = chambersPerHour * Math.floor(chamberPrices?.lbin || 0);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to refresh values per hour.`);
	}
}

function renderWormMembraneProfitTrackerOverlay() {
    if (!settings.wormProfitTrackerOverlay ||
        !isInSkyblock() ||
        !hasFishingRodInHotbar() ||
        getWorldName() !== CRYSTAL_HOLLOWS ||
        (!totalWormsCount && !totalMembranesCount)
    ) {
        buttonsDisplay.hide();
        return;
    }

    let text = `${YELLOW}${BOLD}Worm profit tracker\n`;
    const mode = settings.wormProfitTrackerMode;
    switch (mode) {
        case WORM_MEMBRANES_MODE:
            const wormMembranePrices = getBazaarItemPrices('WORM_MEMBRANE');
            const wormMembraneTotalCoinsSellOffer = totalMembranesCount * Math.floor(wormMembranePrices?.sellOffer || 0);
            const wormMembraneTotalCoinsInstaSell = totalMembranesCount * Math.floor(wormMembranePrices?.instaSell || 0);
        
            text += `${GREEN}Total worms: ${WHITE}${formatNumberWithSpaces(totalWormsCount)}\n`;
            text += `${GREEN}Total membranes: ${WHITE}${formatNumberWithSpaces(totalMembranesCount)} ${GRAY}[+${formatNumberWithSpaces(lastAddedMembranesCount)} last added]\n`;
            text += `${GOLD}Total coins (sell offer): ${WHITE}${formatNumberWithSpaces(wormMembraneTotalCoinsSellOffer)}\n`;
            text += `${GOLD}Total coins (insta-sell): ${WHITE}${formatNumberWithSpaces(wormMembraneTotalCoinsInstaSell)}\n`;
            text += `\n`;
            text += `${GREEN}Worms/h: ${WHITE}${formatNumberWithSpaces(wormsPerHour)}\n`;
            text += `${GREEN}Membranes/h: ${WHITE}${formatNumberWithSpaces(membranesPerHour)}\n`;
            text += `${GOLD}Coins/h (sell offer): ${WHITE}${formatNumberWithSpaces(membraneCoinsPerHourSellOffer)}\n`;
            text += `${GOLD}Coins/h (insta-sell): ${WHITE}${formatNumberWithSpaces(membraneCoinsPerHourInstaSell)}\n`;
            text += `\n`;
            text += `${AQUA}Elapsed time: ${WHITE}${formatElapsedTime(elapsedSeconds)}`;        
            break;

        case GEMSTONE_CHAMBERS_MODE:
            const gemstoneChamberPrices = getAuctionItemPrices('GEMSTONE_CHAMBER');
            const gemstoneChamberTotalCoins = totalChambersCount * Math.floor(gemstoneChamberPrices?.lbin || 0);
        
            text += `${GREEN}Total worms: ${WHITE}${formatNumberWithSpaces(totalWormsCount)}\n`;
            text += `${GREEN}Total membranes: ${WHITE}${formatNumberWithSpaces(totalMembranesCount)} ${GRAY}[+${formatNumberWithSpaces(lastAddedMembranesCount)} last added]\n`;
            text += `${DARK_PURPLE}Total chambers: ${WHITE}${formatNumberWithSpaces(totalChambersCount)}\n`;
            text += `${GOLD}Total coins: ${WHITE}${formatNumberWithSpaces(gemstoneChamberTotalCoins)}\n`;
            text += `\n`;
            text += `${GREEN}Worms/h: ${WHITE}${formatNumberWithSpaces(wormsPerHour)}\n`;
            text += `${GREEN}Membranes/h: ${WHITE}${formatNumberWithSpaces(membranesPerHour)}\n`;
            text += `${DARK_PURPLE}Chambers/h: ${WHITE}${formatNumberWithSpaces(chambersPerHour)}\n`;
            text += `${GOLD}Coins/h: ${WHITE}${formatNumberWithSpaces(chamberCoinsPerHour)}\n`;
            text += `\n`;
            text += `${AQUA}Elapsed time: ${WHITE}${formatElapsedTime(elapsedSeconds)}`;     
            break;
        default:
            break;
    }

    const overlay = new Text(`${text}`, overlayCoordsData.wormProfitTrackerOverlay.x, overlayCoordsData.wormProfitTrackerOverlay.y)
        .setShadow(true)
        .setScale(overlayCoordsData.wormProfitTrackerOverlay.scale);
    overlay.draw();

    const shouldShowButtons = isInChatOrInventoryGui();
    if (shouldShowButtons) {
        resetTrackerDisplayLine.setScale(overlayCoordsData.wormProfitTrackerOverlay.scale - 0.2);
        pauseTrackerDisplayLine.setScale(overlayCoordsData.wormProfitTrackerOverlay.scale - 0.2);
        buttonsDisplay
            .setRenderX(overlayCoordsData.wormProfitTrackerOverlay.x)
            .setRenderY(overlayCoordsData.wormProfitTrackerOverlay.y + overlay.getHeight() + 2).show();
    } else {
        buttonsDisplay.hide();
    }
}

// Returns array of inventory slots, each array item is membranes count in this slot.
function getInventoryMembranes() {
    let currentInventory = [];
    const inventorySlots = Player?.getInventory()?.getItems() || [];

    for (var slotIndex = 0; slotIndex < inventorySlots.length; slotIndex++) {
        let item = inventorySlots[slotIndex];
        if (!item) {
            currentInventory[slotIndex] = 0;
            continue;
        }

        let slotItemName = item?.getName()?.removeFormatting() || '';
        if (slotItemName === 'Worm Membrane') {
            currentInventory[slotIndex] = item.getStackSize() || 0;
        } else {
            currentInventory[slotIndex] = 0;
        }
    }

    return currentInventory;
}
