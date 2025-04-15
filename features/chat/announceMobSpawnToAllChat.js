import settings from '../../settings';
import * as triggers from '../../constants/triggers';
import * as seaCreatures from '../../constants/seaCreatures';
import { getMessageId, getZoneName, isDoubleHook } from '../../utils/common';
import { getWorldName, isInSkyblock } from '../../utils/playerState';
import { registerIf } from '../../utils/registers';
import { CRIMSON_ISLE } from '../../constants/areas';

const chatCommand = 'ac';

const mobTriggers = triggers.RARE_CATCH_TRIGGERS.filter(t =>
    t.seaCreature === seaCreatures.THUNDER ||
    t.seaCreature === seaCreatures.LORD_JAWBUS ||
    t.seaCreature === seaCreatures.PLHLEGBLAST ||
    t.seaCreature === seaCreatures.RAGNAROK ||
    t.seaCreature === seaCreatures.VANQUISHER
);

mobTriggers.forEach(entry => {
    registerIf(
        register("Chat", (event) => announceMobSpawnToAllChat(entry.seaCreature, entry.isAnnounceToAllChatEnabledSettingKey))
            .setCriteria(entry.trigger)
            .setContains(),
        () => isInSkyblock() && getWorldName() === CRIMSON_ISLE
    );
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
    const zone = getZoneName();
    const messageId = getMessageId();

    let message = '';
    message += `${location} | ${seaCreature} ${isDoubleHooked ? 'x2' : '' }${zone ? ' at ' + zone.getName().removeFormatting() : ''} | ${messageId}`;
    return message;
}