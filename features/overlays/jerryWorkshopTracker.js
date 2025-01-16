import settings from "../../settings";
import * as triggers from '../../constants/triggers';
import * as seaCreatures from '../../constants/seaCreatures';
import { persistentData } from "../../data/data";
import { overlayCoordsData } from "../../data/overlayCoords";
import { BOLD, GOLD, RED, WHITE, UNDERLINE, DARK_PURPLE, GRAY, AQUA, DARK_GRAY } from "../../constants/formatting";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";
import { formatDate, formatNumberWithSpaces, isInChatOrInventoryGui } from "../../utils/common";
import { JERRY_WORKSHOP } from "../../constants/areas";

triggers.REGULAR_JERRY_WORKSHOP_CATCH_TRIGGERS.forEach(entry => {
    register("Chat", (event) => trackRegularJerryWorkshopSeaCreatureCatch()).setCriteria(entry.trigger).setContains();
});

const yetiTrigger = triggers.RARE_CATCH_TRIGGERS.find(entry => entry.seaCreature === seaCreatures.YETI);
const reindrakeTrigger = triggers.RARE_CATCH_TRIGGERS.find(entry => entry.seaCreature === seaCreatures.REINDRAKE);
register("Chat", (event) => trackYetiCatch()).setCriteria(yetiTrigger.trigger).setContains();
register("Chat", (event) => trackReindrakeCatch()).setCriteria(reindrakeTrigger.trigger).setContains();

const babyYetiPetEpicTrigger = triggers.RARE_DROP_TRIGGERS.find(entry => entry.trigger === triggers.BABY_YETI_PET_EPIC_MESSAGE);
const babyYetiPetLegendaryTrigger = triggers.RARE_DROP_TRIGGERS.find(entry => entry.trigger === triggers.BABY_YETI_PET_LEG_MESSAGE);
register("Chat", (magicFind, event) => trackEpicBabyYetiPetDrop()).setCriteria(babyYetiPetEpicTrigger.trigger).setContains();
register("Chat", (magicFind, event) => trackLegendaryBabyYetiPetDrop()).setCriteria(babyYetiPetLegendaryTrigger.trigger).setContains();

register('renderOverlay', () => renderJerryWorkshopOverlay());

// DisplayLine is initialized once in order to avoid multiple method calls on click.
let resetTrackerDisplay = new Display().hide();
let resetTrackerDisplayLine = new DisplayLine(`${RED}[Click to reset]`).setShadow(true);
resetTrackerDisplayLine.registerClicked((x, y, mouseButton, buttonState) => {
    if (mouseButton === 0 && buttonState === false) { // When left mouse button is UP. 0 is left mouse button, false is UP, true is DOWN. 
        resetJerryWorkshopTracker(false);
    }
});
resetTrackerDisplayLine.registerHovered(() => resetTrackerDisplayLine.setText(`${RED}${UNDERLINE}[Click to reset]`).setShadow(true));
resetTrackerDisplayLine.registerMouseLeave(() => resetTrackerDisplayLine.setText(`${RED}[Click to reset]`).setShadow(true));
resetTrackerDisplay.addLine(resetTrackerDisplayLine);

export function resetJerryWorkshopTracker(isConfirmed) {
    try {
        if (!isConfirmed) {
            new Message(
                new TextComponent(`${GOLD}[FeeshNotifier] ${WHITE}Do you want to reset Jerry workshop tracker? ${RED}${BOLD}[Click to confirm]`)
                    .setClickAction('run_command')
                    .setClickValue('/feeshResetJerryWorkshop noconfirm')
            ).chat();
            return;
        }
    
        persistentData.jerryWorkshop = {
            yeti: { catchesSinceLast: 0, lastCatchTime: null, catchesHistory: [], averageCatches: 0 },
            reindrake: { catchesSinceLast: 0, lastCatchTime: null, catchesHistory: [], averageCatches: 0 },
            babyYetiPets: { epic: { count: 0 }, legendary: { count: 0 } }
        };
        persistentData.save();

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Jerry workshop tracker was reset.`);    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to reset Jerry workshop tracker.`);
	}
}

