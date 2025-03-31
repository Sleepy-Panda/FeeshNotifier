import settings, { allOverlaysGui } from "../../settings";
import * as triggers from '../../constants/triggers';
import * as seaCreatures from '../../constants/seaCreatures';
import { persistentData } from "../../data/data";
import { overlayCoordsData } from "../../data/overlayCoords";
import { BOLD, GOLD, RED, WHITE, UNDERLINE, GRAY, DARK_GRAY, LIGHT_PURPLE, GREEN, LEGENDARY, DARK_GREEN } from "../../constants/formatting";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";
import { formatDate, formatNumberWithSpaces, formatTimeElapsedBetweenDates, isInChatOrInventoryGui } from "../../utils/common";
import { BACKWATER_BAYOU, WATER_HOTSPOT_WORLDS } from "../../constants/areas";
import { registerIf } from "../../utils/registers";

// Move all SAMPLE
// Commands to set masks and sheds
// WATER_HOTSPOT_WORLDS.includes(getWorldName())

triggers.REGULAR_BACKWATER_BAYOU_CATCH_TRIGGERS.forEach(entry => {
    registerIf(
        register("Chat", (event) => trackRegularBackwaterBayouSeaCreatureCatch()).setCriteria(entry.trigger).setContains(),
        () => settings.backwaterBayouTrackerOverlay && isInSkyblock() && getWorldName() === BACKWATER_BAYOU
    );
});

const wikiTikiTrigger = triggers.RARE_CATCH_TRIGGERS.find(entry => entry.seaCreature === seaCreatures.WIKI_TIKI);
registerIf(
    register("Chat", (event) => trackWikiTikiCatch()).setCriteria(wikiTikiTrigger.trigger).setContains(),
    () => settings.backwaterBayouTrackerOverlay && isInSkyblock() && getWorldName() === BACKWATER_BAYOU
);

const titanoboaTrigger = triggers.RARE_CATCH_TRIGGERS.find(entry => entry.seaCreature === seaCreatures.TITANOBOA);
registerIf(
    register("Chat", (event) => trackTitanoboaCatch()).setCriteria(titanoboaTrigger.trigger).setContains(),
    () => settings.backwaterBayouTrackerOverlay && isInSkyblock() && getWorldName() === BACKWATER_BAYOU
);

const tikiMaskTrigger = triggers.RARE_DROP_TRIGGERS.find(entry => entry.trigger === triggers.TIKI_MASK_MESSAGE);
registerIf(
    register("Chat", (magicFind, event) => trackTikiMaskDrop()).setCriteria(tikiMaskTrigger.trigger).setContains(),
    () => settings.backwaterBayouTrackerOverlay && isInSkyblock() && WATER_HOTSPOT_WORLDS.includes(getWorldName())
);

const titanoboaShedTrigger = triggers.RARE_DROP_TRIGGERS.find(entry => entry.trigger === triggers.TITANOBOA_SHED_MESSAGE);
registerIf(
    register("Chat", (magicFind, event) => trackTitanoboaShedDrop()).setCriteria(titanoboaShedTrigger.trigger).setContains(),
    () => settings.backwaterBayouTrackerOverlay && isInSkyblock() && getWorldName() === BACKWATER_BAYOU
);

registerIf(
    register('renderOverlay', () => renderBackwaterBayouOverlay()),
    () => settings.backwaterBayouTrackerOverlay && isInSkyblock() && getWorldName() === BACKWATER_BAYOU
);

register("gameUnload", () => {
    if (settings.backwaterBayouTrackerOverlay && settings.resetBackwaterBayouTrackerOnGameClosed && persistentData.backwaterBayou && (
        persistentData.backwaterBayou.wikiTiki.lastCatchTime ||
        persistentData.backwaterBayou.titanoboa.lastCatchTime ||
        persistentData.backwaterBayou.wikiTiki.catchesSinceLast ||
        persistentData.backwaterBayou.titanoboa.catchesSinceLast ||
        persistentData.backwaterBayou.tikiMasks.count ||
        persistentData.backwaterBayou.titanoboaSheds.count
    )) {
        resetBackwaterBayouTracker(true);
    }
});

