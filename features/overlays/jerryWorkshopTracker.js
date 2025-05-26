import settings, { allOverlaysGui } from "../../settings";
import * as triggers from '../../constants/triggers';
import * as seaCreatures from '../../constants/seaCreatures';
import { persistentData } from "../../data/data";
import { overlayCoordsData } from "../../data/overlayCoords";
import { BOLD, GOLD, RED, WHITE, DARK_PURPLE, GRAY, AQUA, DARK_GRAY, LIGHT_PURPLE } from "../../constants/formatting";
import { getLastFishingHookSeenAt, getWorldName, isInSkyblock } from "../../utils/playerState";
import { formatDate, formatNumberWithSpaces, formatTimeElapsedBetweenDates, getCatchesCounterChatMessage } from "../../utils/common";
import { JERRY_WORKSHOP } from "../../constants/areas";
import { createButtonsDisplay, toggleButtonsDisplay } from "../../utils/overlays";
import { registerIf } from "../../utils/registers";

let remainingWorkshopTime = null;
let sawWorkshopClosingMessage = false;

triggers.REGULAR_JERRY_WORKSHOP_CATCH_TRIGGERS.forEach(entry => {
    registerIf(
        register("Chat", (event) => trackRegularJerryWorkshopSeaCreatureCatch()).setCriteria(entry.trigger).setContains(),
        () => settings.jerryWorkshopTrackerOverlay && isInSkyblock() && getWorldName() === JERRY_WORKSHOP
    );
});

const yetiTrigger = triggers.RARE_CATCH_TRIGGERS.find(entry => entry.seaCreature === seaCreatures.YETI);
registerIf(
    register("Chat", (event) => trackYetiCatch(yetiTrigger)).setCriteria(yetiTrigger.trigger).setContains(),
    () => settings.jerryWorkshopTrackerOverlay && isInSkyblock() && getWorldName() === JERRY_WORKSHOP
);

const reindrakeTrigger = triggers.RARE_CATCH_TRIGGERS.find(entry => entry.seaCreature === seaCreatures.REINDRAKE);
registerIf(
    register("Chat", (event) => trackReindrakeCatch(reindrakeTrigger)).setCriteria(reindrakeTrigger.trigger).setContains(),
    () => settings.jerryWorkshopTrackerOverlay && isInSkyblock() && getWorldName() === JERRY_WORKSHOP
);

const babyYetiPetEpicTrigger = triggers.RARE_DROP_TRIGGERS.find(entry => entry.trigger === triggers.BABY_YETI_PET_EPIC_MESSAGE);
registerIf(
    register("Chat", (magicFind, event) => trackEpicBabyYetiPetDrop()).setCriteria(babyYetiPetEpicTrigger.trigger).setContains(),
    () => settings.jerryWorkshopTrackerOverlay && isInSkyblock() && getWorldName() === JERRY_WORKSHOP
);

const babyYetiPetLegendaryTrigger = triggers.RARE_DROP_TRIGGERS.find(entry => entry.trigger === triggers.BABY_YETI_PET_LEG_MESSAGE);
registerIf(
    register("Chat", (magicFind, event) => trackLegendaryBabyYetiPetDrop()).setCriteria(babyYetiPetLegendaryTrigger.trigger).setContains(),
    () => settings.jerryWorkshopTrackerOverlay && isInSkyblock() && getWorldName() === JERRY_WORKSHOP
);

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
    if (settings.jerryWorkshopTrackerOverlay && settings.resetJerryWorkshopTrackerOnGameClosed && persistentData.jerryWorkshop && (
        persistentData.jerryWorkshop.yeti.lastCatchTime ||
        persistentData.jerryWorkshop.reindrake.lastCatchTime ||
        persistentData.jerryWorkshop.yeti.catchesSinceLast ||
        persistentData.jerryWorkshop.reindrake.catchesSinceLast ||
        persistentData.jerryWorkshop.babyYetiPets.epic.count ||
        persistentData.jerryWorkshop.babyYetiPets.legendary.count
    )) {
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
    
        persistentData.jerryWorkshop = {
            yeti: { catchesSinceLast: 0, lastCatchTime: null, catchesHistory: [], averageCatches: 0 },
            reindrake: { catchesSinceLast: 0, lastCatchTime: null, catchesHistory: [], averageCatches: 0 },
            babyYetiPets: { epic: { count: 0 }, legendary: { count: 0 } }
        };
        persistentData.save();

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Jerry workshop tracker was reset.`);    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to reset Jerry workshop tracker.`);
	}
}

