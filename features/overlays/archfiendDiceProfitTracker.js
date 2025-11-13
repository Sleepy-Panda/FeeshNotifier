import settings, { allOverlaysGui } from "../../settings";
import { overlayCoordsData } from "../../data/overlayCoords";
import { persistentData } from "../../data/data";
import { AQUA, BOLD, DARK_PURPLE, DARK_RED, EPIC, GOLD, GRAY, GREEN, LEGENDARY, RED, WHITE, YELLOW } from "../../constants/formatting";
import { getAuctionItemPrices } from "../../utils/auctionPrices";
import { isInSkyblock } from "../../utils/playerState";
import { formatNumberWithSpaces, logError, toShortNumber } from "../../utils/common";
import { registerIf } from "../../utils/registers";
import { Overlay, OverlayTextLine, OverlayButtonLine, LEFT_CLICK_TYPE } from "../../utils/overlays";
import { SESSION_VIEW_MODE, TOTAL_VIEW_MODE } from "../../constants/viewModes";
import { ARCHFIEND_DICE_ROLL_MESSAGE, HIGH_CLASS_ARCHFIEND_DICE_ROLL_MESSAGE } from "../../constants/triggers";

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
        trackArchfiendDiceRoll(getSourceObject(SESSION_VIEW_MODE), ARCHFIEND_DICE_ID, +number, true);
        trackArchfiendDiceRoll(getSourceObject(TOTAL_VIEW_MODE), ARCHFIEND_DICE_ID, +number, false);
    }).setCriteria(ARCHFIEND_DICE_ROLL_MESSAGE).setContains(),
    () => settings.archfiendDiceProfitTrackerOverlay && isInSkyblock()
);

registerIf(
    register("chat", (color, number, event) => {
        trackArchfiendDiceRoll(getSourceObject(SESSION_VIEW_MODE), HIGH_CLASS_ARCHFIEND_DICE_ID, +number, true);
        trackArchfiendDiceRoll(getSourceObject(TOTAL_VIEW_MODE), HIGH_CLASS_ARCHFIEND_DICE_ID, +number, false);
    }).setCriteria(HIGH_CLASS_ARCHFIEND_DICE_ROLL_MESSAGE).setContains(),
    () => settings.archfiendDiceProfitTrackerOverlay && isInSkyblock()
);

registerIf(
    register('step', () => refreshOverlay()).setFps(2),
    () => settings.archfiendDiceProfitTrackerOverlay && isInSkyblock()
);

register("gameLoad", () => {
    if (persistentData?.archfiendDiceProfit?.session &&
        (persistentData.archfiendDiceProfit.session.archfiend.rollsCount > 0 || persistentData.archfiendDiceProfit.session.highClass.rollsCount > 0)
    ) {
        resetSession();
    }
});

const overlay = new Overlay(() => settings.archfiendDiceProfitTrackerOverlay && isInSkyblock())
    .setPositionData(overlayCoordsData.archfiendDiceProfitTrackerOverlay)
    .setIsClickable(true)
    .setViewModes([ SESSION_VIEW_MODE, TOTAL_VIEW_MODE ]);

