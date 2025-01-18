import { AQUA, BOLD, GRAY, GREEN, WHITE, YELLOW } from "../../constants/formatting";
import * as seaCreatures from "../../constants/seaCreatures";
import { overlayCoordsData } from "../../data/overlayCoords";
import settings from "../../settings";
import { formatElapsedTime, formatNumberWithSpaces, isDoubleHook } from "../../utils/common";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";

// Setting
// Overlay
// Coords data
// Move, moveall
// Reset / pause via command / buttons
// Zone: Abandoned Quarry
// Multipliers like 2x powder?

let trackerData = {
    catches: {
        [seaCreatures.MITHRIL_GRUBBER]: 0,
        [seaCreatures.MEDIUM_MITHRIL_GRUBBER]: 0,
        [seaCreatures.LARGE_MITHRIL_GRUBBER]: 0,
        [seaCreatures.BLOATED_MITHRIL_GRUBBER]: 0,
    },
    totalCatches: 0,
    catchesPerHour: 0,
    totalPowder: 0,
    powderPerHour: 0,
    elapsedSeconds: 0
};

let isSessionActive = false;
let lastSeaCreatureCaughtAt = null;

[
    '&r&aA leech of the mines surfaces... you\'ve caught a ${seaCreature}.&r',
].forEach(trigger => {
    register("Chat", (seaCreature, event) => {
        const isDoubleHooked = isDoubleHook();
        trackMithrilGrubberCatch(seaCreature, isDoubleHooked);
    }).setCriteria(trigger);
});

register("Chat", (powderCount, event) => {
    trackMithrilPowder(powderCount);
}).setCriteria('&r&2&lGRUB! &r&aYou received &r&2${powderCount} ᠅ Mithril Powder &r&afrom killing a &r&2Mithril Grubber&r&a!&r');

register('step', () => refreshElapsedTime()).setDelay(1);
register('renderOverlay', () => renderMithrilGrubberPowderTrackerOverlay());

function trackMithrilGrubberCatch(seaCreature, isDoubleHook) {
    if (!seaCreature || !isInSkyblock()) { // !setting
        return;
    }

    isSessionActive = true;
    lastSeaCreatureCaughtAt = new Date();

    const valueToAdd = isDoubleHook ? 2 : 1;
    const key = seaCreature.toUpperCase();
    const currentAmount = trackerData.catches[key] ? trackerData.catches[key] : 0;

    trackerData.catches[key] = currentAmount ? currentAmount + valueToAdd : valueToAdd;

    const total = Object.values(trackerData.catches).reduce((accumulator, currentValue) => {
        return accumulator + currentValue
    }, 0);
    trackerData.totalCatches = total;
}

function trackMithrilPowder(powderCount) {
    if (!powderCount || !isSessionActive) { // || !isSessionActive || !setting etc
        return;
    }

    const powderCountWithoutSeparator = +(powderCount.replace(/,/g, ''));
    if (powderCountWithoutSeparator > 0) {
        trackerData.totalPowder += powderCountWithoutSeparator;
    }
}

function refreshElapsedTime() {
    try {
        if (!isSessionActive || !settings.magmaCoreProfitTrackerOverlay || !isInSkyblock() || !hasFishingRodInHotbar() || getWorldName() !== 'Dwarven Mines') { // setting
            return;
        }

        const maxSecondsElapsedSinceLastAction = 60;
        const elapsedSecondsSinceLastCatch = (new Date() - lastSeaCreatureCaughtAt) / 1000;

        if (lastSeaCreatureCaughtAt && elapsedSecondsSinceLastCatch < maxSecondsElapsedSinceLastAction) {
            isSessionActive = true;
            trackerData.elapsedSeconds += 1;
        } else {
            isSessionActive = false;
        }
    } catch (e) {
        console.error(e);
        console.log(`[FeeshNotifier] [MithrilGrubberPowderTracker] Failed to refresh elapsed time.`);
    }
}

function renderMithrilGrubberPowderTrackerOverlay() {
    if (//!settings.magmaCoreProfitTrackerOverlay ||
        !isInSkyblock() ||
        !hasFishingRodInHotbar() ||
        getWorldName() !== 'Dwarven Mines' ||
        !trackerData ||
        (!trackerData.totalCatches && !trackerData.totalPowder) ||
        settings.allOverlaysGui.isOpen()
    ) {
        return;
    }

    const elapsedHours = trackerData.elapsedSeconds / 3600;
    trackerData.catchesPerHour = elapsedHours
        ? Math.floor(trackerData.totalCatches / elapsedHours)
        : 0;
    trackerData.powderPerHour = elapsedHours
        ? Math.floor(trackerData.totalPowder / elapsedHours)
        : 0;

    let text = `${YELLOW}${BOLD}Mithril Grubber Powder tracker\n`;
    text += `${GREEN}Total sea creatures caught: ${WHITE}${formatNumberWithSpaces(trackerData.totalCatches)} ${GRAY}(${WHITE}${formatNumberWithSpaces(trackerData.catches[seaCreatures.BLOATED_MITHRIL_GRUBBER])} ${formatNumberWithSpaces(trackerData.catches[seaCreatures.LARGE_MITHRIL_GRUBBER])} ${formatNumberWithSpaces(trackerData.catches[seaCreatures.MEDIUM_MITHRIL_GRUBBER])} ${formatNumberWithSpaces(trackerData.catches[seaCreatures.MITHRIL_GRUBBER])}${GRAY})\n`;
    text += `${GREEN}Total mithril powder: ${WHITE}${formatNumberWithSpaces(trackerData.totalPowder)}\n`;
    text += `\n`;
    text += `${GREEN}Sea creatures caught/h: ${WHITE}${formatNumberWithSpaces(trackerData.catchesPerHour)}\n`;
    text += `${GREEN}Mithril powder/h: ${WHITE}${formatNumberWithSpaces(trackerData.powderPerHour)}\n`;
    text += `\n`;
    text += `${AQUA}Elapsed time: ${WHITE}${formatElapsedTime(trackerData.elapsedSeconds)}`; 

    const overlay = new Text(text, overlayCoordsData.magmaCoreProfitTrackerOverlay.x, overlayCoordsData.magmaCoreProfitTrackerOverlay.y) // TODO
        .setShadow(true)
        .setScale(overlayCoordsData.magmaCoreProfitTrackerOverlay.scale);
    overlay.draw();
}
