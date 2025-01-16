import settings from '../../settings';
import * as triggers from '../../constants/triggers';
import * as seaCreatures from '../../constants/seaCreatures';
import { isDoubleHook } from '../../utils/common';
import { isInSkyblock } from '../../utils/playerState';

const chatCommand = 'ac';

const mobTriggers = triggers.RARE_CATCH_TRIGGERS.filter(t => t.seaCreature === seaCreatures.THUNDER || t.seaCreature === seaCreatures.LORD_JAWBUS || t.seaCreature === seaCreatures.VANQUISHER);

mobTriggers.forEach(entry => {
    register(
        "Chat",
        (event) => {
            announceMobSpawnToAllChat(entry.seaCreature, entry.isAnnounceToAllChatEnabledSettingKey);
        }
    ).setCriteria(entry.trigger).setContains();
});

function announceMobSpawnToAllChat(seaCreature, isAnnounceToAllChatEnabledSettingKey) {
	try {
		if (!seaCreature || !isAnnounceToAllChatEnabledSettingKey || !settings[isAnnounceToAllChatEnabledSettingKey] || !isInSkyblock()) {
			return;
		}

        const isDoubleHooked = isDoubleHook();
		const message = getMessage(seaCreature, isDoubleHooked);
		ChatLib.command(chatCommand + ' ' + message);	
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to share the location.`);
	}
}

function getMessage(seaCreature, isDoubleHooked) {
    const location = `x: ${Math.round(Player.getX())}, y: ${Math.round(Player.getY())}, z: ${Math.round(Player.getZ())}`;
    const zone = Scoreboard.getLines().find((line) => line.getName().includes('⏣'));
    const messageId = ` @${(Math.random() + 1).toString(36).substring(4)}`; // Inspired by VolcAddons - to prevent "You cannot say the same message twice" error

    let message = '';
    message += `${location} | ${seaCreature} ${isDoubleHooked ? 'x2' : '' }${zone ? ' at ' + zone.getName().removeFormatting() : ''} | ${messageId}`;
    return message;
}