function trackYetiCatch(seaCreatureInfo) {
    try {
        if (!settings.jerryWorkshopTrackerOverlay || !isInSkyblock() || getWorldName() !== JERRY_WORKSHOP) {
            return;
        }

        const catchesSinceLast = persistentData.jerryWorkshop.yeti.catchesSinceLast + 1;
        const lastCatchTime = persistentData.jerryWorkshop.yeti.lastCatchTime;

        let catchesHistory = persistentData.jerryWorkshop.yeti.catchesHistory || [];
        catchesHistory.unshift(catchesSinceLast); // Most recent counts at the start of array
        catchesHistory.length = Math.min(catchesHistory.length, 100); // Store last 100
        persistentData.jerryWorkshop.yeti.catchesHistory = catchesHistory;

        const sumCatches = catchesHistory.reduce(function(a, b) { return a + b; }, 0);
        persistentData.jerryWorkshop.yeti.averageCatches = catchesHistory.length ? Math.round(sumCatches / catchesHistory.length) : 0;

        persistentData.jerryWorkshop.yeti.catchesSinceLast = 0;
        persistentData.jerryWorkshop.yeti.lastCatchTime = new Date();

        persistentData.jerryWorkshop.reindrake.catchesSinceLast += 1;

        persistentData.save();

        const message = getCatchesCounterChatMessage(seaCreatureInfo.seaCreature, seaCreatureInfo.rarityColorCode, catchesSinceLast, lastCatchTime);
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

        const catchesSinceLast = persistentData.jerryWorkshop.reindrake.catchesSinceLast + 1;
        const lastCatchTime = persistentData.jerryWorkshop.reindrake.lastCatchTime;

        let catchesHistory = persistentData.jerryWorkshop.reindrake.catchesHistory || [];
        catchesHistory.unshift(catchesSinceLast); // Most recent counts at the start of array
        catchesHistory.length = Math.min(catchesHistory.length, 100); // Store last 100
        persistentData.jerryWorkshop.reindrake.catchesHistory = catchesHistory;

        const sumCatches = catchesHistory.reduce(function(a, b) { return a + b; }, 0);
        persistentData.jerryWorkshop.reindrake.averageCatches = catchesHistory.length ? Math.round(sumCatches / catchesHistory.length) : 0;

        persistentData.jerryWorkshop.reindrake.catchesSinceLast = 0;
        persistentData.jerryWorkshop.reindrake.lastCatchTime = new Date();

        persistentData.jerryWorkshop.yeti.catchesSinceLast += 1;

        persistentData.save();

        const message = getCatchesCounterChatMessage(seaCreatureInfo.seaCreature, seaCreatureInfo.rarityColorCode, catchesSinceLast, lastCatchTime);
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
        !persistentData.jerryWorkshop ||
        (
            !persistentData.jerryWorkshop.yeti.lastCatchTime &&
            !persistentData.jerryWorkshop.reindrake.lastCatchTime &&
            !persistentData.jerryWorkshop.yeti.catchesSinceLast &&
            !persistentData.jerryWorkshop.reindrake.catchesSinceLast &&
            !persistentData.jerryWorkshop.babyYetiPets.epic.count &&
            !persistentData.jerryWorkshop.babyYetiPets.legendary.count
        ) ||
        !isInSkyblock() ||
        getWorldName() !== JERRY_WORKSHOP ||
        (new Date() - getLastFishingHookSeenAt() > 10 * 60 * 1000) ||
        allOverlaysGui.isOpen()
    ) {
        buttonsDisplay.hide();
        return;
    }

    const lastCatchTimeYeti = persistentData.jerryWorkshop.yeti.lastCatchTime
        ? `${WHITE}${formatTimeElapsedBetweenDates(new Date(persistentData.jerryWorkshop.yeti.lastCatchTime))} ${GRAY}(${WHITE}${formatDate(new Date(persistentData.jerryWorkshop.yeti.lastCatchTime))}${GRAY})` 
        : `${WHITE}N/A`;
    const lastCatchTimeReindrake = persistentData.jerryWorkshop.reindrake.lastCatchTime 
        ? `${WHITE}${formatTimeElapsedBetweenDates(new Date(persistentData.jerryWorkshop.reindrake.lastCatchTime))} ${GRAY}(${WHITE}${formatDate(new Date(persistentData.jerryWorkshop.reindrake.lastCatchTime))}${GRAY})` 
        : `${WHITE}N/A`;
    const averageYeti = formatNumberWithSpaces(persistentData.jerryWorkshop.yeti.averageCatches) || 'N/A';
    const averageReindrake = formatNumberWithSpaces(persistentData.jerryWorkshop.reindrake.averageCatches) || 'N/A';

    let overlayText = `${AQUA}${BOLD}Jerry Workshop tracker`;
    overlayText += `\n${GOLD}Yeti: ${WHITE}${formatNumberWithSpaces(persistentData.jerryWorkshop.yeti.catchesSinceLast)} ${GRAY}${persistentData.jerryWorkshop.yeti.catchesSinceLast !== 1 ? 'catches' : 'catch'} ago ${DARK_GRAY}(${GRAY}avg: ${WHITE}${averageYeti}${DARK_GRAY})`;
    overlayText += `\n${GRAY}Last on: ${lastCatchTimeYeti}`;
    overlayText += `\n${GRAY}Baby Yeti pets: ${GOLD}${formatNumberWithSpaces(persistentData.jerryWorkshop.babyYetiPets.legendary.count)} ${DARK_PURPLE}${formatNumberWithSpaces(persistentData.jerryWorkshop.babyYetiPets.epic.count)}`;
    overlayText += `\n${LIGHT_PURPLE}Reindrake: ${WHITE}${formatNumberWithSpaces(persistentData.jerryWorkshop.reindrake.catchesSinceLast)} ${GRAY}${persistentData.jerryWorkshop.reindrake.catchesSinceLast !== 1 ? 'catches' : 'catch'} ago ${DARK_GRAY}(${GRAY}avg: ${WHITE}${averageReindrake}${DARK_GRAY})`;
    overlayText += `\n${GRAY}Last on: ${lastCatchTimeReindrake}`;

    if (remainingWorkshopTime) {
        overlayText += `\n\n${GRAY}Closes in: ${remainingWorkshopTime}`;
    }

    const overlay = new Text(overlayText, overlayCoordsData.jerryWorkshopTrackerOverlay.x, overlayCoordsData.jerryWorkshopTrackerOverlay.y)
        .setShadow(true)
        .setScale(overlayCoordsData.jerryWorkshopTrackerOverlay.scale);
    overlay.draw();

    toggleButtonsDisplay(buttonsDisplay, overlay, overlayCoordsData.jerryWorkshopTrackerOverlay);
}
