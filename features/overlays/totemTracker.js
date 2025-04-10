import settings, { allOverlaysGui } from "../../settings";
import { overlayCoordsData } from "../../data/overlayCoords";
import { EntityArmorStand } from "../../constants/javaTypes";
import { TIMER_SOUND_SOURCE, OFF_SOUND_MODE } from "../../constants/sounds";
import { WHITE, RED, DARK_PURPLE, GOLD } from "../../constants/formatting";
import { isInSkyblock } from "../../utils/playerState";
import { registerIf } from "../../utils/registers";
import { getMcEntityById, getMcEntityId } from "../../utils/common";

let remainingTotemTime; // Format examples: 01m 02s, 50s, 09s
let lastAlertAt = null; // Prevent alerting 2 times when register rarely triggers twice per second

const currentPlayer = Player.getName();
const secondsBeforeExpiration = 10;

registerIf(
    register('step', () => trackTotemStatus()).setFps(1),
    () => (settings.alertOnTotemExpiresSoon || settings.totemRemainingTimeOverlay) && isInSkyblock()
);

registerIf(
    register('renderOverlay', () => renderTotemOverlay()),
    () => settings.totemRemainingTimeOverlay && isInSkyblock()
);

register("worldUnload", () => {
    resetTotem();
});

function trackTotemStatus() {
    try {
        if ((!settings.alertOnTotemExpiresSoon && !settings.totemRemainingTimeOverlay) || !isInSkyblock()) {
            return;
        }

        const entities = World.getAllEntitiesOfType(EntityArmorStand);
        const ownerArmorStand = entities.find(entity => {
            const name = entity?.getName()?.removeFormatting();
            return name.includes('Owner:') && name.includes(currentPlayer);
        });
        if (!ownerArmorStand) {
            resetTotem();
            return;
        }
    
        const ownerArmorStandId = getMcEntityId(ownerArmorStand);
        const totemArmorStand = getMcEntityById(ownerArmorStandId - 2);
        if (!totemArmorStand || !(totemArmorStand instanceof net.minecraft.entity.item.EntityArmorStand)) return;
    
        const totemArmorStandName = totemArmorStand.func_95999_t()?.removeFormatting(); // func_95999_t -> getCustomNameTag()
        if (totemArmorStandName !== 'Totem of Corruption') {
            resetTotem();
            return;
        }
    
        const remainingArmorStand = getMcEntityById(ownerArmorStandId - 1);
        if (!remainingArmorStand || !(remainingArmorStand instanceof net.minecraft.entity.item.EntityArmorStand)) return;
    
        const remainingArmorStandName = remainingArmorStand.func_95999_t()?.removeFormatting(); // func_95999_t -> getCustomNameTag()
        if (!remainingArmorStandName?.includes('Remaining: ')) {
            resetTotem();
            return;
        }
    
        remainingTotemTime = remainingArmorStandName.split('Remaining: ').pop();

        playAlertOnExpiration();
    } catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track Totem status.`);
	}

    function playAlertOnExpiration() {
        if (!settings.alertOnTotemExpiresSoon ||
            remainingTotemTime !== `${secondsBeforeExpiration}s` ||
            (lastAlertAt && new Date() - lastAlertAt < 1000)) {
            return;
        }

        Client.showTitle(`${DARK_PURPLE}Totem ${RED}expires soon`, '', 1, 30, 1);
        ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Your ${DARK_PURPLE}Totem of Corruption ${WHITE}expires soon.`);
        lastAlertAt = new Date();

        if (settings.soundMode !== OFF_SOUND_MODE)
        {
            new Sound(TIMER_SOUND_SOURCE).play();
        }
    }
}

function renderTotemOverlay() {
    if (!settings.totemRemainingTimeOverlay || !remainingTotemTime || remainingTotemTime === '00s' || !isInSkyblock() || allOverlaysGui.isOpen()) {
        return;
    }

    const timerColor = !remainingTotemTime.includes('m') && remainingTotemTime.slice(0, -1) <= secondsBeforeExpiration ? RED : WHITE;
    const overlayText = `${DARK_PURPLE}Totem of Corruption: ${timerColor}${remainingTotemTime}`;
    const overlay = new Text(overlayText, overlayCoordsData.totemRemainingTimeOverlay.x, overlayCoordsData.totemRemainingTimeOverlay.y)
        .setShadow(true)
        .setScale(overlayCoordsData.totemRemainingTimeOverlay.scale);
    overlay.draw();
}

function resetTotem() {
    remainingTotemTime = null;
    lastAlertAt = null;
}
