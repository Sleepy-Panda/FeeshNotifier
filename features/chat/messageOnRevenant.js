import settings from '../../settings';
import { DUNGEON_HUB, DUNGEONS, GARDEN, GLACITE_MINESHAFTS, KUUDRA, PRIVATE_ISLAND, RIFT, THE_END } from '../../constants/areas';
import { EntityArmorStand } from '../../constants/javaTypes';
import { getWorldName, isInSkyblock } from '../../utils/playerState';
import { registerIf } from '../../utils/registers';
import { getMcEntityById, getMcEntityId } from '../../utils/common';

const CHAT_COMMAND = 'pc';
const EXCLUDED_WORLDS = [PRIVATE_ISLAND, RIFT, GARDEN, KUUDRA, DUNGEON_HUB, DUNGEONS, THE_END, GLACITE_MINESHAFTS];

let slayerID = null;

registerIf(
    register('step', () => sendMessageOnRevenantSpawn()).setFps(3),
    () => settings.messageOnRevenantHorrorSpawn && isInSkyblock() && !EXCLUDED_WORLDS.includes(getWorldName())
);

register("worldUnload", () => {
    slayerID = null;
});


function sendMessageOnRevenantSpawn() {
	try {
		if (!settings.messageOnRevenantHorrorSpawn || !isInSkyblock() || EXCLUDED_WORLDS.includes(getWorldName())) {
			return;
		}
	
        const entities = World.getAllEntitiesOfType(EntityArmorStand);

        // ☠ Revenant Horror: 255719
        // Timer: 255720
        // Spawned by: 255721

        const slayerOwnerArmorStand = entities.find(entity => {
            const plainName = entity?.getName()?.removeFormatting();
            return plainName.includes('Spawned by: ' + Player.getName());
        });

        if (!slayerOwnerArmorStand) {
            return;
        }

        const slayerOwnerArmorStandId = getMcEntityId(slayerOwnerArmorStand);

        const slayerTypeArmorStand = getMcEntityById(slayerOwnerArmorStandId - 2);
        if (!slayerTypeArmorStand || !(slayerTypeArmorStand instanceof net.minecraft.entity.decoration.ArmorStandEntity)) {
            return;
        }
    
        const slayerTypeArmorStandName = slayerTypeArmorStand.func_95999_t()?.removeFormatting(); // func_95999_t -> getCustomNameTag()
        if (slayerTypeArmorStandName.endsWith(' 0❤') || (!slayerTypeArmorStandName.includes('☠ Revenant Horror') && !slayerTypeArmorStandName.includes('☠ Atoned Horror'))) {
            return;
        }

        const currentSlayerID = slayerOwnerArmorStandId;
        if (currentSlayerID === slayerID) {
            return;
        }

        slayerID = currentSlayerID;

        const location = `x: ${Math.round(slayerOwnerArmorStand.getX())}, y: ${Math.round(slayerOwnerArmorStand.getY())}, z: ${Math.round(slayerOwnerArmorStand.getZ())}`;
		const message = `${location} | Revenant Horror`;
		ChatLib.command(CHAT_COMMAND + ' ' + message);
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to send the message on Revenant spawn.`);
	}
}