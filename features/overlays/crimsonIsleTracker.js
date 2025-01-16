import settings from "../../settings";
import { persistentData } from "../../data/data";
import { overlayCoordsData } from "../../data/overlayCoords";
import { BOLD, GOLD, LIGHT_PURPLE, RED, WHITE, UNDERLINE, GRAY, DARK_RED, DARK_GRAY } from "../../constants/formatting";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";
import { formatDate, formatNumberWithSpaces, isInChatOrInventoryGui } from "../../utils/common";
import { CRIMSON_ISLE } from "../../constants/areas";

// DisplayLine is initialized once in order to avoid multiple method calls on click.
let resetTrackerDisplay = new Display().hide();
let resetTrackerDisplayLine = new DisplayLine(`${RED}[Click to reset]`).setShadow(true);
resetTrackerDisplayLine.registerClicked((x, y, mouseButton, buttonState) => {
    if (mouseButton === 0 && buttonState === false) { // When left mouse button is UP. 0 is left mouse button, false is UP, true is DOWN. 
        resetCrimsonIsleTracker(false);
    }
});
resetTrackerDisplayLine.registerHovered(() => resetTrackerDisplayLine.setText(`${RED}${UNDERLINE}[Click to reset]`).setShadow(true));
resetTrackerDisplayLine.registerMouseLeave(() => resetTrackerDisplayLine.setText(`${RED}[Click to reset]`).setShadow(true));
resetTrackerDisplay.addLine(resetTrackerDisplayLine);

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
    
        persistentData.crimsonIsle = {
            thunder: { catchesSinceLast: 0, lastCatchTime: null, catchesHistory: [], averageCatches: 0 },
            lordJawbus: { catchesSinceLast: 0, lastCatchTime: null, catchesHistory: [], averageCatches: 0 },
            radioactiveVials: { count: 0, dropsHistory: [] }
        };
        persistentData.save();

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Crimson Isle tracker was reset.`);    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to reset Crimson Isle tracker.`);
	}
}

export function trackThunderCatch() {
    try {
        if (!isInSkyblock() || getWorldName() !== CRIMSON_ISLE || !settings.crimsonIsleTrackerOverlay) {
            return;
        }

        const catchesSinceLast = persistentData.crimsonIsle.thunder.catchesSinceLast;
        let catchesHistory = persistentData.crimsonIsle.thunder.catchesHistory || [];
        catchesHistory.unshift(catchesSinceLast); // Most recent counts at the start of array
        catchesHistory.length = Math.min(catchesHistory.length, 100); // Store last 100
        persistentData.crimsonIsle.thunder.catchesHistory = catchesHistory;

        const sumCatches = catchesHistory.reduce(function(a, b) { return a + b; }, 0);
        persistentData.crimsonIsle.thunder.averageCatches = catchesHistory.length ? Math.round(sumCatches / catchesHistory.length) : 0;

        persistentData.crimsonIsle.thunder.catchesSinceLast = 0;
        persistentData.crimsonIsle.thunder.lastCatchTime = new Date();

        persistentData.crimsonIsle.lordJawbus.catchesSinceLast += 1;

        persistentData.save();
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Thunder catch.`);
	}
}

export function trackLordJawbusCatch() {
    try {
        if (!isInSkyblock() || getWorldName() !== CRIMSON_ISLE || !settings.crimsonIsleTrackerOverlay) {
            return;
        }

        const catchesSinceLast = persistentData.crimsonIsle.lordJawbus.catchesSinceLast;
        let catchesHistory = persistentData.crimsonIsle.lordJawbus.catchesHistory || [];
        catchesHistory.unshift(catchesSinceLast); // Most recent counts at the start of array
        catchesHistory.length = Math.min(catchesHistory.length, 100); // Store last 100
        persistentData.crimsonIsle.lordJawbus.catchesHistory = catchesHistory;

        const sumCatches = catchesHistory.reduce(function(a, b) { return a + b; }, 0);
        persistentData.crimsonIsle.lordJawbus.averageCatches = catchesHistory.length ? Math.round(sumCatches / catchesHistory.length) : 0;

        persistentData.crimsonIsle.lordJawbus.catchesSinceLast = 0;
        persistentData.crimsonIsle.lordJawbus.lastCatchTime = new Date();

        persistentData.crimsonIsle.thunder.catchesSinceLast += 1;

        persistentData.save();
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Lord Jawbus catch.`);
	}
}

