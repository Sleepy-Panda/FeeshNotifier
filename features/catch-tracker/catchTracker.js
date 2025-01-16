import settings from "../../settings";
import { persistentData } from "../../data/data";
import { overlayCoordsData } from "../../data/overlayCoords";
import { fromUppercaseToCapitalizedFirstLetters, hasDoubleHookInMessage } from '../../utils/common';
import { WHITE, GOLD, BOLD, YELLOW, GRAY } from "../../constants/formatting";
import { RARE_CATCH_TRIGGERS } from "../../constants/triggers";
import { hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";

export function resetRareCatchesTracker() {
    if (persistentData.totalRareCatches > 0 && persistentData.rareCatches) {
        var catches = Object.entries(persistentData.rareCatches)
            .map(([key, value]) => {
                return { seaCreature: key, amount: value.amount };
            })
            .sort((a, b) => b.amount - a.amount)
            .map((entry) => {
                const rarityColorCode = RARE_CATCH_TRIGGERS.find(t => t.seaCreature === entry.seaCreature).rarityColorCode;
                return `${rarityColorCode}${entry.amount} ${fromUppercaseToCapitalizedFirstLetters(entry.seaCreature)}${entry.amount > 1 ? 's' : ''}`;
            });

        if (catches.length) {
            ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}You caught ${catches.join(', ')} ${WHITE}per session (${persistentData.totalRareCatches} rare catches in total).`);
        }
    }

	persistentData.rareCatches = {};
    persistentData.totalRareCatches = 0;
    persistentData.save();
    ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Rare catches tracker was reset.`);
}

export function trackCatch(options) {
    if (!settings.rareCatchesTrackerOverlay) {
        return;
    }

	const isDoubleHook = hasDoubleHookInMessage();
    const valueToAdd = isDoubleHook ? 2 : 1;
    const currentAmount = persistentData.rareCatches[options.seaCreature] ? persistentData.rareCatches[options.seaCreature].amount : 0;

	persistentData.rareCatches[options.seaCreature] = {
        amount: currentAmount ? currentAmount + valueToAdd : valueToAdd,
        percent: null
    };

    const total = Object.values(persistentData.rareCatches).reduce((accumulator, currentValue) => {
        return accumulator + currentValue.amount
    }, 0);
    persistentData.totalRareCatches = total;

    Object.keys(persistentData.rareCatches).forEach((key) => {
        const entry = persistentData.rareCatches[key];
        const percent = persistentData.totalRareCatches ? ((entry.amount / persistentData.totalRareCatches) * 100).toFixed(2) : 0;
        entry.percent = percent;
    });

    persistentData.save();
}

export function renderRareCatchTrackerOverlay() {
    if (!settings.rareCatchesTrackerOverlay ||
        !Object.entries(persistentData.rareCatches).length ||
        !isInSkyblock() ||
        !hasFishingRodInHotbar()) {
        return;
    }

    let overlayText = `${YELLOW}${BOLD}Rare catches tracker\n`;

    const entries = Object.entries(persistentData.rareCatches)
        .map(([key, value]) => {
            return { seaCreature: key, amount: value.amount, percent: value.percent };
        })
        .sort((a, b) => b.amount - a.amount); // Most catches at the top

    entries.forEach((entry) => {
        const rarityColorCode = RARE_CATCH_TRIGGERS.find(t => t.seaCreature === entry.seaCreature).rarityColorCode;
        overlayText += ` ${rarityColorCode}${fromUppercaseToCapitalizedFirstLetters(entry.seaCreature)}: ${WHITE}${entry.amount} ${GRAY}(${entry.percent}%)\n`;
    });

    overlayText += `${YELLOW}Total: ${WHITE}${persistentData.totalRareCatches}`;

    const overlay = new Text(overlayText, overlayCoordsData.rareCatchesTrackerOverlay.x, overlayCoordsData.rareCatchesTrackerOverlay.y)
        .setShadow(true)
        .setScale(overlayCoordsData.rareCatchesTrackerOverlay.scale);
    overlay.draw();
}