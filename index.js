const yeti = "YETI";
const reindrake = "REINDRAKE";
const nutcracker = "NUTCRACKER";
const waterHydra = "WATER HYDRA";
const seaEmperor = "SEA EMPEROR";
const carrotKing = "CARROT KING";
const greatWhiteShark = "GREAT WHITE SHARK";
const phantomFisher = "PHANTOM FISHER";
const grimReaper = "GRIM REAPER";
const thunder = "THUNDER";
const lordJawbus = "LORD JAWBUS";
const vanquisher = "VANQUISHER";

const babyYetiPet = "Baby Yeti";
const flyingFishPet = "Flying Fish";
const megalodonPet = "Megalodon";

const luckyCloverCore = "Lucky Clover Core";
const deepSeaOrb = "Deep Sea Orb";
const radioactiveVial = "Radioactive Vial";

const notificationSound = new Sound({ source: "notification.ogg" });
const ohMyGodSound = new Sound({ source: "oh-my-god.ogg" });
const aughSound = new Sound({ source: "augh.ogg" });

const chatCommand = 'pc';

// YETI

register("Chat", (event) => sendSeaCreatureToChat(event, '&aWhat is this creature!?', yeti))

register("Chat", (event) => showSeaCreatureTitle(event, yeti))

register("Chat", (event) => sendItemDropToChat(event, 'PET DROP! &r&6Baby Yeti', babyYetiPet + ' (Legendary)', ohMyGodSound))
register("Chat", (event) => sendItemDropToChat(event, 'PET DROP! &r&5Baby Yeti', babyYetiPet + ' (Epic)', aughSound))

register("Chat", (event) => showItemDropTitle(event, 'PET DROP! Baby Yeti', babyYetiPet, notificationSound))
register("Chat", (event) => showItemDropTitle(event, getDropMessage(babyYetiPet + ' (Legendary)'), babyYetiPet + ' (Legendary)', ohMyGodSound))
register("Chat", (event) => showItemDropTitle(event, getDropMessage(babyYetiPet + ' (Epic)'), babyYetiPet + ' (Epic)', aughSound))

// Reindrake

register("Chat", (event) => sendSeaCreatureToChat(event, '&aA Reindrake forms from the depths.', reindrake))

register("Chat", (event) => showSeaCreatureTitle(event, reindrake))

// Nutcracker

register("Chat", (event) => sendSeaCreatureToChat(event, '&aYou found a forgotten Nutcracker laying beneath the ice.', nutcracker))

register("Chat", (event) => showSeaCreatureTitle(event, nutcracker))

// Water Hydra

register("Chat", (event) => sendSeaCreatureToChat(event, '&aThe Water Hydra has come to test your strength.', waterHydra))

register("Chat", (event) => showSeaCreatureTitle(event, waterHydra))

// Sea Emperor

register("Chat", (event) => sendSeaCreatureToChat(event, '&aThe Sea Emperor arises from the depths.', seaEmperor))

register("Chat", (event) => showSeaCreatureTitle(event, seaEmperor))

register("Chat", (event) => sendItemDropToChat(event, 'PET DROP! &r&6Flying Fish', flyingFishPet + ' (Legendary)', ohMyGodSound))
register("Chat", (event) => sendItemDropToChat(event, 'PET DROP! &r&5Flying Fish', flyingFishPet + ' (Epic)', aughSound))
register("Chat", (event) => sendItemDropToChat(event, 'PET DROP! &r&9Flying Fish', flyingFishPet + ' (Rare)', aughSound))

register("Chat", (event) => showItemDropTitle(event, 'PET DROP! Flying Fish', flyingFishPet, notificationSound))
register("Chat", (event) => showItemDropTitle(event, getDropMessage(flyingFishPet + ' (Legendary)'), flyingFishPet + ' (Legendary)', ohMyGodSound))
register("Chat", (event) => showItemDropTitle(event, getDropMessage(flyingFishPet + ' (Epic)'), flyingFishPet + ' (Epic)', aughSound))
register("Chat", (event) => showItemDropTitle(event, getDropMessage(flyingFishPet + ' (Rare)'), flyingFishPet + ' (Rare)', aughSound))

// Carrot King

register("Chat", (event) => sendSeaCreatureToChat(event, '&aIs this even a fish? It\'s the Carrot King!', carrotKing))

register("Chat", (event) => showSeaCreatureTitle(event, carrotKing))

register("Chat", (event) => sendItemDropToChat(event, 'RARE DROP! &r&5Lucky Clover Core', luckyCloverCore, ohMyGodSound))

register("Chat", (event) => showItemDropTitle(event, 'RARE DROP! Lucky Clover Core', luckyCloverCore, ohMyGodSound))
register("Chat", (event) => showItemDropTitle(event, getDropMessage(luckyCloverCore), luckyCloverCore, ohMyGodSound))

// GREAT WHITE SHARK

register("Chat", (event) => sendSeaCreatureToChat(event, '&aHide no longer, a Great White Shark has tracked your scent and thirsts for your blood!', greatWhiteShark))

register("Chat", (event) => showSeaCreatureTitle(event, greatWhiteShark))

register("Chat", (event) => sendItemDropToChat(event, 'PET DROP! &r&6Megalodon', megalodonPet + ' (Legendary)', ohMyGodSound))
register("Chat", (event) => sendItemDropToChat(event, 'PET DROP! &r&5Megalodon', megalodonPet + ' (Epic)', aughSound))

