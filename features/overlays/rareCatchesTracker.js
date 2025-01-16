import settings from "../../settings";
import * as triggers from '../../constants/triggers';
import * as seaCreatures from '../../constants/seaCreatures';
import { persistentData } from "../../data/data";
import { overlayCoordsData } from "../../data/overlayCoords";
import { formatNumberWithSpaces, fromUppercaseToCapitalizedFirstLetters, isDoubleHook, isInChatOrInventoryGui, pluralize } from '../../utils/common';
import { WHITE, GOLD, BOLD, YELLOW, GRAY, RED, UNDERLINE } from "../../constants/formatting";
import { RARE_CATCH_TRIGGERS } from "../../constants/triggers";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";
import { KUUDRA } from "../../constants/areas";

triggers.RARE_CATCH_TRIGGERS.forEach(entry => {
    register("Chat", (event) => {
        const isDoubleHooked = isDoubleHook();
        trackCatch({ seaCreature: entry.seaCreature, rarityColorCode: entry.rarityColorCode, isDoubleHook: isDoubleHooked });
    }).setCriteria(entry.trigger).setContains();
});

register('renderOverlay', () => renderRareCatchTrackerOverlay());

// DisplayLine is initialized once in order to avoid multiple method calls on click.
let resetTrackerDisplay = new Display().hide();
let resetTrackerDisplayLine = new DisplayLine(`${RED}[Click to reset]`).setShadow(true);
resetTrackerDisplayLine.registerClicked((x, y, mouseButton, buttonState) => {
    if (mouseButton === 0 && buttonState === false) { // When left mouse button is UP. 0 is left mouse button, false is UP, true is DOWN. 
        resetRareCatchesTracker(false);
    }
});
resetTrackerDisplayLine.registerHovered(() => resetTrackerDisplayLine.setText(`${RED}${UNDERLINE}[Click to reset]`).setShadow(true));
resetTrackerDisplayLine.registerMouseLeave(() => resetTrackerDisplayLine.setText(`${RED}[Click to reset]`).setShadow(true));
resetTrackerDisplay.addLine(resetTrackerDisplayLine);

export function resetRareCatchesTracker(isConfirmed) {
    try {
        if (!isConfirmed) {
            new Message(
                new TextComponent(`${GOLD}[FeeshNotifier] ${WHITE}Do you want to reset rare catches tracker? ${RED}${BOLD}[Click to confirm]`)
                    .setClickAction('run_command')
                    .setClickValue('/feeshResetRareCatches noconfirm')
            ).chat();
            return;
        }

        if (persistentData.totalRareCatches > 0 && persistentData.rareCatches) {
            var catches = Object.entries(persistentData.rareCatches)
                .map(([key, value]) => {
                    return { seaCreature: key, amount: value.amount };
                })
                .sort((a, b) => b.amount - a.amount)
                .map((entry) => {
                    const rarityColorCode = RARE_CATCH_TRIGGERS.find(t => t.seaCreature === entry.seaCreature).rarityColorCode;
                    const seaCreatureDisplayName = fromUppercaseToCapitalizedFirstLetters(entry.seaCreature);
                    return `${rarityColorCode}${entry.amount} ${entry.amount > 1 ? pluralize(seaCreatureDisplayName) : seaCreatureDisplayName}`;
                });
    
            if (catches.length) {
                ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}You caught ${catches.join(', ')} ${WHITE}per session (${persistentData.totalRareCatches} rare catches in total).`);
            }
        }
    
        persistentData.rareCatches = {};
        persistentData.totalRareCatches = 0;
        persistentData.save();
        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Rare catches tracker was reset.`);    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to reset rare catches tracker.`);
	}
}

function trackCatch(options) {
    try {
        if (!settings.rareCatchesTrackerOverlay || !isInSkyblock()) {
            return;
        }
    
        if (options.seaCreature === seaCreatures.VANQUISHER && !hasFishingRodInHotbar()) {
            return;
        }

        const valueToAdd = options.isDoubleHook ? 2 : 1;
        const currentAmount = persistentData.rareCatches[options.seaCreature] ? persistentData.rareCatches[options.seaCreature].amount : 0;
    
        persistentData.rareCatches[options.seaCreature] = {
            amount: currentAmount ? currentAmount + valueToAdd : valueToAdd,
            percent: null
        };
    
        const total = Object.values(persistentData.rareCatches).reduce((accumulator, currentValue) => {
            return accumulator + currentValue.amount
        }, 0);
        persistentData.totalRareCatches = total;
    
        Object.keys(persistentData.rareCatches).forEach((key) => {
            const entry = persistentData.rareCatches[key];
            const percent = persistentData.totalRareCatches ? ((entry.amount / persistentData.totalRareCatches) * 100).toFixed(2) : 0;
            entry.percent = percent;
        });
    
        persistentData.save();    
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track rare catch.`);
	}
}

function renderRareCatchTrackerOverlay() {
    if (!settings.rareCatchesTrackerOverlay ||
        !Object.entries(persistentData.rareCatches).length ||
        !isInSkyblock() ||
        getWorldName() === KUUDRA ||
        !hasFishingRodInHotbar() ||
        settings.allOverlaysGui.isOpen()
    ) {
        resetTrackerDisplay.hide();
        return;
    }

    let overlayText = `${YELLOW}${BOLD}Rare catches tracker\n`;

    const entries = Object.entries(persistentData.rareCatches)
        .map(([key, value]) => {
            return { seaCreature: key, amount: value.amount, percent: value.percent };
        })
        .sort((a, b) => b.amount - a.amount); // Most catches at the top

    entries.forEach((entry) => {
        const rarityColorCode = RARE_CATCH_TRIGGERS.find(t => t.seaCreature === entry.seaCreature).rarityColorCode;
        overlayText += `${GRAY}- ${rarityColorCode}${fromUppercaseToCapitalizedFirstLetters(entry.seaCreature)}: ${WHITE}${formatNumberWithSpaces(entry.amount)} ${GRAY}(${entry.percent}%)\n`;
    });

    overlayText += `${YELLOW}Total: ${WHITE}${persistentData.totalRareCatches}`;

    const overlay = new Text(overlayText, overlayCoordsData.rareCatchesTrackerOverlay.x, overlayCoordsData.rareCatchesTrackerOverlay.y)
        .setShadow(true)
        .setScale(overlayCoordsData.rareCatchesTrackerOverlay.scale);
    overlay.draw();

    const shouldShowReset = isInChatOrInventoryGui();
    if (shouldShowReset) {
        resetTrackerDisplayLine.setScale(overlayCoordsData.rareCatchesTrackerOverlay.scale - 0.2);
        resetTrackerDisplay
            .setRenderX(overlayCoordsData.rareCatchesTrackerOverlay.x)
            .setRenderY(overlayCoordsData.rareCatchesTrackerOverlay.y + overlay.getHeight() + 2).show(); 
    } else {
        resetTrackerDisplay.hide();
    }
}