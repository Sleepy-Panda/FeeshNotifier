import { NO_FISHING_WORLDS } from '../constants/areas';
import { RED, DARK_GRAY, BLUE, WHITE, BOLD, RESET, GOLD, GRAY } from '../constants/formatting';
import { DataComponentTypes, GuiChat, GuiChest, GuiInventory, JsonOps, NbtOps, NBTTagString } from '../constants/javaTypes';
import { EntityFishHook, NBTTagString } from '../constants/javaTypes';
import { DOUBLE_HOOK_MESSAGES, HURRICANE_BOTTLE_CHARGED_MESSAGE, REINDRAKE_SPAWNED_BY_ANYONE_MESSAGE, STORM_BOTTLE_CHARGED_MESSAGE, THUNDER_BOTTLE_CHARGED_MESSAGE } from '../constants/triggers';

// Double hook reindrakes may produce the following messages history:
// [CHAT] &r&eIt's a &r&aDouble Hook&r&e!&r
// [CHAT] &r
// [CHAT] &r&c&lWOAH! &r&cA &r&4Reindrake &r&cwas summoned from the depths!&r
// [CHAT] &r
// [CHAT] &r
// [CHAT] &r&c&lWOAH! &r&cA &r&4Reindrake &r&cwas summoned from the depths!&r
// [CHAT] &r
// [CHAT] &r&aA Reindrake forms from the depths.&r

// [CHAT] &r&eIt's a &r&aDouble Hook&r&e! Woot woot!&r
// [CHAT] &r&e> Your bottle of thunder has fully charged!&r
// [CHAT] &r&c&lYou hear a massive rumble as Thunder emerges.&r

export function isDoubleHook() {
	const history = ChatLib.getChatLines()?.filter(l => // Those messages appear between double hook and catch messages for Reindrake / Thunder
		l !== '&r' &&
		!l.includes('has spawned.') && // Compacted sea creature catch message
		!l.includes(REINDRAKE_SPAWNED_BY_ANYONE_MESSAGE) &&
		!l.includes(THUNDER_BOTTLE_CHARGED_MESSAGE) &&
		!l.includes(STORM_BOTTLE_CHARGED_MESSAGE) &&
		!l.includes(HURRICANE_BOTTLE_CHARGED_MESSAGE)
	);
	const isDoubleHooked = (!!history && history.length > 1)
		? DOUBLE_HOOK_MESSAGES.includes(history[1])
		: false;
	return isDoubleHooked;
}

export function getCatchMessage(seaCreature) {
	return `--> ${getArticle(seaCreature)} ${seaCreature} has spawned <--`;
}

export function getDoubleHookCatchMessage(seaCreature) {
	return `--> DOUBLE HOOK! Two ${seaCreature}s have spawned <--`;
}

export function getPlayerDeathMessage() {
	return `--> I was killed, please wait for me until I come back <--`;
}

export function getCatchTitle(seaCreature, rarityColorCode) {
	return `${rarityColorCode}${BOLD}${seaCreature}`;
}

export function getDoubleHookCatchTitle(seaCreature, rarityColorCode) {
	return `${rarityColorCode}${BOLD}${seaCreature} ${RED}${BOLD}X2`;
}

export function getDropMessage(item, metadata) {
	return metadata && metadata.length
		? `--> ${getArticle(item)} ${item} has dropped (${metadata.join(', ')}) <--`
		: `--> ${getArticle(item)} ${item} has dropped <--`;
}

export function getDropMessagePattern(item) {
	return `--> ${getArticle(item)} ${item} has dropped` + "${*}" + `<--`;
}

export function getDropTitle(item, rarityColorCode) {
	return `${rarityColorCode}${BOLD}${item}`;
}

export function getColoredPlayerNameFromDisplayName() {
	const displayName = Player.getDisplayName(); // [Level] Nickname, e.g. §r§r§8[§d326§8] §bMoonTheSadFisher §7α§r§7
	const nameWithoutLevel = displayName.toString().split('] ').pop();
	const name = nameWithoutLevel.split(' ')[0];
	return name;
}

