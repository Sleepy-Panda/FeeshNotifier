import { EntityArmorStand } from '../constants/javaTypes';
import { getMcEntityId, parseShortNumber } from './common';
import { FISH_ARRIVED, FISH_STATE_ARRIVED, FISH_STATE_ARRIVING, FISHING_HOOK_TIMER_UNTIL_REEL_IN_REGEX } from '../constants/fishingHookStates';

/**
 * Find all Hotspots within the specified range from the specified entity.
 * @returns {Array} Hotspots in the format { entity, position, perk }
 */
export function findHotspotsInRange(entity, distance) {
	if (!entity || !distance) return;

	const armorStands = World.getAllEntitiesOfType(EntityArmorStand).filter(as => as.distanceTo(entity) <= distance);
	const closeHotspotArmorStands = armorStands
		.filter(as => as?.getName()?.removeFormatting() === 'HOTSPOT')
		.sort((a, b) => a.distanceTo(entity) < b.distanceTo(entity))
		.map(as => {
			const obj = {
				entity: as,
				position: as.getPos(),
				perk: armorStands.find(e =>
					e.getX() === as.getX() &&
					e.getY() < as.getY() &&
					as.getY() - e.getY() <= 1 &&
					e.getZ() === as.getZ() &&
					e.getPitch() === as.getPitch())?.getName()
			};
			return obj;
		});

	return closeHotspotArmorStands;
}

/**
 * Find the closest Hotspot in the specified range from the specified entity.
 * @returns {Array} Hotspot in the format { entity, position, perk }
 */
export function findClosestHotspotInRange(entity, distance) {
	if (!entity || !distance) return;

	const armorStands = World.getAllEntitiesOfType(EntityArmorStand).filter(as => as.distanceTo(entity) <= distance);
	const closestHotspotArmorStand = armorStands
		.filter(as => as?.getName()?.removeFormatting() === 'HOTSPOT')
		.sort((a, b) => a.distanceTo(entity) < b.distanceTo(entity))
		.find(() => true); // Find first or null

	const closestHotspot = closestHotspotArmorStand
		? {
			entity: closestHotspotArmorStand,
			position: closestHotspotArmorStand.getPos(),
			perk: armorStands.find(e =>
				e.getX() === closestHotspotArmorStand.getX() &&
				e.getY() < closestHotspotArmorStand.getY() &&
				closestHotspotArmorStand.getY() - e.getY() <= 1 &&
				e.getZ() === closestHotspotArmorStand.getZ() &&
				e.getPitch() === closestHotspotArmorStand.getPitch())?.getName()
		}
		: null;

	return closestHotspot;
}

/**
 * Find the players within the specified range from the current player.
 * @returns {Array} Array of player names
 */
export function getPlayerNamesInRange(distance) {
	const players = World
		.getAllPlayers()
		.filter(player =>
			(player.getUUID().version() === 4 || player.getUUID().version() === 1) && // Players and Watchdog have version 4, nicked players have version 1, this is done to exclude NPCs
			player.ping === 1 && // -1 is watchdog and ghost players, also there is a ghost player with high ping value when joining a world
			player.name != Player.getName() && // Exclude current player because they do not count for legion
			player.distanceTo(Player.getPlayer()) <= distance
		)
		.map(player => player.name)
		.filter((x, i, a) => a.indexOf(x) == i); // Distinct, sometimes the players are duplicated in the list
		
	return players;
}

/**
 * Find the specific sea creatures in the specified range from the current player.
 * @param {Array} includedSeaCreatureNames Array of sea creature names without formatting, to find them in the world
 * @returns {Array} Sea creatures info in format: {
    mcEntityId: number;
    baseMobName: string;
    shortNametag: string;
    currentHpNumber: number;
	renderPos: object;
  } 
 */
