import settings, { allOverlaysGui } from "../../settings";
import * as triggers from '../../constants/triggers';
import * as seaCreatures from '../../constants/seaCreatures';
import { persistentData } from "../../data/data";
import { overlayCoordsData } from "../../data/overlayCoords";
import { formatNumberWithSpaces, fromUppercaseToCapitalizedFirstLetters, isDoubleHook, isInFishingWorld, pluralize } from '../../utils/common';
import { WHITE, GOLD, BOLD, GRAY, RED, AQUA } from "../../constants/formatting";
import { getLastFishingHookSeenAt, getWorldName, isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";
import { LEFT_CLICK_TYPE, Overlay, OverlayButtonLine, OverlayTextLine } from "../../utils/overlays";

// Wrong total amount when Rare catches selected
// Same in Reset statistics
// Migration of old user data, delete old entries in data.js
// Show percent in All mode
// Vanquisher :(
// Do not show widget if SC count > 0 but rares = 0
// Check resets

const ALL_TRIGGERS = triggers.ALL_CATCHES_TRIGGERS.concat([triggers.RARE_CATCH_TRIGGERS.find(t => t.seaCreature === seaCreatures.VANQUISHER)]);

ALL_TRIGGERS.forEach(entry => {
    registerIf(
        register("Chat", (event) => {
            const isDoubleHooked = isDoubleHook();
            trackSeaCreatureCatch({ seaCreature: entry.seaCreature, rarityColorCode: entry.rarityColorCode, isDoubleHook: isDoubleHooked });
        }).setCriteria(entry.trigger).setContains(),
        () => settings.seaCreaturesTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
    );
});

registerIf(
    register('step', () => refreshOverlay()).setFps(2),
    () => settings.seaCreaturesTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
);

register("gameUnload", () => {
    if (settings.seaCreaturesTrackerOverlay && settings.resetSeaCreaturesTrackerOnGameClosed && persistentData.seaCreatures.total.totalCount > 0) {
        resetSeaCreaturesTracker(true);
    }
});

const overlay = new Overlay(() => settings.seaCreaturesTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName()))
    .setPositionData(overlayCoordsData.seaCreaturesTrackerOverlay)
    .setIsClickable(true);

export function resetSeaCreaturesTracker(isConfirmed) {
    try {
        if (!isConfirmed) {
            new Message(
                new TextComponent(`${GOLD}[FeeshNotifier] ${WHITE}Do you want to reset Sea creatures tracker? ${RED}${BOLD}[Click to confirm]`)
                    .setClickAction('run_command')
                    .setClickValue('/feeshResetSeaCreatures noconfirm')
            ).chat();
            return;
        }

        if (persistentData.seaCreatures.total.totalCount > 0 && persistentData.seaCreatures.total.catches) {
            var catches = Object.entries(persistentData.seaCreatures.total.catches)
                .map(([key, value]) => {
                    return { seaCreature: key, amount: value.amount };
                })
                .sort((a, b) => b.amount - a.amount)
                .map((entry) => {
                    const rarityColorCode = ALL_TRIGGERS.find(t => t.seaCreature.toUpperCase() === entry.seaCreature)?.rarityColorCode || WHITE;
                    const seaCreatureDisplayName = fromUppercaseToCapitalizedFirstLetters(entry.seaCreature);
                    return `${rarityColorCode}${entry.amount} ${entry.amount > 1 ? pluralize(seaCreatureDisplayName) : seaCreatureDisplayName}`;
                });
    
            if (catches.length && settings.showOnlyRareSeaCreatures) {
                ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}You caught ${catches.join(', ')} ${WHITE}per session (${persistentData.seaCreatures.total.totalCount} rare catches in total).`);
            }
        }
    
        persistentData.seaCreatures.total.catches = {};
        persistentData.seaCreatures.total.totalCount = 0;
        persistentData.save();
        refreshOverlay();
        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Sea creatures tracker was reset.`);    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to reset Sea creatures tracker.`);
	}
}

function trackSeaCreatureCatch(options) {
    try {
        if (!settings.seaCreaturesTrackerOverlay || !isInSkyblock() || !isInFishingWorld(getWorldName())) {
            return;
        }
    
        if (options.seaCreature.toUpperCase() === seaCreatures.VANQUISHER && (new Date() - getLastFishingHookSeenAt() > 6 * 60 * 1000)) {
            return;
        }

        const key = options.seaCreature.toUpperCase();
        const valueToAdd = options.isDoubleHook ? 2 : 1;
        const currentAmount = persistentData.seaCreatures.total.catches[key] ? persistentData.seaCreatures.total.catches[key].amount : 0;
        const currentDoubleHookAmount = persistentData.seaCreatures.total.catches[key] ? persistentData.seaCreatures.total.catches[key].doubleHookAmount || 0 : 0;

        persistentData.seaCreatures.total.catches[key] = {
            amount: currentAmount ? currentAmount + valueToAdd : valueToAdd,
            percent: null,
            doubleHookAmount: options.isDoubleHook ? currentDoubleHookAmount + 1 : currentDoubleHookAmount,
            doubleHookPercent: null
        };
    
        const total = Object.values(persistentData.seaCreatures.total.catches).reduce((accumulator, currentValue) => {
            return accumulator + currentValue.amount
        }, 0);
        persistentData.seaCreatures.total.totalCount = total;
    
        Object.keys(persistentData.seaCreatures.total.catches).forEach((key) => {
            const entry = persistentData.seaCreatures.total.catches[key];
            const percent = persistentData.seaCreatures.total.totalCount ? ((entry.amount / persistentData.seaCreatures.total.totalCount) * 100).toFixed(1) : 0;
            entry.percent = percent;
            const doubleHookAmount = entry.doubleHookAmount || 0;
            const doubleHookPercent = entry.amount ? ((doubleHookAmount / (entry.amount - doubleHookAmount)) * 100).toFixed(1) : 0;
            entry.doubleHookPercent = doubleHookPercent;
        });
    
        persistentData.save();
        refreshOverlay();
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track sea creature catch.`);
	}
}

