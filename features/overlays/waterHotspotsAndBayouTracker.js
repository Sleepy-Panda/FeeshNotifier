import settings, { allOverlaysGui } from "../../settings";
import * as triggers from '../../constants/triggers';
import * as seaCreatures from '../../constants/seaCreatures';
import { persistentData } from "../../data/data";
import { overlayCoordsData } from "../../data/overlayCoords";
import { BOLD, GOLD, LIGHT_PURPLE, RED, WHITE, GRAY, DARK_GRAY, RESET, AQUA } from "../../constants/formatting";
import { getLastFishingHookInHotspotSeenAt, getLastFishingHookSeenAt, getWorldName, isInSkyblock } from "../../utils/playerState";
import { formatDate, formatNumberWithSpaces, formatTimeElapsedBetweenDates, getCatchesCounterChatMessage, isDoubleHook } from "../../utils/common";
import { BACKWATER_BAYOU, WATER_HOTSPOT_WORLDS } from "../../constants/areas";
import { createButtonsDisplay, toggleButtonsDisplay } from "../../utils/overlays";
import { registerIf } from "../../utils/registers";

// Reset command
// Sample overlay
// Hotspot & bayou logic
// Set count command
// Get rid of copypasted methods here and in similar trackers

const TRACKED_TRIGGERS = [
    {
        seaCreatureInfo: triggers.RARE_CATCH_TRIGGERS.find(entry => entry.seaCreature === seaCreatures.TITANOBOA),
        callback: (seaCreatureInfo) => trackTitanoboaCatch(seaCreatureInfo),
    },
    {
        seaCreatureInfo: triggers.RARE_CATCH_TRIGGERS.find(entry => entry.seaCreature === seaCreatures.WIKI_TIKI),
        callback: (seaCreatureInfo) => trackWikiTikiCatch(seaCreatureInfo),
    }
];

triggers.REGULAR_WATER_HOTSPOT_AND_BAYOU_CATCH_TRIGGERS.forEach(seaCreatureInfo => {
    registerIf(
        register("Chat", (event) => trackRegularSeaCreatureCatch()).setCriteria(seaCreatureInfo.trigger).setContains(),
        () => settings.waterHotspotsAndBayouTrackerOverlay && isInSkyblock() && WATER_HOTSPOT_WORLDS.includes(getWorldName())
    );
});

TRACKED_TRIGGERS.forEach(entry => {
    registerIf(
        register("Chat", (event) => entry.callback(entry.seaCreatureInfo)).setCriteria(entry.seaCreatureInfo.trigger).setContains(),
        () => settings.waterHotspotsAndBayouTrackerOverlay && isInSkyblock() && WATER_HOTSPOT_WORLDS.includes(getWorldName())
    );
});

const titanoboaShedTrigger = triggers.RARE_DROP_TRIGGERS.find(entry => entry.trigger === triggers.TITANOBOA_SHED_MESSAGE);
registerIf(
    register("Chat", (magicFind, event) => trackTitanoboaShedDrop()).setCriteria(titanoboaShedTrigger.trigger).setContains(),
    () => settings.waterHotspotsAndBayouTrackerOverlay && isInSkyblock() && WATER_HOTSPOT_WORLDS.includes(getWorldName())
);

const tikiMaskTrigger = triggers.RARE_DROP_TRIGGERS.find(entry => entry.trigger === triggers.TIKI_MASK_MESSAGE);
registerIf(
    register("Chat", (magicFind, event) => trackTikiMaskDrop()).setCriteria(tikiMaskTrigger.trigger).setContains(),
    () => settings.waterHotspotsAndBayouTrackerOverlay && isInSkyblock() && WATER_HOTSPOT_WORLDS.includes(getWorldName())
);

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
    const lastFishingHookInHotspotSeenAt = getLastFishingHookInHotspotSeenAt();
    return lastFishingHookInHotspotSeenAt && new Date() - lastFishingHookInHotspotSeenAt <= 60 * 1000;
}

