import settings from '../../settings';
import { DUNGEON_HUB, DUNGEONS, GARDEN, GLACITE_MINESHAFTS, KUUDRA, RIFT, THE_END } from '../../constants/areas';
import { EntityArmorStand } from '../../constants/javaTypes';
import { getWorldName, isInSkyblock } from '../../utils/playerState';
import { registerIf } from '../../utils/registers';

const CHAT_COMMAND = 'pc';
const EXCLUDED_WORLDS = [RIFT, GARDEN, KUUDRA, DUNGEON_HUB, DUNGEONS, THE_END, GLACITE_MINESHAFTS];

let slayerUUID = null;

registerIf(
    register('step', () => sendMessageOnRevenantSpawn()).setFps(3),
    () => settings.messageOnRevenantHorrorSpawn && isInSkyblock() && !EXCLUDED_WORLDS.includes(getWorldName())
);

function sendMessageOnRevenantSpawn() {
	try {
		if (!settings.messageOnRevenantHorrorSpawn || !isInSkyblock() || EXCLUDED_WORLDS.includes(getWorldName())) {
			return;
		}
	
        const entities = World.getAllEntitiesOfType(EntityArmorStand);

        const slayerOwner = entities.find(entity => {
            const plainName = entity?.getName()?.removeFormatting();
            return plainName.includes('Spawned by: ' + Player.getName());
        });

        if (!slayerOwner) {
            return;
        }

        const currentSlayerUUID = slayerOwner.getUUID();

        if (currentSlayerUUID === slayerUUID) {
            return;
        }

        slayerUUID = currentSlayerUUID;

	    const slayer = entities.find(entity => {
            const plainName = entity?.getName()?.removeFormatting();
            const position = entity.getPos();
            return (plainName.includes('☠ Atoned Horror') || plainName.includes('☠ Revenant Horror'))
                && !plainName?.endsWith(' 0❤')
                && position.x === slayerOwner.getPos().x && position.z === slayerOwner.getPos().z
                && entity.getPitch() === slayerOwner.getPitch()
        });

        if (!slayer) {
            return;
        }

        const location = `x: ${Math.round(slayer.getX())}, y: ${Math.round(slayer.getY())}, z: ${Math.round(slayer.getZ())}`;
		const message = `${location} | Revenant Horror`;
		ChatLib.command(CHAT_COMMAND + ' ' + message);
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to send the message on Revenant spawn.`);
	}
}