import settings from "../../settings";
import { overlayCoordsData } from "../../data/overlayCoords";
import { EntityArmorStand } from "../../constants/javaTypes";
import { TIMER_SOUND_SOURCE, OFF_SOUND_MODE } from "../../constants/sounds";
import { WHITE, RED, DARK_PURPLE } from "../../constants/formatting";
import { isInSkyblock } from "../../utils/playerState";

let remainingTotemTime; // Format examples: 01m 02s, 50s, 09s
let playerTotemPosition;
const currentPlayer = Player.getName();
const secondsBeforeExpiration = 10;

register('step', () => trackTotemStatus()).setFps(1);
register('renderOverlay', () => renderTotemOverlay());
register("worldUnload", () => {
    resetTotem();
});

function trackTotemStatus() {
    if ((!settings.alertOnTotemExpiresSoon && !settings.totemRemainingTimeOverlay) || !isInSkyblock()) {
        return;
    }

    const entities = World.getAllEntitiesOfType(EntityArmorStand);
    const hasPlayersTotem = entities.some(entity => {
        const name = entity?.getName()?.removeFormatting();
        return name.includes('Owner:') && name.includes(currentPlayer);
    });
    if (playerTotemPosition && !hasPlayersTotem) {
        resetTotem();
    }

	entities.forEach(entity => {
        const name = entity?.getName()?.removeFormatting();

        if (name.includes('Owner:') && name.includes(currentPlayer)) {
            playerTotemPosition = entity.getPos();
        }

        if (playerTotemPosition && name.includes('Remaining: ')) {
            const position = entity.getPos();
            if (position.x === playerTotemPosition.x && position.z === playerTotemPosition.z) {
                remainingTotemTime = name.split('Remaining: ').pop();

                if (settings.alertOnTotemExpiresSoon && remainingTotemTime && remainingTotemTime === `${secondsBeforeExpiration}s`) {
                    Client.showTitle(`${DARK_PURPLE}Totem ${RED}expires soon`, '', 1, 30, 1);

                    if (settings.soundMode !== OFF_SOUND_MODE)
                    {
                        new Sound(TIMER_SOUND_SOURCE).play();
                    }
                }
            }
        } 
    })	
}

function renderTotemOverlay() {
    if (!settings.totemRemainingTimeOverlay || !remainingTotemTime || remainingTotemTime === '00s' || !isInSkyblock()) {
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
    playerTotemPosition = null;
    remainingTotemTime = null;
}