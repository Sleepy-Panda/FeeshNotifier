import settings from "../settings";

// This functionality helps to dynamically re-apply relevant registers after world changed or settings GUI closed.

let registers = [];

settings.getConfig().onCloseGui(() => {
    updateRegisters();
});

export function updateRegisters() {
    console.log('DEBUG - Registers update requested'); // TODO
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
