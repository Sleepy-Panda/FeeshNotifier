import settings, { allOverlaysGui } from "../../settings";
import * as triggers from '../../constants/triggers';
import * as seaCreatures from '../../constants/seaCreatures';
import { persistentData } from "../../data/data";
import { overlayCoordsData } from "../../data/overlayCoords";
import { BOLD, GOLD, LIGHT_PURPLE, RED, WHITE, GRAY, AQUA } from "../../constants/formatting";
import { getLastFishingHookInHotspotSeenAt, getLastFishingHookSeenAt, getWorldName, isInSkyblock } from "../../utils/playerState";
import { formatTimeElapsedBetweenDates, getCatchesCounterChatMessage } from "../../utils/common";
import { BACKWATER_BAYOU, WATER_HOTSPOT_WORLDS } from "../../constants/areas";
import { createButtonsDisplay, toggleButtonsDisplay, setSeaCreatureStatisticsOnCatch, setDropStatisticsOnCatch, setDropStatisticsOnDrop, getSeaCreatureStatisticsOverlayText, getDropStatisticsOverlayText } from "../../utils/overlays";
import { registerIf } from "../../utils/registers";

// Settings description + drops
// Reset command
// Sample overlay
// Hotspot & bayou logic
// Set count command
// Get rid of copypasted methods here and in similar trackers
// Register trackers in water hotspot worlds
// Show Titanoboa part when in Bayou
// Show Wiki Tiki part when fishing in hotspot

const TRACKED_SEA_CREATURES = [
    {
        seaCreatureInfo: triggers.RARE_CATCH_TRIGGERS.find(entry => entry.seaCreature === seaCreatures.TITANOBOA),
        callback: (seaCreatureInfo) => trackTitanoboaCatch(seaCreatureInfo),
    },
    {
        seaCreatureInfo: triggers.RARE_CATCH_TRIGGERS.find(entry => entry.seaCreature === seaCreatures.WIKI_TIKI),
        callback: (seaCreatureInfo) => trackWikiTikiCatch(seaCreatureInfo),
    },
];

const TRACKED_DROPS = [
    {
        dropInfo: triggers.RARE_DROP_TRIGGERS.find(entry => entry.trigger === triggers.TITANOBOA_SHED_MESSAGE),
        callback: () => trackTitanoboaShedDrop(),
    },
    {
        dropInfo: triggers.RARE_DROP_TRIGGERS.find(entry => entry.trigger === triggers.TIKI_MASK_MESSAGE),
        callback: () => trackTikiMaskDrop(),
    },
];

triggers.REGULAR_WATER_HOTSPOT_AND_BAYOU_CATCH_TRIGGERS.forEach(seaCreatureInfo => {
    registerIf(
        register("Chat", (event) => trackRegularSeaCreatureCatch()).setCriteria(seaCreatureInfo.trigger).setContains(),
        () => settings.waterHotspotsAndBayouTrackerOverlay && isInSkyblock() && WATER_HOTSPOT_WORLDS.includes(getWorldName())
    );
});

TRACKED_SEA_CREATURES.forEach(entry => {
    registerIf(
        register("Chat", (event) => entry.callback(entry.seaCreatureInfo)).setCriteria(entry.seaCreatureInfo.trigger).setContains(),
        () => settings.waterHotspotsAndBayouTrackerOverlay && isInSkyblock() && WATER_HOTSPOT_WORLDS.includes(getWorldName())
    );
});

TRACKED_DROPS.forEach(entry => {
    registerIf(
        register("Chat", (magicFind, event) => entry.callback()).setCriteria(entry.dropInfo.trigger).setContains(),
        () => settings.waterHotspotsAndBayouTrackerOverlay && isInSkyblock() && WATER_HOTSPOT_WORLDS.includes(getWorldName())
    );
});

registerIf(
    register('renderOverlay', () => renderOverlay()),
    () => settings.waterHotspotsAndBayouTrackerOverlay && isInSkyblock() && WATER_HOTSPOT_WORLDS.includes(getWorldName())
);

