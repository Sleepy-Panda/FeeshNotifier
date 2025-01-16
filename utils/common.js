import { RED, DARK_GRAY, BLUE, WHITE, BOLD, RESET } from '../constants/formatting';

export function hasDoubleHookInMessage() {
	const doubleHookMessages = [ '&r&eIt\'s a &r&aDouble Hook&r&e! Woot woot!&r', '&r&eIt\'s a &r&aDouble Hook&r&e!&r' ];
	const history = ChatLib.getChatLines();
	const isDoubleHook = (!!history && history.length > 1)
		? doubleHookMessages.includes(history[1])
		: false;
	return isDoubleHook;
}

export function getMessage(seaCreature) {
	return `--> ${getArticle(seaCreature)} ${seaCreature} has spawned <--`;
}

export function getDoubleHookMessage(seaCreature) {
	return `--> DOUBLE HOOK! Two ${seaCreature}s have spawned <--`;
}

export function getTitle(seaCreature, rarityColorCode) {
	return `${rarityColorCode}${BOLD}${seaCreature}`;
}

export function getDoubleHookTitle(seaCreature, rarityColorCode) {
	return `${rarityColorCode}${BOLD}${seaCreature} ${RED}${BOLD}X2`;
}

export function getDropMessage(item) {
	return `--> ${getArticle(item)} ${item} has dropped <--`;
}

export function getDropTitle(item, rarityColorCode) {
	return `${rarityColorCode}${BOLD}${item}`;
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

function getArticle(str) {
    const isFirstLetterVowel = ['a', 'e', 'i', 'o', 'u'].indexOf(str[0].toLowerCase()) !== -1;
	return isFirstLetterVowel ? 'An' : 'A';
}
