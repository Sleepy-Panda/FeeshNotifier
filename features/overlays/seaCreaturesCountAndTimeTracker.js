import settings, { allOverlaysGui } from "../../settings";
import { GOLD, RED, DARK_GRAY, WHITE, GRAY } from "../../constants/formatting";
import { TIMER_SOUND_SOURCE, OFF_SOUND_MODE } from "../../constants/sounds";
import { ALL_SEA_CREATURES_NAMES } from "../../constants/seaCreatures";
import { EntityArmorStand } from "../../constants/javaTypes";
import { overlayCoordsData } from "../../data/overlayCoords";
import { getWorldName, hasFishingRodInHotbar, isInHunterArmor, isInSkyblock } from "../../utils/playerState";
import { CRIMSON_ISLE, CRYSTAL_HOLLOWS, HUB } from "../../constants/areas";
import { createButtonsDisplay, toggleButtonsDisplay } from "../../utils/overlays";
import { registerIf } from "../../utils/registers";
import { isInFishingWorld } from "../../utils/common";

const TIMER_THRESHOLD_IN_MINUTES = 5;

let mobsCount = 0;
let startTime = null;
let killMobsCountNotificationShown = false;
let killMobsTimerNotificationShown = false;

registerIf(
    register('step', () => trackSeaCreaturesCount()).setFps(2),
    () => (settings.alertOnSeaCreaturesCountThreshold || settings.alertOnSeaCreaturesTimerThreshold || settings.seaCreaturesCountOverlay) && isInSkyblock() && isInFishingWorld(getWorldName())
);

registerIf(
    register('step', () => {
        alertOnSeaCreaturesCountThreshold();
        alertOnSeaCreaturesTimerThreshold();
    }).setFps(1),
    () => (settings.alertOnSeaCreaturesCountThreshold || settings.alertOnSeaCreaturesTimerThreshold) && isInSkyblock() && isInFishingWorld(getWorldName())
);

registerIf(
    register('renderOverlay', () => renderCountOverlay()),
    () => settings.seaCreaturesCountOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
);

register("worldUnload", () => {
    resetTimer();
});

const buttonsDisplay = createButtonsDisplay(true, () => resetTimer(), false, null);

function resetTimer() {
    startTime = null;
    mobsCount = 0;
}

function trackSeaCreaturesCount() {
    if ((!settings.alertOnSeaCreaturesCountThreshold && !settings.alertOnSeaCreaturesTimerThreshold && !settings.seaCreaturesCountOverlay) || !isInSkyblock() || !isInFishingWorld(getWorldName())) {
        return;
    }

    let newMobsCount = 0;
    const entities = World.getAllEntitiesOfType(EntityArmorStand);
	entities.forEach(entity => {
        const plainName = entity?.getName()?.removeFormatting();

        // Mobs / corrupted mobs have prefix like [Lv100], only Grinch does not have it
        // This check is needed to exclude Necromancy souls and pets
        if ((plainName.includes('[Lv') && plainName.includes('❤') && 
            ALL_SEA_CREATURES_NAMES.some(sc => plainName.includes(sc))) || plainName.includes('Grinch  ❤')) {
            if (plainName.includes('Rider of the Deep')) {
                newMobsCount += 2;
            } else {
                newMobsCount++;
            }
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

function alertOnSeaCreaturesCountThreshold() {
    if (!settings.alertOnSeaCreaturesCountThreshold ||
        !isInSkyblock() ||
        !isInFishingWorld(getWorldName()) ||
        isInHunterArmor() ||
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

function alertOnSeaCreaturesTimerThreshold() {
    if (!startTime ||
        !settings.alertOnSeaCreaturesTimerThreshold ||
        !isInSkyblock() ||
        !isInFishingWorld(getWorldName()) ||
        isInHunterArmor() ||
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

function renderCountOverlay() {
    if (!settings.seaCreaturesCountOverlay ||
        !mobsCount ||
        !startTime ||
        !isInSkyblock() ||
        !isInFishingWorld(getWorldName()) ||
        isInHunterArmor() ||
        !hasFishingRodInHotbar() ||
        allOverlaysGui.isOpen()
    ) {
        buttonsDisplay.hide();
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

    const overlayText = `${seaCreaturesColor}${mobsCount} ${GRAY}${seaCreaturesText} ${DARK_GRAY}(${timerColor}${timerText}${DARK_GRAY})`;
    const overlay = new Text(overlayText, overlayCoordsData.seaCreaturesCountOverlay.x, overlayCoordsData.seaCreaturesCountOverlay.y)
        .setShadow(true)
        .setScale(overlayCoordsData.seaCreaturesCountOverlay.scale);
    overlay.draw();

    toggleButtonsDisplay(buttonsDisplay, overlay, overlayCoordsData.seaCreaturesCountOverlay);
}

function getSeaCreaturesCountThreshold() {
    const worldName = getWorldName();

    switch (worldName)
    {
        case HUB: return settings.seaCreaturesCountThreshold_Hub;
        case CRIMSON_ISLE: return settings.seaCreaturesCountThreshold_CrimsonIsle;
        case CRYSTAL_HOLLOWS: return settings.seaCreaturesCountThreshold_CrystalHollows;
        default: return settings.seaCreaturesCountThreshold_Default;
    }
}