export function getColoredPlayerNameFromPartyChat(playerAndRank) { // &r&9Party &8> &b[MVP&d+&b] DeadlyMetal&f: &r--> A YETI has spawned <--&r
	if (!playerAndRank) return '';
	const color = playerAndRank.substring(0, 2);
	const nameWithoutRank = playerAndRank.split('] ').pop();
	return `${color}${nameWithoutRank}`;
}

export function getPlayerNameFromPartyChat(playerAndRank) { // Input: &b[MVP&d+&b] DeadlyMetal
	if (!playerAndRank) return '';
	const nameWithoutRank = playerAndRank.split('] ').pop().removeFormatting();
	return nameWithoutRank;
}

// Messages have the following format:
// &r&9Party &8> &b[MVP&d+&b] DeadlyMetal&f: &r--> A YETI has spawned <--&r
// &r&9Компания &8> &b[MVP] PivoTheSadFisher&f: &r--> A Deep Sea Orb has dropped <--&r
// MC 1.21.5: &r&9Party &8> &6[MVP&3++&6] vadim31&f: &r--> A THE LOCH EMPEROR has spawned <--
export function getPartyChatMessage(baseMessage) {
	return `${RESET}${BLUE}` + "${*}" + ` ${DARK_GRAY}> ` + "${rankAndPlayer}" + `${WHITE}: ${RESET}${baseMessage}`;
	// To test using Co-op chat:
	// return `${RESET}${AQUA}Co-op > ` + "${rankAndPlayer}" + `${WHITE}: ${RESET}${baseMessage}${RESET}`;
}

export function getCatchesCounterChatMessage(seaCreatureName, seaCreatureRarity, catchesSinceLast, lastCatchTime) {
	const elapsedTimeText = lastCatchTime ? ` ${GRAY}(${WHITE}${formatTimeElapsedBetweenDates(new Date(lastCatchTime))}${GRAY})` : '';
	const b2bText = catchesSinceLast === 1 ? `${RED}B2B! ` : '';
	const catchesText = `${WHITE}${catchesSinceLast} ${GRAY}${catchesSinceLast === 1 ? 'catch' : 'catches'}`;
	const seaCreatureDisplayName = `${seaCreatureRarity}${fromUppercaseToCapitalizedFirstLetters(seaCreatureName)}`;
	return `${GOLD}[FeeshNotifier] ${b2bText}${GRAY}It took ${catchesText}${elapsedTimeText} to get the ${seaCreatureDisplayName}${GRAY}.`;
}

export function getDropCatchesCounterChatMessage(dropDisplayName, seaCreatureName, lastDropTime, dropNumber, catches) {
	const elapsedTimeText = lastDropTime ? ` ${GRAY}(${WHITE}${formatTimeElapsedBetweenDates(new Date(lastDropTime))}${GRAY})` : '';
	const catchesText = catches === 1 ? `${WHITE}${catches} ${GRAY}${fromUppercaseToCapitalizedFirstLetters(seaCreatureName)} catch` : `${WHITE}${catches} ${GRAY}${fromUppercaseToCapitalizedFirstLetters(seaCreatureName)} catches`;
    return `${GOLD}[FeeshNotifier] ${GRAY}It took ${catchesText}${elapsedTimeText} to get the ${dropDisplayName} ${WHITE}#${dropNumber}${GRAY}. Congratulations!`;   
}

// Transforms UPPERCASE TEXT to a Regular Text With Capitalized First Letters.
export function fromUppercaseToCapitalizedFirstLetters(str) {
	if (!str) {
		return '';
	}

	const words = str.split(' ');
	return words.map((word) => { 
	    return word[0].toUpperCase() + word.substring(1).toLowerCase(); 
	}).join(' ');
}

// Pluralizes the words, e.g. Thunder => Thunders, Lord Jawbus => Lord Jawbuses.
export function pluralize(str) {
	if (!str) {
		return '';
	}

	if (str.endsWith('s') || str.endsWith('z') || str.endsWith('x') || str.endsWith('sh') || str.endsWith('ch')) {
		return `${str}es`;
	}

	return `${str}s`;
}

/**
 * Converts date to string using YYYY-MM-DD hh:ss:ss format. Example: "2024-04-21 17:15:25"
 * @param {Date} date - Date to be formatted
 * @returns {string}
 */
