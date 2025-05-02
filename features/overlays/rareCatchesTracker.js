import settings, { allOverlaysGui } from "../../settings";
import * as triggers from '../../constants/triggers';
import * as seaCreatures from '../../constants/seaCreatures';
import { persistentData } from "../../data/data";
import { overlayCoordsData } from "../../data/overlayCoords";
import { formatNumberWithSpaces, fromUppercaseToCapitalizedFirstLetters, isDoubleHook, isInFishingWorld, pluralize } from '../../utils/common';
import { WHITE, GOLD, BOLD, GRAY, RED, AQUA } from "../../constants/formatting";
import { RARE_CATCH_TRIGGERS } from "../../constants/triggers";
import { getLastFishingHookSeenAt, getWorldName, isInSkyblock } from "../../utils/playerState";
import { createButtonsDisplay, toggleButtonsDisplay } from "../../utils/overlays";
import { registerIf } from "../../utils/registers";

triggers.RARE_CATCH_TRIGGERS.forEach(entry => {
    registerIf(
        register("Chat", (event) => {
            const isDoubleHooked = isDoubleHook();
            trackCatch({ seaCreature: entry.seaCreature, rarityColorCode: entry.rarityColorCode, isDoubleHook: isDoubleHooked });
        }).setCriteria(entry.trigger).setContains(),
        () => settings.rareCatchesTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
    );
});

registerIf(
    register('renderOverlay', () => renderRareCatchTrackerOverlay()),
    () => settings.rareCatchesTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
);

register("gameUnload", () => {
    if (settings.rareCatchesTrackerOverlay && settings.resetRareCatchesTrackerOnGameClosed && persistentData.totalRareCatches > 0) {
        resetRareCatchesTracker(true);
    }
});

const buttonsDisplay = createButtonsDisplay(true, () => resetRareCatchesTracker(false), false, null);

export function resetRareCatchesTracker(isConfirmed) {
    try {
        if (!isConfirmed) {
            new Message(
                new TextComponent(`${GOLD}[FeeshNotifier] ${WHITE}Do you want to reset Rare catches tracker? ${RED}${BOLD}[Click to confirm]`)
                    .setClickAction('run_command')
                    .setClickValue('/feeshResetRareCatches noconfirm')
            ).chat();
            return;
        }

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

function trackCatch(options) {
    try {
        if (!settings.rareCatchesTrackerOverlay || !isInSkyblock() || !isInFishingWorld(getWorldName())) {
            return;
        }
    
        if (options.seaCreature === seaCreatures.VANQUISHER && (new Date() - getLastFishingHookSeenAt() > 6 * 60 * 1000)) {
            return;
        }

        const valueToAdd = options.isDoubleHook ? 2 : 1;
        const currentAmount = persistentData.rareCatches[options.seaCreature] ? persistentData.rareCatches[options.seaCreature].amount : 0;
        const currentDoubleHookAmount = persistentData.rareCatches[options.seaCreature] ? persistentData.rareCatches[options.seaCreature].doubleHookAmount || 0 : 0;

        persistentData.rareCatches[options.seaCreature] = {
            amount: currentAmount ? currentAmount + valueToAdd : valueToAdd,
            percent: null,
            doubleHookAmount: options.isDoubleHook ? currentDoubleHookAmount + 1 : currentDoubleHookAmount,
            doubleHookPercent: null
        };
    
        const total = Object.values(persistentData.rareCatches).reduce((accumulator, currentValue) => {
            return accumulator + currentValue.amount
        }, 0);
        persistentData.totalRareCatches = total;
    
        Object.keys(persistentData.rareCatches).forEach((key) => {
            const entry = persistentData.rareCatches[key];
            const percent = persistentData.totalRareCatches ? ((entry.amount / persistentData.totalRareCatches) * 100).toFixed(1) : 0;
            entry.percent = percent;
            const doubleHookAmount = entry.doubleHookAmount || 0;
            const doubleHookPercent = entry.amount ? ((doubleHookAmount / (entry.amount - doubleHookAmount)) * 100).toFixed(1) : 0;
            entry.doubleHookPercent = doubleHookPercent;
        });
    
        persistentData.save();    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track rare catch.`);
	}
}

function renderRareCatchTrackerOverlay() {
    if (!settings.rareCatchesTrackerOverlay ||
        !Object.entries(persistentData.rareCatches).length ||
        !isInSkyblock() ||
        !isInFishingWorld(getWorldName()) ||
        (new Date() - getLastFishingHookSeenAt() > 10 * 60 * 1000) ||
        allOverlaysGui.isOpen()
    ) {
        buttonsDisplay.hide();
        return;
    }

    let overlayText = `${AQUA}${BOLD}Rare catches tracker\n`;

    const entries = Object.entries(persistentData.rareCatches)
        .map(([key, value]) => {
            return { seaCreature: key, amount: value.amount || 0, doubleHookAmount: value.doubleHookAmount || 0, doubleHookPercent: value.doubleHookPercent || 0 };
        })
        .sort((a, b) => b.amount - a.amount); // Most catches at the top

    entries.forEach((entry) => {
        const trigger = RARE_CATCH_TRIGGERS.find(t => t.seaCreature === entry.seaCreature);
        const rarityColorCode = trigger.rarityColorCode || WHITE;
        const doubleHookInfo = trigger.seaCreature === seaCreatures.VANQUISHER
            ? ''
            : ` ${GRAY}| DH: ${WHITE}${formatNumberWithSpaces(entry.doubleHookAmount)} ${GRAY}(${entry.doubleHookPercent}${GRAY}%)`;
        overlayText += `${GRAY}- ${rarityColorCode}${fromUppercaseToCapitalizedFirstLetters(entry.seaCreature)}${GRAY}: ${WHITE}${formatNumberWithSpaces(entry.amount)}${doubleHookInfo}\n`;
    });

    overlayText += `${GRAY}Total: ${WHITE}${persistentData.totalRareCatches}`;

    const overlay = new Text(overlayText, overlayCoordsData.rareCatchesTrackerOverlay.x, overlayCoordsData.rareCatchesTrackerOverlay.y)
        .setShadow(true)
        .setScale(overlayCoordsData.rareCatchesTrackerOverlay.scale);
    overlay.draw();

    toggleButtonsDisplay(buttonsDisplay, overlay, overlayCoordsData.rareCatchesTrackerOverlay);
}