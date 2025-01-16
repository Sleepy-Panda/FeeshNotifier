import settings from "../../settings";
import * as triggers from '../../constants/triggers';
import * as seaCreatures from '../../constants/seaCreatures';
import { persistentData } from "../../data/data";
import { overlayCoordsData } from "../../data/overlayCoords";
import { BOLD, GOLD, LIGHT_PURPLE, RED, WHITE, UNDERLINE, GRAY, DARK_RED, DARK_GRAY, RESET } from "../../constants/formatting";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";
import { formatDate, formatNumberWithSpaces, isDoubleHook, isInChatOrInventoryGui } from "../../utils/common";
import { CRIMSON_ISLE } from "../../constants/areas";
import { MEME_SOUND_MODE, NORMAL_SOUND_MODE, SAD_TROMBONE_SOUND_SOURCE } from "../../constants/sounds";

triggers.REGULAR_CRIMSON_CATCH_TRIGGERS.forEach(entry => {
    register("Chat", (event) => trackRegularSeaCreatureCatch()).setCriteria(entry.trigger).setContains();
});

const thunderTrigger = triggers.RARE_CATCH_TRIGGERS.find(entry => entry.seaCreature === seaCreatures.THUNDER);
const lordJawbusTrigger = triggers.RARE_CATCH_TRIGGERS.find(entry => entry.seaCreature === seaCreatures.LORD_JAWBUS);
register("Chat", (event) => trackThunderCatch()).setCriteria(thunderTrigger.trigger).setContains();
register("Chat", (event) => trackLordJawbusCatch()).setCriteria(lordJawbusTrigger.trigger).setContains();

const radioactiveVialTrigger = triggers.RARE_DROP_TRIGGERS.find(entry => entry.trigger === triggers.RADIOACTIVE_VIAL_MESSAGE);
register("Chat", (magicFind, event) => trackRadioctiveVialDrop()).setCriteria(radioactiveVialTrigger.trigger).setContains();

register('renderOverlay', () => renderCrimsonIsleTrackerOverlay());

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
            radioactiveVials: { count: 0, lordJawbusCatchesSinceLast: 0, dropsHistory: [] }
        };
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

function trackThunderCatch() {
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

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${GRAY}It took ${WHITE}${catchesSinceLast} ${GRAY}${catchesSinceLast === 1 ? 'catch' : 'catches'} to get the ${LIGHT_PURPLE}Thunder${GRAY}.`);
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

        const isDoubleHooked = isDoubleHook();

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

        const valueToAdd = isDoubleHooked ? 2 : 1;
        let lordJawbusCatchesSinceLast = persistentData.crimsonIsle.radioactiveVials.lordJawbusCatchesSinceLast || 0;
        lordJawbusCatchesSinceLast += valueToAdd;
        persistentData.crimsonIsle.radioactiveVials.lordJawbusCatchesSinceLast = lordJawbusCatchesSinceLast;

        persistentData.save();

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${GRAY}It took ${WHITE}${catchesSinceLast} ${GRAY}${catchesSinceLast === 1 ? 'catch' : 'catches'} to get the ${LIGHT_PURPLE}Lord Jawbus${GRAY}.`);
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

        persistentData.crimsonIsle.thunder.catchesSinceLast += 1;
        persistentData.crimsonIsle.lordJawbus.catchesSinceLast += 1;
        persistentData.save();

        if (persistentData.crimsonIsle.lordJawbus.catchesSinceLast &&
            persistentData.crimsonIsle.lordJawbus.catchesSinceLast % 1000 === 0) {
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
        vialDropsHistory.unshift({
            time: new Date(),
            lordJawbusCatches: lordJawbusCatches
        });
        persistentData.crimsonIsle.radioactiveVials.dropsHistory = vialDropsHistory;

        persistentData.save();

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${GRAY}It took ${WHITE}${lordJawbusCatches} ${GRAY}${lordJawbusCatches === 1 ? 'Lord Jawbus catch' : 'Lord Jawbus catches'} to get the ${LIGHT_PURPLE}Radioactive Vial${GRAY}. Congratulations!`);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Radioactive Vial drop.`);
	}
}

function renderCrimsonIsleTrackerOverlay() {
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
        !hasFishingRodInHotbar() ||
        settings.allOverlaysGui.isOpen()
    ) {
        resetTrackerDisplay.hide();
        return;
    }

    const lastCatchTimeThunder = persistentData.crimsonIsle.thunder.lastCatchTime ? formatDate(new Date(persistentData.crimsonIsle.thunder.lastCatchTime)) : 'N/A';
    const lastCatchTimeLordJawbus = persistentData.crimsonIsle.lordJawbus.lastCatchTime ? formatDate(new Date(persistentData.crimsonIsle.lordJawbus.lastCatchTime)) : 'N/A';
    const averageThunder = formatNumberWithSpaces(persistentData.crimsonIsle.thunder.averageCatches) || 'N/A';
    const averageLordJawbus = formatNumberWithSpaces(persistentData.crimsonIsle.lordJawbus.averageCatches) || 'N/A';
    const lastTimeVial = persistentData.crimsonIsle.radioactiveVials.dropsHistory.length ? formatDate(new Date(persistentData.crimsonIsle.radioactiveVials.dropsHistory[0].time)) : 'N/A';
    const lordJawbusCatchesSinceLastVial = persistentData.crimsonIsle.radioactiveVials.lordJawbusCatchesSinceLast || 0;

    let overlayText = `${DARK_RED}${BOLD}Crimson Isle tracker\n`;
    overlayText += `${LIGHT_PURPLE}Thunder: ${WHITE}${formatNumberWithSpaces(persistentData.crimsonIsle.thunder.catchesSinceLast)} ${GRAY}${persistentData.crimsonIsle.thunder.catchesSinceLast !== 1 ? 'catches' : 'catch'} ago ${DARK_GRAY}(${GRAY}avg: ${WHITE}${averageThunder}${DARK_GRAY})\n`;
    overlayText += `${GRAY}Last on: ${WHITE}${lastCatchTimeThunder}\n`;
    overlayText += `${LIGHT_PURPLE}Lord Jawbus: ${WHITE}${formatNumberWithSpaces(persistentData.crimsonIsle.lordJawbus.catchesSinceLast)} ${GRAY}${persistentData.crimsonIsle.lordJawbus.catchesSinceLast !== 1 ? 'catches' : 'catch'} ago ${DARK_GRAY}(${GRAY}avg: ${WHITE}${averageLordJawbus}${DARK_GRAY})\n`;
    overlayText += `${GRAY}Last on: ${WHITE}${lastCatchTimeLordJawbus}\n`;
    overlayText += `${LIGHT_PURPLE}Radioactive Vials: ${WHITE}${formatNumberWithSpaces(persistentData.crimsonIsle.radioactiveVials.count)}\n`;
    overlayText += `${GRAY}Last on: ${WHITE}${lastTimeVial}\n`;
    overlayText += `${GRAY}Last on: ${WHITE}${formatNumberWithSpaces(lordJawbusCatchesSinceLastVial)} ${GRAY}${lordJawbusCatchesSinceLastVial !== 1 ? 'Jawbuses' : 'Jawbus'} ago`;

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
