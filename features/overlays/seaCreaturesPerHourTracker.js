import settings, { allOverlaysGui } from "../../settings";
import * as triggers from "../../constants/triggers";
import { AQUA, BOLD, GOLD, GRAY, RED, WHITE, YELLOW } from "../../constants/formatting";
import { overlayCoordsData } from "../../data/overlayCoords";
import { formatElapsedTime, formatNumberWithSpaces, isDoubleHook, isInFishingWorld } from "../../utils/common";
import { getLastFishingHookSeenAt, getWorldName, isInSkyblock } from '../../utils/playerState';
import { registerIf } from "../../utils/registers";
import { createButtonsDisplay, toggleButtonsDisplay } from "../../utils/overlays";

let seaCreaturesPerHour = 0;
let totalSeaCreaturesCaughtCount = 0;
let lastSeaCreatureCaughtAt = null;
let isSessionActive = false;
let elapsedSeconds = 0;

triggers.ALL_CATCHES_TRIGGERS.forEach(entry => {
    registerIf(
        register("Chat", (event) => trackSeaCreatureCatch()).setCriteria(entry.trigger).setContains(),
        () => settings.seaCreaturesPerHourTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
    );  
});

registerIf(
    register('step', () => refreshElapsedTime()).setDelay(1),
    () => settings.seaCreaturesPerHourTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
);

registerIf(
    register('renderOverlay', () => renderTrackerOverlay()),
    () => settings.seaCreaturesPerHourTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
);

register("worldUnload", () => {
    isSessionActive = false;
});

const buttonsDisplay = createButtonsDisplay(true, () => resetSeaCreaturesPerHourTracker(false), true, () => pauseSeaCreaturesPerHourTracker());

export function resetSeaCreaturesPerHourTracker(isConfirmed) {
    try {
        if (!isConfirmed) {
            new Message(
                new TextComponent(`${GOLD}[FeeshNotifier] ${WHITE}Do you want to reset Sea creatures per hour tracker? ${RED}${BOLD}[Click to confirm]`)
                    .setClickAction('run_command')
                    .setClickValue('/feeshResetSeaCreaturesPerHour noconfirm')
            ).chat();
            return;
        }
    
        seaCreaturesPerHour = 0;
        totalSeaCreaturesCaughtCount = 0;
        lastSeaCreatureCaughtAt = null;
        isSessionActive = false;
        elapsedSeconds = 0;

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Sea creatures per hour tracker was reset.`);
    } catch (e) {
        console.error(e);
        console.log(`[FeeshNotifier] [SeaCreaturesPerHour] Failed to reset Sea creatures per hour tracker.`);
    }
}

export function pauseSeaCreaturesPerHourTracker() {
    try {
        if (!settings.seaCreaturesPerHourTrackerOverlay || !isInSkyblock() || !isSessionActive) {
            return;
        }
    
        isSessionActive = false;
        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Sea creatures per hour tracker is paused. Continue fishing to resume it.`);       
    } catch (e) {
        console.error(e);
		console.log(`[FeeshNotifier] Failed to pause Sea creatures per hour tracker.`);
    }
}

function refreshElapsedTime() {
    try {
        if (!isSessionActive || !settings.seaCreaturesPerHourTrackerOverlay || !isInSkyblock() || !isInFishingWorld(getWorldName())) {
            isSessionActive = false;
            return;
        }

        const maxSecondsElapsedSinceLastAction = 60 * 6;
        const elapsedSecondsSinceLastCatch = (new Date() - lastSeaCreatureCaughtAt) / 1000;

        if (lastSeaCreatureCaughtAt && elapsedSecondsSinceLastCatch < maxSecondsElapsedSinceLastAction) {
            isSessionActive = true;
            elapsedSeconds += 1;
            refreshTrackerData();
        } else {
            isSessionActive = false;
        }
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [SeaCreaturesPerHour] Failed to refresh elapsed time.`);
	}
}

function trackSeaCreatureCatch() {
    try {
        if (!settings.seaCreaturesPerHourTrackerOverlay || !isInSkyblock() || !isInFishingWorld(getWorldName())) {
            return;
        }

        const isDoubleHooked = isDoubleHook();

        isSessionActive = true;

        const diff = isDoubleHooked ? 2 : 1;
        totalSeaCreaturesCaughtCount += diff;
        lastSeaCreatureCaughtAt = new Date();

        refreshTrackerData();
    } catch (e) {
        console.error(e);
        console.log(`[FeeshNotifier] [SeaCreaturesPerHour] Failed to track sea creature catch.`);
    }
}

function refreshTrackerData() {
    try {
        if (!settings.seaCreaturesPerHourTrackerOverlay || !isInSkyblock()) {
            return;
        }

        const elapsedHours = elapsedSeconds / 3600;
        seaCreaturesPerHour = elapsedHours
            ? Math.floor(totalSeaCreaturesCaughtCount / elapsedHours)
            : 0;
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [SeaCreaturesPerHour] Failed to refresh tracker data.`);
	}
}

function renderTrackerOverlay() {
    if (!settings.seaCreaturesPerHourTrackerOverlay ||
        !isInSkyblock() ||
        !isInFishingWorld(getWorldName()) ||
        (!totalSeaCreaturesCaughtCount && !seaCreaturesPerHour) ||
        (new Date() - getLastFishingHookSeenAt() > 10 * 60 * 1000) ||
        allOverlaysGui.isOpen()
    ) {
        buttonsDisplay.hide();
        return;
    }

    const pausedText = isSessionActive ? '' : ` ${GRAY}[Paused]`;
    let text = `${YELLOW}${BOLD}Sea creatures per hour`;
    text += `\n${WHITE}${formatNumberWithSpaces(seaCreaturesPerHour)} ${GRAY}per hour (${WHITE}${formatNumberWithSpaces(totalSeaCreaturesCaughtCount)} ${GRAY}total)`;
    text += `\n`;
    text += `\n${AQUA}Elapsed time: ${WHITE}${formatElapsedTime(elapsedSeconds)}${pausedText}`;

    const overlay = new Text(text, overlayCoordsData.seaCreaturesPerHourTrackerOverlay.x, overlayCoordsData.seaCreaturesPerHourTrackerOverlay.y)
        .setShadow(true)
        .setScale(overlayCoordsData.seaCreaturesPerHourTrackerOverlay.scale);
    overlay.draw();

    toggleButtonsDisplay(buttonsDisplay, overlay, overlayCoordsData.seaCreaturesPerHourTrackerOverlay);
}