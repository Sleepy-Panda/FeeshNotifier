import settings, { allOverlaysGui } from "../../settings";
import { overlayCoordsData } from "../../data/overlayCoords";
import { persistentData } from "../../data/data";
import { AQUA, BOLD, DARK_PURPLE, DARK_RED, EPIC, GOLD, GRAY, GREEN, LEGENDARY, RED, RESET, WHITE, YELLOW } from "../../constants/formatting";
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
        rollCost: 666_000,
        winCost: 15_000_000,
    },
    {
        itemId: HIGH_CLASS_ARCHFIEND_DICE_ID,
        displayName: `${LEGENDARY}High Class Archfiend Dice`,
        rollCost: 6_600_000,
        winCost: 100_000_000,
    }
];

registerIf(
    register("chat", (color, number, event) => {
        trackArchfiendDiceRoll(persistentData.archfiendDiceProfit.session, ARCHFIEND_DICE_ID, +number);
        trackArchfiendDiceRoll(persistentData.archfiendDiceProfit.total, ARCHFIEND_DICE_ID, +number);
    }).setCriteria(ARCHFIEND_DICE_ROLL_MESSAGE).setContains(),
    () => settings.archfiendDiceProfitTrackerOverlay && isInSkyblock()
);

registerIf(
    register("chat", (color, number, event) => {
        trackArchfiendDiceRoll(persistentData.archfiendDiceProfit.session, HIGH_CLASS_ARCHFIEND_DICE_ID, +number);
        trackArchfiendDiceRoll(persistentData.archfiendDiceProfit.total, HIGH_CLASS_ARCHFIEND_DICE_ID, +number);
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

const buttonsDisplay = createButtonsDisplay(true, () => resetArchfiendDiceProfitTracker(false, null), false, null, true, () => toggleViewMode());

export function resetArchfiendDiceProfitTracker(isConfirmed, resetViewMode) {
    try {
        if (!resetViewMode) resetViewMode = persistentData.archfiendDiceProfit.viewMode;

        const isSession = isSessionViewMode(resetViewMode);
        const viewModeText = isSession ? `${GREEN}[Session]` : `${GREEN}[Total]`;

        if (!isConfirmed) {
            new Message(
                new TextComponent(`${GOLD}[FeeshNotifier] ${WHITE}Do you want to reset Archfiend Dice profit tracker ${viewModeText}${WHITE}? ${RED}${BOLD}[Click to confirm]`)
                    .setClickAction('run_command')
                    .setClickValue(isSession ? '/feeshResetArchfiendDiceProfit noconfirm' : '/feeshResetArchfiendDiceProfitTotal noconfirm')
            ).chat();
            return;
        }
    
        if (isSession) {
            resetSession();
        } else {
            resetTotal();
        }

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Archfiend Dice profit tracker ${viewModeText} ${WHITE}was reset.`);    
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

function trackArchfiendDiceRoll(sourceObj, itemId, number) {
    try {
        if (!settings.archfiendDiceProfitTrackerOverlay || !isInSkyblock() || number < 1 || number > 7) {
            return;
        }
    
        lastDiceRolledAt = new Date();

        let sourceObjDiceProp = itemId === ARCHFIEND_DICE_ID ? sourceObj.archfiend : sourceObj.highClass;
        const diceInfo = DICES_INFO.find(d => d.itemId === itemId);
        const dicePrice = getAuctionItemPrices(itemId)?.lbin || 0;
    
        sourceObjDiceProp.rollsCount++;
        sourceObjDiceProp.rollsCost -= diceInfo.rollCost;
        sourceObjDiceProp.profit -= diceInfo.rollCost;
        sourceObj.profit -= diceInfo.rollCost;
    
        if (number === 6) {
            sourceObjDiceProp.count6 += 1;
            sourceObjDiceProp.lostDicesCost -= dicePrice;
            sourceObjDiceProp.earnedCost += diceInfo.winCost;
            sourceObjDiceProp.profit -= dicePrice;
            sourceObjDiceProp.profit += diceInfo.winCost;
            sourceObj.profit -= dicePrice;
            sourceObj.profit += diceInfo.winCost;
            ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}You gained ${GOLD}${toShortNumber(diceInfo.winCost)} ${WHITE}coins, ${WHITE}but lost ${diceInfo.displayName} ${WHITE}costing ${GOLD}${toShortNumber(dicePrice)} ${WHITE}coins.`);
        }
    
        if (number === 7) {
            const dyePrice = getAuctionItemPrices(ARCHFIEND_DYE_ID)?.lbin || 0;
            sourceObjDiceProp.count7 += 1;
            sourceObjDiceProp.lostDicesCost -= dicePrice;
            sourceObjDiceProp.earnedCost += dyePrice;
            sourceObjDiceProp.profit -= dicePrice;
            sourceObjDiceProp.profit += dyePrice;
            sourceObj.profit -= dicePrice;
            sourceObj.profit += dyePrice;
            ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}You gained ${DARK_RED}Archfiend Dye ${WHITE}costing ${GOLD}${toShortNumber(dyePrice)} ${WHITE}coins, but lost ${diceInfo.displayName} ${WHITE}costing ${GOLD}${toShortNumber(dicePrice)} ${WHITE}coins.`);
        }
    
        persistentData.save();    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [DiceProfitTracker] Failed to track Archfiend Dice roll.`);
	}
}

function renderOverlay() {
    // If session view & session is empty - hide?
    // If total view and total is empty - hide?
    const isSession = isSessionViewMode(persistentData.archfiendDiceProfit.viewMode);

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

function isSessionViewMode(viewMode) {
    const isSession = viewMode === SESSION_VIEW_MODE;
    return isSession;
}
