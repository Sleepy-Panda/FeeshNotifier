import { EntityArmorStand } from '../constants/javaTypes';

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
