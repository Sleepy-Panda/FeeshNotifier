import settings from "../../settings";
import { GOLD, RED, DARK_GRAY, WHITE } from "../../constants/formatting";
import { TIMER_SOUND_SOURCE, OFF_SOUND_MODE } from "../../constants/sounds";
import { ALL_SEA_CREATURES_NAMES } from "../../constants/seaCreatures";
import { EntityArmorStand } from "../../constants/javaTypes";
import { overlayCoordsData } from "../../data/overlayCoords";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";

const TIMER_THRESHOLD_IN_MINUTES = 5;

let mobsCount = 0;
let startTime = null;
let killMobsCountNotificationShown = false;
let killMobsTimerNotificationShown = false;

export function trackSeaCreaturesCount() {
    if ((!settings.alertOnSeaCreaturesCountThreshold && !settings.seaCreaturesCountOverlay) || !isInSkyblock()) {
        return;
    }

    let newMobsCount = 0;
    const entities = World.getAllEntitiesOfType(EntityArmorStand);
	entities.forEach(entity => {
        const plainName = entity?.getName()?.removeFormatting();

        if (ALL_SEA_CREATURES_NAMES.some(sc => plainName.includes(sc) && plainName.includes('[Lv'))) { // Mobs have prefix like [Lv100]
            newMobsCount++;
        }
    });

    if (mobsCount == 0 && newMobsCount > 0) {
        startTime = new Date().getTime();
    }

    if (newMobsCount == 0) {
        startTime = null;
    }

    mobsCount = newMobsCount;
}

export function alertOnSeaCreaturesCountThreshold() {
    if (!settings.alertOnSeaCreaturesCountThreshold ||
        !isInSkyblock() ||
        getWorldName() === 'Kuudra' ||
        !hasFishingRodInHotbar()
    ) {
        return;
    }

    const seaCreaturesCountThreshold = getSeaCreaturesCountThreshold();

    if (mobsCount >= seaCreaturesCountThreshold && !killMobsCountNotificationShown) {
        killMobsCountNotificationShown = true;
        Client.showTitle(`${RED}Kill sea creatures`, `${WHITE}${seaCreaturesCountThreshold}+ mobs`, 1, 45, 1);

        if (settings.soundMode !== OFF_SOUND_MODE)
        {
            new Sound(TIMER_SOUND_SOURCE).play();
        }
    } else if (mobsCount < seaCreaturesCountThreshold && killMobsCountNotificationShown) {
        killMobsCountNotificationShown = false;
    }
}

export function alertOnSeaCreaturesTimerThreshold() {
    if (!startTime ||
        !settings.alertOnSeaCreaturesTimerThreshold ||
        !isInSkyblock() ||
        getWorldName() === 'Kuudra' ||
        !hasFishingRodInHotbar()
    ) {
        return;
    }

    const deltaInSeconds = Math.ceil(Math.abs(new Date().getTime() - startTime) / 1000);
    const thresholdInSeconds = TIMER_THRESHOLD_IN_MINUTES * 60;

    if (deltaInSeconds >= thresholdInSeconds && !killMobsTimerNotificationShown) {
        killMobsTimerNotificationShown = true;
        Client.showTitle(`${RED}Kill sea creatures`, `${WHITE}${TIMER_THRESHOLD_IN_MINUTES}+ minutes`, 1, 45, 1);

        if (settings.soundMode !== OFF_SOUND_MODE)
        {
            new Sound(TIMER_SOUND_SOURCE).play();
        }
    } else if (deltaInSeconds < thresholdInSeconds && killMobsTimerNotificationShown) {
        killMobsTimerNotificationShown = false;
    }
}

export function renderCountOverlay() {
    if (!settings.seaCreaturesCountOverlay ||
        !mobsCount ||
        !startTime ||
        !isInSkyblock() ||
        getWorldName() === 'Kuudra' ||
        !hasFishingRodInHotbar()) {
        return;
    }

    const deltaInSeconds = Math.ceil(Math.abs(new Date().getTime() - startTime) / 1000);
    const minutesSeconds = new Date(deltaInSeconds * 1000).toISOString().substring(14, 19); // mm:ss
    const minutes = +minutesSeconds.substring(0, 2);
    const seconds = +minutesSeconds.substring(3);

    if (!minutes && !seconds) {
        return;
    }

    const timerText = `${minutes > 0 ? minutes + 'm ' : ''}${seconds > 0 || minutes > 0 ? seconds + 's' : ''}`;
    const timerColor = minutes >= TIMER_THRESHOLD_IN_MINUTES ? RED : GOLD;
    const seaCreaturesText = mobsCount > 1 ? 'sea creatures' : 'sea creature';
    const seaCreaturesColor = mobsCount >= getSeaCreaturesCountThreshold() ? RED : GOLD;

    const overlayText = `${seaCreaturesColor}${mobsCount} ${WHITE}${seaCreaturesText} ${DARK_GRAY}(${timerColor}${timerText}${DARK_GRAY})`;
    const overlay = new Text(overlayText, overlayCoordsData.seaCreaturesCountOverlay.x, overlayCoordsData.seaCreaturesCountOverlay.y)
        .setShadow(true)
        .setScale(overlayCoordsData.seaCreaturesCountOverlay.scale);
    overlay.draw();
}

function getSeaCreaturesCountThreshold() {
    const worldName = getWorldName();

    switch (worldName)
    {
        case 'Hub': return settings.seaCreaturesCountThreshold_Hub;
        case 'Crimson Isle': return settings.seaCreaturesCountThreshold_CrimsonIsle;
        case 'Crystal Hollows': return settings.seaCreaturesCountThreshold_CrystalHollows;
        default: return settings.seaCreaturesCountThreshold_Default;
    }
}