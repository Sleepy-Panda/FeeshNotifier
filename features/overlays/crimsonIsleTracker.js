import settings, { allOverlaysGui } from "../../settings";
import * as triggers from '../../constants/triggers';
import * as seaCreatures from '../../constants/seaCreatures';
import { persistentData } from "../../data/data";
import { overlayCoordsData } from "../../data/overlayCoords";
import { BOLD, GOLD, LIGHT_PURPLE, RED, WHITE, GRAY, RESET, AQUA } from "../../constants/formatting";
import { getLastFishingHookInHotspotSeenAt, getLastFishingHookSeenAt, getWorldName, getZoneName, isInSkyblock } from "../../utils/playerState";
import { getCatchesCounterChatMessage, getDropCatchesCounterChatMessage } from "../../utils/common";
import { CRIMSON_ISLE, PLHLEGBLAST_POOL } from "../../constants/areas";
import { MEME_SOUND_MODE, NORMAL_SOUND_MODE, SAD_TROMBONE_SOUND_SOURCE } from "../../constants/sounds";
import { createButtonsDisplay, toggleButtonsDisplay, setSeaCreatureStatisticsOnCatch, getSeaCreatureStatisticsOverlayText, getDropStatisticsOverlayText, setDropStatisticsOnCatch, setDropStatisticsOnDrop, initDropCountOnOverlay } from "../../utils/overlays";
import { registerIf } from "../../utils/registers";

const TRACKED_SEA_CREATURES = [
    {
        seaCreatureInfo: triggers.RARE_CATCH_TRIGGERS.find(entry => entry.seaCreature === seaCreatures.FIERY_SCUTTLER),
        callback: (seaCreatureInfo) => trackFieryScuttlerCatch(seaCreatureInfo),
    },
    {
        seaCreatureInfo: triggers.RARE_CATCH_TRIGGERS.find(entry => entry.seaCreature === seaCreatures.RAGNAROK),
        callback: (seaCreatureInfo) => trackRagnarokCatch(seaCreatureInfo),
    },
    {
        seaCreatureInfo: triggers.RARE_CATCH_TRIGGERS.find(entry => entry.seaCreature === seaCreatures.PLHLEGBLAST),
        callback: (seaCreatureInfo) => trackPlhlegblastCatch(seaCreatureInfo),
    },
    {
        seaCreatureInfo: triggers.RARE_CATCH_TRIGGERS.find(entry => entry.seaCreature === seaCreatures.THUNDER),
        callback: (seaCreatureInfo) => trackThunderCatch(seaCreatureInfo),
    },
    {
        seaCreatureInfo: triggers.RARE_CATCH_TRIGGERS.find(entry => entry.seaCreature === seaCreatures.LORD_JAWBUS),
        callback: (seaCreatureInfo) => trackLordJawbusCatch(seaCreatureInfo),
    },
];

const TRACKED_DROPS = [
    {
        dropInfo: triggers.RARE_DROP_TRIGGERS.find(entry => entry.trigger === triggers.RADIOACTIVE_VIAL_MESSAGE),
        callback: (magicFind) => trackRadioctiveVialDrop(magicFind),
    },
];

triggers.REGULAR_CRIMSON_CATCH_TRIGGERS.forEach(seaCreatureInfo => {
    registerIf(
        register("Chat", (event) => trackRegularSeaCreatureCatch()).setCriteria(seaCreatureInfo.trigger).setContains(),
        () => settings.crimsonIsleTrackerOverlay && isInSkyblock() && getWorldName() === CRIMSON_ISLE
    );
});

TRACKED_SEA_CREATURES.forEach(entry => {
    registerIf(
        register("Chat", (event) => entry.callback(entry.seaCreatureInfo)).setCriteria(entry.seaCreatureInfo.trigger).setContains(),
        () => settings.crimsonIsleTrackerOverlay && isInSkyblock() && getWorldName() === CRIMSON_ISLE
    );
});

