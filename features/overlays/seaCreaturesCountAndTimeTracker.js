import settings from "../../settings";
import { GOLD, RED, DARK_GRAY, WHITE, GRAY, UNDERLINE } from "../../constants/formatting";
import { TIMER_SOUND_SOURCE, OFF_SOUND_MODE } from "../../constants/sounds";
import { ALL_SEA_CREATURES_NAMES } from "../../constants/seaCreatures";
import { EntityArmorStand } from "../../constants/javaTypes";
import { overlayCoordsData } from "../../data/overlayCoords";
import { getWorldName, hasFishingRodInHotbar, isInHunterArmor, isInSkyblock } from "../../utils/playerState";
import { CRIMSON_ISLE, CRYSTAL_HOLLOWS, HUB, KUUDRA } from "../../constants/areas";
import { isInChatOrInventoryGui } from "../../utils/common";

const TIMER_THRESHOLD_IN_MINUTES = 5;

let mobsCount = 0;
let startTime = null;
let killMobsCountNotificationShown = false;
let killMobsTimerNotificationShown = false;

register('step', () => trackSeaCreaturesCount()).setFps(2);
register('step', () => alertOnSeaCreaturesCountThreshold()).setFps(1);
register('step', () => alertOnSeaCreaturesTimerThreshold()).setFps(1);
register('renderOverlay', () => renderCountOverlay());
register("worldUnload", () => {
    resetTimer();
});

// DisplayLine is initialized once in order to avoid multiple method calls on click.
let resetTrackerDisplay = new Display().hide();
let resetTrackerDisplayLine = new DisplayLine(`${RED}[Click to reset]`).setShadow(true);
resetTrackerDisplayLine.registerClicked((x, y, mouseButton, buttonState) => {
    if (mouseButton === 0 && buttonState === false) { // When left mouse button is UP. 0 is left mouse button, false is UP, true is DOWN. 
        resetTimer();
    }
});
resetTrackerDisplayLine.registerHovered(() => resetTrackerDisplayLine.setText(`${RED}${UNDERLINE}[Click to reset]`).setShadow(true));
resetTrackerDisplayLine.registerMouseLeave(() => resetTrackerDisplayLine.setText(`${RED}[Click to reset]`).setShadow(true));
resetTrackerDisplay.addLine(resetTrackerDisplayLine);

function resetTimer() {
    startTime = null;
    mobsCount = 0;
}

function trackSeaCreaturesCount() {
    if ((!settings.alertOnSeaCreaturesCountThreshold && !settings.alertOnSeaCreaturesTimerThreshold && !settings.seaCreaturesCountOverlay) || !isInSkyblock()) {
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

function alertOnSeaCreaturesCountThreshold() {
    if (!settings.alertOnSeaCreaturesCountThreshold ||
        !isInSkyblock() ||
        isInHunterArmor() ||
        getWorldName() === KUUDRA ||
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
        isInHunterArmor() ||
        getWorldName() === KUUDRA ||
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
        isInHunterArmor() ||
        getWorldName() === KUUDRA ||
        !hasFishingRodInHotbar()
    ) {
        resetTrackerDisplay.hide();
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

    const shouldShowReset = isInChatOrInventoryGui();
    if (shouldShowReset) {
        resetTrackerDisplayLine.setScale(overlayCoordsData.seaCreaturesCountOverlay.scale - 0.2);
        resetTrackerDisplay
            .setRenderX(overlayCoordsData.seaCreaturesCountOverlay.x + overlay.getWidth() + 2)
            .setRenderY(overlayCoordsData.seaCreaturesCountOverlay.y + 1).show();
    } else {
        resetTrackerDisplay.hide();
    }
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