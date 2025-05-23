import settings, { allOverlaysGui } from "../../settings";
import * as triggers from '../../constants/triggers';
import * as seaCreatures from '../../constants/seaCreatures';
import { persistentData } from "../../data/data";
import { overlayCoordsData } from "../../data/overlayCoords";
import { BOLD, GOLD, LIGHT_PURPLE, RED, WHITE, GRAY, DARK_GRAY, RESET, AQUA } from "../../constants/formatting";
import { getLastFishingHookSeenAt, getWorldName, isInSkyblock } from "../../utils/playerState";
import { formatDate, formatNumberWithSpaces, formatTimeElapsedBetweenDates, isDoubleHook } from "../../utils/common";
import { CRIMSON_ISLE } from "../../constants/areas";
import { MEME_SOUND_MODE, NORMAL_SOUND_MODE, SAD_TROMBONE_SOUND_SOURCE } from "../../constants/sounds";
import { createButtonsDisplay, toggleButtonsDisplay } from "../../utils/overlays";
import { registerIf } from "../../utils/registers";

const isInHotspot = true; // TODO

triggers.REGULAR_CRIMSON_CATCH_TRIGGERS.forEach(entry => {
    registerIf(
        register("Chat", (event) => trackRegularSeaCreatureCatch()).setCriteria(entry.trigger).setContains(),
        () => settings.crimsonIsleTrackerOverlay && isInSkyblock() && getWorldName() === CRIMSON_ISLE
    );
});

const fieryScuttlerTrigger = triggers.RARE_CATCH_TRIGGERS.find(entry => entry.seaCreature === seaCreatures.FIERY_SCUTTLER);
registerIf(
    register("Chat", (event) => trackFieryScuttlerCatch()).setCriteria(fieryScuttlerTrigger.trigger).setContains(),
    () => settings.crimsonIsleTrackerOverlay && isInSkyblock() && getWorldName() === CRIMSON_ISLE
);

const ragnarokTrigger = triggers.RARE_CATCH_TRIGGERS.find(entry => entry.seaCreature === seaCreatures.RAGNAROK);
registerIf(
    register("Chat", (event) => trackRagnarokCatch()).setCriteria(ragnarokTrigger.trigger).setContains(),
    () => settings.crimsonIsleTrackerOverlay && isInSkyblock() && getWorldName() === CRIMSON_ISLE
);

const thunderTrigger = triggers.RARE_CATCH_TRIGGERS.find(entry => entry.seaCreature === seaCreatures.THUNDER);
registerIf(
    register("Chat", (event) => trackThunderCatch()).setCriteria(thunderTrigger.trigger).setContains(),
    () => settings.crimsonIsleTrackerOverlay && isInSkyblock() && getWorldName() === CRIMSON_ISLE
);

const lordJawbusTrigger = triggers.RARE_CATCH_TRIGGERS.find(entry => entry.seaCreature === seaCreatures.LORD_JAWBUS);
registerIf(
    register("Chat", (event) => trackLordJawbusCatch()).setCriteria(lordJawbusTrigger.trigger).setContains(),
    () => settings.crimsonIsleTrackerOverlay && isInSkyblock() && getWorldName() === CRIMSON_ISLE
);

const radioactiveVialTrigger = triggers.RARE_DROP_TRIGGERS.find(entry => entry.trigger === triggers.RADIOACTIVE_VIAL_MESSAGE);
registerIf(
    register("Chat", (magicFind, event) => trackRadioctiveVialDrop()).setCriteria(radioactiveVialTrigger.trigger).setContains(),
    () => settings.crimsonIsleTrackerOverlay && isInSkyblock() && getWorldName() === CRIMSON_ISLE
);

registerIf(
    register('renderOverlay', () => renderCrimsonIsleTrackerOverlay()),
    () => settings.crimsonIsleTrackerOverlay && isInSkyblock() && getWorldName() === CRIMSON_ISLE
);

