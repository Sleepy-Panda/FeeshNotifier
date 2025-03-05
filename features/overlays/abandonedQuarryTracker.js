import settings from "../../settings";
import * as seaCreatures from "../../constants/seaCreatures";
import { ABANDONED_QUARRY } from "../../constants/areas";
import { AQUA, BOLD, GOLD, GRAY, GREEN, RED, WHITE, YELLOW } from "../../constants/formatting";
import { ANY_MITHRIL_GRUBBER_MESSAGE } from "../../constants/triggers";
import { overlayCoordsData } from "../../data/overlayCoords";
import { formatElapsedTime, formatNumberWithSpaces, isDoubleHook, isFishingHookActive, isInChatOrInventoryGui } from "../../utils/common";
import { getLastGuisClosed, getZoneName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";

const SMALL_MITHRIL_GRUBBER_KEY = seaCreatures.SMALL_MITHRIL_GRUBBER.toUpperCase();
const MEDIUM_MITHRIL_GRUBBER_KEY = seaCreatures.MEDIUM_MITHRIL_GRUBBER.toUpperCase();
const LARGE_MITHRIL_GRUBBER_KEY = seaCreatures.LARGE_MITHRIL_GRUBBER.toUpperCase();
const BLOATED_MITHRIL_GRUBBER_KEY = seaCreatures.BLOATED_MITHRIL_GRUBBER.toUpperCase();

let trackerData = {
    catches: {
        [SMALL_MITHRIL_GRUBBER_KEY]: 0,
        [MEDIUM_MITHRIL_GRUBBER_KEY]: 0,
        [LARGE_MITHRIL_GRUBBER_KEY]: 0,
        [BLOATED_MITHRIL_GRUBBER_KEY]: 0,
    },
    totalCatches: 0,
    catchesPerHour: 0,
    totalPowder: 0,
    lastPowderGain: 0,
    powderPerHour: 0,
    powderPerCatch: 0,
    elapsedSeconds: 0
};

let isSessionActive = false;
let lastHookSeenAt = null;
let previousMithrilPowder = null;

// DisplayLine is initialized once in order to avoid multiple method calls on click.
let buttonsDisplay = new Display().hide();

let pauseTrackerDisplayLine = new DisplayLine(`${YELLOW}[Click to pause]`).setShadow(true);
pauseTrackerDisplayLine.registerClicked((x, y, mouseButton, buttonState) => {
    if (mouseButton === 0 && buttonState === false) { // When left mouse button is UP. 0 is left mouse button, false is UP, true is DOWN. 
        pauseAbandonedQuarryTracker();
    }
});
buttonsDisplay.addLine(pauseTrackerDisplayLine);

let resetTrackerDisplayLine = new DisplayLine(`${RED}[Click to reset]`).setShadow(true);
resetTrackerDisplayLine.registerClicked((x, y, mouseButton, buttonState) => {
    if (mouseButton === 0 && buttonState === false) { // When left mouse button is UP. 0 is left mouse button, false is UP, true is DOWN. 
        resetAbandonedQuarryTracker(false);
    }
});
buttonsDisplay.addLine(resetTrackerDisplayLine);

register("Chat", (seaCreature, event) => {
    const isDoubleHooked = isDoubleHook();
    trackMithrilGrubberCatch(seaCreature, isDoubleHooked);
}).setCriteria(ANY_MITHRIL_GRUBBER_MESSAGE);

register('step', () => {
    activateSessionOnPlayersFishingHook();
    refreshElapsedTime();
    detectMithrilPowderChanges();
}).setFps(1);

register('renderOverlay', () => renderMithrilGrubberPowderTrackerOverlay());

export function resetAbandonedQuarryTracker(isConfirmed) {
    try {
        if (!isConfirmed) {
            new Message(
                new TextComponent(`${GOLD}[FeeshNotifier] ${WHITE}Do you want to reset Abandoned Quarry tracker? ${RED}${BOLD}[Click to confirm]`)
                    .setClickAction('run_command')
                    .setClickValue('/feeshResetAbandonedQuarry noconfirm')
            ).chat();
            return;
        }
    
        trackerData = {
            catches: {
                [SMALL_MITHRIL_GRUBBER_KEY]: 0,
                [MEDIUM_MITHRIL_GRUBBER_KEY]: 0,
                [LARGE_MITHRIL_GRUBBER_KEY]: 0,
                [BLOATED_MITHRIL_GRUBBER_KEY]: 0,
            },
            totalCatches: 0,
            catchesPerHour: 0,
            totalPowder: 0,
            lastPowderGain: 0,
            powderPerHour: 0,
            powderPerCatch: 0,
            elapsedSeconds: 0
        };
        
        isSessionActive = false;
        lastHookSeenAt = null;
        previousMithrilPowder = null;

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Abandoned Quarry tracker was reset.`);    
    } catch (e) {
        console.error(e);
        console.log(`[FeeshNotifier] [AbandonedQuarryTracker] Failed to reset Abandoned Quarry tracker.`);
    }
}

function pauseAbandonedQuarryTracker() {
    try {
        if (!isSessionActive || !settings.abandonedQuarryTrackerOverlay || !isInSkyblock() || !hasFishingRodInHotbar() || getZoneName() !== ABANDONED_QUARRY) {
            return;
        }
    
        pauseSession();
        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Abandoned Quarry tracker is paused. Continue fishing to resume it.`);       
    } catch (e) {
        console.error(e);
        console.log(`[FeeshNotifier] [AbandonedQuarryTracker] Failed to pause Abandoned Quarry tracker.`);
    }
}

