import settings, { allOverlaysGui } from "../../settings";
import { overlayCoordsData } from "../../data/overlayCoords";
import { persistentData } from "../../data/data";
import { AQUA, BOLD, DARK_PURPLE, EPIC, GOLD, GRAY, GREEN, LEGENDARY, RED, RESET, WHITE, YELLOW } from "../../constants/formatting";
import { getAuctionItemPrices } from "../../utils/auctionPrices";
import { isInSkyblock } from "../../utils/playerState";
import { formatNumberWithSpaces, toShortNumber } from "../../utils/common";
import { registerIf } from "../../utils/registers";
import { createButtonsDisplay, toggleButtonsDisplay } from "../../utils/overlays";
import { SESSION_VIEW_MODE, TOTAL_VIEW_MODE } from "../../constants/viewModes";
import { ARCHFIEND_DICE_ROLL_MESSAGE, HIGH_CLASS_ARCHFIEND_DICE_ROLL_MESSAGE } from "../../constants/triggers";

// Hide after N minutes of having no dices in inventory?
// Move, move all
// Settings
// Reset and confirm - 2 commands
// Reset on close game - total?
// Separate reset of session and total
// Sound effects on 6

let lastDiceRolledAt = null;

const ARCHFIEND_DICE_ID = 'ARCHFIEND_DICE';
const HIGH_CLASS_ARCHFIEND_DICE_ID = 'HIGH_CLASS_ARCHFIEND_DICE';
const ARCHFIEND_DYE_ID = 'DYE_ARCHFIEND';
const DICES_INFO = [
    {
        itemId: ARCHFIEND_DICE_ID,
        displayName: `${EPIC}Archfiend Dice`,
        rollCost: 666000,
        winCost: 15000000,
    },
    {
        itemId: HIGH_CLASS_ARCHFIEND_DICE_ID,
        displayName: `${LEGENDARY}High Class Archfiend Dice`,
        rollCost: 6600000,
        winCost: 100000000,
    }
];


registerIf(
    register("chat", (color, number, event) => {
        trackArchfiendRoll(persistentData.archfiendDiceProfit.session, +number);
        trackArchfiendRoll(persistentData.archfiendDiceProfit.total, +number);
    }).setCriteria(ARCHFIEND_DICE_ROLL_MESSAGE).setContains(),
    () => settings.archfiendDiceProfitTrackerOverlay && isInSkyblock()
);

registerIf(
    register("chat", (color, number, event) => {
        trackHighClassArchfiendRoll(persistentData.archfiendDiceProfit.session, +number);
        trackHighClassArchfiendRoll(persistentData.archfiendDiceProfit.total, +number);
    }).setCriteria(HIGH_CLASS_ARCHFIEND_DICE_ROLL_MESSAGE).setContains(),
    () => settings.archfiendDiceProfitTrackerOverlay && isInSkyblock()
);

registerIf(
    register('renderOverlay', () => renderOverlay()),
    () => settings.archfiendDiceProfitTrackerOverlay && isInSkyblock()
);

register("gameUnload", () => {
    resetSession();
});

const buttonsDisplay = createButtonsDisplay(true, () => resetDiceProfitTracker(false), false, null, true, () => toggleViewMode());

function resetDiceProfitTracker(isConfirmed) {
    try {
        const isSession = isSessionViewMode();
        const viewMode = isSession ? '[Session]' : '[Total]';

        if (!isConfirmed) {
            new Message(
                new TextComponent(`${GOLD}[FeeshNotifier] ${WHITE}Do you want to reset Archfiend Dice profit tracker ${viewMode}? ${RED}${BOLD}[Click to confirm]`)
                    .setClickAction('run_command')
                    .setClickValue(isSession ? '/feeshResetArchfiendDiceProfit noconfirm' : '/feeshResetArchfiendDiceProfitTotal noconfirm')
            ).chat();
            return;
        }
    
        lastDiceRolledAt = null;

        if (isSession) {
            resetSession();
        } else {
            resetTotal();
        }

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Archfiend Dice profit tracker ${viewMode} was reset.`);    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [DiceProfitTracker] Failed to reset Archfiend Dice profit tracker.`);
	}
}

