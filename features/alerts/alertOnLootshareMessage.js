import settings from "../../settings";
import { MC_RANDOM_ORB_SOUND, OFF_SOUND_MODE } from "../../constants/sounds";
import { isInSkyblock } from "../../utils/playerState";
import { playMcSound } from "../../utils/sound";
import { getPartyChatMessage } from "../../utils/common";
import { BOLD, GREEN } from "../../constants/formatting";
import { registerIf } from "../../utils/registers";

const MESSAGE_PAYLOAD = "Lootshare!";

export function sendLootshareMessage() {
    ChatLib.command('pc ' + MESSAGE_PAYLOAD);
}

registerIf(
	register("Chat", (rankAndPlayer, event) => playAlertOnLootshareMessage(rankAndPlayer)).setCriteria(getPartyChatMessage(MESSAGE_PAYLOAD)).setStart(),
	() => settings.alertOnLootshareMessage && isInSkyblock()
);

function playAlertOnLootshareMessage(rankAndPlayer) {
    try {
        if (!settings.alertOnLootshareMessage || !isInSkyblock()) return;
        if (rankAndPlayer.includes(Player.getName())) return;
        
        const title = `${GREEN}${BOLD}Lootshare!`;
        Client.showTitle(title, '', 1, 45, 1);
    
        if (settings.soundMode !== OFF_SOUND_MODE) {
            playMcSound(MC_RANDOM_ORB_SOUND);
        }
    } catch (e) {
        console.error(e);
        console.log(`[FeeshNotifier] Failed to play alert on lootshare message.`);
    }
}