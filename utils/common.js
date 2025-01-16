import { RED, DARK_GRAY, BLUE, WHITE, BOLD, RESET } from '../constants/formatting';

export function hasDoubleHookInMessage() {
	const doubleHookMessages = [ '&r&eIt\'s a &r&aDouble Hook&r&e! Woot woot!&r', '&r&eIt\'s a &r&aDouble Hook&r&e!&r' ];
	const history = ChatLib.getChatLines();
	const isDoubleHook = (!!history && history.length > 1)
		? doubleHookMessages.includes(history[1])
		: false;
	return isDoubleHook;
}

// Double hook reindrakes may produce the following messages history:
// [CHAT] &r&eIt's a &r&aDouble Hook&r&e!&r
// [CHAT] &r
// [CHAT] &r&c&lWOAH! &r&cA &r&4Reindrake &r&cwas summoned from the depths!&r
// [CHAT] &r
// [CHAT] &r
// [CHAT] &r&c&lWOAH! &r&cA &r&4Reindrake &r&cwas summoned from the depths!&r
// [CHAT] &r
// [CHAT] &r&aA Reindrake forms from the depths.&r
export function hasDoubleHookInMessage_Reindrake() {
	const doubleHookMessages = [ '&r&eIt\'s a &r&aDouble Hook&r&e! Woot woot!&r', '&r&eIt\'s a &r&aDouble Hook&r&e!&r' ];
	const history = ChatLib.getChatLines()?.filter(l => l !== '&r' && l !== '&r&c&lWOAH! &r&cA &r&4Reindrake &r&cwas summoned from the depths!&r');
	const isDoubleHook = (!!history && history.length > 1)
		? doubleHookMessages.includes(history[1])
		: false;
	return isDoubleHook;
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

export function getDropMessage(item) {
	return `--> ${getArticle(item)} ${item} has dropped <--`;
}

export function getDropTitle(item, rarityColorCode) {
	return `${rarityColorCode}${BOLD}${item}`;
}

export function getColoredPlayerNameFromDisplayName() {
	const displayName = Player.getDisplayName(); // [Level] Nickname, e.g. §r§r§8[§d326§8] §bMoonTheSadFisher §7α§r§7
	const nameWithoutLevel = displayName.getText().split('] ').pop();
	const name = nameWithoutLevel.split(' ')[0];
	return name;
}

export function getColoredPlayerNameFromPartyChat(playerAndRank) { // &r&9Party &8> &b[MVP&d+&b] DeadlyMetal&f: &r--> A YETI has spawned <--&r
	if (!playerAndRank) return '';
	const color = playerAndRank.substring(0, 2);
	const nameWithoutRank = playerAndRank.split('] ').pop();
	return `${color}${nameWithoutRank}`;
}

// Messages have the following format:
// &r&9Party &8> &b[MVP&d+&b] DeadlyMetal&f: &r--> A YETI has spawned <--&r
// &r&9Компания &8> &b[MVP] PivoTheSadFisher&f: &r--> A Deep Sea Orb has dropped <--&r
export function getPartyChatMessage(baseMessage) {
	return `${RESET}${BLUE}` + "${*}" + ` ${DARK_GRAY}> ` + "${rankAndPlayer}" + `${WHITE}: ${RESET}${baseMessage}${RESET}`;
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

// Date to '2024-04-12 01:15:25' format
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

// Number to format with spaces: 10500 => "10 500"
export function formatNumberWithSpaces(number) {
	if (!number) {
		return number;
	}
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function isInChatOrInventoryGui() {
	return Client.Companion.isInGui() && (Client.currentGui?.getClassName() === 'GuiInventory' || Client.currentGui?.getClassName() === 'GuiChatOF');
}

function getArticle(str) {
    const isFirstLetterVowel = ['a', 'e', 'i', 'o', 'u'].indexOf(str[0].toLowerCase()) !== -1;
	return isFirstLetterVowel ? 'An' : 'A';
}