function refreshOverlay() {
    overlay.clear();

    if (!settings.seaCreaturesTrackerOverlay ||
        !Object.entries(persistentData.seaCreatures.total.catches).length ||
        !isInSkyblock() ||
        !isInFishingWorld(getWorldName()) ||
        (new Date() - getLastFishingHookSeenAt() > 10 * 60 * 1000) ||
        allOverlaysGui.isOpen()
    ) {
        return;
    }

    overlay.addTextLine(new OverlayTextLine().setText(`${AQUA}${BOLD}Sea creatures tracker`));

    const entries = Object.entries(persistentData.seaCreatures.total.catches)
        .map(([key, value]) => {
            return { seaCreature: key, amount: value.amount || 0, percent: value.percent, doubleHookAmount: value.doubleHookAmount || 0, doubleHookPercent: value.doubleHookPercent || 0 };
        })
        .sort((a, b) => b.amount - a.amount); // Most catches at the top

    entries.forEach((entry) => {
        const trigger = ALL_TRIGGERS.find(t => t.seaCreature.toUpperCase() === entry.seaCreature);
        if (!trigger) return;
        if (settings.showOnlyRareSeaCreatures && !trigger.isRare) return;

        const rarityColorCode = trigger.rarityColorCode || WHITE;
        const seaCreatureInfo = `${rarityColorCode}${fromUppercaseToCapitalizedFirstLetters(entry.seaCreature)}`;
        const percentInfo = settings.showOnlyRareSeaCreatures ? '' : ` ${GRAY}(${entry.percent}%)`;
        const doubleHookInfo = trigger.seaCreature.toUpperCase() === seaCreatures.VANQUISHER || trigger.seaCreature.toUpperCase() === seaCreatures.REINDRAKE
            ? ''
            : ` ${GRAY}| DH: ${WHITE}${formatNumberWithSpaces(entry.doubleHookAmount)} ${GRAY}(${entry.doubleHookPercent}${GRAY}%)`;
        overlay.addTextLine(new OverlayTextLine().setText(`${GRAY}- ${seaCreatureInfo}${GRAY}: ${WHITE}${formatNumberWithSpaces(entry.amount)}${percentInfo}${doubleHookInfo}`));
    });

    overlay.addTextLine(new OverlayTextLine().setText(`${GRAY}Total: ${WHITE}${persistentData.seaCreatures.total.totalCount}`));

    overlay.addButtonLine(new OverlayButtonLine().setText(`${RED}${BOLD}[Click to reset]`).setIsSmallerScale(true).setOnClick(LEFT_CLICK_TYPE, () => resetSeaCreaturesTracker(false)));
}