function resetSession() {
    persistentData.archfiendDiceProfit.session = {
        archfiend: {
            rollsCount: 0,
            rollsCost: 0,  
            count6: 0,
            count7: 0,
            lostDicesCost: 0,
            earnedCost: 0,
            profit: 0
        },
        highClass: {
            rollsCount: 0,
            rollsCost: 0,  
            count6: 0,
            count7: 0,
            lostDicesCost: 0,
            earnedCost: 0,
            profit: 0
        },
        profit: 0
    };
    persistentData.save();
}

function resetTotal() {
    persistentData.archfiendDiceProfit.total = {
        archfiend: {
            rollsCount: 0,
            rollsCost: 0,  
            count6: 0,
            count7: 0,
            lostDicesCost: 0,
            earnedCost: 0,
            profit: 0
        },
        highClass: {
            rollsCount: 0,
            rollsCost: 0,  
            count6: 0,
            count7: 0,
            lostDicesCost: 0,
            earnedCost: 0,
            profit: 0
        },
        profit: 0
    };
    persistentData.save();
}

function toggleViewMode() {
    try {
        const currentViewMode = persistentData.archfiendDiceProfit.viewMode || SESSION_VIEW_MODE;
        const newViewMode = currentViewMode === SESSION_VIEW_MODE ? TOTAL_VIEW_MODE : SESSION_VIEW_MODE;
        persistentData.archfiendDiceProfit.viewMode = newViewMode;
        persistentData.save();    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [DiceProfitTracker] Failed to toggle view mode from ${currentViewMode}.`);
	}
}

function trackArchfiendRoll(sourceObj, number) {
    try {
        if (!settings.archfiendDiceProfitTrackerOverlay || !isInSkyblock() || number < 1 || number > 7) {
            return;
        }
    
        lastDiceRolledAt = new Date();

        const itemId = ARCHFIEND_DICE_ID;
        const diceInfo = DICES_INFO.find(d => d.itemId === itemId);
        const dicePrice = getAuctionItemPrices(itemId)?.lbin || 0;
    
        sourceObj.archfiend.rollsCount++;
        sourceObj.archfiend.rollsCost -= diceInfo.rollCost;
        sourceObj.archfiend.profit -= diceInfo.rollCost;
        sourceObj.profit -= diceInfo.rollCost;
    
        if (number === 6) {
            sourceObj.archfiend.count6 += 1;
            sourceObj.archfiend.lostDicesCost -= dicePrice;
            sourceObj.archfiend.earnedCost += diceInfo.winCost;
            sourceObj.archfiend.profit -= dicePrice;
            sourceObj.archfiend.profit += diceInfo.winCost;
            sourceObj.profit -= dicePrice;
            sourceObj.profit += diceInfo.winCost;
        }
    
        if (number === 7) {
            const dyePrice = getAuctionItemPrices(ARCHFIEND_DYE_ID)?.lbin || 0;
            sourceObj.archfiend.count7 += 1;
            sourceObj.archfiend.lostDicesCost -= dicePrice;
            sourceObj.archfiend.earnedCost += dyePrice;
            sourceObj.archfiend.profit -= dicePrice;
            sourceObj.archfiend.profit += dyePrice;
            sourceObj.profit -= dicePrice;
            sourceObj.profit += dyePrice;
        }
    
        persistentData.save();    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [DiceProfitTracker] Failed to track Archfiend Dice roll.`);
	}
}

