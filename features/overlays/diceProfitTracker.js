import settings, { allOverlaysGui } from "../../settings";
import { overlayCoordsData } from "../../data/overlayCoords";
import { persistentData } from "../../data/data";
import { AQUA, BOLD, DARK_GRAY, DARK_PURPLE, EPIC, GOLD, GRAY, GREEN, LEGENDARY, RED, RESET, WHITE, YELLOW } from "../../constants/formatting";
import { getAuctionItemPrices } from "../../utils/auctionPrices";
import { isInSkyblock } from "../../utils/playerState";
import { formatNumberWithSpaces, toShortNumber } from "../../utils/common";
import { registerIf } from "../../utils/registers";
import { createButtonsDisplay, toggleButtonsDisplay } from "../../utils/overlays";

// Hide after N minutes of having no dices in inventory?
// Move, move all
// Settings
// Reset and confirm - 2 commands
// Reset on close game - total?
// Separate reset of session and total
// Sound effects on 6
// Reset on game unload?

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

// &r&eYour &r&5Archfiend Dice &r&erolled a &r&a5&r&e! Bonus: &r&c+60❤&r
// &r&eYour &r&5Archfiend Dice &r&erolled a &r&c3&r&e! Bonus: &r&c-30❤&r
// &r&eYour &r&5Archfiend Dice &r&erolled a &r&56&r&e! Nice! Bonus: &r&c+120❤&r
registerIf(
    register("chat", (color, number, event) => {
        trackArchfiendRoll(persistentData.diceProfit.session, +number);
        trackArchfiendRoll(persistentData.diceProfit.total, +number);
    }).setCriteria(`${RESET}${YELLOW}Your ${RESET}${DARK_PURPLE}Archfiend Dice ${RESET}${YELLOW}rolled a ${RESET}` + "${color}" + "${number}" + `${RESET}${YELLOW}!`).setContains(),
    () => settings.legionAndBobbingTimeOverlay && isInSkyblock() // TODO
);

// &r&eYour &r&6High Class Archfiend Dice &r&erolled a &r&56&r&e! Nice! Bonus: &r&c+300❤&r
// &r&eYour &r&6High Class Archfiend Dice &r&erolled a &r&a5&r&e! Bonus: &r&c+200❤&r
// &r&eYour &r&6High Class Archfiend Dice &r&erolled a &r&c1&r&e! Bonus: &r&c-300❤&r
// &r&eYour &r&6High Class Archfiend Dice &r&erolled a &r&57&r&e!
registerIf(
    register("chat", (color, number, event) => {
        trackHighClassArchfiendRoll(persistentData.diceProfit.session, +number);
        trackHighClassArchfiendRoll(persistentData.diceProfit.total, +number);
    }).setCriteria(`${RESET}${YELLOW}Your ${RESET}${GOLD}High Class Archfiend Dice ${RESET}${YELLOW}rolled a ${RESET}` + "${color}" + "${number}" + `${RESET}${YELLOW}!`).setContains(),
    () => settings.legionAndBobbingTimeOverlay && isInSkyblock() // TODO
);

registerIf(
    register('renderOverlay', () => renderOverlay()),
    () => settings.legionAndBobbingTimeOverlay && isInSkyblock() // TODO
);

register("worldUnload", () => {
    resetSession();
});

const buttonsDisplay = createButtonsDisplay(true, () => resetDiceProfitTracker(false), false, null, true, () => toggleViewMode());

function resetDiceProfitTracker(isConfirmed) {
    try {
        if (!isConfirmed) {
            new Message(
                new TextComponent(`${GOLD}[FeeshNotifier] ${WHITE}Do you want to reset Dice profit tracker? ${RED}${BOLD}[Click to confirm]`)
                    .setClickAction('run_command')
                    .setClickValue('/feeshResetDiceProfit noconfirm') // TODO
            ).chat();
            return;
        }
    
        resetSession();
        resetTotal();

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Dice profit tracker was reset.`);    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [DiceProfitTracker] Failed to reset Dice profit tracker.`);
	}
}

