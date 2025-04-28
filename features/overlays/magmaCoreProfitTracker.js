import settings, { allOverlaysGui } from "../../settings";
import * as triggers from '../../constants/triggers';
import { overlayCoordsData } from "../../data/overlayCoords";
import { BOLD, GOLD, RED, WHITE, BLUE, YELLOW, GREEN, AQUA, GRAY } from "../../constants/formatting";
import { getLastFishingHookSeenAt, getWorldName, isInSkyblock } from "../../utils/playerState";
import {  formatElapsedTime, formatNumberWithSpaces, isDoubleHook, toShortNumber } from "../../utils/common";
import { CRYSTAL_HOLLOWS } from "../../constants/areas";
import { getBazaarItemPrices } from "../../utils/bazaarPrices";
import { createButtonsDisplay, toggleButtonsDisplay } from "../../utils/overlays";
import { registerIf } from "../../utils/registers";

var totalMagmaCoresCount = 0;
var lastAddedMagmaCoresCount = 0;
var totalSeaCreaturesCaughtCount = 0;
var magmaCoreTotalCoinsSellOffer = 0;
var magmaCoreTotalCoinsInstaSell = 0;

var magmaCoresPerHour = 0;
var seaCreaturesPerHour = 0;
var magmaCoreCoinsPerHourSellOffer = 0;
var magmaCoreCoinsPerHourInstaSell = 0;

var elapsedSeconds = 0;
var isSessionActive = false;
var lastSeaCreatureCaughtAt = null;
var lastMagmaCoreDroppedAt = null;

triggers.MAGMA_FIELDS_TRIGGERS.forEach(trigger => {
    registerIf(
        register("Chat", (event) => {
            const isDoubleHooked = isDoubleHook();
            trackSeaCreatureCatch(isDoubleHooked);
        }).setCriteria(trigger.trigger).setContains(),
        () => settings.magmaCoreProfitTrackerOverlay && isInSkyblock() && getWorldName() === CRYSTAL_HOLLOWS
    );
});

const magmaCoreTrigger = triggers.RARE_DROP_TRIGGERS.find(entry => entry.trigger === triggers.MAGMA_CORE_MESSAGE);
registerIf(
    register("Chat", (magicFind, event) => trackMagmaCoreDrop()).setCriteria(magmaCoreTrigger.trigger).setContains(),
    () => settings.magmaCoreProfitTrackerOverlay && isInSkyblock() && getWorldName() === CRYSTAL_HOLLOWS
);

registerIf(
    register('step', () => refreshElapsedTime()).setDelay(1),
    () => settings.magmaCoreProfitTrackerOverlay && isInSkyblock() && getWorldName() === CRYSTAL_HOLLOWS
);

registerIf(
    register('step', () => refreshTrackerData()).setDelay(5),
    () => settings.magmaCoreProfitTrackerOverlay && isInSkyblock() && getWorldName() === CRYSTAL_HOLLOWS
);

registerIf(
    register('renderOverlay', () => renderMagmaCoreTrackerOverlay()),
    () => settings.magmaCoreProfitTrackerOverlay && isInSkyblock() && getWorldName() === CRYSTAL_HOLLOWS
);

register("worldUnload", () => {
    isSessionActive = false;
    buttonsDisplay.hide();
});

const buttonsDisplay = createButtonsDisplay(true, () => resetMagmaCoreProfitTracker(false), true, () => pauseMagmaCoreProfitTracker());

export function resetMagmaCoreProfitTracker(isConfirmed) {
    try {
        if (!isConfirmed) {
            new Message(
                new TextComponent(`${GOLD}[FeeshNotifier] ${WHITE}Do you want to reset Magma Core profit tracker? ${RED}${BOLD}[Click to confirm]`)
                    .setClickAction('run_command')
                    .setClickValue('/feeshResetMagmaCoreProfit noconfirm')
            ).chat();
            return;
        }
    
        totalMagmaCoresCount = 0;
        lastAddedMagmaCoresCount = 0;
        totalSeaCreaturesCaughtCount = 0;
        magmaCoreTotalCoinsSellOffer = 0;
        magmaCoreTotalCoinsInstaSell = 0;

        magmaCoresPerHour = 0;
        seaCreaturesPerHour = 0;
        magmaCoreCoinsPerHourSellOffer = 0;
        magmaCoreCoinsPerHourInstaSell = 0;

        elapsedSeconds = 0;
        isSessionActive = false;
        lastSeaCreatureCaughtAt = null;
        lastMagmaCoreDroppedAt = null;

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Magma Core profit tracker was reset.`);    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [MagmaCoreTracker] Failed to reset Magma Core profit tracker.`);
	}
}

export function pauseMagmaCoreProfitTracker() {
    try {
        if (!settings.magmaCoreProfitTrackerOverlay || !isInSkyblock() || getWorldName() !== CRYSTAL_HOLLOWS || !isSessionActive) {
            return;
        }
    
        isSessionActive = false;
        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Magma Core profit tracker is paused. Continue fishing to resume it.`);       
    } catch (e) {
        console.error(e);
		console.log(`[FeeshNotifier] Failed to pause Magma Core profit tracker.`);
    }
}

function refreshElapsedTime() {
    try {
        if (!isSessionActive || !settings.magmaCoreProfitTrackerOverlay || !isInSkyblock() || getWorldName() !== CRYSTAL_HOLLOWS) {
            isSessionActive = false;
            return;
        }

        const maxSecondsElapsedSinceLastAction = 60;
        const elapsedSecondsSinceLastCatch = (new Date() - lastSeaCreatureCaughtAt) / 1000;

        if (lastSeaCreatureCaughtAt && elapsedSecondsSinceLastCatch < maxSecondsElapsedSinceLastAction) {
            isSessionActive = true;
            elapsedSeconds += 1;
        } else {
            isSessionActive = false;
        }
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [MagmaCoreTracker] Failed to refresh elapsed time.`);
	}
}

