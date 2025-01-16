import settings from "../../settings";
import { overlayCoordsData } from "../../data/overlayCoords";
import { EntityArmorStand } from "../../constants/javaTypes";
import { TIMER_SOUND, OFF_SOUND_MODE } from "../../constants/sounds";
import { WHITE, GOLD } from "../../constants/formatting";
import { isInSkyblock } from "../../utils/common";

let remainingTotemTime;
let playerTotemPosition;
const currentPlayer = Player.getName();
const secondsBeforeExpiration = 10;

export function trackTotemStatus() {
    if (!settings.alertOnTotemExpiresSoon && !settings.totemRemainingTimeOverlay || !isInSkyblock()) {
        return;
    }

    const entities = World.getAllEntitiesOfType(EntityArmorStand);
    const hasPlayersTotem = entities.some(entity => {
        const name = entity?.getName()?.removeFormatting();
        return name.includes('Owner:') && name.includes(currentPlayer);
    });
    if (playerTotemPosition && !hasPlayersTotem) {
        playerTotemPosition = null;
        remainingTotemTime = null;
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
                    Client.showTitle(`&cYour totem expires in ${secondsBeforeExpiration} seconds`, '', 1, 60, 1);

                    if (settings.soundMode !== OFF_SOUND_MODE)
                    {
                        TIMER_SOUND.play();
                    }
                }
            }
        } 
    })	
}

export function renderTotemOverlay() {
    if (!settings.totemRemainingTimeOverlay || !remainingTotemTime || !isInSkyblock()) {
        return;
    }

    const overlayText = `${GOLD}Remaining totem time: ${WHITE}${remainingTotemTime}`;
    const overlay = new Text(overlayText, overlayCoordsData.totemRemainingTimeOverlay.x, overlayCoordsData.totemRemainingTimeOverlay.y)
        .setShadow(true)
        .setScale(overlayCoordsData.totemRemainingTimeOverlay.scale);
    overlay.draw();
}