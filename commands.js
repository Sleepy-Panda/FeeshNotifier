import settings from "./settings"
import { resetRareCatchesTracker } from './features/catch-tracker/catchTracker';

register("command", (...args) => {
    settings.openGUI();
    return;
}).setName("feesh").setAliases(["feeshnotifier"]);

register("command", (...args) => {
    const isConfirmed = args[0] && args[0] === "noconfirm";
    resetRareCatchesTracker(!!isConfirmed);
    return;
}).setName("feeshResetRareCatches");