export function getSeaCreaturesInRange(includedSeaCreatureNames, distance) {
	const entities = World.getAllEntitiesOfType(EntityArmorStand);
    const player = Player.getPlayer();

	const seaCreatures = entities
		.filter(entity => entity.distanceTo(player) <= distance)
		.map(entity => {
			const seaCreatureInfo = parseSeaCreatureNametag(entity, includedSeaCreatureNames);
        	if (!seaCreatureInfo) return null;
			return includedSeaCreatureNames.some(n => seaCreatureInfo.baseMobName === n) ? seaCreatureInfo : null; // Exact mob name match (e.g. exclude Night Squid if we search for Squid)
		})
		.filter(seaCreatureInfo => !!seaCreatureInfo);

	return seaCreatures;

	// Original nametag samples:
    // §8[§7Lv15§8] §9⚓§e✰ §cDumpster Diver§r §e1,086§f/§a2,500§c❤
    // §8[§7Lv15§8] §9⚓§e✰ §5§ka§5Corrupted Dumpster Diver§5§ka§r §a7,331§f/§a7,500§c❤ §b✯
    // §8[§7Lv15§8] §9⚓§e✰ §5§ka§5Corrupted Dumpster Diver§5§ka§r §a7,243§f/§a7,500§c❤ §b✯
    
    // §e﴾ §8[§7Lv600§8] §c♆§7⚙§d♣ §c§lLord Jawbus§r§r §a69M§f/§a100M§c❤ §e﴿
    // §e﴾ §8[§7Lv600§8] §c♆§7⚙§d♣ §c§lLord Jawbus§r§r §e6.3M§f/§a100M§c❤ §e﴿ §b✯
    // §8[§7Lv250§8] §c♆§e✰§a☮ §cJawbus Follower§r §a3M§f/§a3M§c❤
	function parseSeaCreatureNametag(entity, includedSeaCreatureNames) { 
		if (!entity) return null;

		const plainName = entity?.getName()?.removeFormatting();
		if (!plainName || !plainName.includes('[Lv') || !plainName.includes(']') || !plainName.includes('❤') || !includedSeaCreatureNames.some(n => plainName.includes(n))) return null;

		const name = entity.getName().replace('§e﴾ ', '').replace(' §e﴿', '').trim() || '';
		const shortName = name.split('] ')[1].replace('Corrupted ', '');
		const baseMobName = takeWhile(shortName.split(' '), part => !part.includes('/'))
			.join(' ')
			.replaceAll('§ka', '') // Corrupted character before and after mob name
			.removeFormatting()
			.replace(/[^a-zA-Z\s'-]/g, '')
			.trim();

		const currentHp = shortName.split('§f/')[0].split(' ').slice(-1)[0];

		return {
			mcEntityId: getMcEntityId(entity),
			baseMobName: baseMobName, // "Lord Jawbus" or "Squid"
			shortNametag: shortName, // §c♆§7⚙§d♣ §c§lLord Jawbus§r§r §a69M§f/§a100M§c❤ §b✯
			currentHpNumber: parseShortNumber(currentHp.removeFormatting()),
			renderPos: {
				x: entity.getRenderX(),
                y: entity.getRenderY(),
                z: entity.getRenderZ(),
			},
		};

		function takeWhile(arr, predicate) {
			if (!arr || !arr.length) return [];
			const i = arr.findIndex(x => !predicate(x));                
			return i >= 0 ? arr.slice(0, i) : arr;
		}
	}
}

/**
 * Find Hypixel's fishing hook timer near player's fishing hook.
 * @param {Entity} fishingHook player's fishing hook entity
 * @returns {Object|null} Fishing hook timer info
 */
export function getHypixelFishingHookTimer(fishingHook) {
	if (!fishingHook) return null;

	const entities = World.getAllEntitiesOfType(EntityArmorStand);
	const hypixelHookTimer = entities
		.filter(entity => entity.distanceTo(fishingHook) <= 1)
		.find(e => e.getName() === FISH_ARRIVED || FISHING_HOOK_TIMER_UNTIL_REEL_IN_REGEX.test(e.getName()));
	if (!hypixelHookTimer) return null;

	const result = {
		uuid: hypixelHookTimer.getUUID(),
		name: hypixelHookTimer.getName(),
		fishState: hypixelHookTimer.getName() === FISH_ARRIVED ? FISH_STATE_ARRIVED : FISH_STATE_ARRIVING,
	};

	return result;
}