TRACKED_DROPS.forEach(entry => {
    registerIf(
        register("Chat", (magicFind, event) => entry.callback(magicFind)).setCriteria(entry.dropInfo.trigger).setContains(),
        () => settings.crimsonIsleTrackerOverlay && isInSkyblock() && getWorldName() === CRIMSON_ISLE
    );
});

registerIf(
    register('renderOverlay', () => renderCrimsonIsleTrackerOverlay()),
    () => settings.crimsonIsleTrackerOverlay && isInSkyblock() && getWorldName() === CRIMSON_ISLE
);

register("gameUnload", () => {
    if (settings.crimsonIsleTrackerOverlay && settings.resetCrimsonIsleTrackerOnGameClosed && hasAnyData()) {
        resetCrimsonIsleTracker(true);
    }
});

const buttonsDisplay = createButtonsDisplay(true, () => resetCrimsonIsleTracker(false), false, null);

export function resetCrimsonIsleTracker(isConfirmed) {
    try {
        if (!isConfirmed) {
            new Message(
                new TextComponent(`${GOLD}[FeeshNotifier] ${WHITE}Do you want to reset Crimson Isle tracker? ${RED}${BOLD}[Click to confirm]`)
                    .setClickAction('run_command')
                    .setClickValue('/feeshResetCrimsonIsle noconfirm')
            ).chat();
            return;
        }
    
        persistentData.crimsonIsle = getDefaultObject();
        persistentData.save();

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Crimson Isle tracker was reset.`);    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to reset Crimson Isle tracker.`);
	}
}

export function setRadioactiveVials(count, lastOn) {
    try {
        if (!isInSkyblock()) {
            return;
        }
        
        const errorMessage = initDropCountOnOverlay(persistentData.crimsonIsle.radioactiveVials, count, lastOn);
        if (errorMessage) {
            ChatLib.chat(errorMessage);
            return;
        }

        persistentData.save();
        ChatLib.chat(`${GOLD}[FeeshNotifier] ${GRAY}Successfully changed Radioactive Vials count to ${count} for the Crimson Isle tracker.`);
    } catch (e) {
        console.error(e);
		console.log(`[FeeshNotifier] Failed to set Radioactive Vials.`);
    }
}

function initMissingPersistentData() { // Init data added later and missing for users with previous version
    if (!persistentData.crimsonIsle) return;
    if (!persistentData.crimsonIsle.fieryScuttler) persistentData.crimsonIsle.fieryScuttler = getDefaultSeaCreatureSectionObject();
    if (!persistentData.crimsonIsle.ragnarok) persistentData.crimsonIsle.ragnarok = getDefaultSeaCreatureSectionObject();
    if (!persistentData.crimsonIsle.plhlegblast) persistentData.crimsonIsle.plhlegblast = getDefaultSeaCreatureSectionObject();
}

function getDefaultSeaCreatureSectionObject() {
    return { catchesSinceLast: 0, lastCatchTime: null, catchesHistory: [], averageCatches: 0 };
}

function getDefaultObject() {
    return {
        fieryScuttler: getDefaultSeaCreatureSectionObject(),
        ragnarok: getDefaultSeaCreatureSectionObject(),
        plhlegblast: getDefaultSeaCreatureSectionObject(),
        thunder: getDefaultSeaCreatureSectionObject(),
        lordJawbus: getDefaultSeaCreatureSectionObject(),
        radioactiveVials: { count: 0, lordJawbusCatchesSinceLast: 0, dropsHistory: [] }
    };
}

function hasAnyData() {
    return persistentData.crimsonIsle && (
        persistentData.crimsonIsle.fieryScuttler?.lastCatchTime ||
        persistentData.crimsonIsle.fieryScuttler?.catchesSinceLast ||
        persistentData.crimsonIsle.ragnarok?.lastCatchTime ||
        persistentData.crimsonIsle.ragnarok?.catchesSinceLast ||
        persistentData.crimsonIsle.plhlegblast?.lastCatchTime ||
        persistentData.crimsonIsle.plhlegblast?.catchesSinceLast ||
        persistentData.crimsonIsle.thunder?.lastCatchTime ||
        persistentData.crimsonIsle.thunder?.catchesSinceLast ||
        persistentData.crimsonIsle.lordJawbus?.lastCatchTime ||
        persistentData.crimsonIsle.lordJawbus?.catchesSinceLast ||
        persistentData.crimsonIsle.radioactiveVials?.count
    );
}

