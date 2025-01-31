import { AQUA, BOLD, DARK_GRAY, GREEN, RESET, YELLOW } from "../../constants/formatting";
import { formatDate, formatElapsedTime, formatTimeElapsedBetweenDates } from "../../utils/common";
import { isInSkyblock } from "../../utils/playerState";

// Everything is calculated in seconds
// The Spider's Den has a weather cycle that includes both Rain and Thunderstorms.
// After 40 minutes of clear skies, it will rain for the next 20 minutes, and every 3rd rain will be a thunderstorm.

const RAIN_COOLDOWN = 2400;
const RAIN_DURATION = 1200;
const CYCLE_DURATION = RAIN_COOLDOWN + RAIN_DURATION;

const THUNDERSTORM_FREQUENCY = 3; //  Every 3rd rain is a thunderstorm

const SKYBLOCK_EPOCH_START_MS = 1560275700000; // https://wiki.hypixel.net/SkyBlock_Time
const SKYBLOCK_EPOCH_START_SECONDS = SKYBLOCK_EPOCH_START_MS / 1000;

export function showSpidersDenRainSchedule() {
    if (!isInSkyblock()) {
        return;
    }

    try {
        const nowSeconds = Math.floor(Date.now() / 1000);
        const skyblockAge = nowSeconds - SKYBLOCK_EPOCH_START_SECONDS;

        const sinceLastRainFinished = skyblockAge % CYCLE_DURATION;
        const sinceLastThunderstormFinished = skyblockAge % (CYCLE_DURATION * THUNDERSTORM_FREQUENCY);

        const isRaining = sinceLastRainFinished >= RAIN_COOLDOWN;
        const isThunderstorm = sinceLastThunderstormFinished >= RAIN_COOLDOWN && sinceLastThunderstormFinished < CYCLE_DURATION;
        const rainTimeLeft = isRaining ? CYCLE_DURATION - sinceLastRainFinished : 0;

        let nextEvents = [];
        const nextRain = isRaining ? rainTimeLeft + RAIN_COOLDOWN : RAIN_COOLDOWN - sinceLastRainFinished;
        nextEvents.push({ startsIn: nextRain });
        nextEvents.push({ startsIn: nextRain + CYCLE_DURATION });
        nextEvents.push({ startsIn: nextRain + 2 * CYCLE_DURATION });

        let message = `${GREEN}${BOLD}Spider's Den Rain / Thunderstorm:\n\n`;
        message += isRaining ? `Now: ${AQUA}${isThunderstorm ? 'Thunderstorm' : 'Rain'} ${RESET}(${formatElapsedTime(rainTimeLeft)} left)\n\n` : `Now: ${YELLOW}Sunny\n\n`;

        for (let nextEvent of nextEvents) {
            const isNextEventThunderstorm = (skyblockAge + nextEvent.startsIn) % (CYCLE_DURATION * THUNDERSTORM_FREQUENCY) === RAIN_COOLDOWN;
            const startsAtStr = formatDate(secondsToDate(nowSeconds + nextEvent.startsIn));
            const startsInStr = formatTimeElapsedBetweenDates(secondsToDate(nowSeconds), secondsToDate(nowSeconds + nextEvent.startsIn));
            message += `- ${AQUA}${isNextEventThunderstorm ? 'Thunderstorm' : 'Rain'} ${RESET}starts at ${startsAtStr} (in ${startsInStr})\n`;
        }

        message += `\n${DARK_GRAY}Gain +50☂ Fishing Speed during Rain, and +3α Sea Creature Chance during Thunderstorm.\n`;

        ChatLib.chat(message);
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] [ProfitTracker] Failed to show Spider's Den rain schedule.`);
	}
}

function secondsToDate(seconds) {
    return new Date(seconds * 1000);
}