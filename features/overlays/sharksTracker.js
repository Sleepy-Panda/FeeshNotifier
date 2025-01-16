import settings from "../../settings";
import * as triggers from '../../constants/triggers';
import * as seaCreatures from '../../constants/seaCreatures';
import { overlayCoordsData } from "../../data/overlayCoords";
import { formatNumberWithSpaces, isDoubleHook, isInChatOrInventoryGui } from '../../utils/common';
import { WHITE, GOLD, BOLD, GRAY, RED, UNDERLINE, AQUA, RESET } from "../../constants/formatting";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";
import { KUUDRA } from "../../constants/areas";
import { registerWhen } from "../../utils/registers";

let sharksCaught = {
    [seaCreatures.GREAT_WHITE_SHARK]: 0,
    [seaCreatures.TIGER_SHARK]: 0,
    [seaCreatures.BLUE_SHARK]: 0,
    [seaCreatures.NURSE_SHARK]: 0,
};
let totalSharksCaught = 0;
let festivalStartedAt = null;

triggers.SHARK_CATCH_TRIGGERS.forEach(entry => {
    registerWhen(
        register("Chat", (event) => {
            const isDoubleHooked = isDoubleHook();
            trackSharkCatch({ seaCreature: entry.seaCreature, rarityColorCode: entry.rarityColorCode, isDoubleHook: isDoubleHooked });
        }).setCriteria(entry.trigger).setContains(),
        () => isInSkyblock() && settings.sharksTrackerOverlay
    );
});

registerWhen(
    register("Chat", () => sendFestivalResultsAndReset()).setCriteria(triggers.FISHING_FESTIVAL_ENDED_MESSAGE).setContains(),
    () => isInSkyblock() && settings.sharksTrackerOverlay
);

registerWhen(
    register('renderOverlay', () => renderSharksTrackerOverlay()),
    () => isInSkyblock() && settings.sharksTrackerOverlay && getWorldName() !== KUUDRA
);

let resetTrackerDisplay = new Display().hide();
let resetTrackerDisplayLine = new DisplayLine(`${RED}[Click to reset]`).setShadow(true);
resetTrackerDisplayLine.registerClicked((x, y, mouseButton, buttonState) => {
    if (mouseButton === 0 && buttonState === false) { // When left mouse button is UP. 0 is left mouse button, false is UP, true is DOWN. 
        resetSharksTracker(false);
    }
});
resetTrackerDisplayLine.registerHovered(() => resetTrackerDisplayLine.setText(`${RED}${UNDERLINE}[Click to reset]`).setShadow(true));
resetTrackerDisplayLine.registerMouseLeave(() => resetTrackerDisplayLine.setText(`${RED}[Click to reset]`).setShadow(true));
resetTrackerDisplay.addLine(resetTrackerDisplayLine);

export function resetSharksTracker(isConfirmed) {
    try {
        if (!isConfirmed) {
            new Message(
                new TextComponent(`${GOLD}[FeeshNotifier] ${WHITE}Do you want to reset sharks tracker? ${RED}${BOLD}[Click to confirm]`)
                    .setClickAction('run_command')
                    .setClickValue('/feeshResetSharks noconfirm')
            ).chat();
            return;
        }

        sendFestivalResultsAndReset();

        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Sharks tracker was reset.`);    
    } catch (e) {
        console.error(e);
        console.log(`[FeeshNotifier] Failed to reset Sharks tracker.`);
    }
}

function resetTracker() {
    sharksCaught = {
        [seaCreatures.GREAT_WHITE_SHARK]: 0,
        [seaCreatures.TIGER_SHARK]: 0,
        [seaCreatures.BLUE_SHARK]: 0,
        [seaCreatures.NURSE_SHARK]: 0,
    };
    totalSharksCaught = 0;
    festivalStartedAt = null;
}

function trackSharkCatch(options) {
    try {
        if (!festivalStartedAt || new Date() - festivalStartedAt > 61 * 60 * 1000) { // If more than 1 hour & 1 minute elapsed, it means it's the next festival
            resetTracker();
            festivalStartedAt = new Date();
        }
    
        const valueToAdd = options.isDoubleHook ? 2 : 1;
        const currentAmount = sharksCaught[options.seaCreature] ? sharksCaught[options.seaCreature] : 0;
    
        sharksCaught[options.seaCreature] = currentAmount ? currentAmount + valueToAdd : valueToAdd;
    
        const total = Object.values(sharksCaught).reduce((accumulator, currentValue) => {
            return accumulator + currentValue
        }, 0);
        totalSharksCaught = total;
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track shark catch.`);
	}
}

function sendFestivalResultsAndReset() {
    try {
        if (!totalSharksCaught || !Object.entries(sharksCaught).length) {
            return;
        }
        
        let text = '';
        const entries = Object.entries(sharksCaught)
            .map(([key, value]) => {
                return { seaCreature: key, amount: value, rarityColorCode: triggers.SHARK_CATCH_TRIGGERS.find(t => t.seaCreature === key)?.rarityColorCode || '' };
            });
    
        entries.forEach((entry) => {
            text += `${entry.rarityColorCode}${formatNumberWithSpaces(entry.amount)} `;
        });
    
        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}You caught ${text}${RESET}${WHITE}(${totalSharksCaught} in total) sharks during the fishing festival.`);
        resetTracker();
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to post festival results.`);
	}
}

function renderSharksTrackerOverlay() {
    if (!Object.entries(sharksCaught).length ||
        !totalSharksCaught ||
        !hasFishingRodInHotbar() ||
        settings.allOverlaysGui.isOpen()
    ) {
        resetTrackerDisplay.hide();
        return;
    }

    let overlayText = `${AQUA}${BOLD}Sharks: `;

    const entries = Object.entries(sharksCaught)
        .map(([key, value]) => {
            return { seaCreature: key, amount: value, rarityColorCode: triggers.SHARK_CATCH_TRIGGERS.find(t => t.seaCreature === key)?.rarityColorCode || '' };
        });

    entries.forEach((entry) => {
        overlayText += `${entry.rarityColorCode}${formatNumberWithSpaces(entry.amount)} `;
    });

    overlayText += `${GRAY}(${WHITE}${totalSharksCaught}${GRAY} in total)`;

    const overlay = new Text(overlayText, overlayCoordsData.sharksTrackerOverlay.x, overlayCoordsData.sharksTrackerOverlay.y)
        .setShadow(true)
        .setScale(overlayCoordsData.sharksTrackerOverlay.scale);
    overlay.draw();

    const shouldShowReset = isInChatOrInventoryGui();
    if (shouldShowReset) {
        resetTrackerDisplayLine.setScale(overlayCoordsData.sharksTrackerOverlay.scale - 0.2);
        resetTrackerDisplay
            .setRenderX(overlayCoordsData.sharksTrackerOverlay.x)
            .setRenderY(overlayCoordsData.sharksTrackerOverlay.y + overlay.getHeight() + 2).show(); 
    } else {
        resetTrackerDisplay.hide();
    }    
}