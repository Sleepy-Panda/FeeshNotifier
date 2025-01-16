export function hasDoubleHookInMessage() {
	const history = ChatLib.getChatLines();
	const isDoubleHook = (!!history && history.length > 1) ? history[1].includes("Double Hook") : false;
	return isDoubleHook;
}

export function getMessage(baseMessage) {
	return '--> A ' + baseMessage + ' has spawned <--';
}

export function getDoubleHookMessage(baseMessage) {
	return '--> DOUBLE HOOK! Two ' + baseMessage + 's have spawned <--';
}

export function getTitle(seaCreature) {
	return '&6' + seaCreature;
}

export function getDoubleHookTitle(seaCreature) {
	return '&d' + seaCreature + ' x2';
}

export function getDropMessage(item) {
	return '--> A ' + item + ' has dropped <--';
}

export function getDropTitle(item) {
	return '&c' + item;
}