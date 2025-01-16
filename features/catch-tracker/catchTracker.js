import settings from "../../settings";
import * as seaCreatures from '../../constants/seaCreatures';
import { persistentData } from "../../data/data";
import { overlayCoordsData } from "../../data/overlayCoords";
import { fromUppercaseToCapitalizedFirstLetters, hasDoubleHookInMessage, hasDoubleHookInMessage_Reindrake, pluralize } from '../../utils/common';
import { WHITE, GOLD, BOLD, YELLOW, GRAY } from "../../constants/formatting";
import { RARE_CATCH_TRIGGERS } from "../../constants/triggers";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";

export function resetRareCatchesTracker() {
    try {
        if (persistentData.totalRareCatches > 0 && persistentData.rareCatches) {
            var catches = Object.entries(persistentData.rareCatches)
                .map(([key, value]) => {
                    return { seaCreature: key, amount: value.amount };
                })
                .sort((a, b) => b.amount - a.amount)
                .map((entry) => {
                    const rarityColorCode = RARE_CATCH_TRIGGERS.find(t => t.seaCreature === entry.seaCreature).rarityColorCode;
                    const seaCreatureDisplayName = fromUppercaseToCapitalizedFirstLetters(entry.seaCreature);
                    return `${rarityColorCode}${entry.amount} ${entry.amount > 1 ? pluralize(seaCreatureDisplayName) : seaCreatureDisplayName}`;
                });
    
            if (catches.length) {
                ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}You caught ${catches.join(', ')} ${WHITE}per session (${persistentData.totalRareCatches} rare catches in total).`);
            }
        }
    
        persistentData.rareCatches = {};
        persistentData.totalRareCatches = 0;
        persistentData.save();
        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Rare catches tracker was reset.`);    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to reset rare catches tracker.`);
	}
}

export function trackCatch(options) {
    try {
        if (!settings.rareCatchesTrackerOverlay || !isInSkyblock()) {
            return;
        }
    
        const valueToAdd = options.isDoubleHook ? 2 : 1;
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
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track rare catch.`);
	}
}

export function renderRareCatchTrackerOverlay() {
    if (!settings.rareCatchesTrackerOverlay ||
        !Object.entries(persistentData.rareCatches).length ||
        !isInSkyblock() ||
        getWorldName() === 'Kuudra' ||
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