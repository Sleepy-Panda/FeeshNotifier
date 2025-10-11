import settings, { allOverlaysGui } from "../../settings";
import * as triggers from '../../constants/triggers';
import { persistentData } from "../../data/data";
import { overlayCoordsData } from "../../data/overlayCoords";
import { formatNumberWithSpaces, getDropCatchesCounterChatMessage, isInFishingWorld } from '../../utils/common';
import { WHITE, GOLD, BOLD, GRAY, RED, AQUA, DARK_PURPLE, LIGHT_PURPLE } from "../../constants/formatting";
import { getWorldName, isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";
import { getDropStatisticsOverlayText, initDropCountOnOverlay, LEFT_CLICK_TYPE, Overlay, OverlayButtonLine, OverlayTextLine, setDropStatisticsOnDrop } from "../../utils/overlays";

const TREASURE_CATCH_TRIGGERS = [
    {
        trigger: triggers.GOOD_CATCH_MESSAGE,
        treasureType: "good",
    },
    {
        trigger: triggers.GREAT_CATCH_MESSAGE,
        treasureType: "great",
    },
    {
        trigger: triggers.OUTSTANDING_CATCH_MESSAGE,
        treasureType: "outstanding",
    },
];

const TRACKED_DROPS = [
    {
        trigger: triggers.TREASURE_DYE_MESSAGE,
        callback: () => trackTreasureDyeDrop(),
    },
];

let lastTreasureCaughtAt = null;

TREASURE_CATCH_TRIGGERS.forEach(entry => {
    registerIf(
        register("Chat", (event) => {
            trackTreasureCatch(entry.treasureType);
        }).setCriteria(entry.trigger).setStart(),
        () => settings.treasureFishingTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
    );
});

TRACKED_DROPS.forEach(entry => {
    registerIf(
        register("Chat", (event) => entry.callback()).setCriteria(entry.trigger).setContains(),
        () => settings.treasureFishingTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
    );
});

registerIf(
    register('step', () => refreshOverlay()).setFps(2),
    () => settings.treasureFishingTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
);

register('worldUnload', () => {
    lastTreasureCaughtAt = null;
});

register("gameUnload", () => {
    if (settings.treasureFishingTrackerOverlay && settings.resetTreasureFishingTrackerOnGameClosed && persistentData.treasureFishing.total.totalCount > 0) {
        resetTreasureFishingTracker(true);
    }
});

const overlay = new Overlay(() => settings.treasureFishingTrackerOverlay && isInSkyblock() && isInFishingWorld(getWorldName()))
    .setPositionData(overlayCoordsData.treasureFishingTrackerOverlay)
    .setIsClickable(true);

export function setTreasureDyes(count, lastOn) {
    try {
        if (!isInSkyblock()) {
            return;
        }
        
        const errorMessage = initDropCountOnOverlay(persistentData.treasureFishing.total.treasureDyes, count, lastOn);
        if (errorMessage) {
            ChatLib.chat(errorMessage);
            return;
        }

        persistentData.save();
        refreshOverlay();
        ChatLib.chat(`${GOLD}[FeeshNotifier] ${GRAY}Successfully changed Treasure Dyes count to ${count} for the Treasure fishing tracker.`);
    } catch (e) {
        console.error(e);
        console.log(`[FeeshNotifier] Failed to set Treasure Dyes.`);
    }
}

export function resetTreasureFishingTracker(isConfirmed) {
    try {
        if (!isConfirmed) {
            new Message(
                new TextComponent(`${GOLD}[FeeshNotifier] ${WHITE}Do you want to reset Treasure fishing tracker? ${RED}${BOLD}[Click to confirm]`)
                    .setClickAction('run_command')
                    .setClickValue('/feeshResetTreasureFishing noconfirm')
            ).chat();
            return;
        }
    
        persistentData.treasureFishing = {
            session: {
                catches: {
                    good: 0,
                    great: 0,
                    outstanding: 0,
                },
            },
            total: {
                catches: {
                    good: 0,
                    great: 0,
                    outstanding: 0,
                },
                treasureDyes: {
                    count: 0,
                    catchesSinceLast: 0,
                    dropsHistory: []
                },
            }
        };

        lastTreasureCaughtAt = null;

        persistentData.save();
        refreshOverlay();
        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Treasure fishing tracker was reset.`);    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to reset Treasure fishing tracker.`);
	}
}