export function formatDate(date) {
    if (!date) {
        return date;
    }

	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const formattedDate = [ year, month < 10 ? `0${month}` : month, day < 10 ? `0${day}` : day ].join('-');
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const formattedTime = [
        hours < 10 ? `0${hours}` : hours,
        minutes < 10 ? `0${minutes}` : minutes,
        seconds < 10 ? `0${seconds}` : seconds
    ].join(':');
    const formattedDateTime = formattedDate + ' ' + formattedTime;
    return formattedDateTime;
}

/**
 * Converts a number to more readable format with spaces. Example: 10500 => "10 500"
 * @param {number} number - Number to be formatted
 * @returns {string}
 */
export function formatNumberWithSpaces(number) {
	if (!number) {
		return number;
	}
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/**
 * Converts a number to more short format in thousands, millions and billions. Examples: 100 => "100", 1000 => "1K", 1160 => "1.1K", 999999 => "999.9K", 2500000 => "2.5M"
 * @param {number} number - Number to be formatted
 * @returns {string}
 */
export function toShortNumber(number) {
	if (!number) {
		return 0;
	}

	number = Math.floor(number);

	if (Math.abs(number) >= 1000000000) {
		return roundToFixed(number / 1000000000, 2) + 'B';
	}
	if (Math.abs(number) >= 1000000) {
		return roundToFixed(number / 1000000, 1) + 'M';
	}
	if (Math.abs(number) >= 1000) {
		return roundToFixed(number / 1000, 1) + 'K';
	}

	return number;

	function roundToFixed(number, digits) { // Default js toFixed() function rounds numbers, e.g. 999.999 => 1000K
		const m = 10 ** digits;
		return Math.floor(number * m) / m;
	}
}

/**
 * Converts a short string number format into a normal number.
 * Examples: "100,500" => 100500, "1.2B" => 1200000000, "1M" => 1000000, "6.5k" => 6500
 * @param {string} str - The string to convert
 * @returns {number} The converted number
 */
export function parseShortNumber(str) {
    if (!str) return 0;
    
    str = str.replace(/,/g, '').toLowerCase();
    
    const multipliers = {
        'k': 1e3,
        'm': 1e6,
        'b': 1e9,
        't': 1e12,
    };
    
    const lastChar = str.slice(-1);
    if (multipliers[lastChar]) {
        const number = parseFloat(str.slice(0, -1));
        return number * multipliers[lastChar];
    }
    
    return parseFloat(str);
} 

/**
 * Converts elapsed seconds to hours, minutes and seconds. Examples: "1:05", "2:03:49", "27:03:17"
 * @param {Number} elapsedSeconds - Elapsed seconds
 * @returns {string}
 */
export function formatElapsedTime(elapsedSeconds) {
    const hours = ~~(elapsedSeconds / 3600);
    const minutes = ~~((elapsedSeconds % 3600) / 60);
    const seconds = ~~elapsedSeconds % 60;
  
    let result = '';
  
    if (hours > 0) {
        result += hours + ':' + (minutes < 10 ? '0' : '');
    }
  
    result += minutes + ':' + (seconds < 10 ? '0' : '');
    result += seconds;
  
    return result;
}

/**
 * Splits array into 2 sub-arrays starting after the specified items count. Example: [1, 2, 3, 4, 5], 3 => [1, 2, 3], [4, 5]
 * @param {array} array - Array to split
 * @param {number} count - Number of items coming into the first sub-array. The rest of items come into the second sub-array. If count is more than the array length, the second sub-array will be empty.
 * @returns {array} Array of 2 sub-arrays [[...], [...]]
 */
export function splitArray(array, count) {
    if (!array || !array.length) {
        return [[], []];
    }
    return [array.slice(0, count), array.slice(count)]
}

export function isInChatOrInventoryGui() {
	const screen = Client.getMinecraft().currentScreen;
	if (!screen) return;
	return screen instanceof GuiChat || screen instanceof GuiInventory;
}

export function isInSacksGui() {
	const chestName = getCurrentGuiChestName();
	return (!!chestName && chestName.endsWith('Sack'));
}

export function isInSupercraftGui() {
	const chestName = getCurrentGuiChestName();
	return (!!chestName && chestName.endsWith('Recipe'));
}

export function getItemsAddedToSacks(eventMessage) {
	let items = [];
	
	console.log('Msg part = ' + eventMessage.getSiblings()[0].getString() + ' ' + eventMessage.getSiblings()[0].getStyle().hoverEvent.action);
	// .value returns function comp_3510() {/*
// net.minecraft.class_2561 comp_3510()
// */}
	console.log('Hover value = ' + eventMessage.getSiblings()[0].getStyle()?.hoverEvent?.value?.toString());
	const addedItemsMessage = new TextComponent(eventMessage).find(part => part.hoverValue?.getString()?.includes('Added items:'))?.hoverValue || '';
    if (!addedItemsMessage) {
        return items;
    }
    
    const addedItemsRegex = new RegExp(/(\+[\d,]+) (.+) \((.+)\)/, "g"); // +1,344 Pufferfish (Fishing Sack)
    let match = addedItemsRegex.exec(addedItemsMessage);

    while (!!match) {
        const difference = +match[1]?.removeFormatting()?.replace(/\+/g, '')?.replace(/,/g, '') || 0;
        const itemName = match[2];
        const sackName = match[3]?.removeFormatting();
    
        if (!difference || !itemName) {
            match = addedItemsRegex.exec(addedItemsMessage);
            continue;
        }

		items.push({ itemName: itemName, difference: difference, sackName: sackName });
        match = addedItemsRegex.exec(addedItemsMessage);
    }

	return items;
}

export function getCleanItemName(itemName) {
    if (itemName && /.+ §r§8x[\d]+$/.test(itemName)) { // Booster cookie menu or NPCs append the amount to the item name - e.g. §9Fish Affinity Talisman §8x1
        const itemNameParts = itemName.split(' ');
        itemNameParts.pop();
        itemName = itemNameParts.join(' ');
    }
    const cleanItemName = itemName?.removeFormatting()?.replace(/§L/g, ''); // For some reason, §L is not deleted when calling removeFormatting (trophy fish) 
    return cleanItemName || '';
}

/**
 * Checks if an item is a fishing rod.
 * @param {Item} item
 * @returns {boolean}
 */
export function isFishingRod(item) {
	if (!item) return false;

    const isRod = (!item.getName()?.removeFormatting()?.includes('Carnival Rod') && item.getLore().some(loreLine => loreLine.toString().includes('FISHING ROD') || loreLine.toString().includes('FISHING WEAPON')));
	return isRod;
}

/**
 * Gets current player's fishing hook entity.
 * @returns {EntityFishHook}
 */
export function getPlayerFishingHook() {
	return World.getAllEntitiesOfType(EntityFishHook)
		.find(e =>
			Player.getPlayer().fishHook == e.toMC() ||
			e.toMC()?.getPlayerOwner()?.getDisplayName()?.removeFormatting() === Player.getName().removeFormatting()
		);
}

/**
 * Checks if a fishing rod is casted (fishing hook is in water or lava).
 * @returns {boolean}
 */
export function isFishingHookActive() {
	const heldItem = Player?.getHeldItem();
    if (!isFishingRod(heldItem)) {
        return false;
    }

	const playerHook = getPlayerFishingHook();
	if (!playerHook) {
		return false;
	}

    if (playerHook.isInWater() || playerHook.isInLava()) { // For regular rods, the player's hook must be in lava or water
        return true;
    }

    const isDirtRod = heldItem?.getName()?.includes('Dirt Rod');
    if (isDirtRod) { // For dirt rod, the player's hook can be in dirt
        return true;
    }

	return false;
}

/**
 * Formats time elapsed between two dates in days, hours and minutes. Examples: "2d 8h 5m" or "less than 1m"
 * @param {Date} dateFrom - Earlier date
 * @param {Date} dateTo - Later date
 * @returns {string}
 */
export function formatTimeElapsedBetweenDates(dateFrom, dateTo = new Date()) {
	if (!dateFrom || !dateTo) {
		return '';
	}

	const totalSeconds = Math.floor((dateTo - dateFrom) / 1000);
	return formatElapsedTimeWithUnits(totalSeconds);
}

/**
 * Formats elapsed time in days, hours and minutes. Examples: "2d 8h 5m" or "less than 1m"
 * @param {number} elapsedSeconds - Number of elapsed seconds
 * @returns {string}
 */
export function formatElapsedTimeWithUnits(elapsedSeconds) {
	if (!elapsedSeconds) {
		return '';
	}

	const totalSeconds = elapsedSeconds;
	const totalMinutes = Math.floor(totalSeconds / 60);
	const totalHours = Math.floor(totalMinutes / 60);
	const totalDays = Math.floor(totalHours / 24);

	const days = totalDays;
	const hours = totalHours - (days * 24);
	const minutes = totalMinutes - (days * 24 * 60) - (hours * 60);
	const seconds = totalSeconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

	const isLessThanMinute = totalSeconds < 60;

	return isLessThanMinute
		? `less than 1m`
		: `${days > 0 ? days + 'd ' : ''}${days > 0 || hours > 0 ? hours + 'h ' : ''}${days > 0 || hours > 0 || minutes > 0 ? minutes + 'm' : ''}`;
}

/**
 * Get item's attributes (if any).
 * @param {Item} item
 * @returns {array} Array of item's attributes in format [{ "attributeCode": "life_regeneration", "attributeLevel": 5 }]
 */
export function getItemAttributes(item) {
	if (!item) return [];

	const customData = getItemCustomData(item);
    if (!customData) return [];

    const itemAttributes = customData.attributes;
    if (!itemAttributes) return [];

    var attributes = [];
    Object.keys(itemAttributes).sort().forEach(attributeCode => {
        const level = itemAttributes[attributeCode];
		const code = attributeCode === 'mending' ? 'vitality' : attributeCode.toLowerCase();
		attributes.push({ attributeCode: code, attributeLevel: level });
    });

    return attributes;
}

/**
 * Get suitable article (A/An) depending on the passed string.
 * @param {string} str
 * @returns {string} Article (A/An)
 */
export function getArticle(str) {
    const isFirstLetterVowel = ['a', 'e', 'i', 'o', 'u'].indexOf(str[0].toLowerCase()) !== -1;
	return isFirstLetterVowel ? 'An' : 'A';
}

/**
 * Get random characters substring to make message content unique and prevent "You cannot say the same message twice" error. Inspired by VolcAddons
 * @returns {string} Random substring
 */
export function getMessageId() {
	const messageId = `@${(Math.random() + 1).toString(36).substring(4)}`;
	return messageId;
}

/**
 * Get current zone name.
 * @returns {string} Formatted zone name if exists, or empty string
 */
export function getZoneName() {
	const zoneLine = Scoreboard.getLines().find((line) => line.toString().includes('⏣'));
	return zoneLine?.toString()?.trim() || '';
}

/**
 * Check whether current world name supports fishing features.
 * @returns {boolean}
 */
export function isInFishingWorld(worldName) {
	if (!worldName) return false;
	return !NO_FISHING_WORLDS.includes(worldName);
}

/**
 * Get MC entity ID.
 * @param {Entity} entity
 * @returns {number} ID
 */
export function getMcEntityId(entity) {
    if (!entity || !entity.toMC()) return;
    return entity.toMC().getId();
}

/**
 * Get MC entity ID.
 * @param {number} id MC entity ID
 * @returns {object} MC entity
 */
export function getMcEntityById(id) {
    if (!id) return;
    return World.getWorld()?.getEntityById(id);
}

/**
 * Get item's custom data (old NBT) as object.
 * @param {Item} item
 * @returns {object}
 */
export function getItemCustomData(item) {
	if (!item) return null;

	const customDataMc = item.getNBT()?.get(DataComponentTypes.CUSTOM_DATA);
	if (!customDataMc) return null;

	const customDataJson = NbtOps.INSTANCE.convertTo(JsonOps.INSTANCE, customDataMc.copyNbt()).asJsonObject;
	const customData = JSON.parse(customDataJson);

	return customData;
}

function getCurrentGuiChestName() {
	if (!Client.isInGui()) return null;

	const currentScreen = Client.getMinecraft().currentScreen;
	if (currentScreen && currentScreen instanceof GuiChest) {
		const chestName = currentScreen.getTitle().getString();
		return chestName;
	}
	return null;
}