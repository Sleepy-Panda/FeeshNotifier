import settings, { allOverlaysGui } from "../../settings";
import * as triggers from '../../constants/triggers';
import * as seaCreatures from '../../constants/seaCreatures';
import { persistentData } from "../../data/data";
import { overlayCoordsData } from "../../data/overlayCoords";
import { formatNumberWithSpaces, fromUppercaseToCapitalizedFirstLetters, isDoubleHook, isInFishingWorld } from '../../utils/common';
import { WHITE, GOLD, BOLD, GRAY, RED, AQUA, DARK_GRAY } from "../../constants/formatting";
import { getLastFishingHookSeenAt, getWorldName, isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";
import { LEFT_CLICK_TYPE, Overlay, OverlayButtonLine, OverlayTextLine } from "../../utils/overlays";
import { SESSION_VIEW_MODE, TOTAL_VIEW_MODE } from "../../constants/viewModes";


const ALL_TRIGGERS = triggers.ALL_CATCHES_TRIGGERS.concat(triggers.VANQUISHER_CATCH_TRIGGER);

const SORTING_DESC = 0;
const SORTING_ASC = 1;
const DISPLAY_MODE_ONLY_RARE = 0;
const DISPLAY_MODE_ALL = 1;

ALL_TRIGGERS.forEach(entry => {
    registerIf(
        register("Chat", (event) => {
            const isDoubleHooked = isDoubleHook();
            const options = { seaCreature: entry.seaCreature, rarityColorCode: entry.rarityColorCode, isDoubleHook: isDoubleHooked };
            trackSeaCreatureCatch(persistentData.seaCreatures.session, options);
            trackSeaCreatureCatch(persistentData.seaCreatures.total, options);        
        }).setCriteria(entry.trigger).setContains(),
        () => settings.seaCreaturesTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
    );
});

registerIf(
    register('step', () => refreshOverlay()).setFps(2),
    () => settings.seaCreaturesTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
);

register("gameUnload", () => {
    if (settings.seaCreaturesTrackerOverlay && settings.resetSeaCreaturesTrackerOnGameClosed && persistentData.seaCreatures.session.totalCount > 0) {
        resetSeaCreaturesTracker(true, SESSION_VIEW_MODE);
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
    .setIsClickable(true)
    .setViewModes([ SESSION_VIEW_MODE, TOTAL_VIEW_MODE ]);

export function resetSeaCreaturesTracker(isConfirmed, resetViewMode) {
    try {
        if (!resetViewMode) resetViewMode = getCurrentViewMode();
        const viewModeText = overlay.getViewModeDisplayText(resetViewMode);

        if (!isConfirmed) {
            new Message(
                new TextComponent(`${GOLD}[FeeshNotifier] ${WHITE}Do you want to reset Sea creatures tracker ${viewModeText}${WHITE}? ${RED}${BOLD}[Click to confirm]`)
                    .setClickAction('run_command')
                    .setClickValue(getResetAction(resetViewMode))
            ).chat();
            return;
        }
    
        switch (true) {
            case resetViewMode === SESSION_VIEW_MODE:
                resetSession();
                break;
            case resetViewMode === TOTAL_VIEW_MODE:
                resetTotal();
                break;
            default:
                break;
        }

        refreshOverlay();
        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Sea creatures tracker ${viewModeText} ${WHITE}was reset.`);    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to reset Sea creatures tracker.`);
	}

    function getResetAction(viewMode) {
        switch (true) {
            case viewMode === SESSION_VIEW_MODE:
                return '/feeshResetSeaCreatures noconfirm';
            case viewMode === TOTAL_VIEW_MODE:
                return '/feeshResetSeaCreaturesTotal noconfirm';
            default:
                return '';
        }
    }

    function resetSession() {
        persistentData.seaCreatures.session = {
            catches: {},
            totalCount: 0
        };
        persistentData.save();
    }

    function resetTotal() {
        persistentData.seaCreatures.total = {
            catches: {},
            totalCount: 0
        };
        persistentData.save();
    }
}

function trackSeaCreatureCatch(sourceObj, options) {
    try {
        if (!sourceObj || !options || !settings.seaCreaturesTrackerOverlay || !isInSkyblock() || !isInFishingWorld(getWorldName())) {
            return;
        }
    
        if (options.seaCreature.toUpperCase() === seaCreatures.VANQUISHER && (new Date() - getLastFishingHookSeenAt() > 6 * 60 * 1000)) {
            return;
        }

        const key = options.seaCreature.toUpperCase();
        const valueToAdd = options.isDoubleHook ? 2 : 1;
        const currentAmount = sourceObj.catches[key] ? sourceObj.catches[key].amount : 0;
        const currentDoubleHookAmount = sourceObj.catches[key] ? sourceObj.catches[key].doubleHookAmount || 0 : 0;

        sourceObj.catches[key] = {
            amount: currentAmount ? currentAmount + valueToAdd : valueToAdd,
            percent: null,
            doubleHookAmount: options.isDoubleHook ? currentDoubleHookAmount + 1 : currentDoubleHookAmount,
            doubleHookPercent: null
        };
    
        const total = getTotalCount(sourceObj.catches);
        sourceObj.totalCount = total;
    
        Object.keys(sourceObj.catches).forEach((key) => {
            const entry = sourceObj.catches[key];
            const percent = sourceObj.totalCount ? ((entry.amount / sourceObj.totalCount) * 100).toFixed(1) : 0;
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
    const viewMode = getCurrentViewMode();

    if (!settings.seaCreaturesTrackerOverlay ||
        (viewMode === SESSION_VIEW_MODE && !Object.entries(persistentData.seaCreatures.session.catches).length) ||
        (viewMode === TOTAL_VIEW_MODE && !Object.entries(persistentData.seaCreatures.total.catches).length) ||
        !isInSkyblock() ||
        !isInFishingWorld(getWorldName()) ||
        (new Date() - getLastFishingHookSeenAt() > 10 * 60 * 1000) ||
        allOverlaysGui.isOpen()
    ) {
        return;
    }

    const sourceObj = getSourceObject(viewMode);

    const entries = Object.entries(sourceObj.catches)
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

    const viewModeText = overlay.getViewModeDisplayText(viewMode);
    overlay.addTextLine(new OverlayTextLine().setText(`${AQUA}${BOLD}Sea creatures tracker ${viewModeText}`));

    entries.forEach((entry) => {
        const seaCreatureText = `${entry.rarityColorCode}${fromUppercaseToCapitalizedFirstLetters(entry.seaCreature)}`;
        const countText = `${WHITE}${formatNumberWithSpaces(entry.amount)}`;
        const percentText = settings.seaCreaturesTrackerMode === DISPLAY_MODE_ONLY_RARE || !settings.showSeaCreaturesPercentage ? '' : ` ${GRAY}${entry.percent}%`;
        const doubleHookText = !settings.showSeaCreaturesDoubleHookStatistics || (entry.seaCreature === seaCreatures.VANQUISHER || entry.seaCreature === seaCreatures.REINDRAKE)
            ? ''
            : ` ${DARK_GRAY}| ${GRAY}DH: ${WHITE}${formatNumberWithSpaces(entry.doubleHookAmount)} ${GRAY}${entry.doubleHookPercent}${GRAY}%`;
        overlay.addTextLine(new OverlayTextLine().setText(`${GRAY}- ${seaCreatureText}${GRAY}: ${countText}${percentText}${doubleHookText}`));
    });

    const totalCount = settings.seaCreaturesTrackerMode === DISPLAY_MODE_ALL ? sourceObj.totalCount : getTotalCount(entries);
    overlay.addTextLine(new OverlayTextLine().setText(`${GRAY}Total: ${WHITE}${totalCount}`));

    overlay.addButtonLine(new OverlayButtonLine()
        .setText(`${overlay.getNextViewModeButtonDisplayText(viewMode)}`)
        .setIsSmallerScale(true)
        .setOnClick(LEFT_CLICK_TYPE, () => toggleViewMode()));
    overlay.addButtonLine(new OverlayButtonLine()
        .setText(`${RED}${BOLD}[Click to reset]`)
        .setIsSmallerScale(true)
        .setOnClick(LEFT_CLICK_TYPE, () => resetSeaCreaturesTracker(false, viewMode)));
}

function getTotalCount(seaCreaturesObj) {
    return Object.values(seaCreaturesObj).reduce((accumulator, currentValue) => {
        return accumulator + currentValue.amount
    }, 0);
}

function toggleViewMode() {
    try {
        const currentViewMode = getCurrentViewMode();
        const newViewMode = overlay.getNextViewMode(currentViewMode);
        persistentData.seaCreatures.viewMode = newViewMode;
        persistentData.save();
        refreshOverlay();
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to toggle view mode.`);
	}
}

function getCurrentViewMode() {
    return persistentData.seaCreatures.viewMode || SESSION_VIEW_MODE;
}

function getSourceObject(viewMode) {
    switch (true) {
        case viewMode === SESSION_VIEW_MODE:
            return persistentData.seaCreatures.session;
        case viewMode === TOTAL_VIEW_MODE:
            return persistentData.seaCreatures.total;
        default:
            console.error(`[FeeshNotifier] Failed to get source object for '${viewMode}' view mode.`);
            return null;
    }
}