import settings, { allOverlaysGui } from "../../settings";
import * as triggers from "../../constants/triggers";
import { AQUA, BOLD, GOLD, GRAY, RESET, WHITE, YELLOW } from "../../constants/formatting";
import { overlayCoordsData } from "../../data/overlayCoords";
import { formatElapsedTime, formatNumberWithSpaces, isDoubleHook } from "../../utils/common";
import { hasFishingRodInHotbar, isInSkyblock } from '../../utils/playerState';

// Reset after N minutes?
// Recalculate evry second or more rare?
// Reset

let seaCreaturesPerHour = 0;
let totalSeaCreaturesCaughtCount = 0;
let lastSeaCreatureCaughtAt = null;
let isSessionActive = false;
let elapsedSeconds = 0;

triggers.ALL_CATCHES_TRIGGERS.forEach(entry => {
    register("Chat", (event) => trackSeaCreatureCatch(entry)).setCriteria(entry.trigger).setContains();
});

register("worldUnload", () => {
    isSessionActive = false;
});

register('step', () => refreshElapsedTime()).setDelay(1);

register('renderOverlay', () => renderTrackerOverlay());

function refreshElapsedTime() {
    try {
        if (!isSessionActive || !settings.magmaCoreProfitTrackerOverlay || !isInSkyblock() || !hasFishingRodInHotbar()) {
            return;
        }

        const maxSecondsElapsedSinceLastAction = 60;
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
		console.log(`[FeeshNotifier] [MagmaCoreTracker] Failed to refresh elapsed time.`);
	}
}

function trackSeaCreatureCatch(entry) {
    try {
        if (!settings.magmaCoreProfitTrackerOverlay || !isInSkyblock() || !hasFishingRodInHotbar()) {
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
        console.log(`[FeeshNotifier] [MagmaCoreTracker] Failed to track magma fields catch.`);
    }
}

function refreshTrackerData() {
    try {
        if (!settings.magmaCoreProfitTrackerOverlay || !isInSkyblock() || !hasFishingRodInHotbar()) {
            return;
        }

        const elapsedHours = elapsedSeconds / 3600;
        seaCreaturesPerHour = elapsedHours
            ? Math.floor(totalSeaCreaturesCaughtCount / elapsedHours)
            : 0;
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [MagmaCoreTracker] Failed to refresh tracker data.`);
	}
}

function renderTrackerOverlay() {
    if (!settings.magmaCoreProfitTrackerOverlay ||
        !isInSkyblock() ||
        !hasFishingRodInHotbar() ||
        (!totalSeaCreaturesCaughtCount || !seaCreaturesPerHour) ||
        allOverlaysGui.isOpen()
    ) {
        //buttonsDisplay.hide();
        return;
    }

    const pausedText = isSessionActive ? '' : ` ${YELLOW}[Paused]`;
    let text = `${GOLD}${BOLD}Sea creatures/hour: `;
    text += `${WHITE}${formatNumberWithSpaces(seaCreaturesPerHour)}`;

    text += `\n${AQUA}Elapsed time: ${WHITE}${formatElapsedTime(elapsedSeconds)}`; //  TODO

    const overlay = new Text(text, overlayCoordsData.magmaCoreProfitTrackerOverlay.x, overlayCoordsData.magmaCoreProfitTrackerOverlay.y)
        .setShadow(true)
        .setScale(overlayCoordsData.magmaCoreProfitTrackerOverlay.scale);
    overlay.draw();

    // const shouldShowButtons = isInChatOrInventoryGui();
    // if (shouldShowButtons) {
    //     resetTrackerDisplayLine.setScale(overlayCoordsData.magmaCoreProfitTrackerOverlay.scale - 0.2);
    //     pauseTrackerDisplayLine.setScale(overlayCoordsData.magmaCoreProfitTrackerOverlay.scale - 0.2);
    //     buttonsDisplay
    //         .setRenderX(overlayCoordsData.magmaCoreProfitTrackerOverlay.x)
    //         .setRenderY(overlayCoordsData.magmaCoreProfitTrackerOverlay.y + overlay.getHeight() + 2).show();
    // } else {
    //     buttonsDisplay.hide();
    // }
}