function trackYetiCatch() {
    try {
        if (!settings.jerryWorkshopTrackerOverlay || !isInSkyblock() || getWorldName() !== JERRY_WORKSHOP) {
            return;
        }

        const catchesSinceLast = persistentData.jerryWorkshop.yeti.catchesSinceLast;
        let catchesHistory = persistentData.jerryWorkshop.yeti.catchesHistory || [];
        catchesHistory.unshift(catchesSinceLast); // Most recent counts at the start of array
        catchesHistory.length = Math.min(catchesHistory.length, 100); // Store last 100
        persistentData.jerryWorkshop.yeti.catchesHistory = catchesHistory;

        const sumCatches = catchesHistory.reduce(function(a, b) { return a + b; }, 0);
        persistentData.jerryWorkshop.yeti.averageCatches = catchesHistory.length ? Math.round(sumCatches / catchesHistory.length) : 0;

        persistentData.jerryWorkshop.yeti.catchesSinceLast = 0;
        persistentData.jerryWorkshop.yeti.lastCatchTime = new Date();

        persistentData.jerryWorkshop.reindrake.catchesSinceLast += 1;

        persistentData.save();

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${GRAY}It took ${WHITE}${catchesSinceLast} ${GRAY}${catchesSinceLast === 1 ? 'catch' : 'catches'} to get the ${GOLD}Yeti${GRAY}.`);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Yeti catch.`);
	}
}

function trackReindrakeCatch() {
    try {
        if (!settings.jerryWorkshopTrackerOverlay || !isInSkyblock() || getWorldName() !== JERRY_WORKSHOP) {
            return;
        }

        const catchesSinceLast = persistentData.jerryWorkshop.reindrake.catchesSinceLast;
        let catchesHistory = persistentData.jerryWorkshop.reindrake.catchesHistory || [];
        catchesHistory.unshift(catchesSinceLast); // Most recent counts at the start of array
        catchesHistory.length = Math.min(catchesHistory.length, 100); // Store last 100
        persistentData.jerryWorkshop.reindrake.catchesHistory = catchesHistory;

        const sumCatches = catchesHistory.reduce(function(a, b) { return a + b; }, 0);
        persistentData.jerryWorkshop.reindrake.averageCatches = catchesHistory.length ? Math.round(sumCatches / catchesHistory.length) : 0;

        persistentData.jerryWorkshop.reindrake.catchesSinceLast = 0;
        persistentData.jerryWorkshop.reindrake.lastCatchTime = new Date();

        persistentData.jerryWorkshop.yeti.catchesSinceLast += 1;

        persistentData.save();

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${GRAY}It took ${WHITE}${catchesSinceLast} ${GRAY}${catchesSinceLast === 1 ? 'catch' : 'catches'} to get the ${GOLD}Reindrake${GRAY}.`);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Reindrake catch.`);
	}
}

function trackRegularJerryWorkshopSeaCreatureCatch() {
    try {
        if (!settings.jerryWorkshopTrackerOverlay || !isInSkyblock() || getWorldName() !== JERRY_WORKSHOP) {
            return;
        }

        persistentData.jerryWorkshop.yeti.catchesSinceLast += 1;
        persistentData.jerryWorkshop.reindrake.catchesSinceLast += 1;
        persistentData.save();
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track regular Jerry Workshop sea creature catch.`);
	}
}

function trackEpicBabyYetiPetDrop() {
    try {
        if (!settings.jerryWorkshopTrackerOverlay || !isInSkyblock() || getWorldName() !== JERRY_WORKSHOP) {
            return;
        }

        persistentData.jerryWorkshop.babyYetiPets.epic.count += 1;
        persistentData.save();
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Baby Yeti Pet drop.`);
	}
}