// DisplayLine is initialized once in order to avoid multiple method calls on click.
let resetTrackerDisplay = new Display().hide();
let resetTrackerDisplayLine = new DisplayLine(`${RED}[Click to reset]`).setShadow(true);
resetTrackerDisplayLine.registerClicked((x, y, mouseButton, buttonState) => {
    if (mouseButton === 0 && buttonState === false) { // When left mouse button is UP. 0 is left mouse button, false is UP, true is DOWN. 
        resetBackwaterBayouTracker(false);
    }
});
resetTrackerDisplayLine.registerHovered(() => resetTrackerDisplayLine.setText(`${RED}${UNDERLINE}[Click to reset]`).setShadow(true));
resetTrackerDisplayLine.registerMouseLeave(() => resetTrackerDisplayLine.setText(`${RED}[Click to reset]`).setShadow(true));
resetTrackerDisplay.addLine(resetTrackerDisplayLine);

export function resetBackwaterBayouTracker(isConfirmed) {
    try {
        if (!isConfirmed) {
            new Message(
                new TextComponent(`${GOLD}[FeeshNotifier] ${WHITE}Do you want to reset Backwater Bayou tracker? ${RED}${BOLD}[Click to confirm]`)
                    .setClickAction('run_command')
                    .setClickValue('/feeshResetBackwaterBayou noconfirm')
            ).chat();
            return;
        }
    
        persistentData.backwaterBayou = {
            wikiTiki: { catchesSinceLast: 0, lastCatchTime: null, catchesHistory: [], averageCatches: 0 },
            titanoboa: { catchesSinceLast: 0, lastCatchTime: null, catchesHistory: [], averageCatches: 0 },
            tikiMasks: { count: 0, wikiTikiCatchesSinceLast: 0, dropsHistory: [] },
            titanoboaSheds: { count: 0, titanoboaCatchesSinceLast: 0, dropsHistory: [] },
        };
        persistentData.save();

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Backwater Bayou tracker was reset.`);    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to reset Backwater Bayou tracker.`);
	}
}

function trackWikiTikiCatch() {
    try {
        if (!settings.backwaterBayouTrackerOverlay || !isInSkyblock() || getWorldName() !== BACKWATER_BAYOU) {
            return;
        }

        const catchesSinceLast = persistentData.backwaterBayou.wikiTiki.catchesSinceLast;
        const lastCatchTime = persistentData.backwaterBayou.wikiTiki.lastCatchTime;
        const elapsedTime = lastCatchTime ? ` ${GRAY}(${WHITE}${formatTimeElapsedBetweenDates(new Date(lastCatchTime))}${GRAY})` : '';

        let catchesHistory = persistentData.backwaterBayou.wikiTiki.catchesHistory || [];
        catchesHistory.unshift(catchesSinceLast);
        catchesHistory.length = Math.min(catchesHistory.length, 100);
        persistentData.backwaterBayou.wikiTiki.catchesHistory = catchesHistory;

        const sumCatches = catchesHistory.reduce(function(a, b) { return a + b; }, 0);
        persistentData.backwaterBayou.wikiTiki.averageCatches = catchesHistory.length ? Math.round(sumCatches / catchesHistory.length) : 0;

        persistentData.backwaterBayou.wikiTiki.catchesSinceLast = 0;
        persistentData.backwaterBayou.wikiTiki.lastCatchTime = new Date();

        persistentData.backwaterBayou.titanoboa.catchesSinceLast += 1;

        persistentData.save();

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${GRAY}It took ${WHITE}${catchesSinceLast} ${GRAY}${catchesSinceLast === 1 ? 'catch' : 'catches'}${elapsedTime} to get the ${LIGHT_PURPLE}Wiki Tiki${GRAY}.`);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Wiki Tiki catch.`);
	}
}