function isFishingInHotspot() {
    if (getWorldName() !== CRIMSON_ISLE) return false;

    const lastFishingHookInHotspotSeenAt = getLastFishingHookInHotspotSeenAt();
    return lastFishingHookInHotspotSeenAt && new Date() - lastFishingHookInHotspotSeenAt <= 60 * 1000;
}

function isInPlhlegblastPool() {
    if (getWorldName() !== CRIMSON_ISLE) return false;
    return getZoneName() === PLHLEGBLAST_POOL;
}

function trackFieryScuttlerCatch(seaCreatureInfo) {
    try {
        if (!isInSkyblock() || getWorldName() !== CRIMSON_ISLE || !settings.crimsonIsleTrackerOverlay) {
            return;
        }

        initMissingPersistentData();

        const result = setSeaCreatureStatisticsOnCatch(persistentData.crimsonIsle.fieryScuttler);

        persistentData.crimsonIsle.thunder.catchesSinceLast += 1;
        persistentData.crimsonIsle.lordJawbus.catchesSinceLast += 1;

        if (isFishingInHotspot()) {
            persistentData.crimsonIsle.ragnarok.catchesSinceLast += 1;
        }

        if (isInPlhlegblastPool()) {
            persistentData.crimsonIsle.plhlegblast.catchesSinceLast += 1;
        }

        persistentData.save();

        const message = getCatchesCounterChatMessage(seaCreatureInfo.seaCreature, seaCreatureInfo.rarityColorCode, result.catchesSinceLast, result.lastCatchTime);
        ChatLib.chat(message);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Fiery Scuttler catch.`);
	}
}

function trackRagnarokCatch(seaCreatureInfo) {
    try {
        if (!isInSkyblock() || getWorldName() !== CRIMSON_ISLE || !settings.crimsonIsleTrackerOverlay) {
            return;
        }

        initMissingPersistentData();

        const result = setSeaCreatureStatisticsOnCatch(persistentData.crimsonIsle.ragnarok);

        persistentData.crimsonIsle.thunder.catchesSinceLast += 1;
        persistentData.crimsonIsle.lordJawbus.catchesSinceLast += 1;

        if (isFishingInHotspot()) {
            persistentData.crimsonIsle.fieryScuttler.catchesSinceLast += 1;
        }

        if (isInPlhlegblastPool()) {
            persistentData.crimsonIsle.plhlegblast.catchesSinceLast += 1;
        }

        persistentData.save();

        const message = getCatchesCounterChatMessage(seaCreatureInfo.seaCreature, seaCreatureInfo.rarityColorCode, result.catchesSinceLast, result.lastCatchTime);
        ChatLib.chat(message);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Ragnarok catch.`);
	}
}