function refreshTrackerData() {
    try {
        if (!settings.magmaCoreProfitTrackerOverlay || !isInSkyblock() || getWorldName() !== CRYSTAL_HOLLOWS) {
            return;
        }

        const elapsedHours = elapsedSeconds / 3600;
        const magmaCorePrices = getBazaarItemPrices('MAGMA_CORE');

        magmaCoreTotalCoinsSellOffer = totalMagmaCoresCount * Math.floor(magmaCorePrices?.sellOffer || 0);
        magmaCoreTotalCoinsInstaSell = totalMagmaCoresCount * Math.floor(magmaCorePrices?.instaSell || 0);
    
        magmaCoresPerHour = elapsedHours
            ? Math.floor(totalMagmaCoresCount / elapsedHours)
            : 0;
        seaCreaturesPerHour = elapsedHours
            ? Math.floor(totalSeaCreaturesCaughtCount / elapsedHours)
            : 0;

        magmaCoreCoinsPerHourSellOffer = elapsedHours
            ? magmaCoresPerHour * Math.floor(magmaCorePrices?.sellOffer || 0)
            : 0;
        magmaCoreCoinsPerHourInstaSell = elapsedHours
            ? magmaCoresPerHour * Math.floor(magmaCorePrices?.instaSell || 0)
            : 0;  
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [MagmaCoreTracker] Failed to refresh tracker data.`);
	}
}

function trackSeaCreatureCatch(isDoubleHooked) {
    try {
        if (!settings.magmaCoreProfitTrackerOverlay || !isInSkyblock() || getWorldName() !== CRYSTAL_HOLLOWS) {
            return;
        }

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

function trackMagmaCoreDrop() {
    try {
        if (!isSessionActive || !settings.magmaCoreProfitTrackerOverlay || !isInSkyblock() || getWorldName() !== CRYSTAL_HOLLOWS) {
            return;
        }

        totalMagmaCoresCount += 1;

        const now = new Date();
        if (now - lastMagmaCoreDroppedAt < 10 * 1000) { // If players kill a cap slowly, the cores are added a few times nearly at the same time
            lastAddedMagmaCoresCount += 1;
        } else {
            lastAddedMagmaCoresCount = 1;
        }
        lastMagmaCoreDroppedAt = now;

        refreshTrackerData();
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [MagmaCoreTracker] Failed to track Magma Core drop.`);
	}
}

function renderMagmaCoreTrackerOverlay() {
    if (!settings.magmaCoreProfitTrackerOverlay ||
        !isInSkyblock() ||
        getWorldName() !== CRYSTAL_HOLLOWS ||
        (!totalMagmaCoresCount && !totalSeaCreaturesCaughtCount) ||
        (new Date() - getLastFishingHookSeenAt() > 10 * 60 * 1000) ||
        allOverlaysGui.isOpen()
    ) {
        buttonsDisplay.hide();
        return;
    }

    const pausedText = isSessionActive ? '' : ` ${GRAY}[Paused]`;
    let text = `${YELLOW}${BOLD}Magma Core profit tracker\n`;
    text += `${GREEN}Total sea creatures caught: ${WHITE}${formatNumberWithSpaces(totalSeaCreaturesCaughtCount)}\n`;
    text += `${BLUE}Total magma cores: ${WHITE}${formatNumberWithSpaces(totalMagmaCoresCount)} ${GRAY}[+${formatNumberWithSpaces(lastAddedMagmaCoresCount)} last added]\n`;
    text += `${GOLD}Total coins (sell offer): ${WHITE}${toShortNumber(magmaCoreTotalCoinsSellOffer)}\n`;
    text += `${GOLD}Total coins (insta-sell): ${WHITE}${toShortNumber(magmaCoreTotalCoinsInstaSell)}\n`;
    text += `\n`;
    text += `${GREEN}Sea creatures caught/h: ${WHITE}${formatNumberWithSpaces(seaCreaturesPerHour)}\n`;
    text += `${BLUE}Magma cores/h: ${WHITE}${formatNumberWithSpaces(magmaCoresPerHour)}\n`;
    text += `${GOLD}Coins/h (sell offer): ${WHITE}${toShortNumber(magmaCoreCoinsPerHourSellOffer)}\n`;
    text += `${GOLD}Coins/h (insta-sell): ${WHITE}${toShortNumber(magmaCoreCoinsPerHourInstaSell)}\n`;
    text += `\n`;
    text += `${AQUA}Elapsed time: ${WHITE}${formatElapsedTime(elapsedSeconds)}${pausedText}`; 

    const overlay = new Text(text, overlayCoordsData.magmaCoreProfitTrackerOverlay.x, overlayCoordsData.magmaCoreProfitTrackerOverlay.y)
        .setShadow(true)
        .setScale(overlayCoordsData.magmaCoreProfitTrackerOverlay.scale);
    overlay.draw();

    toggleButtonsDisplay(buttonsDisplay, overlay, overlayCoordsData.magmaCoreProfitTrackerOverlay);
}
