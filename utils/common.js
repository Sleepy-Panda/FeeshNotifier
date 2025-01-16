import { GOLD, LIGHT_PURPLE, RED, DARK_GRAY, BLUE, WHITE, BOLD, RESET } from '../constants/formatting';

export function hasDoubleHookInMessage() {
	const history = ChatLib.getChatLines();
	const isDoubleHook = (!!history && history.length > 1) ? history[1].includes("Double Hook") : false; // Original message is &r&eIt's a &r&aDouble Hook&r&e! Woot woot!&r OR &r&eIt's a &r&aDouble Hook&r&e!&r
	return isDoubleHook;
}

export function getMessage(seaCreature) {
	return `--> ${getArticle(seaCreature)} ${seaCreature} has spawned <--`;
}

export function getDoubleHookMessage(seaCreature) {
	return `--> DOUBLE HOOK! Two ${seaCreature}s have spawned <--`;
}

export function getTitle(seaCreature) {
	return `${GOLD}${BOLD}${seaCreature}`;
}

export function getDoubleHookTitle(seaCreature) {
	return `${LIGHT_PURPLE}${BOLD}${seaCreature} x2`;
}

export function getDropMessage(item) {
	return `--> ${getArticle(item)} ${item} has dropped <--`;
}

export function getDropTitle(item) {
	return `${RED}${BOLD}${item}`;
}

// Messages have the following format:
// &r&9Party &8> &b[MVP&d+&b] DeadlyMetal&f: &r--> A YETI has spawned <--&r
// &r&9Компания &8> &b[MVP] PivoTheSadFisher&f: &r--> A Deep Sea Orb has dropped <--&r
export function getPartyChatMessage(baseMessage) {
	return `${RESET}${BLUE}` + "${*}" + ` ${DARK_GRAY}> ` + "${rankAndPlayer}" + `${WHITE}: ${RESET}${baseMessage}${RESET}`;
}

function getArticle(str) {
    const isFirstLetterVowel = ['a', 'e', 'i', 'o', 'u'].indexOf(str[0].toLowerCase()) !== -1;
	return isFirstLetterVowel ? 'An' : 'A';
}
