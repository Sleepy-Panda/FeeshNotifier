import settings from "../../settings";
import { GOLD, RED, DARK_GRAY, WHITE } from "../../constants/formatting";
import { TIMER_SOUND, OFF_SOUND_MODE } from "../../constants/sounds";
import { ALL_SEA_CREATURES_NAMES } from "../../constants/seaCreatures";
import { EntityArmorStand } from "../../constants/javaTypes";
import { overlayCoordsData } from "../../data/overlayCoords";
import { getWorldName, hasFishingRodInHotbar, isInSkyblock } from "../../utils/playerState";

let mobsCount = 0;
let startTime = null;
let killMobsNotificationShown = false;

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

    if (mobsCount >= seaCreaturesCountThreshold && !killMobsNotificationShown) {
        killMobsNotificationShown = true;
        Client.showTitle(`${RED}Kill sea creatures`, `${WHITE}${seaCreaturesCountThreshold}+ mobs`, 1, 60, 1);

        if (settings.soundMode !== OFF_SOUND_MODE)
        {
            TIMER_SOUND.play();
        }
    } else if (mobsCount < seaCreaturesCountThreshold && killMobsNotificationShown) {
        killMobsNotificationShown = false;
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
    const timerColor = minutes >= 5 ? RED : GOLD;
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