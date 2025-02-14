import settings from "../../settings";
import { overlayCoordsData } from "../../data/overlayCoords";
import { BOLD, DARK_PURPLE, EPIC, GOLD, GRAY, GREEN, LEGENDARY, RED, RESET, WHITE, YELLOW } from "../../constants/formatting";
import { getAuctionItemPrices } from "../../utils/auctionPrices";
import { isInSkyblock } from "../../utils/playerState";
import { toShortNumber } from "../../utils/common";

let trackerData = {
    archfiend: {
        rollsCount: 0,
        rollsCost: 0,  
        lostDicesCount: 0,
        lostDicesCost: 0,  
    },
    highClass: {
        rollsCount: 0,
        rollsCost: 0,  
        lostDicesCount: 0,
        lostDicesCost: 0,
    },
    dyesCount: 0,
    profit: 0,
    bonusHp: null
};

const DICES_INFO = [
    {
        itemId: 'ARCHFIEND_DICE',
        displayName: `${EPIC}Archfiend Dice`,
        rollCost: 666000,
        winCost: 15000000,
    },
    {
        itemId: 'HIGH_CLASS_ARCHFIEND_DICE',
        displayName: `${LEGENDARY}High Class Archfiend Dice`,
        rollCost: 6600000,
        winCost: 100000000,
    }
];

register("worldUnload", () => {
    trackerData = {
        archfiend: {
            rollsCount: 0,
            rollsCost: 0,  
            lostDicesCount: 0,
            lostDicesCost: 0,  
        },
        highClass: {
            rollsCount: 0,
            rollsCost: 0,  
            lostDicesCount: 0,
            lostDicesCost: 0,  
        },
        dyesCount: 0,
        profit: 0,
        bonusHp: null
    };
});

// &r&eYour &r&5Archfiend Dice &r&erolled a &r&a5&r&e! Bonus: &r&c+60❤&r
// &r&eYour &r&5Archfiend Dice &r&erolled a &r&c3&r&e! Bonus: &r&c-30❤&r
// &r&eYour &r&5Archfiend Dice &r&erolled a &r&56&r&e! Nice! Bonus: &r&c+120❤&r
register("chat", (color, number, event) => {
    trackArchfiendRoll(+number);
}).setCriteria(`${RESET}${YELLOW}Your ${RESET}${DARK_PURPLE}Archfiend Dice ${RESET}${YELLOW}rolled a ${RESET}` + "${color}" + "${number}" + `${RESET}${YELLOW}!`).setContains();

// &r&eYour &r&6High Class Archfiend Dice &r&erolled a &r&56&r&e! Nice! Bonus: &r&c+300❤&r
// &r&eYour &r&6High Class Archfiend Dice &r&erolled a &r&a5&r&e! Bonus: &r&c+200❤&r
// &r&eYour &r&6High Class Archfiend Dice &r&erolled a &r&c1&r&e! Bonus: &r&c-300❤&r
// &r&eYour &r&6High Class Archfiend Dice &r&erolled a &r&57&r&e!
register("chat", (color, number, event) => {
    trackHighClassArchfiendRoll(+number);
}).setCriteria(`${RESET}${YELLOW}Your ${RESET}${GOLD}High Class Archfiend Dice ${RESET}${YELLOW}rolled a ${RESET}` + "${color}" + "${number}" + `${RESET}${YELLOW}!`).setContains();

register('renderOverlay', () => renderOverlay());

function trackArchfiendRoll(number) {
    if (number < 1 || number > 7) {
        return;
    }

    const itemId = 'ARCHFIEND_DICE';
    const diceInfo = DICES_INFO.find(d => d.itemId === itemId);
    const dicePrice = getAuctionItemPrices(itemId)?.lbin || 0;
    const dyePrice = getAuctionItemPrices('DYE_ARCHFIEND')?.lbin || 0;

    trackerData.archfiend.rollsCount++;
    trackerData.archfiend.rollsCost -= diceInfo.rollCost;
    trackerData.profit -= diceInfo.rollCost;

    if (number === 6) {
        trackerData.archfiend.lostDicesCount += 1;
        trackerData.archfiend.lostDicesCost -= dicePrice;
        trackerData.profit -= dicePrice;
        trackerData.profit += 15000000;
    }

    if (number === 7) {
        trackerData.archfiend.lostDicesCount += 1;
        trackerData.archfiend.lostDicesCost -= dicePrice;
        trackerData.profit -= dicePrice;
        trackerData.profit += dyePrice;
    }
}

function trackHighClassArchfiendRoll(number) {
    if (number < 1 || number > 7) {
        return;
    }

    const itemId = 'HIGH_CLASS_ARCHFIEND_DICE';
    const diceInfo = DICES_INFO.find(d => d.itemId === itemId);
    const dicePrice = getAuctionItemPrices(itemId)?.lbin || 0;
    const dyePrice = getAuctionItemPrices('DYE_ARCHFIEND')?.lbin || 0;
    
    trackerData.highClass.rollsCount++;
    trackerData.highClass.rollsCost -= diceInfo.rollCost;
    trackerData.profit -= diceInfo.rollCost;

    if (number === 6) {
        trackerData.highClass.lostDicesCount += 1;
        trackerData.highClass.lostDicesCost -= dicePrice;
        trackerData.profit -= dicePrice;
        trackerData.profit += 15000000;
    }

    if (number === 7) {
        trackerData.highClass.lostDicesCount += 1;
        trackerData.highClass.lostDicesCost -= dicePrice;
        trackerData.profit -= dicePrice;
        trackerData.profit += dyePrice;
    }
}

function renderOverlay() {
    // TODO!!!!!!! setting
    if (//!isInSkyblock() ||
        (!trackerData.archfiend.rollsCount && !trackerData.highClass.rollsCount) ||
        settings.allOverlaysGui.isOpen()
    ) {
        return;
    }

    let text = `${DARK_PURPLE}${BOLD}Archfiend Dice\n`;
    text += `${GRAY}Rolled ${WHITE}${trackerData.archfiend.rollsCount} ${GRAY}time(s)\n`;
    text += `${GOLD}Rolls cost: ${RED}${toShortNumber(trackerData.archfiend.rollsCost)}\n`;
    text += `${GOLD}Lost dices cost: ${RED}${toShortNumber(trackerData.archfiend.lostDicesCost)}\n\n`;

    text += `${GOLD}${BOLD}High Class Archfiend Dice\n`;
    text += `${GRAY}Rolled ${WHITE}${trackerData.highClass.rollsCount} ${GRAY}time(s)\n`;
    text += `${GOLD}Rolls cost: ${RED}${toShortNumber(trackerData.highClass.rollsCost)}\n`;
    text += `${GOLD}Lost dices cost: ${RED}${toShortNumber(trackerData.highClass.lostDicesCost)}\n\n`;

    const bonusHpColor = trackerData.bonusHp >= 0 ? GREEN : RED;
    text += `${GREEN}Bonus HP: ${bonusHpColor}${trackerData.bonusHp || 'N/A'}\n`;

    const profitColor = trackerData.profit >= 0 ? GREEN : RED;
    text += `${GOLD}${BOLD}Total profit: ${profitColor}${toShortNumber(trackerData.profit)}\n`;
    
    const overlay = new Text(text, overlayCoordsData.legionAndBobbingTimeOverlay.x, overlayCoordsData.legionAndBobbingTimeOverlay.y) // TODO!!!!!!!
        .setShadow(true)
        .setScale(overlayCoordsData.legionAndBobbingTimeOverlay.scale); // TODO!!!!!!!
    overlay.draw();
}