register("gameUnload", () => {
    if (settings.waterHotspotsAndBayouTrackerOverlay && settings.resetWaterHotspotsAndBayouTrackerOnGameClosed && persistentData.waterHotspotsAndBayou && (
        persistentData.waterHotspotsAndBayou.titanoboa.lastCatchTime ||
        persistentData.waterHotspotsAndBayou.titanoboa.catchesSinceLast ||
        persistentData.waterHotspotsAndBayou.wikiTiki.lastCatchTime ||
        persistentData.waterHotspotsAndBayou.wikiTiki.catchesSinceLast ||
        persistentData.waterHotspotsAndBayou.titanoboaSheds.count ||
        persistentData.waterHotspotsAndBayou.tikiMasks.count
    )) {
        resetWaterHotspotsAndBayouTracker(true);
    }
});

const buttonsDisplay = createButtonsDisplay(true, () => resetWaterHotspotsAndBayouTracker(false), false, null);

export function resetWaterHotspotsAndBayouTracker(isConfirmed) {
    try {
        if (!isConfirmed) {
            new Message(
                new TextComponent(`${GOLD}[FeeshNotifier] ${WHITE}Do you want to reset Water Hotspots & Bayou tracker? ${RED}${BOLD}[Click to confirm]`)
                    .setClickAction('run_command')
                    .setClickValue('/feeshResetWaterHotspotsAndBayou noconfirm')
            ).chat();
            return;
        }
    
        persistentData.waterHotspotsAndBayou = getDefaultObject();
        persistentData.save();

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Water Hotspots & Bayou tracker was reset.`);    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to reset Water Hotspots & Bayou tracker.`);
	}
}

//export function setRadioactiveVials(count, lastOn) {
//    try {
//        if (!isInSkyblock()) {
//            return;
//        }
//        
//        if (typeof count !== 'number' || count < 0 || !Number.isInteger(count)) {
//            ChatLib.chat(`${GOLD}[FeeshNotifier] ${RED}Please specify correct Radioactive Vials count.`);
//            return;
//        }
//        persistentData.crimsonIsle.radioactiveVials.count = count;
//
//        if (lastOn) {
//            if (!isIsoDate(lastOn)) {
//                ChatLib.chat(`${GOLD}[FeeshNotifier] ${RED}Please specify correct Last On UTC date in format YYYY-MM-DDThh:mm:ssZ, e.g. 2024-03-18T14:05:00Z`);
//                return;
//            }
//
//            const dropsHistory = (persistentData.crimsonIsle.radioactiveVials.dropsHistory || []);
//            const dateIso = new Date(lastOn);
//            if (dropsHistory.length) {
//                dropsHistory[0].time = dateIso;
//            } else {
//                dropsHistory.unshift({
//                    time: dateIso,
//                });
//            }
//        }
//
//        persistentData.save();
//
//        ChatLib.chat(`${GOLD}[FeeshNotifier] ${GRAY}Successfully changed Radioactive Vials count to ${count} for the Crimson Isle tracker.`);   
//    } catch (e) {
//        console.error(e);
//		console.log(`[FeeshNotifier] Failed to set Radioactive Vials.`);
//    }
//
//    function isIsoDate(dateString) {
//        if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/.test(dateString)) return false;
//        const d = new Date(dateString); 
//        return d instanceof Date && !isNaN(d.getTime());
//    }
//}

function getDefaultSeaCreatureSectionObject() {
    return { catchesSinceLast: 0, lastCatchTime: null, catchesHistory: [], averageCatches: 0 };
}

function getDefaultObject() {
    return {
        titanoboa: getDefaultSeaCreatureSectionObject(),
        titanoboaSheds: { count: 0, catchesSinceLast: 0, dropsHistory: [] },
        wikiTiki: getDefaultSeaCreatureSectionObject(),
        tikiMasks: { count: 0, catchesSinceLast: 0, dropsHistory: [] }
    };
}

function isFishingInHotspot() {
    if (!WATER_HOTSPOT_WORLDS.includes(getWorldName())) return false;

    const lastFishingHookInHotspotSeenAt = getLastFishingHookInHotspotSeenAt();
    return lastFishingHookInHotspotSeenAt && new Date() - lastFishingHookInHotspotSeenAt <= 60 * 1000;
}