function resetSession() {
    persistentData.diceProfit.session = {
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
    persistentData.diceProfit.total = {
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
        const currentViewMode = persistentData.diceProfit.viewMode || 'SESSION';
        const newViewMode = currentViewMode === 'SESSION' ? 'TOTAL' : 'SESSION';
        persistentData.diceProfit.viewMode = newViewMode;
        persistentData.save();    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [DiceProfitTracker] Failed to toggle view mode from ${currentViewMode}.`);
	}
}

function trackArchfiendRoll(sourceObj, number) {
    try {
        if (number < 1 || number > 7) {
            return;
        }
    
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
        if (number < 1 || number > 7) {
            return;
        }
    
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
    // TODO!!!!!!! setting
    // If session view & session is empty - hide?
    // If total view and total is empty - hide?
    const isSessionViewMode = persistentData.diceProfit.viewMode === 'SESSION';

    // TODO setting
    if (!settings.legionAndBobbingTimeOverlay ||
        !isInSkyblock() ||
        (isSessionViewMode && !persistentData.diceProfit.session.archfiend.rollsCount && !persistentData.diceProfit.session.highClass.rollsCount) ||
        (!isSessionViewMode && !persistentData.diceProfit.session.archfiend.rollsCount && !persistentData.diceProfit.session.highClass.rollsCount && !persistentData.diceProfit.total.archfiend.rollsCount && !persistentData.diceProfit.total.highClass.rollsCount) ||
        allOverlaysGui.isOpen()
    ) {
        buttonsDisplay.hide();
        return;
    }

    const sourceObj = isSessionViewMode ? persistentData.diceProfit.session : persistentData.diceProfit.total;
    let text = `${YELLOW}${BOLD}Dice profit tracker`;
    text += isSessionViewMode ? `\n${GRAY}View mode: ${WHITE}[Session]` : `\n${GRAY}View mode: ${WHITE}[Total]`;
    text += `\n\n${DARK_PURPLE}${BOLD}Archfiend Dice`;
    text += `\n${WHITE}${formatNumberWithSpaces(sourceObj.archfiend.rollsCount)}${GRAY}x rolls | ${WHITE}${formatNumberWithSpaces(sourceObj.archfiend.count6)}${GRAY}x ${DARK_PURPLE}6 ${GRAY}| ${WHITE}${formatNumberWithSpaces(sourceObj.archfiend.count7)}${GRAY}x ${DARK_PURPLE}7`;
    //text += `\n- ${GRAY}Rolled ${DARK_PURPLE}6${GRAY}: ${WHITE}${formatNumberWithSpaces(sourceObj.archfiend.count6)}${GRAY}x`;
    //text += `\n- ${GRAY}Rolled ${DARK_PURPLE}7${GRAY}: ${WHITE}${formatNumberWithSpaces(sourceObj.archfiend.count7)}${GRAY}x`;
    text += `\n${AQUA}Profit: ${sourceObj.archfiend.profit >= 0 ? GREEN : RED}${toShortNumber(sourceObj.archfiend.profit)}`;

    //text += `\n- ${YELLOW}Rolls cost: ${RED}${toShortNumber(sourceObj.archfiend.rollsCost) || 'N/A'}`;
    //text += `\n- ${YELLOW}Lost dices cost: ${RED}${toShortNumber(sourceObj.archfiend.lostDicesCost) || 'N/A'}`;
    //text += `\n- ${YELLOW}Earned: ${GREEN}${toShortNumber(sourceObj.archfiend.earnedCost) || 'N/A'}`;

    text += `\n\n${GOLD}${BOLD}High Class Archfiend Dice`;
    text += `\n${WHITE}${formatNumberWithSpaces(sourceObj.highClass.rollsCount)}${GRAY}x rolls | ${WHITE}${formatNumberWithSpaces(sourceObj.highClass.count6)}${GRAY}x ${DARK_PURPLE}6 ${GRAY}| ${WHITE}${formatNumberWithSpaces(sourceObj.highClass.count7)}${GRAY}x ${DARK_PURPLE}7`;

    //text += `\n- ${GRAY}Rolls: ${WHITE}${formatNumberWithSpaces(sourceObj.highClass.rollsCount)}${GRAY}x`;
    //text += `\n- ${GRAY}Rolled ${DARK_PURPLE}6${GRAY}: ${WHITE}${formatNumberWithSpaces(sourceObj.highClass.count6)}${GRAY}x`;
    //text += `\n- ${GRAY}Rolled ${DARK_PURPLE}7${GRAY}: ${WHITE}${formatNumberWithSpaces(sourceObj.highClass.count7)}${GRAY}x`;
    text += `\n${AQUA}Profit: ${sourceObj.highClass.profit >= 0 ? GREEN : RED}${toShortNumber(sourceObj.highClass.profit)}`;


    //text += `\n- ${YELLOW}Rolls: ${WHITE}${sourceObj.highClass.rollsCount}`;
    //text += `\n${GRAY}6: ${WHITE}${sourceObj.highClass.count6} ${GRAY}time(s), ${GRAY}7: ${WHITE}${sourceObj.highClass.count7} ${GRAY}time(s)`;
    //text += `\n- ${YELLOW}Rolls cost: ${RED}${toShortNumber(sourceObj.highClass.rollsCost) || 'N/A'}`;
    //text += `\n- ${YELLOW}Lost dices cost: ${RED}${toShortNumber(sourceObj.highClass.lostDicesCost) || 'N/A'}`;
    //text += `\n- ${YELLOW}Earned: ${GREEN}${toShortNumber(sourceObj.highClass.earnedCost) || 'N/A'}`;

    const profitColor = sourceObj.profit >= 0 ? GREEN : RED;
    text += `\n\n${AQUA}${BOLD}Total profit: ${profitColor}${toShortNumber(sourceObj.profit)}`;

    const overlay = new Text(text, overlayCoordsData.legionAndBobbingTimeOverlay.x, overlayCoordsData.legionAndBobbingTimeOverlay.y) // TODO!!!!!!!
        .setShadow(true)
        .setScale(overlayCoordsData.legionAndBobbingTimeOverlay.scale); // TODO!!!!!!!
    overlay.draw();

    toggleButtonsDisplay(buttonsDisplay, overlay, overlayCoordsData.legionAndBobbingTimeOverlay); // TODO
}