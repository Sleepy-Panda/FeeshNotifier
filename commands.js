import settings from "./settings"
import { resetRareCatchesTracker } from './features/catch-tracker/catchTracker';

register("command", (...args) => {
    settings.openGUI();
    return;
}).setName("feesh").setAliases(["feeshnotifier"]);

register("command", (...args) => {
    resetRareCatchesTracker();
    return;
}).setName("feeshResetRareCatches");


