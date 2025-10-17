import { CRIMSON_ISLE, PLHLEGBLAST_POOL } from "../constants/areas";
import { getPlayerFishingHook, isFishingHookActive, isFishingRod } from "./common";
import { findClosestHotspotInRange } from "./entityDetection";

var inSkyblock = false;
var worldName = null;
var zoneName = null;

var hasFishingRodInHotbar = false;
var hasDirtRodInHand = false;
var isInHunterArmor = false;
var lastFishingHookSeenAt = null;
var lastFishingHookInHotspotSeenAt = null;

var lastKatUpgrade = {
	lastPetClaimedAt: null,
	petDisplayName: null
};

var lastGuisClosed = {
	lastStorageGuiClosedAt: null,
	lastSacksGuiClosedAt: null,
	lastCraftGuiClosedAt: null,
	lastSupercraftGuiClosedAt: null,
	lastOdgerGuiClosedAt: null,
	lastAuctionGuiClosedAt: null,
	lastBazaarGuiClosedAt: null,
	lastHotmGuiClosedAt: null,
};

register('step', () => trackPlayerState()).setFps(2);

function trackPlayerState() {
	try {
		const prevInSkyblock = inSkyblock;
		const prevWorldName = worldName;

		setInSkyblock();
		setWorldName();
		setZoneName();

		if (prevInSkyblock !== inSkyblock || prevWorldName !== worldName) {
			lastFishingHookSeenAt = null;
			lastFishingHookInHotspotSeenAt = null;
		}

		setHasFishingRodInHotbar();
		setLastFishingHookSeenAt();
		setLastFishingHookInHotspotSeenAt();
		setHasDirtRodInHand();
		setIsInHunterArmor();	
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track player's state.`);
	}
}

register("guiClosed", (gui) => {
    if (!gui) return;

	const chestName = gui.getTitle()?.getString();
	if (!chestName) return;

    if (chestName.includes('Sack')) {
        lastGuisClosed.lastSacksGuiClosedAt = new Date();
    } else if (chestName.includes('Trophy Fishing')) {
        lastGuisClosed.lastOdgerGuiClosedAt = new Date();
    } else if (chestName.includes('Manage Auctions') || chestName.includes('Confirm Purchase') || chestName.includes('BIN Auction View') || chestName.includes('Your Bids')) {
        lastGuisClosed.lastAuctionGuiClosedAt = new Date();
    } else if (chestName.endsWith('Recipe')) {
        lastGuisClosed.lastSupercraftGuiClosedAt = new Date();
    } else if (chestName.includes('Craft Item')) {
        lastGuisClosed.lastCraftGuiClosedAt = new Date();
    } else if (chestName.includes('Backpack') || chestName.includes('Chest') || chestName.includes('Ender Chest')) {
		lastGuisClosed.lastStorageGuiClosedAt = new Date();
	}  else if (chestName.includes('Bazaar Orders') || chestName.includes('Order options') || chestName.includes('Instant Buy')) {
        lastGuisClosed.lastBazaarGuiClosedAt = new Date();
    } else if (chestName.includes('Heart of the Mountain')) { // Heart of the Mountain, Reset Heart of the Mountain (5)
        lastGuisClosed.lastHotmGuiClosedAt = new Date();
    }
});

[
	'&e[NPC] &bKat&f: &rI was able to upgrade your pet ${petDisplayName}&f to ${*}&f.', // petDisplayName contains old rarity, &e[NPC] &bKat&f: &rI was able to upgrade your pet &5Guardian&f to &6§LLEGENDARY&f.&r
	'&e[NPC] &bKat&f: &b✆ &f&rHi! I\'ve finished training your ${petDisplayName}&f!' // petDisplayName contains new rarity, &e[NPC] &bKat&f: &b✆ &f&rHi! I've finished training your &5Guardian&f!&r
].forEach(entry => {
	register("Chat", (petDisplayName, event) => {
		lastKatUpgrade = {
			lastPetClaimedAt: new Date(),
			petDisplayName: petDisplayName
		};
	}).setCriteria(entry).setStart(); 
});

export function isInSkyblock() {
	return inSkyblock;
}

export function getWorldName() {
	return worldName;
}

export function getZoneName() {
	return zoneName;
}

export function hasFishingRodInHotbar() {
	return hasFishingRodInHotbar;
}

export function hasDirtRodInHand() {
	return hasDirtRodInHand;
}

export function isInHunterArmor() {
	return isInHunterArmor;
}