function trackTitanoboaCatch(seaCreatureInfo) {
    try {
        if (!settings.waterHotspotsAndBayouTrackerOverlay || !isInSkyblock() || getWorldName() !== BACKWATER_BAYOU) {
            return;
        }

        const result = setSeaCreatureStatisticsOnCatch(persistentData.waterHotspotsAndBayou.titanoboa);
        setDropStatisticsOnCatch(persistentData.waterHotspotsAndBayou.titanoboaSheds, 'catchesSinceLast');

        if (isFishingInHotspot()) {
            persistentData.waterHotspotsAndBayou.wikiTiki.catchesSinceLast += 1;
        }

        persistentData.save();

        const message = getCatchesCounterChatMessage(seaCreatureInfo.seaCreature, seaCreatureInfo.rarityColorCode, result.catchesSinceLast, result.lastCatchTime);
        ChatLib.chat(message);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Titanoboa catch.`);
	}
}

function trackWikiTikiCatch(seaCreatureInfo) {
    try {
        if (!settings.waterHotspotsAndBayouTrackerOverlay || !isInSkyblock() || !WATER_HOTSPOT_WORLDS.includes(getWorldName())) {
            return;
        }

        const result = setSeaCreatureStatisticsOnCatch(persistentData.waterHotspotsAndBayou.wikiTiki);
        setDropStatisticsOnCatch(persistentData.waterHotspotsAndBayou.tikiMasks, 'catchesSinceLast');

        if (getWorldName() === BACKWATER_BAYOU) {
            persistentData.waterHotspotsAndBayou.titanoboa.catchesSinceLast += 1;
        }

        persistentData.save();

        const message = getCatchesCounterChatMessage(seaCreatureInfo.seaCreature, seaCreatureInfo.rarityColorCode, result.catchesSinceLast, result.lastCatchTime);
        ChatLib.chat(message);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Wiki Tiki catch.`);
	}
}