function trackPlhlegblastCatch(seaCreatureInfo) {
    try {
        if (!isInSkyblock() || getWorldName() !== CRIMSON_ISLE || !settings.crimsonIsleTrackerOverlay) {
            return;
        }

        initMissingPersistentData();

        const result = setSeaCreatureStatisticsOnCatch(persistentData.crimsonIsle.plhlegblast);

        persistentData.crimsonIsle.thunder.catchesSinceLast += 1;
        persistentData.crimsonIsle.lordJawbus.catchesSinceLast += 1;

        if (isFishingInHotspot()) {
            persistentData.crimsonIsle.fieryScuttler.catchesSinceLast += 1;
            persistentData.crimsonIsle.ragnarok.catchesSinceLast += 1;
        }

        persistentData.save();

        const message = getCatchesCounterChatMessage(seaCreatureInfo.seaCreature, seaCreatureInfo.rarityColorCode, result.catchesSinceLast, result.lastCatchTime);
        ChatLib.chat(message);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Plhlegblast catch.`);
	}
}

function trackThunderCatch(seaCreatureInfo) {
    try {
        if (!isInSkyblock() || getWorldName() !== CRIMSON_ISLE || !settings.crimsonIsleTrackerOverlay) {
            return;
        }

        initMissingPersistentData();

        const result = setSeaCreatureStatisticsOnCatch(persistentData.crimsonIsle.thunder);

        persistentData.crimsonIsle.lordJawbus.catchesSinceLast += 1;

        if (isFishingInHotspot()) {
            persistentData.crimsonIsle.fieryScuttler.catchesSinceLast += 1;
            persistentData.crimsonIsle.ragnarok.catchesSinceLast += 1;    
        }

        if (isInPlhlegblastPool()) {
            persistentData.crimsonIsle.plhlegblast.catchesSinceLast += 1;
        }

        persistentData.save();

        const message = getCatchesCounterChatMessage(seaCreatureInfo.seaCreature, seaCreatureInfo.rarityColorCode, result.catchesSinceLast, result.lastCatchTime);
        ChatLib.chat(message);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Thunder catch.`);
	}
}

function trackLordJawbusCatch(seaCreatureInfo) {
    try {
        if (!isInSkyblock() || getWorldName() !== CRIMSON_ISLE || !settings.crimsonIsleTrackerOverlay) {
            return;
        }

        initMissingPersistentData();

        const result = setSeaCreatureStatisticsOnCatch(persistentData.crimsonIsle.lordJawbus);
        setDropStatisticsOnCatch(persistentData.crimsonIsle.radioactiveVials, 'lordJawbusCatchesSinceLast');

        persistentData.crimsonIsle.thunder.catchesSinceLast += 1;

        if (isFishingInHotspot()) {
            persistentData.crimsonIsle.fieryScuttler.catchesSinceLast += 1;
            persistentData.crimsonIsle.ragnarok.catchesSinceLast += 1;    
        }

        if (isInPlhlegblastPool()) {
            persistentData.crimsonIsle.plhlegblast.catchesSinceLast += 1;
        }

        persistentData.save();

        const message = getCatchesCounterChatMessage(seaCreatureInfo.seaCreature, seaCreatureInfo.rarityColorCode, result.catchesSinceLast, result.lastCatchTime);
        ChatLib.chat(message);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Lord Jawbus catch.`);
	}
}

function trackRegularSeaCreatureCatch() {
    try {
        if (!isInSkyblock() || getWorldName() !== CRIMSON_ISLE || !settings.crimsonIsleTrackerOverlay) {
            return;
        }

        initMissingPersistentData();

        persistentData.crimsonIsle.thunder.catchesSinceLast += 1;
        persistentData.crimsonIsle.lordJawbus.catchesSinceLast += 1;

        if (isFishingInHotspot()) {
            persistentData.crimsonIsle.fieryScuttler.catchesSinceLast += 1;
            persistentData.crimsonIsle.ragnarok.catchesSinceLast += 1;    
        }

        if (isInPlhlegblastPool()) {
            persistentData.crimsonIsle.plhlegblast.catchesSinceLast += 1;
        }

        persistentData.save();

        const catchesSinceLast = persistentData.crimsonIsle.lordJawbus.catchesSinceLast;
        if (catchesSinceLast && catchesSinceLast % 1000 === 0) {
            Client.showTitle('', `${RED}No ${LIGHT_PURPLE}Lord Jawbus ${RED}for ${catchesSinceLast} catches`, 1, 45, 1);
            ChatLib.chat(`${GOLD}[FeeshNotifier] ${RED}${BOLD}Yikes! ${RESET}${RED}No ${LIGHT_PURPLE}Lord Jawbus ${RED}for ${catchesSinceLast} catches...`);

            switch (settings.soundMode) {
                case MEME_SOUND_MODE:
                    new Sound(SAD_TROMBONE_SOUND_SOURCE).play();
                    break;
                case NORMAL_SOUND_MODE:
                    World.playSound('random.orb', 1, 1);
                    break;
                default:
                    break;
            }
        }
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track regular sea creature catch.`);
	}
}