export function trackRegularSeaCreatureCatch() {
    try {
        if (!isInSkyblock() || getWorldName() !== CRIMSON_ISLE || !settings.crimsonIsleTrackerOverlay) {
            return;
        }

        persistentData.crimsonIsle.thunder.catchesSinceLast += 1;
        persistentData.crimsonIsle.lordJawbus.catchesSinceLast += 1;
        persistentData.save();
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track regular sea creature catch.`);
	}
}

export function trackRadioctiveVialDrop() {
    try {
        if (!settings.crimsonIsleTrackerOverlay || !isInSkyblock() || getWorldName() !== CRIMSON_ISLE) {
            return;
        }

        persistentData.crimsonIsle.radioactiveVials.count += 1;

        let vialDropsHistory = persistentData.crimsonIsle.radioactiveVials.dropsHistory || [];
        vialDropsHistory.unshift({
            time: new Date()
        });
        persistentData.crimsonIsle.radioactiveVials.dropsHistory = vialDropsHistory;

        persistentData.save();
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Radioactive Vial drop.`);
	}
}

export function renderCrimsonIsleTrackerOverlay() {
    if (!settings.crimsonIsleTrackerOverlay ||
        !persistentData.crimsonIsle ||
        (
            !persistentData.crimsonIsle.thunder.lastCatchTime &&
            !persistentData.crimsonIsle.lordJawbus.lastCatchTime &&
            !persistentData.crimsonIsle.thunder.catchesSinceLast &&
            !persistentData.crimsonIsle.lordJawbus.catchesSinceLast &&
            !persistentData.crimsonIsle.radioactiveVials.count
        ) ||
        !isInSkyblock() ||
        getWorldName() !== CRIMSON_ISLE ||
        !hasFishingRodInHotbar()
    ) {
        resetTrackerDisplay.hide();
        return;
    }

    const lastCatchTimeThunder = persistentData.crimsonIsle.thunder.lastCatchTime ? formatDate(new Date(persistentData.crimsonIsle.thunder.lastCatchTime)) : 'N/A';
    const lastCatchTimeLordJawbus = persistentData.crimsonIsle.lordJawbus.lastCatchTime ? formatDate(new Date(persistentData.crimsonIsle.lordJawbus.lastCatchTime)) : 'N/A';
    const averageThunder = formatNumberWithSpaces(persistentData.crimsonIsle.thunder.averageCatches) || 'N/A';
    const averageLordJawbus = formatNumberWithSpaces(persistentData.crimsonIsle.lordJawbus.averageCatches) || 'N/A';
    const lastTimeVial = persistentData.crimsonIsle.radioactiveVials.dropsHistory.length ? formatDate(new Date(persistentData.crimsonIsle.radioactiveVials.dropsHistory[0].time)) : 'N/A';

    let overlayText = `${DARK_RED}${BOLD}Crimson Isle tracker\n`;
    overlayText += `${LIGHT_PURPLE}Thunder: ${WHITE}${formatNumberWithSpaces(persistentData.crimsonIsle.thunder.catchesSinceLast)} ${GRAY}${persistentData.crimsonIsle.thunder.catchesSinceLast !== 1 ? 'catches' : 'catch'} ago ${DARK_GRAY}(${GRAY}avg: ${WHITE}${averageThunder}${DARK_GRAY})\n`;
    overlayText += `${GRAY}Last on: ${WHITE}${lastCatchTimeThunder}\n`;
    overlayText += `${LIGHT_PURPLE}Lord Jawbus: ${WHITE}${formatNumberWithSpaces(persistentData.crimsonIsle.lordJawbus.catchesSinceLast)} ${GRAY}${persistentData.crimsonIsle.lordJawbus.catchesSinceLast !== 1 ? 'catches' : 'catch'} ago ${DARK_GRAY}(${GRAY}avg: ${WHITE}${averageLordJawbus}${DARK_GRAY})\n`;
    overlayText += `${GRAY}Last on: ${WHITE}${lastCatchTimeLordJawbus}\n`;
    overlayText += `${LIGHT_PURPLE}Radioactive Vials: ${WHITE}${formatNumberWithSpaces(persistentData.crimsonIsle.radioactiveVials.count)}\n`;
    overlayText += `${GRAY}Last on: ${WHITE}${lastTimeVial}`;

    const overlay = new Text(overlayText, overlayCoordsData.crimsonIsleTrackerOverlay.x, overlayCoordsData.crimsonIsleTrackerOverlay.y)
        .setShadow(true)
        .setScale(overlayCoordsData.crimsonIsleTrackerOverlay.scale);
    overlay.draw();

    const shouldShowReset = isInChatOrInventoryGui();
    if (shouldShowReset) {
        resetTrackerDisplayLine.setScale(overlayCoordsData.crimsonIsleTrackerOverlay.scale - 0.2);
        resetTrackerDisplay
            .setRenderX(overlayCoordsData.crimsonIsleTrackerOverlay.x)
            .setRenderY(overlayCoordsData.crimsonIsleTrackerOverlay.y + overlay.getHeight() + 2).show();
    } else {
        resetTrackerDisplay.hide();
    }
}