function trackHighClassArchfiendRoll(sourceObj, number) {
    try {
        if (!settings.archfiendDiceProfitTrackerOverlay || !isInSkyblock() || number < 1 || number > 7) {
            return;
        }
    
        lastDiceRolledAt = new Date();

        const itemId = HIGH_CLASS_ARCHFIEND_DICE_ID;
        const diceInfo = DICES_INFO.find(d => d.itemId === itemId);
        const dicePrice = getAuctionItemPrices(itemId)?.lbin || 0;
    
        sourceObj.highClass.rollsCount++;
        sourceObj.highClass.rollsCost -= diceInfo.rollCost;
        sourceObj.highClass.profit -= diceInfo.rollCost;
        sourceObj.profit -= diceInfo.rollCost;
    
        if (number === 6) {
            sourceObj.highClass.count6 += 1;
            sourceObj.highClass.lostDicesCost -= dicePrice;
            sourceObj.highClass.earnedCost += diceInfo.winCost;
            sourceObj.highClass.profit -= dicePrice;
            sourceObj.highClass.profit += diceInfo.winCost;
            sourceObj.profit -= dicePrice;
            sourceObj.profit += diceInfo.winCost;
        }
    
        if (number === 7) {
            const dyePrice = getAuctionItemPrices(ARCHFIEND_DYE_ID)?.lbin || 0;
            sourceObj.highClass.count7 += 1;
            sourceObj.highClass.lostDicesCost -= dicePrice;
            sourceObj.highClass.earnedCost += dyePrice;
            sourceObj.highClass.profit -= dicePrice;
            sourceObj.highClass.profit += dyePrice;
            sourceObj.profit -= dicePrice;
            sourceObj.profit += dyePrice;
        }
    
        persistentData.save();    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [DiceProfitTracker] Failed to track High Class Archfiend Dice roll.`);
	}
}

function renderOverlay() {
    // If session view & session is empty - hide?
    // If total view and total is empty - hide?
    const isSession = isSessionViewMode();

    if (!settings.archfiendDiceProfitTrackerOverlay ||
        !isInSkyblock() ||
        !lastDiceRolledAt ||
        (new Date() - lastDiceRolledAt > 60000) || // Hide in 1 minute after last roll
        (isSession && !persistentData.archfiendDiceProfit.session.archfiend.rollsCount && !persistentData.archfiendDiceProfit.session.highClass.rollsCount) ||
        //(!isSession && !persistentData.archfiendDiceProfit.session.archfiend.rollsCount && !persistentData.archfiendDiceProfit.session.highClass.rollsCount && !persistentData.archfiendDiceProfit.total.archfiend.rollsCount && !persistentData.archfiendDiceProfit.total.highClass.rollsCount) ||
        allOverlaysGui.isOpen()
    ) {
        buttonsDisplay.hide();
        return;
    }

    const sourceObj = isSession ? persistentData.archfiendDiceProfit.session : persistentData.archfiendDiceProfit.total;
    let text = `${YELLOW}${BOLD}Archfiend Dice profit tracker`;
    text += isSession ? ` ${GREEN}[Session]` : ` ${GREEN}[Total]`;

    text += `\n\n${DARK_PURPLE}${BOLD}Archfiend Dice`;
    text += `\n${WHITE}${formatNumberWithSpaces(sourceObj.archfiend.rollsCount)}${GRAY}x rolls | ${WHITE}${formatNumberWithSpaces(sourceObj.archfiend.count6)}${GRAY}x ${DARK_PURPLE}6 ${GRAY}| ${WHITE}${formatNumberWithSpaces(sourceObj.archfiend.count7)}${GRAY}x ${DARK_PURPLE}7`;
    text += `\n${AQUA}Profit: ${sourceObj.archfiend.profit >= 0 ? GREEN : RED}${toShortNumber(sourceObj.archfiend.profit)}`;

    text += `\n\n${GOLD}${BOLD}High Class Archfiend Dice`;
    text += `\n${WHITE}${formatNumberWithSpaces(sourceObj.highClass.rollsCount)}${GRAY}x rolls | ${WHITE}${formatNumberWithSpaces(sourceObj.highClass.count6)}${GRAY}x ${DARK_PURPLE}6 ${GRAY}| ${WHITE}${formatNumberWithSpaces(sourceObj.highClass.count7)}${GRAY}x ${DARK_PURPLE}7`;

    text += `\n${AQUA}Profit: ${sourceObj.highClass.profit >= 0 ? GREEN : RED}${toShortNumber(sourceObj.highClass.profit)}`;

    const profitColor = sourceObj.profit >= 0 ? GREEN : RED;
    text += `\n\n${AQUA}${BOLD}Total profit: ${profitColor}${toShortNumber(sourceObj.profit)}`;

    const overlay = new Text(text, overlayCoordsData.archfiendDiceProfitTrackerOverlay.x, overlayCoordsData.archfiendDiceProfitTrackerOverlay.y)
        .setShadow(true)
        .setScale(overlayCoordsData.archfiendDiceProfitTrackerOverlay.scale);
    overlay.draw();

    toggleButtonsDisplay(buttonsDisplay, overlay, overlayCoordsData.archfiendDiceProfitTrackerOverlay);
}

function isSessionViewMode() {
    const isSession = persistentData.archfiendDiceProfit.viewMode === SESSION_VIEW_MODE;
    return isSession;
}