function trackRadioctiveVialDrop(magicFind) {
    try {
        if (!settings.crimsonIsleTrackerOverlay || !isInSkyblock() || getWorldName() !== CRIMSON_ISLE) {
            return;
        }

        const result = setDropStatisticsOnDrop(persistentData.crimsonIsle.radioactiveVials, 'lordJawbusCatchesSinceLast', 'lordJawbusCatches', magicFind);
        persistentData.save();

        const dropNumber = persistentData.crimsonIsle.radioactiveVials.count;
        const message = getDropCatchesCounterChatMessage(`${LIGHT_PURPLE}Radioactive Vial`, 'Lord Jawbus', result.lastDropTime, dropNumber, result.catches);
        ChatLib.chat(message);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Radioactive Vial drop.`);
	}
}

function renderCrimsonIsleTrackerOverlay() {
    if (!settings.crimsonIsleTrackerOverlay ||
        !hasAnyData() ||
        !isInSkyblock() ||
        getWorldName() !== CRIMSON_ISLE ||
        (new Date() - getLastFishingHookSeenAt() > 10 * 60 * 1000) ||
        allOverlaysGui.isOpen()
    ) {
        buttonsDisplay.hide();
        return;
    }

    let overlayText = `${AQUA}${BOLD}Crimson Isle tracker`;
    overlayText += getFieryScuttlerOverlayText();
    overlayText += getRagnarokOverlayText();
    overlayText += getPlhlegblastOverlayText();
    overlayText += getThunderOverlayText();
    overlayText += getLordJawbusOverlayText();
    overlayText += getRadioactiveVialsOverlayText();

    const overlay = new Text(overlayText, overlayCoordsData.crimsonIsleTrackerOverlay.x, overlayCoordsData.crimsonIsleTrackerOverlay.y)
        .setShadow(true)
        .setScale(overlayCoordsData.crimsonIsleTrackerOverlay.scale);
    overlay.draw();

    toggleButtonsDisplay(buttonsDisplay, overlay, overlayCoordsData.crimsonIsleTrackerOverlay);

    function getFieryScuttlerOverlayText() {
        if (!isFishingInHotspot()) return '';

        const overlayText = getSeaCreatureStatisticsOverlayText(`${GOLD}Fiery Scuttler`, persistentData.crimsonIsle.fieryScuttler);
        return '\n' + overlayText;
    }

    function getRagnarokOverlayText() {
        if (!isFishingInHotspot()) return '';

        const overlayText = getSeaCreatureStatisticsOverlayText(`${LIGHT_PURPLE}Ragnarok`, persistentData.crimsonIsle.ragnarok);
        return '\n' + overlayText;
    }

    function getPlhlegblastOverlayText() {
        if (!isInPlhlegblastPool()) return '';

        const overlayText = getSeaCreatureStatisticsOverlayText(`${LIGHT_PURPLE}Plhlegblast`, persistentData.crimsonIsle.plhlegblast);
        return '\n' + overlayText;
    }

    function getThunderOverlayText() {
        const overlayText = getSeaCreatureStatisticsOverlayText(`${LIGHT_PURPLE}Thunder`, persistentData.crimsonIsle.thunder);
        return '\n' + overlayText;
    }

    function getLordJawbusOverlayText() {
        const overlayText = getSeaCreatureStatisticsOverlayText(`${LIGHT_PURPLE}Lord Jawbus`, persistentData.crimsonIsle.lordJawbus);
        return '\n' + overlayText;
    }

    function getRadioactiveVialsOverlayText() {
        const overlayText = getDropStatisticsOverlayText(`${LIGHT_PURPLE}Radioactive Vial`, 'Jawbus', persistentData.crimsonIsle.radioactiveVials, 'lordJawbusCatchesSinceLast');
        return '\n' + overlayText;
    }
}
