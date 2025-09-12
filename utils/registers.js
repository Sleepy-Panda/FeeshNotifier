import settings from "../settings";
import { getWorldName, isInSkyblock } from "./playerState";

// This functionality helps to dynamically re-apply relevant registers after world changed or settings GUI closed.

let registers = [];
let attemptsCounter = 0;
let lastWorldLoadAt = null;

let lastKnownIsInSkyblock = false;
let lastKnownWorldName = null;

// TODO: Uncomment when implemented back in Amaterasu
//settings.getConfig().onCloseGui(() => {
//    updateRegisters();
//});

register("guiClosed", (gui) => {
    if (!gui) return;

    if (gui.getClass().getName() === 'com.chattriggers.ctjs.api.render.Gui') {
        updateRegisters();
    }
});

register('worldLoad', () => {
    attemptsCounter = 0;
    if (new Date() - lastWorldLoadAt < 1000) return; // Multiple world load events may happen

    lastWorldLoadAt = new Date();
    tryUpdateRegisters();
});

function tryUpdateRegisters() {
    if (attemptsCounter > 5) return;

    const inSkyblock = isInSkyblock();
    const worldName = getWorldName();

    if ((inSkyblock !== lastKnownIsInSkyblock || worldName !== lastKnownWorldName) && registers.length) {
        updateRegisters();        
    }

    lastKnownIsInSkyblock = inSkyblock;
    lastKnownWorldName = worldName;

    attemptsCounter++;
    setTimeout(tryUpdateRegisters, 2000);
}

function updateRegisters() {
    try {
        registers.forEach(register => {
            if (!register.conditionFunc() && register.isTriggerEnabled) {
                register.registerTrigger.unregister();
                register.isTriggerEnabled = false;
                return;
            }

            if (register.conditionFunc() && !register.isTriggerEnabled) {
                register.registerTrigger.register();
                register.isTriggerEnabled = true;
            }
        });
    }
    catch (e) {
        console.error(e);
		console.log(`[FeeshNotifier] Failed to update registers.`);
    }
}

/**
 * Adds a trigger for dynamic registration based on the condition function.
 *
 * @param {Trigger} trigger - The trigger function to be registered.
 * @param {function} conditionFunc - Trigger is registered when conditionFunc() is true.
 */
export function registerIf(trigger, conditionFunc) {
    registers.push({ registerTrigger: trigger.unregister(), conditionFunc: conditionFunc, isTriggerEnabled: false });
}
