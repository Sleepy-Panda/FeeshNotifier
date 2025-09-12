import settings from "../../settings";
import * as triggers from '../../constants/triggers';
import { formatNumberWithSpaces, isDoubleHook, isInFishingWorld } from '../../utils/common';
import { WHITE, GOLD, BOLD, RESET, YELLOW } from "../../constants/formatting";
import { getWorldName, isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";
import { GREAT_WHITE_SHARK, TIGER_SHARK, BLUE_SHARK, NURSE_SHARK } from "../../constants/seaCreatures";
import { MC_RANDOM_ORB_SOUND, OFF_SOUND_MODE } from "../../constants/sounds";
import { playMcSound } from "../../utils/sound";

const GREAT_WHITE_SHARK_KEY = GREAT_WHITE_SHARK.toUpperCase();
const TIGER_SHARK_KEY = TIGER_SHARK.toUpperCase();
const BLUE_SHARK_KEY = BLUE_SHARK.toUpperCase();
const NURSE_SHARK_KEY = NURSE_SHARK.toUpperCase();

let sharksCaught = {
    [GREAT_WHITE_SHARK_KEY]: 0,
    [TIGER_SHARK_KEY]: 0,
    [BLUE_SHARK_KEY]: 0,
    [NURSE_SHARK_KEY]: 0,
};
let totalSharksCaught = 0;
let festivalStartedAt = null;

triggers.SHARK_CATCH_TRIGGERS.forEach(entry => {
    registerIf(
        register("Chat", (event) => {
            const isDoubleHooked = isDoubleHook();
            trackSharkCatch({ seaCreature: entry.seaCreature.toUpperCase(), rarityColorCode: entry.rarityColorCode, isDoubleHook: isDoubleHooked });
        }).setCriteria(entry.trigger).setContains().triggerIfCanceled(true),
        () => isInSkyblock() && settings.alertOnFishingFestivalEnded && isInFishingWorld(getWorldName())
    );
});

registerIf(
    register("Chat", () => alertOnFestivalResults()).setCriteria(triggers.FISHING_FESTIVAL_ENDED_MESSAGE).setContains(),
    () => isInSkyblock() && settings.alertOnFishingFestivalEnded && isInFishingWorld(getWorldName())
);

register("worldUnload", () => {
    if (isInPast()) {
        resetTracker();
    }
});

function resetTracker() {
    sharksCaught = {
        [GREAT_WHITE_SHARK_KEY]: 0,
        [TIGER_SHARK_KEY]: 0,
        [BLUE_SHARK_KEY]: 0,
        [NURSE_SHARK_KEY]: 0,
    };
    totalSharksCaught = 0;
    festivalStartedAt = null;
}

function trackSharkCatch(options) {
    try {
        if (!settings.alertOnFishingFestivalEnded || !isInSkyblock() || !isInFishingWorld(getWorldName())) {
            return;
        }

        if (!festivalStartedAt || isInPast()) {
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

function alertOnFestivalResults() {
    try {
        if (!settings.alertOnFishingFestivalEnded || !isInSkyblock() || !isInFishingWorld(getWorldName())) {
            return;
        }

        if (!totalSharksCaught || !Object.entries(sharksCaught).length) {
            return;
        }

        Client.showTitle(`${YELLOW}Fishing Festival ended`, '', 1, 30, 1);

        if (settings.soundMode !== OFF_SOUND_MODE) {
            playMcSound(MC_RANDOM_ORB_SOUND);
        }

        const text = Object.entries(sharksCaught)
            .map(([key, value]) => {
                return `${RESET}${triggers.SHARK_CATCH_TRIGGERS.find(t => t.seaCreature.toUpperCase() === key)?.rarityColorCode || ''}${formatNumberWithSpaces(value)}`;
            })
            .join(' ');

        const message = `${GOLD}[FeeshNotifier] ${WHITE}You caught ${BOLD}${totalSharksCaught} ${RESET}${WHITE}(${text}${WHITE}) sharks during the fishing festival.`;
        ChatLib.chat(message);

        resetTracker();
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to send festival results.`);
	}
}

function isInPast() {
    return festivalStartedAt && new Date() - festivalStartedAt > 61 * 60 * 1000; // If more than 1 hour & 1 minute elapsed, it means it's the next festival
}