function trackTitanoboaCatch() {
    try {
        if (!settings.backwaterBayouTrackerOverlay || !isInSkyblock() || getWorldName() !== BACKWATER_BAYOU) {
            return;
        }

        const catchesSinceLast = persistentData.backwaterBayou.titanoboa.catchesSinceLast;
        const lastCatchTime = persistentData.backwaterBayou.titanoboa.lastCatchTime;
        const elapsedTime = lastCatchTime ? ` ${GRAY}(${WHITE}${formatTimeElapsedBetweenDates(new Date(lastCatchTime))}${GRAY})` : '';

        let catchesHistory = persistentData.backwaterBayou.titanoboa.catchesHistory || [];
        catchesHistory.unshift(catchesSinceLast);
        catchesHistory.length = Math.min(catchesHistory.length, 100);
        persistentData.backwaterBayou.titanoboa.catchesHistory = catchesHistory;

        const sumCatches = catchesHistory.reduce(function(a, b) { return a + b; }, 0);
        persistentData.backwaterBayou.titanoboa.averageCatches = catchesHistory.length ? Math.round(sumCatches / catchesHistory.length) : 0;

        persistentData.backwaterBayou.titanoboa.catchesSinceLast = 0;
        persistentData.backwaterBayou.titanoboa.lastCatchTime = new Date();

        persistentData.backwaterBayou.wikiTiki.catchesSinceLast += 1;

        persistentData.save();

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${GRAY}It took ${WHITE}${catchesSinceLast} ${GRAY}${catchesSinceLast === 1 ? 'catch' : 'catches'}${elapsedTime} to get the ${LIGHT_PURPLE}Titanoboa${GRAY}.`);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Titanoboa catch.`);
	}
}