export function resetArchfiendDiceProfitTracker(isConfirmed, resetViewMode) {
    try {
        if (!resetViewMode) resetViewMode = persistentData.archfiendDiceProfit.viewMode;
        const viewModeText = overlay.getViewModeDisplayText(resetViewMode);

        if (!isConfirmed) {
            new Message(
                new TextComponent(`${GOLD}[FeeshNotifier] ${WHITE}Do you want to reset Archfiend Dice profit tracker ${viewModeText}${WHITE}? ${RED}${BOLD}[Click to confirm]`)
                    .setClickAction('run_command')
                    .setClickValue(getResetAction(resetViewMode))
            ).chat();
            return;
        }
    
        if (resetViewMode === SESSION_VIEW_MODE) resetSession();
        else if (resetViewMode === TOTAL_VIEW_MODE) resetTotal();

        refreshOverlay();
        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Archfiend Dice profit tracker ${viewModeText} ${WHITE}was reset.`);    
    } catch (e) {
        logError(e, 'Failed to reset Archfiend Dice profit tracker.');
	}

    function getResetAction(viewMode) {
        const actions = {
            [SESSION_VIEW_MODE]: '/feeshResetArchfiendDiceProfit noconfirm',
            [TOTAL_VIEW_MODE]: '/feeshResetArchfiendDiceProfitTotal noconfirm'
        };
        return actions[viewMode] || '';
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
        const newViewMode = overlay.getNextViewMode(currentViewMode);
        persistentData.archfiendDiceProfit.viewMode = newViewMode;
        persistentData.save();
        refreshOverlay();
    } catch (e) {
        logError(e, 'Failed to toggle view mode for Archfiend Dice profit tracker.');
	}
}

function trackArchfiendDiceRoll(sourceObj, itemId, number, announceCost) {
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

            if (announceCost) {
                ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}You gained ${GOLD}${toShortNumber(diceInfo.winCost)} ${WHITE}coins for rolling 6, ${WHITE}but lost ${diceInfo.displayName} ${WHITE}costing ${GOLD}${toShortNumber(dicePrice)} ${WHITE}coins.`);
            }
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
            if (announceCost) {
                ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}You gained ${DARK_RED}Archfiend Dye ${WHITE}costing ${GOLD}${toShortNumber(dyePrice)} ${WHITE}coins for rolling 7, but lost ${diceInfo.displayName} ${WHITE}costing ${GOLD}${toShortNumber(dicePrice)} ${WHITE}coins.`);
            }
        }
    
        persistentData.save();
        refreshOverlay();  
    } catch (e) {
        logError(e, 'Failed to track Archfiend Dice roll for Archfiend Dice profit tracker.');
	}
}

function refreshOverlay() {
    try {
        overlay.clear();
        const viewMode = persistentData.archfiendDiceProfit.viewMode;
    
        if (!settings.archfiendDiceProfitTrackerOverlay ||
            !isInSkyblock() ||
            !lastDiceRolledAt ||
            (new Date() - lastDiceRolledAt > 60_000) || // Hide in 1 minute after last roll
            (viewMode === SESSION_VIEW_MODE && !persistentData.archfiendDiceProfit.session.archfiend.rollsCount && !persistentData.archfiendDiceProfit.session.highClass.rollsCount) ||
            (viewMode === TOTAL_VIEW_MODE && !persistentData.archfiendDiceProfit.total.archfiend.rollsCount && !persistentData.archfiendDiceProfit.total.highClass.rollsCount) ||
            allOverlaysGui.isOpen()
        ) {
            return;
        }
    
        const sourceObj = getSourceObject(viewMode);
        const viewModeText = overlay.getViewModeDisplayText(viewMode);
        let overlayText = `${YELLOW}${BOLD}Archfiend Dice profit tracker ${viewModeText}`;
    
        overlayText += `\n\n${DARK_PURPLE}${BOLD}Archfiend Dice`;
        overlayText += `\n${WHITE}${formatNumberWithSpaces(sourceObj.archfiend.rollsCount)}${GRAY}x rolls | ${WHITE}${formatNumberWithSpaces(sourceObj.archfiend.count6)}${GRAY}x ${DARK_PURPLE}6 ${GRAY}| ${WHITE}${formatNumberWithSpaces(sourceObj.archfiend.count7)}${GRAY}x ${DARK_PURPLE}7`;
        overlayText += `\n${AQUA}Profit: ${sourceObj.archfiend.profit >= 0 ? GREEN : RED}${toShortNumber(sourceObj.archfiend.profit)}`;
    
        overlayText += `\n\n${GOLD}${BOLD}High Class Archfiend Dice`;
        overlayText += `\n${WHITE}${formatNumberWithSpaces(sourceObj.highClass.rollsCount)}${GRAY}x rolls | ${WHITE}${formatNumberWithSpaces(sourceObj.highClass.count6)}${GRAY}x ${DARK_PURPLE}6 ${GRAY}| ${WHITE}${formatNumberWithSpaces(sourceObj.highClass.count7)}${GRAY}x ${DARK_PURPLE}7`;
    
        overlayText += `\n${AQUA}Profit: ${sourceObj.highClass.profit >= 0 ? GREEN : RED}${toShortNumber(sourceObj.highClass.profit)}`;
    
        const profitColor = sourceObj.profit >= 0 ? GREEN : RED;
        overlayText += `\n\n${AQUA}${BOLD}Total profit: ${profitColor}${toShortNumber(sourceObj.profit)}`;
    
        overlay.addTextLine(new OverlayTextLine().setText(overlayText));
        overlay.addButtonLine(new OverlayButtonLine()
            .setText(overlay.getNextViewModeButtonDisplayText(viewMode))
            .setIsSmallerScale(true)
            .setOnClick(LEFT_CLICK_TYPE, () => toggleViewMode()));
        overlay.addButtonLine(new OverlayButtonLine()
            .setText(`${RED}${BOLD}[Click to reset]`)
            .setIsSmallerScale(true)
            .setOnClick(LEFT_CLICK_TYPE, () => resetArchfiendDiceProfitTracker(false, null)));    
    } catch (e) {
        logError(e, 'Failed to refresh tracker data for Archfiend Dice profit tracker.');
	}
}

function getSourceObject(viewMode) {
    switch (true) {
        case viewMode === SESSION_VIEW_MODE:
            return persistentData.archfiendDiceProfit.session;
        case viewMode === TOTAL_VIEW_MODE:
            return persistentData.archfiendDiceProfit.total;
        default:
            return null;
    }
}