register("gameUnload", () => {
    if (settings.crimsonIsleTrackerOverlay && settings.resetCrimsonIsleTrackerOnGameClosed && persistentData.crimsonIsle && (
        persistentData.crimsonIsle.fieryScuttler?.lastCatchTime ||
        persistentData.crimsonIsle.fieryScuttler?.catchesSinceLast ||
        persistentData.crimsonIsle.ragnarok?.lastCatchTime ||
        persistentData.crimsonIsle.ragnarok?.catchesSinceLast ||
        persistentData.crimsonIsle.thunder?.lastCatchTime ||
        persistentData.crimsonIsle.thunder?.catchesSinceLast ||
        persistentData.crimsonIsle.lordJawbus?.lastCatchTime ||
        persistentData.crimsonIsle.lordJawbus?.catchesSinceLast ||
        persistentData.crimsonIsle.radioactiveVials.count
    )) {
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
        
        if (typeof count !== 'number' || count < 0 || !Number.isInteger(count)) {
            ChatLib.chat(`${GOLD}[FeeshNotifier] ${RED}Please specify correct Radioactive Vials count.`);
            return;
        }
        persistentData.crimsonIsle.radioactiveVials.count = count;

        if (lastOn) {
            if (!isIsoDate(lastOn)) {
                ChatLib.chat(`${GOLD}[FeeshNotifier] ${RED}Please specify correct Last On UTC date in format YYYY-MM-DDThh:mm:ssZ, e.g. 2024-03-18T14:05:00Z`);
                return;
            }

            const dropsHistory = (persistentData.crimsonIsle.radioactiveVials.dropsHistory || []);
            const dateIso = new Date(lastOn);
            if (dropsHistory.length) {
                dropsHistory[0].time = dateIso;
            } else {
                dropsHistory.unshift({
                    time: dateIso,
                });
            }
        }

        persistentData.save();

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${GRAY}Successfully changed Radioactive Vials count to ${count} for the Crimson Isle tracker.`);   
    } catch (e) {
        console.error(e);
		console.log(`[FeeshNotifier] Failed to set Radioactive Vials.`);
    }

    function isIsoDate(dateString) {
        if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/.test(dateString)) return false;
        const d = new Date(dateString); 
        return d instanceof Date && !isNaN(d.getTime());
    }
}

function initMissingPersistentData() { // Init data added later and missing for users with previous version
    if (!persistentData.crimsonIsle) return;
    if (!persistentData.crimsonIsle.fieryScuttler) persistentData.crimsonIsle.fieryScuttler = getDefaultSeaCreatureSectionObject();
    if (!persistentData.crimsonIsle.ragnarok) persistentData.crimsonIsle.ragnarok = getDefaultSeaCreatureSectionObject();
}

function getDefaultSeaCreatureSectionObject() {
    return { catchesSinceLast: 0, lastCatchTime: null, catchesHistory: [], averageCatches: 0 };
}

function getDefaultObject() {
    return {
        fieryScuttler: getDefaultSeaCreatureSectionObject(),
        ragnarok: getDefaultSeaCreatureSectionObject(),
        thunder: getDefaultSeaCreatureSectionObject(),
        lordJawbus: getDefaultSeaCreatureSectionObject(),
        radioactiveVials: { count: 0, lordJawbusCatchesSinceLast: 0, dropsHistory: [] }
    };
}

function trackFieryScuttlerCatch() {
    try {
        if (!isInSkyblock() || getWorldName() !== CRIMSON_ISLE || !settings.crimsonIsleTrackerOverlay) {
            return;
        }

        initMissingPersistentData();

        const catchesSinceLast = persistentData.crimsonIsle.fieryScuttler.catchesSinceLast + 1;
        const lastCatchTime = persistentData.crimsonIsle.fieryScuttler.lastCatchTime;
        const elapsedTime = lastCatchTime ? ` ${GRAY}(${WHITE}${formatTimeElapsedBetweenDates(new Date(lastCatchTime))}${GRAY})` : '';

        let catchesHistory = persistentData.crimsonIsle.fieryScuttler.catchesHistory || [];
        catchesHistory.unshift(catchesSinceLast); // Most recent counts at the start of array
        catchesHistory.length = Math.min(catchesHistory.length, 100); // Store last 100
        persistentData.crimsonIsle.fieryScuttler.catchesHistory = catchesHistory;

        const sumCatches = catchesHistory.reduce(function(a, b) { return a + b; }, 0);
        persistentData.crimsonIsle.fieryScuttler.averageCatches = catchesHistory.length ? Math.round(sumCatches / catchesHistory.length) : 0;

        persistentData.crimsonIsle.fieryScuttler.catchesSinceLast = 0;
        persistentData.crimsonIsle.fieryScuttler.lastCatchTime = new Date();

        persistentData.crimsonIsle.thunder.catchesSinceLast += 1;
        persistentData.crimsonIsle.lordJawbus.catchesSinceLast += 1;

        if (isInHotspot) {
            persistentData.crimsonIsle.ragnarok.catchesSinceLast += 1;
        }

        persistentData.save();

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${GRAY}It took ${WHITE}${catchesSinceLast} ${GRAY}${catchesSinceLast === 1 ? 'catch' : 'catches'}${elapsedTime} to get the ${GOLD}Fiery Scuttler${GRAY}.`);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Fiery Scuttler catch.`);
	}
}

function trackRagnarokCatch() {
    try {
        if (!isInSkyblock() || getWorldName() !== CRIMSON_ISLE || !settings.crimsonIsleTrackerOverlay) {
            return;
        }

        initMissingPersistentData();

        const catchesSinceLast = persistentData.crimsonIsle.ragnarok.catchesSinceLast + 1;
        const lastCatchTime = persistentData.crimsonIsle.ragnarok.lastCatchTime;
        const elapsedTime = lastCatchTime ? ` ${GRAY}(${WHITE}${formatTimeElapsedBetweenDates(new Date(lastCatchTime))}${GRAY})` : '';

        let catchesHistory = persistentData.crimsonIsle.ragnarok.catchesHistory || [];
        catchesHistory.unshift(catchesSinceLast); // Most recent counts at the start of array
        catchesHistory.length = Math.min(catchesHistory.length, 100); // Store last 100
        persistentData.crimsonIsle.ragnarok.catchesHistory = catchesHistory;

        const sumCatches = catchesHistory.reduce(function(a, b) { return a + b; }, 0);
        persistentData.crimsonIsle.ragnarok.averageCatches = catchesHistory.length ? Math.round(sumCatches / catchesHistory.length) : 0;

        persistentData.crimsonIsle.ragnarok.catchesSinceLast = 0;
        persistentData.crimsonIsle.ragnarok.lastCatchTime = new Date();

        persistentData.crimsonIsle.thunder.catchesSinceLast += 1;
        persistentData.crimsonIsle.lordJawbus.catchesSinceLast += 1;

        if (isInHotspot) {
            persistentData.crimsonIsle.fieryScuttler.catchesSinceLast += 1;
        }

        persistentData.save();

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${GRAY}It took ${WHITE}${catchesSinceLast} ${GRAY}${catchesSinceLast === 1 ? 'catch' : 'catches'}${elapsedTime} to get the ${LIGHT_PURPLE}Ragnarok${GRAY}.`);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Ragnarok catch.`);
	}
}

function trackThunderCatch() {
    try {
        if (!isInSkyblock() || getWorldName() !== CRIMSON_ISLE || !settings.crimsonIsleTrackerOverlay) {
            return;
        }

        initMissingPersistentData();

        const catchesSinceLast = persistentData.crimsonIsle.thunder.catchesSinceLast + 1;
        const lastCatchTime = persistentData.crimsonIsle.thunder.lastCatchTime || null;
        const elapsedTime = lastCatchTime ? ` ${GRAY}(${WHITE}${formatTimeElapsedBetweenDates(new Date(lastCatchTime))}${GRAY})` : '';

        let catchesHistory = persistentData.crimsonIsle.thunder.catchesHistory || [];
        catchesHistory.unshift(catchesSinceLast); // Most recent counts at the start of array
        catchesHistory.length = Math.min(catchesHistory.length, 100); // Store last 100
        persistentData.crimsonIsle.thunder.catchesHistory = catchesHistory;

        const sumCatches = catchesHistory.reduce(function(a, b) { return a + b; }, 0);
        persistentData.crimsonIsle.thunder.averageCatches = catchesHistory.length ? Math.round(sumCatches / catchesHistory.length) : 0;

        persistentData.crimsonIsle.thunder.catchesSinceLast = 0;
        persistentData.crimsonIsle.thunder.lastCatchTime = new Date();

        persistentData.crimsonIsle.lordJawbus.catchesSinceLast += 1;

        if (isInHotspot) {
            persistentData.crimsonIsle.fieryScuttler.catchesSinceLast += 1;
            persistentData.crimsonIsle.ragnarok.catchesSinceLast += 1;    
        }

        persistentData.save();

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${GRAY}It took ${WHITE}${catchesSinceLast} ${GRAY}${catchesSinceLast === 1 ? 'catch' : 'catches'}${elapsedTime} to get the ${LIGHT_PURPLE}Thunder${GRAY}.`);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Thunder catch.`);
	}
}

function trackLordJawbusCatch() {
    try {
        if (!isInSkyblock() || getWorldName() !== CRIMSON_ISLE || !settings.crimsonIsleTrackerOverlay) {
            return;
        }

        initMissingPersistentData();

        const catchesSinceLast = persistentData.crimsonIsle.lordJawbus.catchesSinceLast + 1;
        const lastCatchTime = persistentData.crimsonIsle.lordJawbus.lastCatchTime;
        const elapsedTime = lastCatchTime ? ` ${GRAY}(${WHITE}${formatTimeElapsedBetweenDates(new Date(lastCatchTime))}${GRAY})` : '';

        let catchesHistory = persistentData.crimsonIsle.lordJawbus.catchesHistory || [];
        catchesHistory.unshift(catchesSinceLast); // Most recent counts at the start of array
        catchesHistory.length = Math.min(catchesHistory.length, 100); // Store last 100
        persistentData.crimsonIsle.lordJawbus.catchesHistory = catchesHistory;

        const sumCatches = catchesHistory.reduce(function(a, b) { return a + b; }, 0);
        persistentData.crimsonIsle.lordJawbus.averageCatches = catchesHistory.length ? Math.round(sumCatches / catchesHistory.length) : 0;

        persistentData.crimsonIsle.lordJawbus.catchesSinceLast = 0;
        persistentData.crimsonIsle.lordJawbus.lastCatchTime = new Date();

        persistentData.crimsonIsle.thunder.catchesSinceLast += 1;

        if (isInHotspot) {
            persistentData.crimsonIsle.fieryScuttler.catchesSinceLast += 1;
            persistentData.crimsonIsle.ragnarok.catchesSinceLast += 1;    
        }

        const isDoubleHooked = isDoubleHook();
        const valueToAdd = isDoubleHooked ? 2 : 1;
        let lordJawbusCatchesSinceLast = persistentData.crimsonIsle.radioactiveVials.lordJawbusCatchesSinceLast || 0;
        lordJawbusCatchesSinceLast += valueToAdd;
        persistentData.crimsonIsle.radioactiveVials.lordJawbusCatchesSinceLast = lordJawbusCatchesSinceLast;

        persistentData.save();

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${GRAY}It took ${WHITE}${catchesSinceLast} ${GRAY}${catchesSinceLast === 1 ? 'catch' : 'catches'}${elapsedTime} to get the ${LIGHT_PURPLE}Lord Jawbus${GRAY}.`);
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

        if (isInHotspot) {
            persistentData.crimsonIsle.fieryScuttler.catchesSinceLast += 1;
            persistentData.crimsonIsle.ragnarok.catchesSinceLast += 1;    
        }

        persistentData.save();

        if (persistentData.crimsonIsle.lordJawbus.catchesSinceLast && persistentData.crimsonIsle.lordJawbus.catchesSinceLast % 1000 === 0) {
            Client.showTitle('', `${RED}No ${LIGHT_PURPLE}Lord Jawbus ${RED}for ${persistentData.crimsonIsle.lordJawbus.catchesSinceLast} catches`, 1, 45, 1);
            ChatLib.chat(`${GOLD}[FeeshNotifier] ${RED}${BOLD}Yikes! ${RESET}${RED}No ${LIGHT_PURPLE}Lord Jawbus ${RED}for ${persistentData.crimsonIsle.lordJawbus.catchesSinceLast} catches...`);

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

function trackRadioctiveVialDrop() {
    try {
        if (!settings.crimsonIsleTrackerOverlay || !isInSkyblock() || getWorldName() !== CRIMSON_ISLE) {
            return;
        }

        const lordJawbusCatches = persistentData.crimsonIsle.radioactiveVials.lordJawbusCatchesSinceLast || 0;

        persistentData.crimsonIsle.radioactiveVials.count += 1;
        persistentData.crimsonIsle.radioactiveVials.lordJawbusCatchesSinceLast = 0;

        let vialDropsHistory = persistentData.crimsonIsle.radioactiveVials.dropsHistory || [];
        const lastDropTime = vialDropsHistory.length && vialDropsHistory[0].time ? vialDropsHistory[0].time : null;
        const elapsedTime = lastDropTime ? ` ${GRAY}(${WHITE}${formatTimeElapsedBetweenDates(new Date(lastDropTime))}${GRAY})` : '';

        vialDropsHistory.unshift({
            time: new Date(),
            lordJawbusCatches: lordJawbusCatches
        });
        persistentData.crimsonIsle.radioactiveVials.dropsHistory = vialDropsHistory;

        persistentData.save();

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${GRAY}It took ${WHITE}${lordJawbusCatches} ${GRAY}${lordJawbusCatches === 1 ? 'Lord Jawbus catch' : 'Lord Jawbus catches'}${elapsedTime} to get the ${LIGHT_PURPLE}Radioactive Vial ${WHITE}#${persistentData.crimsonIsle.radioactiveVials.count}${GRAY}. Congratulations!`);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Radioactive Vial drop.`);
	}
}

function renderCrimsonIsleTrackerOverlay() {
    if (!settings.crimsonIsleTrackerOverlay ||
        !persistentData.crimsonIsle ||
        (
            !persistentData.crimsonIsle.fieryScuttler?.lastCatchTime &&
            !persistentData.crimsonIsle.fieryScuttler?.catchesSinceLast &&
            !persistentData.crimsonIsle.ragnarok?.lastCatchTime &&
            !persistentData.crimsonIsle.ragnarok?.catchesSinceLast &&
            !persistentData.crimsonIsle.thunder?.lastCatchTime &&
            !persistentData.crimsonIsle.thunder?.catchesSinceLast &&
            !persistentData.crimsonIsle.lordJawbus?.lastCatchTime &&
            !persistentData.crimsonIsle.lordJawbus?.catchesSinceLast &&
            !persistentData.crimsonIsle.radioactiveVials.count
        ) ||
        !isInSkyblock() ||
        getWorldName() !== CRIMSON_ISLE ||
        (new Date() - getLastFishingHookSeenAt() > 10 * 60 * 1000) ||
        allOverlaysGui.isOpen()
    ) {
        buttonsDisplay.hide();
        return;
    }

    let overlayText = `${AQUA}${BOLD}Crimson Isle tracker\n`;
    overlayText += getFieryScuttlerOverlayText();
    overlayText += getRagnarokOverlayText();
    overlayText += getThunderOverlayText();
    overlayText += getLordJawbusOverlayText();

    const lastTimeVial = persistentData.crimsonIsle.radioactiveVials.dropsHistory.length
        ? `${WHITE}${formatTimeElapsedBetweenDates(new Date(persistentData.crimsonIsle.radioactiveVials.dropsHistory[0].time))} ${GRAY}(${WHITE}${formatDate(new Date(persistentData.crimsonIsle.radioactiveVials.dropsHistory[0].time))}${GRAY})` 
        : `${WHITE}N/A`;
    const lordJawbusCatchesSinceLastVial = persistentData.crimsonIsle.radioactiveVials.lordJawbusCatchesSinceLast || 0;

    overlayText += `${LIGHT_PURPLE}Radioactive Vials: ${WHITE}${formatNumberWithSpaces(persistentData.crimsonIsle.radioactiveVials.count)}\n`;
    overlayText += `${GRAY}Last on: ${lastTimeVial}\n`;
    overlayText += `${GRAY}Last on: ${WHITE}${formatNumberWithSpaces(lordJawbusCatchesSinceLastVial)} ${GRAY}${lordJawbusCatchesSinceLastVial !== 1 ? 'Jawbuses' : 'Jawbus'} ago`;

    const overlay = new Text(overlayText, overlayCoordsData.crimsonIsleTrackerOverlay.x, overlayCoordsData.crimsonIsleTrackerOverlay.y)
        .setShadow(true)
        .setScale(overlayCoordsData.crimsonIsleTrackerOverlay.scale);
    overlay.draw();

    toggleButtonsDisplay(buttonsDisplay, overlay, overlayCoordsData.crimsonIsleTrackerOverlay);

    function getFieryScuttlerOverlayText() {
        if (!isInHotspot) return '';

        let overlayText = '';
        const obj = persistentData.crimsonIsle.fieryScuttler;
        overlayText += `${GOLD}Fiery Scuttler: ${getCatchesSinceLastOverlayText(obj)} ${getAverageCatchesOverlayText(obj)}\n`;
        overlayText += `${getLastCatchTimeOverlayText(obj)}\n`;

        return overlayText;
    }

    function getRagnarokOverlayText() {
        if (!isInHotspot) return '';

        let overlayText = '';
        const obj = persistentData.crimsonIsle.ragnarok;
        overlayText += `${LIGHT_PURPLE}Ragnarok: ${getCatchesSinceLastOverlayText(obj)} ${getAverageCatchesOverlayText(obj)}\n`;
        overlayText += `${getLastCatchTimeOverlayText(obj)}\n`;

        return overlayText;
    }

    function getThunderOverlayText() {
        if (!isInHotspot) return '';

        let overlayText = '';
        const obj = persistentData.crimsonIsle.thunder;
        overlayText += `${LIGHT_PURPLE}Thunder: ${getCatchesSinceLastOverlayText(obj)} ${getAverageCatchesOverlayText(obj)}\n`;
        overlayText += `${getLastCatchTimeOverlayText(obj)}\n`;

        return overlayText;
    }

    function getLordJawbusOverlayText() {
        if (!isInHotspot) return '';

        let overlayText = '';
        const obj = persistentData.crimsonIsle.lordJawbus;
        overlayText += `${LIGHT_PURPLE}Lord Jawbus: ${getCatchesSinceLastOverlayText(obj)} ${getAverageCatchesOverlayText(obj)}\n`;
        overlayText += `${getLastCatchTimeOverlayText(obj)}\n`;

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