function trackRegularBackwaterBayouSeaCreatureCatch() {
    try {
        if (!settings.backwaterBayouTrackerOverlay || !isInSkyblock() || getWorldName() !== BACKWATER_BAYOU) {
            return;
        }

        persistentData.backwaterBayou.wikiTiki.catchesSinceLast += 1;
        persistentData.backwaterBayou.titanoboa.catchesSinceLast += 1;
        persistentData.save();
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track regular Backwater Bayou sea creature catch.`);
	}
}

function trackTikiMaskDrop() {
    try {
        if (!settings.backwaterBayouTrackerOverlay || !isInSkyblock() || !WATER_HOTSPOT_WORLDS.includes(getWorldName())) {
            return;
        }

        const catches = persistentData.backwaterBayou.tikiMasks.wikiTikiCatchesSinceLast || 0;

        persistentData.backwaterBayou.tikiMasks.count += 1;
        persistentData.backwaterBayou.tikiMasks.wikiTikiCatchesSinceLast = 0;

        let dropsHistory = persistentData.backwaterBayou.tikiMasks.dropsHistory || [];
        const lastDropTime = dropsHistory.length && dropsHistory[0].time ? dropsHistory[0].time : null;
        const elapsedTime = lastDropTime ? ` ${GRAY}(${WHITE}${formatTimeElapsedBetweenDates(new Date(lastDropTime))}${GRAY})` : '';

        dropsHistory.unshift({
            time: new Date(),
            wikiTikiCatches: catches
        });
        persistentData.backwaterBayou.tikiMasks.dropsHistory = dropsHistory;

        persistentData.save();

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${GRAY}It took ${WHITE}${catches} ${GRAY}${catches === 1 ? 'Wiki Tiki catch' : 'Wiki Tiki catches'}${elapsedTime} to get the ${LEGENDARY}Tiki Mask ${WHITE}#${persistentData.backwaterBayou.tikiMasks.count}${GRAY}. Congratulations!`);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Tiki Mask drop.`);
	}
}

function trackTitanoboaShedDrop() {
    try {
        if (!settings.backwaterBayouTrackerOverlay || !isInSkyblock() || getWorldName() !== BACKWATER_BAYOU) {
            return;
        }

        const catches = persistentData.backwaterBayou.titanoboaSheds.titanoboaCatchesSinceLast || 0;

        persistentData.backwaterBayou.titanoboaSheds.count += 1;
        persistentData.backwaterBayou.titanoboaSheds.titanoboaCatchesSinceLast = 0;

        let dropsHistory = persistentData.backwaterBayou.titanoboaSheds.dropsHistory || [];
        const lastDropTime = dropsHistory.length && dropsHistory[0].time ? dropsHistory[0].time : null;
        const elapsedTime = lastDropTime ? ` ${GRAY}(${WHITE}${formatTimeElapsedBetweenDates(new Date(lastDropTime))}${GRAY})` : '';

        dropsHistory.unshift({
            time: new Date(),
            titanoboaCatches: catches
        });
        persistentData.backwaterBayou.titanoboaSheds.dropsHistory = dropsHistory;

        persistentData.save();

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${GRAY}It took ${WHITE}${catches} ${GRAY}${catches === 1 ? 'Titanoboa catch' : 'Titanoboa catches'}${elapsedTime} to get the ${LEGENDARY}Titanoboa Shed ${WHITE}#${persistentData.backwaterBayou.titanoboaSheds.count}${GRAY}. Congratulations!`);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Titanoboa Shed drop.`);
	}
}

function renderBackwaterBayouOverlay() {
    if (!settings.backwaterBayouTrackerOverlay ||
        !persistentData.backwaterBayou ||
        (
            !persistentData.backwaterBayou.wikiTiki.lastCatchTime &&
            !persistentData.backwaterBayou.titanoboa.lastCatchTime &&
            !persistentData.backwaterBayou.wikiTiki.catchesSinceLast &&
            !persistentData.backwaterBayou.titanoboa.catchesSinceLast &&
            !persistentData.backwaterBayou.tikiMasks.count &&
            !persistentData.backwaterBayou.titanoboaSheds.count
        ) ||
        !isInSkyblock() ||
        getWorldName() !== BACKWATER_BAYOU ||
        !hasFishingRodInHotbar() ||
        allOverlaysGui.isOpen()
    ) {
        resetTrackerDisplay.hide();
        return;
    }

    const lastCatchTimeWikiTiki = persistentData.backwaterBayou.wikiTiki.lastCatchTime
        ? `${WHITE}${formatTimeElapsedBetweenDates(new Date(persistentData.backwaterBayou.wikiTiki.lastCatchTime))} ${GRAY}(${WHITE}${formatDate(new Date(persistentData.backwaterBayou.wikiTiki.lastCatchTime))}${GRAY})` 
        : `${WHITE}N/A`;
    const lastCatchTimeTitanoboa = persistentData.backwaterBayou.titanoboa.lastCatchTime 
        ? `${WHITE}${formatTimeElapsedBetweenDates(new Date(persistentData.backwaterBayou.titanoboa.lastCatchTime))} ${GRAY}(${WHITE}${formatDate(new Date(persistentData.backwaterBayou.titanoboa.lastCatchTime))}${GRAY})` 
        : `${WHITE}N/A`;
    const averageWikiTiki = formatNumberWithSpaces(persistentData.backwaterBayou.wikiTiki.averageCatches) || 'N/A';
    const averageTitanoboa = formatNumberWithSpaces(persistentData.backwaterBayou.titanoboa.averageCatches) || 'N/A';

    const lastTimeTikiMask = persistentData.backwaterBayou.tikiMasks.dropsHistory.length
        ? `${WHITE}${formatTimeElapsedBetweenDates(new Date(persistentData.backwaterBayou.tikiMasks.dropsHistory[0].time))} ${GRAY}(${WHITE}${formatDate(new Date(persistentData.backwaterBayou.tikiMasks.dropsHistory[0].time))}${GRAY})` 
        : `${WHITE}N/A`;
    const wikiTikiCatchesSinceLastTikiMask = persistentData.backwaterBayou.tikiMasks.wikiTikiCatchesSinceLast || 0;

    const lastTimeTitanoboaShed = persistentData.backwaterBayou.titanoboaSheds.dropsHistory.length
        ? `${WHITE}${formatTimeElapsedBetweenDates(new Date(persistentData.backwaterBayou.titanoboaSheds.dropsHistory[0].time))} ${GRAY}(${WHITE}${formatDate(new Date(persistentData.backwaterBayou.titanoboaSheds.dropsHistory[0].time))}${GRAY})` 
        : `${WHITE}N/A`;
    const titanoboaCatchesSinceLastShed = persistentData.backwaterBayou.titanoboaSheds.titanoboaCatchesSinceLast || 0;

    let overlayText = `${DARK_GREEN}${BOLD}Backwater Bayou tracker`;
    overlayText += `\n${LIGHT_PURPLE}Wiki Tiki: ${WHITE}${formatNumberWithSpaces(persistentData.backwaterBayou.wikiTiki.catchesSinceLast)} ${GRAY}${persistentData.backwaterBayou.wikiTiki.catchesSinceLast !== 1 ? 'catches' : 'catch'} ago ${DARK_GRAY}(${GRAY}avg: ${WHITE}${averageWikiTiki}${DARK_GRAY})`;
    overlayText += `\n${GRAY}Last on: ${lastCatchTimeWikiTiki}`;
    overlayText += `\n${GOLD}Tiki Masks: ${WHITE}${formatNumberWithSpaces(persistentData.backwaterBayou.tikiMasks.count)}`;
    overlayText += `\n${GRAY}Last on: ${lastTimeTikiMask}`;
    overlayText += `\n${GRAY}Last on: ${WHITE}${formatNumberWithSpaces(wikiTikiCatchesSinceLastTikiMask)} ${GRAY}${wikiTikiCatchesSinceLastTikiMask !== 1 ? 'Wiki Tikis' : 'Wiki Tiki'} ago`;
    overlayText += `\n`;
    overlayText += `\n${LIGHT_PURPLE}Titanoboa: ${WHITE}${formatNumberWithSpaces(persistentData.backwaterBayou.titanoboa.catchesSinceLast)} ${GRAY}${persistentData.backwaterBayou.titanoboa.catchesSinceLast !== 1 ? 'catches' : 'catch'} ago ${DARK_GRAY}(${GRAY}avg: ${WHITE}${averageTitanoboa}${DARK_GRAY})`;
    overlayText += `\n${GRAY}Last on: ${lastCatchTimeTitanoboa}`;
    overlayText += `\n${GOLD}Titanoboa Sheds: ${WHITE}${formatNumberWithSpaces(persistentData.backwaterBayou.titanoboaSheds.count)}`;
    overlayText += `\n${GRAY}Last on: ${lastTimeTitanoboaShed}`;
    overlayText += `\n${GRAY}Last on: ${WHITE}${formatNumberWithSpaces(titanoboaCatchesSinceLastShed)} ${GRAY}${titanoboaCatchesSinceLastShed !== 1 ? 'Titanoboas' : 'Titanoboa'} ago`;

    const overlay = new Text(overlayText, overlayCoordsData.backwaterBayouTrackerOverlay.x, overlayCoordsData.backwaterBayouTrackerOverlay.y)
        .setShadow(true)
        .setScale(overlayCoordsData.backwaterBayouTrackerOverlay.scale);
    overlay.draw();

    const shouldShowReset = isInChatOrInventoryGui();
    if (shouldShowReset) {
        resetTrackerDisplayLine.setScale(overlayCoordsData.backwaterBayouTrackerOverlay.scale - 0.2);
        resetTrackerDisplay
            .setRenderX(overlayCoordsData.backwaterBayouTrackerOverlay.x)
            .setRenderY(overlayCoordsData.backwaterBayouTrackerOverlay.y + overlay.getHeight() + 2).show();
    } else {
        resetTrackerDisplay.hide();
    }
}
