var isInSkyblock = false;
var hasFishingRodInHotbar = false;
var hasFishingRodInHand = false;
var hasDirtRodInHand = false;
var worldName = null;
var isInHunterArmor = false;

register('step', () => trackPlayerState()).setFps(2);

function trackPlayerState() {
	try {
		setIsInSkyblock();
		setWorldName();
		setHasFishingRodInHotbar();
		setHasFishingRodInHand();
		setHasDirtRodInHand();
		setIsInHunterArmor();	
	} catch (e) {
		console.error(e);
		console.log(`[FeeshNotifier] Failed to track player's state.`);
	}
}

export function isInSkyblock() {
	return isInSkyblock;
}

export function getWorldName() {
	return worldName;
}

export function hasFishingRodInHotbar() {
	return hasFishingRodInHotbar;
}

export function hasFishingRodInHand() {
	return hasFishingRodInHand;
}

export function hasDirtRodInHand() {
	return hasDirtRodInHand;
}

export function isInHunterArmor() {
	return isInHunterArmor;
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
		const rods = hotbarItems.filter(i => i && i.getLore().some(loreLine => loreLine.includes('FISHING ROD') || loreLine.includes('FISHING WEAPON')));
		hasFishingRodInHotbar = rods && rods.length;	
	}
}

function setHasFishingRodInHand() {
	if (!isInSkyblock) {
		hasFishingRodInHand = false;
		return;
	}

	const heldItem = Player.getHeldItem();
	if (!heldItem) {
		hasFishingRodInHand = false;
	} else {
		const isRod = heldItem.getLore().some(loreLine => loreLine.includes('FISHING ROD') || loreLine.includes('FISHING WEAPON'));
		hasFishingRodInHand = isRod;
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