function trackLegendaryBabyYetiPetDrop() {
    try {
        if (!settings.jerryWorkshopTrackerOverlay || !isInSkyblock() || getWorldName() !== JERRY_WORKSHOP) {
            return;
        }

        persistentData.jerryWorkshop.babyYetiPets.legendary.count += 1;
        persistentData.save();
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Baby Yeti Pet drop.`);
	}
}

function renderJerryWorkshopOverlay() {
    if (!settings.jerryWorkshopTrackerOverlay ||
        !persistentData.jerryWorkshop ||
        (
            !persistentData.jerryWorkshop.yeti.lastCatchTime &&
            !persistentData.jerryWorkshop.reindrake.lastCatchTime &&
            !persistentData.jerryWorkshop.yeti.catchesSinceLast &&
            !persistentData.jerryWorkshop.reindrake.catchesSinceLast &&
            !persistentData.jerryWorkshop.babyYetiPets.epic.count &&
            !persistentData.jerryWorkshop.babyYetiPets.legendary.count
        ) ||
        !isInSkyblock() ||
        getWorldName() !== JERRY_WORKSHOP ||
        !hasFishingRodInHotbar()
    ) {
        resetTrackerDisplay.hide();
        return;
    }

    const lastCatchTimeYeti = persistentData.jerryWorkshop.yeti.lastCatchTime ? formatDate(new Date(persistentData.jerryWorkshop.yeti.lastCatchTime)) : 'N/A';
    const lastCatchTimeReindrake = persistentData.jerryWorkshop.reindrake.lastCatchTime ? formatDate(new Date(persistentData.jerryWorkshop.reindrake.lastCatchTime)) : 'N/A';
    const averageYeti = formatNumberWithSpaces(persistentData.jerryWorkshop.yeti.averageCatches) || 'N/A';
    const averageReindrake = formatNumberWithSpaces(persistentData.jerryWorkshop.reindrake.averageCatches) || 'N/A';

    let overlayText = `${AQUA}${BOLD}Jerry Workshop tracker\n`;
    overlayText += `${GOLD}Yeti: ${WHITE}${formatNumberWithSpaces(persistentData.jerryWorkshop.yeti.catchesSinceLast)} ${GRAY}${persistentData.jerryWorkshop.yeti.catchesSinceLast !== 1 ? 'catches' : 'catch'} ago ${DARK_GRAY}(${GRAY}avg: ${WHITE}${averageYeti}${DARK_GRAY})\n`;
    overlayText += `${GRAY}Last on: ${WHITE}${lastCatchTimeYeti}\n`;
    overlayText += `${GOLD}Reindrake: ${WHITE}${formatNumberWithSpaces(persistentData.jerryWorkshop.reindrake.catchesSinceLast)} ${GRAY}${persistentData.jerryWorkshop.reindrake.catchesSinceLast !== 1 ? 'catches' : 'catch'} ago ${DARK_GRAY}(${GRAY}avg: ${WHITE}${averageReindrake}${DARK_GRAY})\n`;
    overlayText += `${GRAY}Last on: ${WHITE}${lastCatchTimeReindrake}\n`;
    overlayText += `${GRAY}Baby Yeti pets: ${GOLD}${formatNumberWithSpaces(persistentData.jerryWorkshop.babyYetiPets.legendary.count)} ${DARK_PURPLE}${formatNumberWithSpaces(persistentData.jerryWorkshop.babyYetiPets.epic.count)}`;

    const overlay = new Text(overlayText, overlayCoordsData.jerryWorkshopTrackerOverlay.x, overlayCoordsData.jerryWorkshopTrackerOverlay.y)
        .setShadow(true)
        .setScale(overlayCoordsData.jerryWorkshopTrackerOverlay.scale);
    overlay.draw();

    const shouldShowReset = isInChatOrInventoryGui();
    if (shouldShowReset) {
        resetTrackerDisplayLine.setScale(overlayCoordsData.jerryWorkshopTrackerOverlay.scale - 0.2);
        resetTrackerDisplay
            .setRenderX(overlayCoordsData.jerryWorkshopTrackerOverlay.x)
            .setRenderY(overlayCoordsData.jerryWorkshopTrackerOverlay.y + overlay.getHeight() + 2).show();
    } else {
        resetTrackerDisplay.hide();
    }
}
