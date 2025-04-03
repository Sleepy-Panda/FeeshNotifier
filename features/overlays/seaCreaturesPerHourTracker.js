import settings, { allOverlaysGui } from "../../settings";
import * as triggers from "../../constants/triggers";
import { AQUA, BOLD, GOLD, RED, WHITE, YELLOW } from "../../constants/formatting";
import { overlayCoordsData } from "../../data/overlayCoords";
import { formatElapsedTime, formatNumberWithSpaces, isDoubleHook, isInChatOrInventoryGui } from "../../utils/common";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from '../../utils/playerState';
import { registerIf } from "../../utils/registers";
import { NO_FISHING_WORLDS } from "../../constants/areas";

// Recalculate evry second or more rare?
// Reset
// Pause button
// Sample

let seaCreaturesPerHour = 0;
let totalSeaCreaturesCaughtCount = 0;
let lastSeaCreatureCaughtAt = null;
let isSessionActive = false;
let elapsedSeconds = 0;

triggers.ALL_CATCHES_TRIGGERS.forEach(entry => {
    registerIf(
        register("Chat", (event) => trackSeaCreatureCatch()).setCriteria(entry.trigger).setContains(),
        () => settings.seaCreaturesPerHourTrackerOverlay && isInSkyblock() && !NO_FISHING_WORLDS.includes(getWorldName())
    );  
});

registerIf(
    register('step', () => refreshElapsedTime()).setDelay(1),
    () => settings.seaCreaturesPerHourTrackerOverlay && isInSkyblock() && !NO_FISHING_WORLDS.includes(getWorldName())
);

registerIf(
    register('renderOverlay', () => renderTrackerOverlay()),
    () => settings.seaCreaturesPerHourTrackerOverlay && isInSkyblock() && !NO_FISHING_WORLDS.includes(getWorldName())
);

register("worldUnload", () => {
    isSessionActive = false;
});

let buttonsDisplay = new Display().hide();
let resetTrackerDisplayLine = new DisplayLine(`${RED}[Click to reset]`).setShadow(true);
resetTrackerDisplayLine.registerClicked((x, y, mouseButton, buttonState) => {
    if (mouseButton === 0 && buttonState === false) { // When left mouse button is UP. 0 is left mouse button, false is UP, true is DOWN. 
        resetSeaCreaturesPerHourTracker(false);
    }
});
resetTrackerDisplayLine.registerHovered(() => resetTrackerDisplayLine.setText(`${RED}${UNDERLINE}[Click to reset]`).setShadow(true));
resetTrackerDisplayLine.registerMouseLeave(() => resetTrackerDisplayLine.setText(`${RED}[Click to reset]`).setShadow(true));
buttonsDisplay.addLine(resetTrackerDisplayLine);

export function resetSeaCreaturesPerHourTracker(isConfirmed) {
    try {
        if (!isConfirmed) {
            new Message(
                new TextComponent(`${GOLD}[FeeshNotifier] ${WHITE}Do you want to reset Sea creatures per hour? ${RED}${BOLD}[Click to confirm]`)
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
        console.log(`[FeeshNotifier] [SeaCreaturesPerHour] Failed to reset Sea creatures per hour.`);
    }
}

function refreshElapsedTime() {
    try {
        if (!isSessionActive || !settings.seaCreaturesPerHourOverlay || !isInSkyblock() || !hasFishingRodInHotbar()) {
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
        if (!settings.seaCreaturesPerHourOverlay || !isInSkyblock() || !hasFishingRodInHotbar()) {
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
        console.log(`[FeeshNotifier] [SeaCreaturesPerHour] Failed to track magma fields catch.`);
    }
}

function refreshTrackerData() {
    try {
        if (!settings.seaCreaturesPerHourTrackerOverlay || !isInSkyblock() || !hasFishingRodInHotbar()) {
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
        !hasFishingRodInHotbar() ||
        (!totalSeaCreaturesCaughtCount || !seaCreaturesPerHour) ||
        allOverlaysGui.isOpen()
    ) {
        buttonsDisplay.hide();
        return;
    }

    const pausedText = isSessionActive ? '' : ` ${YELLOW}[Paused]`;
    let text = `${GOLD}${BOLD}Sea creatures/hour: `;
    text += `${WHITE}${formatNumberWithSpaces(seaCreaturesPerHour)}`;

    text += `\n${GOLD}${BOLD}Total: ${WHITE}${formatNumberWithSpaces(totalSeaCreaturesCaughtCount)}`; //  TODO
    text += `\n${AQUA}${BOLD}Elapsed time: ${WHITE}${formatElapsedTime(elapsedSeconds)}${pausedText}`;

    const overlay = new Text(text, overlayCoordsData.seaCreaturesPerHourTrackerOverlay.x, overlayCoordsData.seaCreaturesPerHourTrackerOverlay.y)
        .setShadow(true)
        .setScale(overlayCoordsData.seaCreaturesPerHourTrackerOverlay.scale);
    overlay.draw();

    const shouldShowButtons = isInChatOrInventoryGui();
    if (shouldShowButtons) {
        resetTrackerDisplayLine.setScale(overlayCoordsData.seaCreaturesPerHourTrackerOverlay.scale - 0.2);
        //pauseTrackerDisplayLine.setScale(overlayCoordsData.magmaCoreProfitTrackerOverlay.scale - 0.2);
        buttonsDisplay
            .setRenderX(overlayCoordsData.seaCreaturesPerHourTrackerOverlay.x)
            .setRenderY(overlayCoordsData.seaCreaturesPerHourTrackerOverlay.y + overlay.getHeight() + 2).show();
    } else {
        buttonsDisplay.hide();
    }
}