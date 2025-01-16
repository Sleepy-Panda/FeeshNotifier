import { isFishingRod } from "./common";
import { updateRegisters } from "./registers";

var isInSkyblock = false;
var worldName = null;

var hasFishingRodInHotbar = false;
var hasDirtRodInHand = false;
var isInHunterArmor = false;

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
};

register("worldUnload", () => {
	isInSkyblock = false;
	worldName = null;
});

var trackWorldAttempt = 0;

register("worldLoad", () => {
	isInSkyblock = false;
	worldName = null;
	trackWorldAttempt = 0;
	setTimeout(trackWorld, 500);
});

register('step', () => trackPlayerState()).setFps(2);

function trackWorld() {
	try {
		if (trackWorldAttempt > 10) {
			console.log('[FeeshNotifier] Failed to detect the current world after 10 attempts.')
			return;
		}

		trackWorldAttempt++;

		const scoreboardTitle = Scoreboard?.getTitle();
		if (!scoreboardTitle) {
			isInSkyblock = false;
			worldName = null;
			setTimeout(trackWorld, 1000);
			return;
		}

		isInSkyblock = hasSkyblockInScoreboard();

		if (!isInSkyblock) {
			worldName = null;
			updateRegisters();
			return;
		}

		const detectedWorld = TabList?.getNames()?.find(tab => tab.includes("Area: "));
		if (!detectedWorld) {
			worldName = null;
			setTimeout(trackWorld, 1000);
			return;
		}

		const cleanName = detectedWorld?.removeFormatting();
		worldName = cleanName.substring(cleanName.indexOf(': ') + 2);
		updateRegisters();
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track player's world.`);
	}
}

function trackPlayerState() {
	try {
		setHasFishingRodInHotbar();
		setHasDirtRodInHand();
		setIsInHunterArmor();	
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track player's state.`);
	}
}

register("guiClosed", (gui) => {
    if (!gui) {
        return;
    }

    const chestName = gui.field_147002_h?.func_85151_d()?.func_145748_c_()?.text;
    if (!chestName) {
        return;
    }

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
    }
});

[
	'&e[NPC] &bKat&f: &rI was able to upgrade your pet ${petDisplayName}&f to ${*}&f.&r', // petDisplayName contains old rarity, &e[NPC] &bKat&f: &rI was able to upgrade your pet &5Guardian&f to &6§LLEGENDARY&f.&r
	'&e[NPC] &bKat&f: &b✆ &f&rHi! I\'ve finished training your ${petDisplayName}&f!&r' // petDisplayName contains new rarity, &e[NPC] &bKat&f: &b✆ &f&rHi! I've finished training your &5Guardian&f!&r
].forEach(entry => {
	register("Chat", (petDisplayName, event) => {
		lastKatUpgrade = {
			lastPetClaimedAt: new Date(),
			petDisplayName: petDisplayName
		};
	}).setCriteria(entry); 
});

export function isInSkyblock() {
	return isInSkyblock;
}

export function getWorldName() {
	return worldName;
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

export function getLastGuisClosed() {
	return lastGuisClosed;
}

export function getLastKatUpgrade() {
	return lastKatUpgrade;
}

function setHasFishingRodInHotbar() {
	if (!isInSkyblock) {
		hasFishingRodInHotbar = false;
		return;
	}

	const hotbarItems = Player?.getInventory()?.getItems()?.slice(0, 8);
	if (!hotbarItems || !hotbarItems.length) {
		hasFishingRodInHotbar = false;
	} else {
		const rods = hotbarItems.filter(i => i && isFishingRod(i));
		hasFishingRodInHotbar = rods && rods.length;	
	}
}

function setHasDirtRodInHand() {
	if (!isInSkyblock) {
		hasDirtRodInHand = false;
		return;
	}

	const heldItem = Player?.getHeldItem();
	if (!heldItem) {
		hasDirtRodInHand = false;
	} else {
		const loreLines = heldItem.getLore();
		const isDirtRod = loreLines.length ? loreLines[0].includes('Dirt Rod') : false;
		hasDirtRodInHand = isDirtRod;
	}
}

function setIsInHunterArmor() {
	if (!isInSkyblock) {
		isInHunterArmor = false;
		return;
	}

	const armor = Player?.armor;
	const helmetLoreLines = armor?.getHelmet()?.getLore();
	const chestplateLoreLines = armor?.getChestplate()?.getLore();
	const leggingsLoreLines = armor?.getLeggings()?.getLore();
	const bootsLoreLines = armor?.getBoots()?.getLore();
	const hunter = 'Hunter';

	if (!helmetLoreLines || !helmetLoreLines.length ||
		!chestplateLoreLines || !chestplateLoreLines.length ||
		!leggingsLoreLines || !leggingsLoreLines.length ||
		!bootsLoreLines || !bootsLoreLines.length
	) {
		isInHunterArmor = false;
		return;
	}

	if (helmetLoreLines[0].includes(hunter) && chestplateLoreLines[0].includes(hunter) && leggingsLoreLines[0].includes(hunter) && bootsLoreLines[0].includes(hunter)) {
		isInHunterArmor = true;
	} else {
		isInHunterArmor = false;
	}
}

function hasSkyblockInScoreboard() {
	const scoreboardTitle = Scoreboard?.getTitle()?.removeFormatting();
	return !!scoreboardTitle && scoreboardTitle.includes('SKYBLOCK');
}