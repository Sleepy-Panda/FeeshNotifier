import settings from "../../settings";
import { EntityArmorStand } from "../../constants/javaTypes";
import { TIMER_SOUND, OFF_SOUND_MODE } from "../../constants/sounds";

let playerTotemPosition;
const currentPlayer = Player.getName();
const secondsBeforeExpiration = 10;

export function notifyOnPlayersTotemExpiration(options) {
    if (!options.isAlertEnabled) {
		return;
	}

	World.getAllEntitiesOfType(EntityArmorStand).forEach(entity => {
        const name = entity?.getName()?.removeFormatting();

        if (name.includes('Owner:') && name.includes(currentPlayer)) {
            playerTotemPosition = entity.getPos();
        } 

        if (playerTotemPosition && name.includes(`Remaining: ${secondsBeforeExpiration}s`)) {
            const position = entity.getPos();

            if (position.x === playerTotemPosition.x && position.z === playerTotemPosition.z) {
                Client.showTitle(`&cYour totem expires in ${secondsBeforeExpiration} seconds`, '', 1, 60, 1);

                if (settings.soundMode !== OFF_SOUND_MODE)
                {
                    TIMER_SOUND.play();
                }
            }
        }
    })	
}