export function getLastFishingHookSeenAt() {
	return lastFishingHookSeenAt;
}

export function getLastFishingHookInHotspotSeenAt() {
	return lastFishingHookInHotspotSeenAt;
}

export function getLastGuisClosed() {
	return lastGuisClosed;
}

export function getLastKatUpgrade() {
	return lastKatUpgrade;
}

function setInSkyblock() {
	const scoreboardTitle = Scoreboard.getTitle()?.toString()?.removeFormatting();
	inSkyblock = scoreboardTitle ? scoreboardTitle.includes('SKYBLOCK') : false;
}

function setWorldName() {
	if (!inSkyblock) {
		worldName = null;
		return;
	}
	
	const world = TabList.getNames().find(tab => tab.toString().includes("Area: "));
	if (!world) {
		worldName = null;
	} else {
		const formattedName = world.toString().removeFormatting();
		worldName = formattedName.substring(formattedName.indexOf(': ') + 2);
	}
}

function setZoneName() {
	if (!inSkyblock || !worldName) {
		zoneName = null;
		return;
	}
	
	const zone = Scoreboard.getLines().find((line) => line.toString().includes('⏣'));
	if (!zone) {
		zoneName = null;
	} else {
		const plainName = zone.toString()?.removeFormatting();
		zoneName = plainName?.replace(/[^\u0000-\u007F]/g, '')?.trim(); // Abandoned🐍 Quarry

		// Some lava in Phlegblast area does not belong to Phlegblast Pool zone but needs to be counted
		if (worldName === CRIMSON_ISLE && zoneName === CRIMSON_ISLE) {
			const x = Player.getX();
			const y = Player.getY();
			const z = Player.getZ();
		
			if (isBetweenIncluding(x, -381, -370) && isBetweenIncluding(y, 68, 72) && isBetweenIncluding(z, -708, -697)) {
				zoneName = PLHLEGBLAST_POOL;
			}
		}
	}

	function isBetweenIncluding(value, num1, num2) {
		return value >= num1 && value <= num2;
	}
}

function setHasFishingRodInHotbar() {
	if (!inSkyblock) {
		hasFishingRodInHotbar = false;
		return;
	}

	const hotbarItems = Player.getInventory()?.getItems()?.slice(0, 8);
	if (!hotbarItems || !hotbarItems.length) {
		hasFishingRodInHotbar = false;
	} else {
		const rods = hotbarItems.filter(i => i && isFishingRod(i));
		hasFishingRodInHotbar = rods && rods.length;
	}
}

function setHasDirtRodInHand() {
	if (!inSkyblock) {
		hasDirtRodInHand = false;
		return;
	}

	const heldItem = Player.getHeldItem();
	if (!heldItem) {
		hasDirtRodInHand = false;
	} else {
		const isDirtRod = heldItem?.getName()?.includes('Dirt Rod');
		hasDirtRodInHand = isDirtRod;
	}
}

function setIsInHunterArmor() {
	if (!inSkyblock) {
		isInHunterArmor = false;
		return;
	}

	const armor = Player?.armor;
	const helmetName = armor?.getHelmet()?.getName();
	const chestplateName = armor?.getChestplate()?.getName();
	const leggingsName = armor?.getLeggings()?.getName();
	const bootsName = armor?.getBoots()?.getName();
	const hunter = 'Hunter';

	if (!helmetName || !chestplateName || !leggingsName || !bootsName) {
		isInHunterArmor = false;
		return;
	}

	if (helmetName.includes(hunter) && chestplateName.includes(hunter) && leggingsName.includes(hunter) && bootsName.includes(hunter)) {
		isInHunterArmor = true;
	} else {
		isInHunterArmor = false;
	}
}

function setLastFishingHookSeenAt() {
	if (!inSkyblock) {
		return;
	}

	const isHookActive = isFishingHookActive();
    if (isHookActive) {
        lastFishingHookSeenAt = new Date();
    }
}

function setLastFishingHookInHotspotSeenAt() {
	if (!inSkyblock) {
		return;
	}

	const isHookActive = isFishingHookActive();
	if (!isHookActive) return;

	var playerHook = getPlayerFishingHook();
	if (!playerHook) return;

	const HOTSPOT_RANGE = 7;
	const closestHotspot = findClosestHotspotInRange(playerHook, HOTSPOT_RANGE);
	if (closestHotspot) {
		lastFishingHookInHotspotSeenAt = new Date();
	}
}