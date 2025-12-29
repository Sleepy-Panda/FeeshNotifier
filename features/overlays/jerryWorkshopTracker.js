import settings, { allOverlaysGui } from "../../settings";
import * as triggers from '../../constants/triggers';
import * as seaCreatures from '../../constants/seaCreatures';
import { persistentData } from "../../data/data";
import { overlayCoordsData } from "../../data/overlayCoords";
import { BOLD, GOLD, RED, WHITE, GRAY, AQUA, LIGHT_PURPLE } from "../../constants/formatting";
import { getLastFishingHookSeenAt, getWorldName, isInSkyblock } from "../../utils/playerState";
import { getCatchesCounterChatMessage } from "../../utils/common";
import { JERRY_WORKSHOP } from "../../constants/areas";
import { getSeaCreatureStatisticsOverlayText, LEFT_CLICK_TYPE, Overlay, OverlayButtonLine, OverlayTextLine, setSeaCreatureStatisticsOnCatch } from "../../utils/overlays";
import { registerIf } from "../../utils/registers";

let remainingWorkshopTime = null;
let sawWorkshopClosingMessage = false;

const TRACKED_SEA_CREATURES = [
    {
        seaCreatureInfo: triggers.RARE_CATCH_TRIGGERS.find(entry => entry.seaCreature === seaCreatures.YETI),
        callback: (seaCreatureInfo) => trackYetiCatch(seaCreatureInfo),
    },
    {
        seaCreatureInfo: triggers.RARE_CATCH_TRIGGERS.find(entry => entry.seaCreature === seaCreatures.REINDRAKE),
        callback: (seaCreatureInfo) => trackReindrakeCatch(seaCreatureInfo),
    },
];

triggers.REGULAR_JERRY_WORKSHOP_CATCH_TRIGGERS.forEach(entry => {
    registerIf(
        register("Chat", (event) => trackRegularJerryWorkshopSeaCreatureCatch()).setCriteria(entry.trigger).setContains(),
        () => settings.jerryWorkshopTrackerOverlay && isInSkyblock() && getWorldName() === JERRY_WORKSHOP
    );
});

TRACKED_SEA_CREATURES.forEach(entry => {
    registerIf(
        register("Chat", (event) => entry.callback(entry.seaCreatureInfo)).setCriteria(entry.seaCreatureInfo.trigger).setContains(),
        () => settings.jerryWorkshopTrackerOverlay && isInSkyblock() && getWorldName() === JERRY_WORKSHOP
    );
});

registerIf(
    register("Chat", (event) => { sawWorkshopClosingMessage = true; }).setCriteria(triggers.WORKSHOP_CLOSING_MESSAGE).setContains(),
    () => settings.jerryWorkshopTrackerOverlay && isInSkyblock() && getWorldName() === JERRY_WORKSHOP
);

registerIf(
    register('step', () => trackRemainingWorkshopTime()).setFps(1),
    () => settings.jerryWorkshopTrackerOverlay && isInSkyblock() && getWorldName() === JERRY_WORKSHOP
);

registerIf(
    register('step', () => refreshOverlay()).setFps(2),
    () => settings.jerryWorkshopTrackerOverlay && isInSkyblock() && getWorldName() === JERRY_WORKSHOP
);

register("worldUnload", () => {
    remainingWorkshopTime = null;
    sawWorkshopClosingMessage = false;
});

register("gameUnload", () => {
    if (!World.isLoaded() && settings.jerryWorkshopTrackerOverlay && settings.resetJerryWorkshopTrackerOnGameClosed && hasAnyData()) {
        resetJerryWorkshopTracker(true);
    }
});

const overlay = new Overlay(() => settings.jerryWorkshopTrackerOverlay && isInSkyblock() && getWorldName() === JERRY_WORKSHOP)
    .setPositionData(overlayCoordsData.jerryWorkshopTrackerOverlay)
    .setIsClickable(true);

export function resetJerryWorkshopTracker(isConfirmed) {
    try {
        if (!isConfirmed) {
            new Message(
                new TextComponent(`${GOLD}[FeeshNotifier] ${WHITE}Do you want to reset Jerry workshop tracker? ${RED}${BOLD}[Click to confirm]`)
                    .setClickAction('run_command')
                    .setClickValue('/feeshResetJerryWorkshop noconfirm')
            ).chat();
            return;
        }
    
        persistentData.jerryWorkshop = getDefaultObject();
        persistentData.save();
        refreshOverlay();
        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Jerry workshop tracker was reset.`);    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to reset Jerry workshop tracker.`);
	}
}

function getDefaultSeaCreatureSectionObject() {
    return { catchesSinceLast: 0, lastCatchTime: null, catchesHistory: [], averageCatches: 0 };
}

