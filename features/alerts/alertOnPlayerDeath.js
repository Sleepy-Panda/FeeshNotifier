import settings from "../../settings";
import * as triggers from '../../constants/triggers';
import { MC_VILLAGER_DEATH_SOUND, OFF_SOUND_MODE } from "../../constants/sounds";
import { RED } from "../../constants/formatting";
import { isInSkyblock } from "../../utils/playerState";
import { getColoredPlayerNameFromPartyChat, getPartyChatMessage, getPlayerDeathMessage } from "../../utils/common";
import { registerIf } from "../../utils/registers";
import { playMcSound } from "../../utils/sound";

triggers.KILLED_BY_TRIGGERS.forEach(entry => {
	registerIf(
		register(
			"Chat",
			(rankAndPlayer, event) => playAlertOnPlayerDeath(getColoredPlayerNameFromPartyChat(rankAndPlayer))
		).setCriteria(getPartyChatMessage(getPlayerDeathMessage())),
		() => settings.alertOnPartyMemberDeath && isInSkyblock()
	);
});

// Shows a title and plays a sound on automated player death message sent by this module.
function playAlertOnPlayerDeath(player) {
	try {
		if (!settings.alertOnPartyMemberDeath || !isInSkyblock()) {
			return;
		}
		
		// If the party message is sent by current player, no need to show alert.
		if (player && player.includes(Player.getName())) {
			return;
		}
	
		const title = `${player || 'Party member'} ${RED}killed ☠`;
		Client.showTitle(title, 'Wait for them to come back', 1, 30, 1);
	
		if (settings.soundMode !== OFF_SOUND_MODE) {
            playMcSound(MC_VILLAGER_DEATH_SOUND);
        }
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to play alert on party member's death.`);
	}
}