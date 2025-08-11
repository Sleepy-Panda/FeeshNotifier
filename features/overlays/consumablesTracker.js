import settings, { allOverlaysGui } from "../../settings";
import * as triggers from '../../constants/triggers';
import { overlayCoordsData } from "../../data/overlayCoords";
import { getWorldName, isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";
import { formatElapsedTimeWithUnits, isInFishingWorld } from "../../utils/common";
import { Overlay, OverlayTextLine } from "../../utils/overlays";
import { DARK_PURPLE, RED, WHITE } from "../../constants/formatting";
import { OFF_SOUND_MODE, TIMER_SOUND_SOURCE } from "../../constants/sounds";

let remainingTimes = {
    mobyDuck: {
        consumedAt: null,
        elapsedTime: 0,
        remainingTime: 0
    }
};

const MOBY_DUCK_EFFECTIVE_SECONDS = 3600;

registerIf(
    register("chat", (event) => {
        trackMobyDuckConsumed();
    }).setCriteria(triggers.MOBY_DUCK_CONSUMED).setStart(),
    () => (settings.consumablesRemainingTimeOverlay || settings.alertOnConsumableExpiresSoon) && isInSkyblock()
);

registerIf(
    register("chat", (seconds, event) => {
        trackMobyDuckExpiring(+seconds);
    }).setCriteria(triggers.MOBY_DUCK_EXPIRING).setStart(),
    () => (settings.consumablesRemainingTimeOverlay || settings.alertOnConsumableExpiresSoon) && isInSkyblock()
);

registerIf(
    register("chat", (event) => {
        trackMobyDuckExpired();
    }).setCriteria(triggers.MOBY_DUCK_EXPIRED).setStart(),
    () => (settings.consumablesRemainingTimeOverlay || settings.alertOnConsumableExpiresSoon) && isInSkyblock()
);

registerIf(
    register('step', () => trackMobyDuckStatus()).setFps(1),
    () => (settings.consumablesRemainingTimeOverlay || settings.alertOnConsumableExpiresSoon) && isInSkyblock()
);

registerIf(
    register('step', () => refreshOverlay()).setFps(2),
    () => settings.consumablesRemainingTimeOverlay && isInSkyblock() && isInFishingWorld(getWorldName())
);

const overlay = new Overlay(() => settings.consumablesRemainingTimeOverlay && isInSkyblock() && isInFishingWorld(getWorldName()))
    .setPositionData(overlayCoordsData.consumablesRemainingTimeOverlay)
    .setIsClickable(false);

function trackMobyDuckConsumed() {
    try {
        if ((!settings.consumablesRemainingTimeOverlay && !settings.alertOnConsumableExpiresSoon) || !isInSkyblock()) return;

        remainingTimes.mobyDuck = {
            consumedAt: new Date(),
            elapsedTime: 0,
            remainingTime: 3600
        };
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Moby-Duck consumed.`);
	}
}

function trackMobyDuckExpiring(remainingSeconds) {
    if (!remainingSeconds ||
        !remainingTimes.mobyDuck.consumedAt ||
        (!settings.consumablesRemainingTimeOverlay && !settings.alertOnConsumableExpiresSoon) ||
        !isInSkyblock()) {
            return;
        }

    remainingTimes.mobyDuck.elapsedTime = MOBY_DUCK_EFFECTIVE_SECONDS - remainingSeconds;
    remainingTimes.mobyDuck.remainingTime = remainingSeconds;

    if (remainingSeconds === 10) {
        Client.showTitle(`${DARK_PURPLE}Moby-Duck ${RED}expires soon`, '', 1, 30, 1);

        if (settings.soundMode !== OFF_SOUND_MODE)
        {
            new Sound(TIMER_SOUND_SOURCE).play();
        }
    }
}

function trackMobyDuckExpired() {
    try {
        if ((!settings.consumablesRemainingTimeOverlay && !settings.alertOnConsumableExpiresSoon) || !isInSkyblock()) return;

        remainingTimes.mobyDuck = {
            consumedAt: null,
            elapsedTime: 0,
            remainingTime: 0
        };
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Moby-Duck expired.`);
	}
}

function trackMobyDuckStatus() {
    try {
        if ((!settings.consumablesRemainingTimeOverlay && !settings.alertOnConsumableExpiresSoon) || !isInSkyblock()) return;

        if (remainingTimes.mobyDuck.elapsedTime >= MOBY_DUCK_EFFECTIVE_SECONDS) {
            trackMobyDuckExpired();
            return;
        }

        remainingTimes.mobyDuck.elapsedTime += 1;
        remainingTimes.mobyDuck.remainingTime = MOBY_DUCK_EFFECTIVE_SECONDS - remainingTimes.mobyDuck.elapsedTime;
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Moby-Duck status.`);
	}
}

function refreshOverlay() {
    overlay.clear();

    if (!settings.consumablesRemainingTimeOverlay ||
        !remainingTimes.mobyDuck.consumedAt ||
        remainingTimes.mobyDuck.remainingTime <= 0 ||
        !isInSkyblock() ||
        !isInFishingWorld(getWorldName()) ||
        allOverlaysGui.isOpen()
    ) {
        return;
    }

    overlay.addTextLine(new OverlayTextLine().setText(`${DARK_PURPLE}Moby-Duck: ${WHITE}${formatElapsedTimeWithUnits(remainingTimes.mobyDuck.remainingTime)}`));
}