function trackRegularSeaCreatureCatch() {
    try {
        if (!settings.waterHotspotsAndBayouTrackerOverlay || !isInSkyblock() || !WATER_HOTSPOT_WORLDS.includes(getWorldName())) {
            return;
        }

        if (isFishingInHotspot()) {
            persistentData.waterHotspotsAndBayou.wikiTiki.catchesSinceLast += 1;
        }

        if (getWorldName() === BACKWATER_BAYOU) {
            persistentData.waterHotspotsAndBayou.titanoboa.catchesSinceLast += 1;
        }

        persistentData.save();
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track regular sea creature catch.`);
	}
}

function trackTitanoboaShedDrop() {
    try {
        if (!settings.waterHotspotsAndBayouTrackerOverlay || !isInSkyblock() || getWorldName() !== BACKWATER_BAYOU) {
            return;
        }

        const result = setDropStatisticsOnDrop(persistentData.waterHotspotsAndBayou.titanoboaSheds, 'catchesSinceLast', 'titanoboaCatches');
        persistentData.save();

        const elapsedTimeText = result.lastDropTime ? ` ${GRAY}(${WHITE}${formatTimeElapsedBetweenDates(new Date(result.lastDropTime))}${GRAY})` : '';
        const dropNumber = persistentData.waterHotspotsAndBayou.titanoboaSheds.count;
        const catches = result.catches;
        const message = `${GOLD}[FeeshNotifier] ${GRAY}It took ${WHITE}${catches} ${GRAY}${catches === 1 ? 'Titanoboa catch' : 'Titanoboa catches'}${elapsedTimeText} to get the ${GOLD}Titanoboa Shed ${WHITE}#${dropNumber}${GRAY}. Congratulations!`;
        ChatLib.chat(message);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Titanoboa Shed drop.`);
	}
}

function trackTikiMaskDrop() {
    try {
        if (!settings.waterHotspotsAndBayouTrackerOverlay || !isInSkyblock() || !WATER_HOTSPOT_WORLDS.includes(getWorldName())) {
            return;
        }

        const result = setDropStatisticsOnDrop(persistentData.waterHotspotsAndBayou.tikiMasks, 'catchesSinceLast', 'wikiTikiCatches');
        persistentData.save();

        const elapsedTimeText = result.lastDropTime ? ` ${GRAY}(${WHITE}${formatTimeElapsedBetweenDates(new Date(result.lastDropTime))}${GRAY})` : '';
        const dropNumber = persistentData.waterHotspotsAndBayou.tikiMasks.count;
        const catches = result.catches;
        const message = `${GOLD}[FeeshNotifier] ${GRAY}It took ${WHITE}${catches} ${GRAY}${catches === 1 ? 'Wiki Tiki catch' : 'Wiki Tiki catches'}${elapsedTimeText} to get the ${GOLD}Tiki Mask ${WHITE}#${dropNumber}${GRAY}. Congratulations!`;
        ChatLib.chat(message);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Tiki Mask drop.`);
	}
}

function renderOverlay() {
    if (!settings.waterHotspotsAndBayouTrackerOverlay ||
        !persistentData.waterHotspotsAndBayou ||
        (
            !persistentData.waterHotspotsAndBayou.titanoboa.lastCatchTime &&
            !persistentData.waterHotspotsAndBayou.titanoboa.catchesSinceLast &&
            !persistentData.waterHotspotsAndBayou.wikiTiki.lastCatchTime &&
            !persistentData.waterHotspotsAndBayou.wikiTiki.catchesSinceLast &&
            !persistentData.waterHotspotsAndBayou.titanoboaSheds.count &&
            !persistentData.waterHotspotsAndBayou.tikiMasks.count
        ) ||
        !isInSkyblock() ||
        !WATER_HOTSPOT_WORLDS.includes(getWorldName()) ||
        !(getWorldName() === BACKWATER_BAYOU || isFishingInHotspot()) ||
        (new Date() - getLastFishingHookSeenAt() > 10 * 60 * 1000) ||
        allOverlaysGui.isOpen()
    ) {
        buttonsDisplay.hide();
        return;
    }

    let overlayText = `${AQUA}${BOLD}Water hotspots & Bayou tracker\n`;
    overlayText += getTitanoboaOverlayText();
    overlayText += getTitanoboaShedsOverlayText();
    overlayText += getWikiTikiOverlayText();
    overlayText += getTikiMasksOverlayText();

    const overlay = new Text(overlayText, overlayCoordsData.waterHotspotsAndBayouTrackerOverlay.x, overlayCoordsData.waterHotspotsAndBayouTrackerOverlay.y)
        .setShadow(true)
        .setScale(overlayCoordsData.waterHotspotsAndBayouTrackerOverlay.scale);
    overlay.draw();

    toggleButtonsDisplay(buttonsDisplay, overlay, overlayCoordsData.waterHotspotsAndBayouTrackerOverlay);

    function getTitanoboaOverlayText() {
        if (getWorldName() !== BACKWATER_BAYOU) return '';

        const overlayText = getSeaCreatureStatisticsOverlayText(`${LIGHT_PURPLE}Titanoboa`, persistentData.waterHotspotsAndBayou.titanoboa);
        return overlayText;
    }

    function getTitanoboaShedsOverlayText() {
        if (getWorldName() !== BACKWATER_BAYOU) return '';

        const overlayText = getDropStatisticsOverlayText(`${GOLD}Titanoboa Shed`, 'Titanoboa', persistentData.waterHotspotsAndBayou.titanoboaSheds, 'catchesSinceLast');
        return overlayText;
    }

    function getWikiTikiOverlayText() {
        if (!isFishingInHotspot()) return '';

        const overlayText = getSeaCreatureStatisticsOverlayText(`${LIGHT_PURPLE}Wiki Tiki`, persistentData.waterHotspotsAndBayou.wikiTiki);
        return overlayText;
    }

    function getTikiMasksOverlayText() {
        if (!isFishingInHotspot()) return '';

        const overlayText = getDropStatisticsOverlayText(`${GOLD}Tiki Mask`, 'Wiki Tiki', persistentData.waterHotspotsAndBayou.tikiMasks, 'catchesSinceLast');
        return overlayText;
    }
}