register("Chat", (event) => showItemDropTitle(event, 'PET DROP! Megalodon', megalodonPet, notificationSound))
register("Chat", (event) => showItemDropTitle(event, getDropMessage(megalodonPet + ' (Legendary)'), megalodonPet + ' (Legendary)', ohMyGodSound))
register("Chat", (event) => showItemDropTitle(event, getDropMessage(megalodonPet + ' (Epic)'), megalodonPet + ' (Epic)', aughSound))

// PHANTOM FISHER

register("Chat", (event) => sendSeaCreatureToChat(event, '&aThe spirit of a long lost Phantom Fisher has come to haunt you.', phantomFisher))

register("Chat", (event) => showSeaCreatureTitle(event, phantomFisher))

// GRIM REAPER

register("Chat", (event) => sendSeaCreatureToChat(event, '&aThis can\'t be! The manifestation of death himself!', grimReaper))

register("Chat", (event) => showSeaCreatureTitle(event, grimReaper))

register("Chat", (event) => sendItemDropToChat(event, 'RARE DROP! &r&5Deep Sea Orb', deepSeaOrb, ohMyGodSound))

register("Chat", (event) => showItemDropTitle(event, 'RARE DROP! Deep Sea Orb', deepSeaOrb, ohMyGodSound))
register("Chat", (event) => showItemDropTitle(event, getDropMessage(deepSeaOrb), deepSeaOrb, ohMyGodSound))

// THUNDER

register("Chat", (event) => sendSeaCreatureToChat(event, '&r&c&lYou hear a massive rumble as Thunder emerges.&r', thunder))

register("Chat", (event) => showSeaCreatureTitle(event, thunder))

// LORD JAWBUSSY

register("Chat", (event) => sendSeaCreatureToChat(event, '&r&c&lYou have angered a legendary creature... Lord Jawbus has arrived.&r', lordJawbus))

register("Chat", (event) => showSeaCreatureTitle(event, lordJawbus))

register("Chat", (event) => sendItemDropToChat(event, 'RARE DROP! &r&dRadioactive Vial', radioactiveVial, ohMyGodSound))

register("Chat", (event) => showItemDropTitle(event, 'RARE DROP! Radioactive Vial', radioactiveVial, ohMyGodSound))
register("Chat", (event) => showItemDropTitle(event, getDropMessage(radioactiveVial), radioactiveVial, ohMyGodSound))

// Vanquisher

register("Chat", (event) => sendSeaCreatureToChat(event, 'A &r&cVanquisher &r&ais spawning nearby!', vanquisher))

register("Chat", (event) => showSeaCreatureTitle(event, vanquisher))



// Common

function hasDoubleHookInMessage() {
	const history = ChatLib.getChatLines();
	const isDoubleHook = (!!history && history.length > 1) ? history[1].includes("Double Hook") : false;
	return isDoubleHook;
}

function getMessage(baseMessage) {
	return '--> A ' + baseMessage + ' has spawned <--';
}

function getDoubleHookMessage(baseMessage) {
	return '--> DOUBLE HOOK! Two ' + baseMessage + 's have spawned <--';
}

function getTitle(seaCreature) {
	return '&6' + seaCreature;
}

function getDoubleHookTitle(seaCreature) {
	return '&d' + seaCreature + ' x2';
}

function getDropMessage(item) {
	return '--> A ' + item + ' has dropped <--';
}

function getDropTitle(item) {
	return '&c' + item;
}

function sendSeaCreatureToChat(event, triggerPattern, seaCreature) {
	var formattedMessage = ChatLib.getChatMessage(event, true);
	if (formattedMessage.includes(triggerPattern)) {	
		setTimeout(() => {
			const isDoubleHook = hasDoubleHookInMessage(formattedMessage);
			const message = isDoubleHook ? getDoubleHookMessage(seaCreature) : getMessage(seaCreature);
			const title = isDoubleHook ? getDoubleHookTitle(seaCreature) : getTitle(seaCreature);
			notificationSound.play();
			ChatLib.command(chatCommand + ' ' + message);
			Client.showTitle(title, "", 1, 30, 1);
		}, 1);	
	}
}

function showSeaCreatureTitle(event, seaCreature) {
	var formattedMessage = ChatLib.getChatMessage(event, true);
	if (formattedMessage.includes(getDoubleHookMessage(seaCreature))) {	
		setTimeout(() => {
			notificationSound.play();
			Client.showTitle(getDoubleHookTitle(seaCreature), "", 1, 30, 1);
		}, 1);		
	} else if (formattedMessage.includes(getMessage(seaCreature))) {	
		setTimeout(() => {
			notificationSound.play();
			Client.showTitle(getTitle(seaCreature), "", 1, 30, 1);
		}, 1);		
	}
}

function sendItemDropToChat(event, triggerPattern, item, sound) {
	var formattedMessage = ChatLib.getChatMessage(event, true);
	if (formattedMessage.includes(triggerPattern)) {	
		setTimeout(() => {
 			// Drop message has format: &r&6&lRARE DROP! &r&fEnchanted Book &r&b(+&r&b196% &r&b✯ Magic Find&r&b)&r&r
			const message = getDropMessage(item);
			const title = getDropTitle(item);
			sound.play();
			ChatLib.command(chatCommand + ' ' + message);
			Client.showTitle(title, "", 1, 30, 1);
		}, 1);	
	}
}

function showItemDropTitle(event, triggerPattern, item, sound) {
	var formattedMessage = ChatLib.getChatMessage(event, true);
	if (formattedMessage.includes(triggerPattern)) {
		setTimeout(() => {
			const title = getDropTitle(item);
			sound.play();
			Client.showTitle(title, "", 1, 30, 1);
		}, 1);		
	}
}