function getDefaultObject() {
    return {
        yeti: getDefaultSeaCreatureSectionObject(),
        reindrake: getDefaultSeaCreatureSectionObject()
    };
}

function hasAnyData() {
    return persistentData.jerryWorkshop && (
        persistentData.jerryWorkshop.yeti.lastCatchTime ||
        persistentData.jerryWorkshop.yeti.catchesSinceLast ||
        persistentData.jerryWorkshop.reindrake.lastCatchTime ||
        persistentData.jerryWorkshop.reindrake.catchesSinceLast
    );
}

function trackYetiCatch(seaCreatureInfo) {
    try {
        if (!settings.jerryWorkshopTrackerOverlay || !isInSkyblock() || getWorldName() !== JERRY_WORKSHOP) {
            return;
        }

        const result = setSeaCreatureStatisticsOnCatch(persistentData.jerryWorkshop.yeti);
        persistentData.jerryWorkshop.reindrake.catchesSinceLast += 1;

        persistentData.save();
        refreshOverlay();

        const message = getCatchesCounterChatMessage(seaCreatureInfo.seaCreature, seaCreatureInfo.rarityColorCode, result.catchesSinceLast, result.lastCatchTime);
        ChatLib.chat(message);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Yeti catch.`);
	}
}

function trackReindrakeCatch(seaCreatureInfo) {
    try {
        if (!settings.jerryWorkshopTrackerOverlay || !isInSkyblock() || getWorldName() !== JERRY_WORKSHOP) {
            return;
        }

        const result = setSeaCreatureStatisticsOnCatch(persistentData.jerryWorkshop.reindrake);
        persistentData.jerryWorkshop.yeti.catchesSinceLast += 1;

        persistentData.save();
        refreshOverlay();

        const message = getCatchesCounterChatMessage(seaCreatureInfo.seaCreature, seaCreatureInfo.rarityColorCode, result.catchesSinceLast, result.lastCatchTime);
        ChatLib.chat(message);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Reindrake catch.`);
	}
}

function trackRegularJerryWorkshopSeaCreatureCatch() {
    try {
        if (!settings.jerryWorkshopTrackerOverlay || !isInSkyblock() || getWorldName() !== JERRY_WORKSHOP) {
            return;
        }

        persistentData.jerryWorkshop.yeti.catchesSinceLast += 1;
        persistentData.jerryWorkshop.reindrake.catchesSinceLast += 1;
        persistentData.save();
        refreshOverlay();
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track regular Jerry Workshop sea creature catch.`);
	}
}

function trackRemainingWorkshopTime() {
    if (!settings.jerryWorkshopTrackerOverlay || !isInSkyblock() || getWorldName() !== JERRY_WORKSHOP) {
        return;
    }
    
    if (new Date().getMonth() === 11) { // Workshop is open permanently in December
        remainingWorkshopTime = null;
        return;
    }

    if (sawWorkshopClosingMessage) {
        remainingWorkshopTime = `${RED}${BOLD}Soon`;
        return;
    }

    const tabListLine = TabList?.getNames()?.find(tab => tab.includes("Island closes in: "));
    if (tabListLine) {
        remainingWorkshopTime = tabListLine.split(': ')[1];
    } else {
        remainingWorkshopTime = null;
    }
}

function refreshOverlay() {
    overlay.clear();

    if (!settings.jerryWorkshopTrackerOverlay ||
        !hasAnyData() ||
        !isInSkyblock() ||
        getWorldName() !== JERRY_WORKSHOP ||
        (new Date() - getLastFishingHookSeenAt() > 10 * 60 * 1000) ||
        allOverlaysGui.isOpen()
    ) {
        return;
    }

    let overlayText = `${AQUA}${BOLD}Jerry Workshop tracker`;
    overlayText += getYetiOverlayText();
    overlayText += getReindrakeOverlayText();

    if (remainingWorkshopTime) {
        overlayText += `\n\n${GRAY}Closes in: ${remainingWorkshopTime}`;
    }

    overlay.addTextLine(new OverlayTextLine().setText(overlayText));
    overlay.addButtonLine(new OverlayButtonLine()
        .setText(`${RED}${BOLD}[Click to reset]`)
        .setIsSmallerScale(true)
        .setOnClick(LEFT_CLICK_TYPE, () => resetJerryWorkshopTracker(false)));

    function getYetiOverlayText() {
        const overlayText = getSeaCreatureStatisticsOverlayText(`${GOLD}Yeti`, persistentData.jerryWorkshop.yeti);
        return '\n' + overlayText;
    }

    function getReindrakeOverlayText() {
        const overlayText = getSeaCreatureStatisticsOverlayText(`${LIGHT_PURPLE}Reindrake`, persistentData.jerryWorkshop.reindrake);
        return '\n' + overlayText;
    }
}