function trackTitanoboaCatch(seaCreatureInfo) {
    try {
        if (!settings.waterHotspotsAndBayouTrackerOverlay || !isInSkyblock() || !WATER_HOTSPOT_WORLDS.includes(getWorldName())) {
            return;
        }

        const catchesSinceLast = persistentData.waterHotspotsAndBayou.titanoboa.catchesSinceLast + 1;
        const lastCatchTime = persistentData.waterHotspotsAndBayou.titanoboa.lastCatchTime;

        let catchesHistory = persistentData.waterHotspotsAndBayou.titanoboa.catchesHistory || [];
        catchesHistory.unshift(catchesSinceLast); // Most recent counts at the start of array
        catchesHistory.length = Math.min(catchesHistory.length, 100); // Store last 100
        persistentData.waterHotspotsAndBayou.titanoboa.catchesHistory = catchesHistory;

        const sumCatches = catchesHistory.reduce(function(a, b) { return a + b; }, 0);
        persistentData.waterHotspotsAndBayou.titanoboa.averageCatches = catchesHistory.length ? Math.round(sumCatches / catchesHistory.length) : 0;

        persistentData.waterHotspotsAndBayou.titanoboa.catchesSinceLast = 0;
        persistentData.waterHotspotsAndBayou.titanoboa.lastCatchTime = new Date();

        persistentData.waterHotspotsAndBayou.wikiTiki.catchesSinceLast += 1;

        //if (isFishingInHotspot()) {
        //    persistentData.crimsonIsle.ragnarok.catchesSinceLast += 1;
        //}

        const isDoubleHooked = isDoubleHook();
        const valueToAdd = isDoubleHooked ? 2 : 1;
        let catchesSinceLastShed = persistentData.waterHotspotsAndBayou.titanoboaSheds.catchesSinceLast || 0;
        catchesSinceLastShed += valueToAdd;
        persistentData.waterHotspotsAndBayou.titanoboaSheds.catchesSinceLast = catchesSinceLastShed;

        persistentData.save();

        const message = getCatchesCounterChatMessage(seaCreatureInfo.seaCreature, seaCreatureInfo.rarityColorCode, catchesSinceLast, lastCatchTime);
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

        const catchesSinceLast = persistentData.waterHotspotsAndBayou.wikiTiki.catchesSinceLast + 1;
        const lastCatchTime = persistentData.waterHotspotsAndBayou.wikiTiki.lastCatchTime;

        let catchesHistory = persistentData.waterHotspotsAndBayou.wikiTiki.catchesHistory || [];
        catchesHistory.unshift(catchesSinceLast); // Most recent counts at the start of array
        catchesHistory.length = Math.min(catchesHistory.length, 100); // Store last 100
        persistentData.waterHotspotsAndBayou.wikiTiki.catchesHistory = catchesHistory;

        const sumCatches = catchesHistory.reduce(function(a, b) { return a + b; }, 0);
        persistentData.waterHotspotsAndBayou.wikiTiki.averageCatches = catchesHistory.length ? Math.round(sumCatches / catchesHistory.length) : 0;

        persistentData.waterHotspotsAndBayou.wikiTiki.catchesSinceLast = 0;
        persistentData.waterHotspotsAndBayou.wikiTiki.lastCatchTime = new Date();

        persistentData.waterHotspotsAndBayou.titanoboa.catchesSinceLast += 1;

        //if (isFishingInHotspot()) {
        //    persistentData.crimsonIsle.fieryScuttler.catchesSinceLast += 1;
        //}

        const isDoubleHooked = isDoubleHook();
        const valueToAdd = isDoubleHooked ? 2 : 1;
        let catchesSinceLastTikiMask = persistentData.waterHotspotsAndBayou.tikiMasks.catchesSinceLast || 0;
        catchesSinceLastTikiMask += valueToAdd;
        persistentData.waterHotspotsAndBayou.tikiMasks.catchesSinceLast = catchesSinceLastTikiMask;

        persistentData.save();

        const message = getCatchesCounterChatMessage(seaCreatureInfo.seaCreature, seaCreatureInfo.rarityColorCode, catchesSinceLast, lastCatchTime);
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

        persistentData.waterHotspotsAndBayou.titanoboa.catchesSinceLast += 1;
        persistentData.waterHotspotsAndBayou.wikiTiki.catchesSinceLast += 1;

        //if (isFishingInHotspot()) {
        //    persistentData.crimsonIsle.fieryScuttler.catchesSinceLast += 1;
        //    persistentData.crimsonIsle.ragnarok.catchesSinceLast += 1;    
        //}

        persistentData.save();
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track regular sea creature catch.`);
	}
}

function trackTitanoboaShedDrop() {
    try {
        if (!settings.waterHotspotsAndBayouTrackerOverlay || !isInSkyblock() || !WATER_HOTSPOT_WORLDS.includes(getWorldName())) {
            return;
        }

        const catches = persistentData.waterHotspotsAndBayou.titanoboaSheds.catchesSinceLast || 0;

        persistentData.waterHotspotsAndBayou.titanoboaSheds.count += 1;
        persistentData.waterHotspotsAndBayou.titanoboaSheds.catchesSinceLast = 0;

        let dropsHistory = persistentData.waterHotspotsAndBayou.titanoboaSheds.dropsHistory || [];
        const lastDropTime = dropsHistory.length && dropsHistory[0].time ? dropsHistory[0].time : null;
        const elapsedTime = lastDropTime ? ` ${GRAY}(${WHITE}${formatTimeElapsedBetweenDates(new Date(lastDropTime))}${GRAY})` : '';

        dropsHistory.unshift({
            time: new Date(),
            titanoboaCatches: catches
        });
        persistentData.waterHotspotsAndBayou.titanoboaSheds.dropsHistory = dropsHistory;

        persistentData.save();

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${GRAY}It took ${WHITE}${catches} ${GRAY}${catches === 1 ? 'Titanoboa catch' : 'Titanoboa catches'}${elapsedTime} to get the ${GOLD}Titanoboa Shed ${WHITE}#${persistentData.waterHotspotsAndBayou.titanoboaSheds.count}${GRAY}. Congratulations!`);
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

        const catches = persistentData.waterHotspotsAndBayou.tikiMasks.catchesSinceLast || 0;

        persistentData.waterHotspotsAndBayou.tikiMasks.count += 1;
        persistentData.waterHotspotsAndBayou.tikiMasks.catchesSinceLast = 0;

        let dropsHistory = persistentData.waterHotspotsAndBayou.tikiMasks.dropsHistory || [];
        const lastDropTime = dropsHistory.length && dropsHistory[0].time ? dropsHistory[0].time : null;
        const elapsedTime = lastDropTime ? ` ${GRAY}(${WHITE}${formatTimeElapsedBetweenDates(new Date(lastDropTime))}${GRAY})` : '';

        dropsHistory.unshift({
            time: new Date(),
            wikiTikiCatches: catches
        });
        persistentData.waterHotspotsAndBayou.tikiMasks.dropsHistory = dropsHistory;

        persistentData.save();

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${GRAY}It took ${WHITE}${catches} ${GRAY}${catches === 1 ? 'Wiki Tiki catch' : 'Wiki Tiki catches'}${elapsedTime} to get the ${GOLD}Tiki Mask ${WHITE}#${persistentData.waterHotspotsAndBayou.tikiMasks.count}${GRAY}. Congratulations!`);
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
        (new Date() - getLastFishingHookSeenAt() > 10 * 60 * 1000) ||
        allOverlaysGui.isOpen()
    ) {
        buttonsDisplay.hide();
        return;
    }

    let overlayText = `${AQUA}${BOLD}Water Hotspots & Bayou tracker\n`;
    overlayText += getTitanoboaOverlayText();
    overlayText += getTitanoboaShedsOverlayText();
    overlayText += getWikiTikiOverlayText();

    const overlay = new Text(overlayText, overlayCoordsData.crimsonIsleTrackerOverlay.x, overlayCoordsData.crimsonIsleTrackerOverlay.y)
        .setShadow(true)
        .setScale(overlayCoordsData.crimsonIsleTrackerOverlay.scale);
    overlay.draw();

    toggleButtonsDisplay(buttonsDisplay, overlay, overlayCoordsData.crimsonIsleTrackerOverlay);

    function getTitanoboaOverlayText() {
        if (getWorldName() !== BACKWATER_BAYOU) return '';

        let overlayText = '';
        const obj = persistentData.waterHotspotsAndBayou.titanoboa;
        overlayText += `${LIGHT_PURPLE}Titanoboa: ${getCatchesSinceLastOverlayText(obj)} ${getAverageCatchesOverlayText(obj)}\n`;
        overlayText += `${getLastCatchTimeOverlayText(obj)}\n`;

        return overlayText;
    }

    function getTitanoboaShedsOverlayText() {
        if (getWorldName() !== BACKWATER_BAYOU) return '';

        const obj = persistentData.waterHotspotsAndBayou.titanoboaSheds;
        const lastDropTime = obj.dropsHistory.length
            ? `${WHITE}${formatTimeElapsedBetweenDates(new Date(obj.dropsHistory[0].time))} ${GRAY}(${WHITE}${formatDate(new Date(obj.dropsHistory[0].time))}${GRAY})` 
            : `${WHITE}N/A`;
        const catchesSinceLastDrop = obj.catchesSinceLast || 0;

        let overlayText = '';
        overlayText += `${GOLD}Titanoboa Sheds: ${WHITE}${formatNumberWithSpaces(obj.count)}\n`;
        overlayText += `${GRAY}Last on: ${lastDropTime}\n`;
        overlayText += `${GRAY}Last on: ${WHITE}${formatNumberWithSpaces(catchesSinceLastDrop)} ${GRAY}${catchesSinceLastDrop !== 1 ? 'Titanoboas' : 'Titanoboa'} ago`;

        return overlayText;
    }

    function getWikiTikiOverlayText() {
        if (!isFishingInHotspot()) return '';

        let overlayText = '';
        const obj = persistentData.waterHotspotsAndBayou.wikiTiki;
        overlayText += `${LIGHT_PURPLE}Wiki Tiki: ${getCatchesSinceLastOverlayText(obj)} ${getAverageCatchesOverlayText(obj)}\n`;
        overlayText += `${getLastCatchTimeOverlayText(obj)}\n`;

        return overlayText;
    }

    function getTikiMasksOverlayText() {
        if (!isFishingInHotspot()) return '';

        const obj = persistentData.waterHotspotsAndBayou.tikiMasks;
        const lastDropTime = obj.dropsHistory.length
            ? `${WHITE}${formatTimeElapsedBetweenDates(new Date(obj.dropsHistory[0].time))} ${GRAY}(${WHITE}${formatDate(new Date(obj.dropsHistory[0].time))}${GRAY})` 
            : `${WHITE}N/A`;
        const catchesSinceLastDrop = obj.catchesSinceLast || 0;

        let overlayText = '';
        overlayText += `${GOLD}Tiki Masks: ${WHITE}${formatNumberWithSpaces(obj.count)}\n`;
        overlayText += `${GRAY}Last on: ${lastDropTime}\n`;
        overlayText += `${GRAY}Last on: ${WHITE}${formatNumberWithSpaces(catchesSinceLastDrop)} ${GRAY}${catchesSinceLastDrop !== 1 ? 'Wiki Tikis' : 'Wiki Tiki'} ago`;

        return overlayText;
    }
    
    function getCatchesSinceLastOverlayText(obj) {
        const catchesSinceLast = `${WHITE}${formatNumberWithSpaces(obj?.catchesSinceLast || 0)}`;
        const text = `${catchesSinceLast} ${GRAY}${obj?.catchesSinceLast !== 1 ? 'catches' : 'catch'} ago`;
        return text;
    }

    function getAverageCatchesOverlayText(obj) {
        const average = formatNumberWithSpaces(obj?.averageCatches) || 'N/A';
        const text = `${DARK_GRAY}(${GRAY}avg: ${WHITE}${average}${DARK_GRAY})`;
        return text;
    }

    function getLastCatchTimeOverlayText(obj) {
        const lastCatchTime = obj?.lastCatchTime
            ? `${WHITE}${formatTimeElapsedBetweenDates(new Date(obj.lastCatchTime))} ${GRAY}(${WHITE}${formatDate(new Date(obj.lastCatchTime))}${GRAY})` 
            : `${WHITE}N/A`;
        const text = `${GRAY}Last on: ${lastCatchTime}`;
        return text;
    }
}