function trackTreasureCatch(treasureType) {
    try {
        if (!settings.treasureFishingTrackerOverlay || !isInSkyblock() || !isInFishingWorld(getWorldName())) {
            return;
        }

        lastTreasureCaughtAt = new Date();
        persistentData.treasureFishing.total.catches[treasureType] += 1;
        persistentData.treasureFishing.total.treasureDyes.catchesSinceLast += 1; 
        persistentData.save();
        refreshOverlay();
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track treasure catch.`);
	}
}

function trackTreasureDyeDrop() {
    try {
        if (!settings.treasureFishingTrackerOverlay || !isInSkyblock() || !isInFishingWorld(getWorldName())) {
            return;
        }

        const result = setDropStatisticsOnDrop(persistentData.treasureFishing.total.treasureDyes, 'catchesSinceLast', 'catches', null);
        persistentData.save();
        refreshOverlay();

        const dropNumber = persistentData.treasureFishing.total.treasureDyes.count;
        const message = getDropCatchesCounterChatMessage(`${GOLD}Treasure Dye`, 'Treasure', result.lastDropTime, dropNumber, result.catches);
        ChatLib.chat(message);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Treasure Dye drop.`);
	}
}

function hasAnyData() {
    return persistentData.treasureFishing?.total?.catches && (
        persistentData.treasureFishing.total.catches.good ||
        persistentData.treasureFishing.total.catches.great ||
        persistentData.treasureFishing.total.catches.outstanding
    );
}

function refreshOverlay() {
    overlay.clear();

    if (!settings.treasureFishingTrackerOverlay ||
        !hasAnyData() ||
        !isInSkyblock() ||
        !isInFishingWorld(getWorldName()) ||
        !lastTreasureCaughtAt ||
        (new Date() - lastTreasureCaughtAt > 2 * 60 * 1000) ||
        allOverlaysGui.isOpen()
    ) {
        return;
    }

    overlay.addTextLine(new OverlayTextLine().setText(`${AQUA}⛃ ${AQUA}${BOLD}Treasure fishing tracker`));
    overlay.addTextLine(new OverlayTextLine().setText(`${GRAY}- ${DARK_PURPLE}Good catch${GRAY}: ${WHITE}${formatNumberWithSpaces(persistentData.treasureFishing.total.catches.good)}`));
    overlay.addTextLine(new OverlayTextLine().setText(`${GRAY}- ${GOLD}Great catch${GRAY}: ${WHITE}${formatNumberWithSpaces(persistentData.treasureFishing.total.catches.great)}`));
    overlay.addTextLine(new OverlayTextLine().setText(`${GRAY}- ${LIGHT_PURPLE}Outstanding catch${GRAY}: ${WHITE}${formatNumberWithSpaces(persistentData.treasureFishing.total.catches.outstanding)}`));

    const totalTreasureCatches = persistentData.treasureFishing.total.catches.good + persistentData.treasureFishing.total.catches.great + persistentData.treasureFishing.total.catches.outstanding;
    overlay.addTextLine(new OverlayTextLine().setText(`${GRAY}Total Treasures: ${WHITE}${formatNumberWithSpaces(totalTreasureCatches)}`));

    const treasureDyesText = getDropStatisticsOverlayText(`${GOLD}Treasure Dye`, 'Treasure', persistentData.treasureFishing.total.treasureDyes, 'catchesSinceLast');
    overlay.addTextLine(new OverlayTextLine().setText(`\n${treasureDyesText}`));

    overlay.addButtonLine(new OverlayButtonLine()
        .setText(`${RED}${BOLD}[Click to reset]`)
        .setIsSmallerScale(true)
        .setOnClick(LEFT_CLICK_TYPE, () => resetTreasureFishingTracker(false)));
}