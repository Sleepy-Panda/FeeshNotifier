import settings, { allOverlaysGui } from "../../settings";
import * as triggers from '../../constants/triggers';
import * as seaCreatures from '../../constants/seaCreatures';
import { persistentData } from "../../data/data";
import { overlayCoordsData } from "../../data/overlayCoords";
import { BOLD, GOLD, RED, WHITE, DARK_PURPLE, GRAY, AQUA, LIGHT_PURPLE } from "../../constants/formatting";
import { getLastFishingHookSeenAt, getWorldName, isInSkyblock } from "../../utils/playerState";
import { formatNumberWithSpaces, getCatchesCounterChatMessage } from "../../utils/common";
import { JERRY_WORKSHOP } from "../../constants/areas";
import { createButtonsDisplay, getSeaCreatureStatisticsOverlayText, setSeaCreatureStatisticsOnCatch, toggleButtonsDisplay } from "../../utils/overlays";
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

const TRACKED_DROPS = [
    {
        dropInfo: triggers.RARE_DROP_TRIGGERS.find(entry => entry.trigger === triggers.BABY_YETI_PET_EPIC_MESSAGE),
        callback: () => trackEpicBabyYetiPetDrop(),
    },
    {
        dropInfo: triggers.RARE_DROP_TRIGGERS.find(entry => entry.trigger === triggers.BABY_YETI_PET_LEG_MESSAGE),
        callback: () => trackLegendaryBabyYetiPetDrop(),
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

TRACKED_DROPS.forEach(entry => {
    registerIf(
        register("Chat", (magicFind, event) => entry.callback()).setCriteria(entry.dropInfo.trigger).setContains(),
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
    register('renderOverlay', () => renderJerryWorkshopOverlay()),
    () => settings.jerryWorkshopTrackerOverlay && isInSkyblock() && getWorldName() === JERRY_WORKSHOP
);

register("worldUnload", () => {
    remainingWorkshopTime = null;
    sawWorkshopClosingMessage = false;
    buttonsDisplay.hide();
});

register("gameUnload", () => {
    if (settings.jerryWorkshopTrackerOverlay && settings.resetJerryWorkshopTrackerOnGameClosed && hasAnyData()) {
        resetJerryWorkshopTracker(true);
    }
});

const buttonsDisplay = createButtonsDisplay(true, () => resetJerryWorkshopTracker(false), false, null);

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
        reindrake: getDefaultSeaCreatureSectionObject(),
        babyYetiPets: { epic: { count: 0 }, legendary: { count: 0 } }
    };
}

function hasAnyData() {
    return persistentData.jerryWorkshop && (
        persistentData.jerryWorkshop.yeti.lastCatchTime ||
        persistentData.jerryWorkshop.yeti.catchesSinceLast ||
        persistentData.jerryWorkshop.reindrake.lastCatchTime ||
        persistentData.jerryWorkshop.reindrake.catchesSinceLast ||
        persistentData.jerryWorkshop.babyYetiPets.epic.count ||
        persistentData.jerryWorkshop.babyYetiPets.legendary.count
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
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track regular Jerry Workshop sea creature catch.`);
	}
}

function trackEpicBabyYetiPetDrop() {
    try {
        if (!settings.jerryWorkshopTrackerOverlay || !isInSkyblock() || getWorldName() !== JERRY_WORKSHOP) {
            return;
        }

        persistentData.jerryWorkshop.babyYetiPets.epic.count += 1;
        persistentData.save();
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Baby Yeti Pet drop.`);
	}
}

function trackLegendaryBabyYetiPetDrop() {
    try {
        if (!settings.jerryWorkshopTrackerOverlay || !isInSkyblock() || getWorldName() !== JERRY_WORKSHOP) {
            return;
        }

        persistentData.jerryWorkshop.babyYetiPets.legendary.count += 1;
        persistentData.save();
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Baby Yeti Pet drop.`);
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

function renderJerryWorkshopOverlay() {
    if (!settings.jerryWorkshopTrackerOverlay ||
        !hasAnyData() ||
        !isInSkyblock() ||
        getWorldName() !== JERRY_WORKSHOP ||
        (new Date() - getLastFishingHookSeenAt() > 10 * 60 * 1000) ||
        allOverlaysGui.isOpen()
    ) {
        buttonsDisplay.hide();
        return;
    }

    let overlayText = `${AQUA}${BOLD}Jerry Workshop tracker`;
    overlayText += getYetiOverlayText();
    overlayText += `\n${GRAY}Baby Yeti pets: ${GOLD}${formatNumberWithSpaces(persistentData.jerryWorkshop.babyYetiPets.legendary.count)} ${DARK_PURPLE}${formatNumberWithSpaces(persistentData.jerryWorkshop.babyYetiPets.epic.count)}`;
    overlayText += getReindrakeOverlayText();

    if (remainingWorkshopTime) {
        overlayText += `\n\n${GRAY}Closes in: ${remainingWorkshopTime}`;
    }

    const overlay = new Text(overlayText, overlayCoordsData.jerryWorkshopTrackerOverlay.x, overlayCoordsData.jerryWorkshopTrackerOverlay.y)
        .setShadow(true)
        .setScale(overlayCoordsData.jerryWorkshopTrackerOverlay.scale);
    overlay.draw();

    toggleButtonsDisplay(buttonsDisplay, overlay, overlayCoordsData.jerryWorkshopTrackerOverlay);

    function getYetiOverlayText() {
        const overlayText = getSeaCreatureStatisticsOverlayText(`${GOLD}Yeti`, persistentData.jerryWorkshop.yeti);
        return '\n' + overlayText;
    }

    function getReindrakeOverlayText() {
        const overlayText = getSeaCreatureStatisticsOverlayText(`${LIGHT_PURPLE}Reindrake`, persistentData.jerryWorkshop.reindrake);
        return '\n' + overlayText;
    }
}
