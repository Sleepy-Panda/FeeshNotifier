var isInSkyblock = false;
var hasFishingRodInHotbar = false;
var hasDirtRodInHand = false;
var worldName = null;
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

register('step', () => trackPlayerState()).setFps(2);

function trackPlayerState() {
	try {
		setIsInSkyblock();
		setWorldName();
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

function setIsInSkyblock() {
	const scoreboardTitle = Scoreboard.getTitle()?.removeFormatting();
	isInSkyblock = scoreboardTitle && scoreboardTitle.includes('SKYBLOCK');
}

function setWorldName() {
	if (!isInSkyblock) {
		worldName = null;
		return;
	}
	
	const world = TabList.getNames().find(tab => tab.includes("Area: "));
	if (!world) {
		worldName = null;
	} else {
		const formattedName = world.removeFormatting();
		worldName = formattedName.substring(formattedName.indexOf(': ') + 2);
	}
}

function setHasFishingRodInHotbar() {
	if (!isInSkyblock) {
		hasFishingRodInHotbar = false;
		return;
	}

	const hotbarItems = Player.getInventory().getItems()?.slice(0, 8);
	if (!hotbarItems || !hotbarItems.length) {
		hasFishingRodInHotbar = false;
	} else {
		const rods = hotbarItems.filter(i => i && !i.getName()?.includes('Carnival Rod') && i.getLore().some(loreLine => loreLine.includes('FISHING ROD') || loreLine.includes('FISHING WEAPON')));
		hasFishingRodInHotbar = rods && rods.length;	
	}
}

function setHasDirtRodInHand() {
	if (!isInSkyblock) {
		hasDirtRodInHand = false;
		return;
	}

	const heldItem = Player.getHeldItem();
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

	const armor = Player.armor;
	const helmetLoreLines = armor.getHelmet()?.getLore();
	const chestplateLoreLines = armor.getChestplate()?.getLore();
	const leggingsLoreLines = armor.getLeggings()?.getLore();
	const bootsLoreLines = armor.getBoots()?.getLore();
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