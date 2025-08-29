import settings, { allOverlaysGui } from "../../settings";
import * as triggers from '../../constants/triggers';
import * as seaCreatures from '../../constants/seaCreatures';
import { persistentData } from "../../data/data";
import { overlayCoordsData } from "../../data/overlayCoords";
import { formatNumberWithSpaces, fromUppercaseToCapitalizedFirstLetters, isDoubleHook, isInFishingWorld } from '../../utils/common';
import { WHITE, GOLD, BOLD, GRAY, RED, AQUA } from "../../constants/formatting";
import { getLastFishingHookSeenAt, getWorldName, isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";
import { LEFT_CLICK_TYPE, Overlay, OverlayButtonLine, OverlayTextLine } from "../../utils/overlays";

const ALL_TRIGGERS = triggers.ALL_CATCHES_TRIGGERS.concat(triggers.VANQUISHER_CATCH_TRIGGER);

const SORTING_DESC = 0;
const SORTING_ASC = 1;
const DISPLAY_MODE_ONLY_RARE = 0;
const DISPLAY_MODE_ALL = 1;

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

// Migration - cleanup of the outdated fields
register("gameLoad", () => {
    if (persistentData.rareCatches) {
        persistentData.seaCreatures = {
            session: {
                catches: {},
                totalCount: 0
            },
            total: {
                catches: persistentData.rareCatches,
                totalCount: persistentData.totalRareCatches
            }
        };
        delete persistentData.rareCatches;
        delete persistentData.totalRareCatches;
        persistentData.save();
    }
});

const overlay = new Overlay(() => settings.seaCreaturesTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName()))
    .setPositionData(overlayCoordsData.seaCreaturesTrackerOverlay)
    .setIsClickable(true);

export function resetSeaCreaturesTracker(isConfirmed) {
    try {
        if (!isConfirmed) {
            new TextComponent({
                text: `${GOLD}[FeeshNotifier] ${WHITE}Do you want to reset Sea creatures tracker? ${RED}${BOLD}[Click to confirm]`,
                clickEvent: { action: 'run_command', value: '/feeshResetSeaCreatures noconfirm' },
            }).chat();
            return;
        }
    
        persistentData.seaCreatures = {
            session: {
                catches: {},
                totalCount: 0
            },
            total: {
                catches: {},
                totalCount: 0
            }
        };
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
    
        const total = getTotalCount(persistentData.seaCreatures.total.catches);
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

    const entries = Object.entries(persistentData.seaCreatures.total.catches)
        .map(([key, value]) => {
            const seaCreatureInfo = ALL_TRIGGERS.find(t => key === t.seaCreature.toUpperCase());
            if (!seaCreatureInfo) return null;
            if (settings.seaCreaturesTrackerMode === DISPLAY_MODE_ONLY_RARE && !seaCreatureInfo.isRare) return null;

            return {
                seaCreature: key,
                rarityColorCode: seaCreatureInfo.rarityColorCode || WHITE,
                amount: value.amount || 0,
                percent: value.percent,
                doubleHookAmount: value.doubleHookAmount || 0,
                doubleHookPercent: value.doubleHookPercent || 0
            };
        })
        .filter(e => !!e)
        .sort((a, b) => settings.seaCreaturesTrackerSorting === SORTING_DESC ? b.amount - a.amount : a.amount - b.amount);

    if (!entries.length) return;

    overlay.addTextLine(new OverlayTextLine().setText(`${AQUA}${BOLD}Sea creatures tracker`));

    entries.forEach((entry) => {
        const seaCreatureText = `${entry.rarityColorCode}${fromUppercaseToCapitalizedFirstLetters(entry.seaCreature)}`;
        const countText = `${WHITE}${formatNumberWithSpaces(entry.amount)}`;
        const percentText = settings.seaCreaturesTrackerMode === DISPLAY_MODE_ONLY_RARE || !settings.showSeaCreaturesPercentage ? '' : ` ${GRAY}(${entry.percent}%)`;
        const doubleHookText = !settings.showSeaCreaturesDoubleHookStatistics || (entry.seaCreature === seaCreatures.VANQUISHER || entry.seaCreature === seaCreatures.REINDRAKE)
            ? ''
            : ` ${GRAY}| DH: ${WHITE}${formatNumberWithSpaces(entry.doubleHookAmount)} ${GRAY}(${entry.doubleHookPercent}${GRAY}%)`;
        overlay.addTextLine(new OverlayTextLine().setText(`${GRAY}- ${seaCreatureText}${GRAY}: ${countText}${percentText}${doubleHookText}`));
    });

    const totalCount = settings.seaCreaturesTrackerMode === DISPLAY_MODE_ALL ? persistentData.seaCreatures.total.totalCount : getTotalCount(entries);
    overlay.addTextLine(new OverlayTextLine().setText(`${GRAY}Total: ${WHITE}${totalCount}`));

    overlay.addButtonLine(new OverlayButtonLine().setText(`${RED}${BOLD}[Click to reset]`).setIsSmallerScale(true).setOnClick(LEFT_CLICK_TYPE, () => resetSeaCreaturesTracker(false)));
}

function getTotalCount(seaCreaturesObj) {
    return Object.values(seaCreaturesObj).reduce((accumulator, currentValue) => {
        return accumulator + currentValue.amount
    }, 0);
}