function pauseSession() {
    isSessionActive = false;
    previousMithrilPowder = null;
}

function activateSessionOnPlayersFishingHook() {
    try {
        if (!settings.abandonedQuarryTrackerOverlay || !isInSkyblock() || !hasFishingRodInHotbar() || getZoneName() !== ABANDONED_QUARRY) {
            return;
        }
    
        const isHookActive = isFishingHookActive();
        if (isHookActive) {
            activateTimer();
        }
    } catch (e) {
        console.error(e);
        console.log(`[FeeshNotifier] [AbandonedQuarryTracker] Failed to track player's fishing hook.`);
    }

    function activateTimer() {
        if (!isSessionActive) {
            previousMithrilPowder = getMithrilPowder();
        }

        lastHookSeenAt = new Date();
        isSessionActive = true;

        if (!trackerData.elapsedSeconds) {
            trackerData.elapsedSeconds = 1;
        }
    }
}

function refreshElapsedTime() {
    try {
        if (!isSessionActive || !settings.abandonedQuarryTrackerOverlay || !isInSkyblock() || !hasFishingRodInHotbar() || getZoneName() !== ABANDONED_QUARRY) {
            pauseSession();
            return;
        }

        const maxSecondsElapsedSinceLastAction = 60;
        const elapsedSecondsSinceLastAction = (new Date() - lastHookSeenAt) / 1000;

        if (lastHookSeenAt && elapsedSecondsSinceLastAction < maxSecondsElapsedSinceLastAction) {
            trackerData.elapsedSeconds += 1;
            refreshTrackerData();
        } else {
            pauseSession();
        }
    } catch (e) {
        console.error(e);
        console.log(`[FeeshNotifier] [AbandonedQuarryTracker] Failed to refresh elapsed time.`);
    }
}

function trackMithrilGrubberCatch(seaCreature, isDoubleHook) {
    try {
        if (!seaCreature || !settings.abandonedQuarryTrackerOverlay || !isInSkyblock() || !hasFishingRodInHotbar() || getZoneName() !== ABANDONED_QUARRY) {
            return;
        }
  
        const valueToAdd = isDoubleHook ? 2 : 1;
        const key = seaCreature.toUpperCase();
        const currentAmount = trackerData.catches[key] ? trackerData.catches[key] : 0;
    
        trackerData.catches[key] = currentAmount ? currentAmount + valueToAdd : valueToAdd;
    
        const total = Object.values(trackerData.catches).reduce((accumulator, currentValue) => {
            return accumulator + currentValue
        }, 0);
        trackerData.totalCatches = total;
        
        refreshTrackerData();
    } catch (e) {
        console.error(e);
		console.log(`[FeeshNotifier] [AbandonedQuarryTracker] Failed to track Mithril Grubber catch.`);
    }
}

function getMithrilPowder() {
    try {
        const tabListLine = TabList?.getNames()?.find(line => line.removeFormatting().startsWith(' Mithril: '));
        if (!tabListLine) {
            return null;
        }

        const powder = tabListLine.removeFormatting()?.trim()?.split(': ')[1]?.replaceAll(',', '');
        return powder;
    } catch (e) {
        console.error(e);
        console.log(`[FeeshNotifier] [AbandonedQuarryTracker] Failed to get current Mithril Powder.`);
    }
}

function detectMithrilPowderChanges() {
    try {
        if (!isSessionActive || !settings.abandonedQuarryTrackerOverlay || !isInSkyblock() || !hasFishingRodInHotbar() || getZoneName() !== ABANDONED_QUARRY) {
            return;
        }

        if (previousMithrilPowder === null) {
            const currentPowder = getMithrilPowder();
            previousMithrilPowder = currentPowder;
        }

        const currentPowder = getMithrilPowder();

        const isInHotm = Player?.getContainer()?.getName()?.toLowerCase()?.includes('Heart of the Mountain');
        const lastHotmClosedAt = getLastGuisClosed().lastHotmGuiClosedAt;
        if (isInHotm || (lastHotmClosedAt && new Date() - lastHotmClosedAt < 1000)) {
            previousMithrilPowder = currentPowder;
            return;
        }

        const diff = currentPowder !== null && previousMithrilPowder !== null ? currentPowder - previousMithrilPowder : 0;

        if (diff > 0) {
            trackerData.totalPowder += diff;
            trackerData.lastPowderGain = diff;
            refreshTrackerData();
        }

        previousMithrilPowder = currentPowder;
    } catch (e) {
        console.error(e);
        console.log(`[FeeshNotifier] [AbandonedQuarryTracker] Failed to detect Mithril Powder changes.`);
    }
}

function refreshTrackerData() {
    try {
        if (!isSessionActive || !settings.abandonedQuarryTrackerOverlay || !isInSkyblock() || !hasFishingRodInHotbar() || getZoneName() !== ABANDONED_QUARRY) {
            return;
        }

        const elapsedHours = trackerData.elapsedSeconds / 3600;
        trackerData.catchesPerHour = elapsedHours
            ? Math.floor(trackerData.totalCatches / elapsedHours)
            : 0;
        trackerData.powderPerHour = elapsedHours
            ? Math.floor(trackerData.totalPowder / elapsedHours)
            : 0;
        trackerData.powderPerCatch = trackerData.totalPowder > 0 && trackerData.totalCatches > 0
            ? Math.floor(trackerData.totalPowder / trackerData.totalCatches)
            : 0;
    } catch (e) {
        console.error(e);
        console.log(`[FeeshNotifier] [AbandonedQuarryTracker] Failed to refresh tracker data.`);
    }
}

function renderMithrilGrubberPowderTrackerOverlay() {
    if (!settings.abandonedQuarryTrackerOverlay ||
        !isInSkyblock() ||
        !hasFishingRodInHotbar() ||
        getZoneName() !== ABANDONED_QUARRY ||
        !trackerData ||
        !trackerData.elapsedSeconds ||
        settings.allOverlaysGui.isOpen()
    ) {
        buttonsDisplay.hide();
        return;
    }

    const lastPowderGainText = trackerData.lastPowderGain ? ` ${GRAY}[+${formatNumberWithSpaces(trackerData.lastPowderGain)} last added]` : '';
    const pausedText = isSessionActive ? '' : ` ${YELLOW}[Paused]`;
    let text = `${YELLOW}${BOLD}Abandoned Quarry tracker\n`;
    text += `${GREEN}Total Mithril Grubbers caught: ${WHITE}${formatNumberWithSpaces(trackerData.totalCatches)} ${GRAY}(${WHITE}${formatNumberWithSpaces(trackerData.catches[SMALL_MITHRIL_GRUBBER_KEY])} ${formatNumberWithSpaces(trackerData.catches[MEDIUM_MITHRIL_GRUBBER_KEY])} ${formatNumberWithSpaces(trackerData.catches[LARGE_MITHRIL_GRUBBER_KEY])} ${formatNumberWithSpaces(trackerData.catches[BLOATED_MITHRIL_GRUBBER_KEY])}${GRAY})\n`;
    text += `${GREEN}Total Mithril Powder: ${WHITE}${formatNumberWithSpaces(trackerData.totalPowder)}${lastPowderGainText}\n`;
    text += `${GREEN}Avg Mithril Powder per catch: ${WHITE}${formatNumberWithSpaces(trackerData.powderPerCatch)}\n`;
    text += `\n`;
    text += `${GREEN}Mithril Grubbers caught/h: ${WHITE}${formatNumberWithSpaces(trackerData.catchesPerHour)}\n`;
    text += `${GREEN}Mithril Powder/h: ${WHITE}${formatNumberWithSpaces(trackerData.powderPerHour)}\n`;
    text += `\n`;
    text += `${AQUA}Elapsed time: ${WHITE}${formatElapsedTime(trackerData.elapsedSeconds)}${pausedText}`; 

    const overlay = new Text(text, overlayCoordsData.abandonedQuarryTrackerOverlay.x, overlayCoordsData.abandonedQuarryTrackerOverlay.y) // TODO
        .setShadow(true)
        .setScale(overlayCoordsData.abandonedQuarryTrackerOverlay.scale);
    overlay.draw();

    const shouldShowButtons = isInChatOrInventoryGui();
    if (shouldShowButtons) {
        resetTrackerDisplayLine.setScale(overlayCoordsData.abandonedQuarryTrackerOverlay.scale - 0.2);
        pauseTrackerDisplayLine.setScale(overlayCoordsData.abandonedQuarryTrackerOverlay.scale - 0.2);
        buttonsDisplay
            .setRenderX(overlayCoordsData.abandonedQuarryTrackerOverlay.x)
            .setRenderY(overlayCoordsData.abandonedQuarryTrackerOverlay.y + overlay.getHeight() + 2).show();
    } else {
        buttonsDisplay.hide();
    }
}
