import settings from "./settings"
import { resetRareCatchesTracker } from './features/overlays/rareCatchesTracker';
import { resetCrimsonIsleTracker } from "./features/overlays/crimsonIsleTracker";
import { resetJerryWorkshopTracker } from "./features/overlays/jerryWorkshopTracker";

register("command", (...args) => {
    settings.openGUI();
    return;
}).setName("feesh").setAliases(["feeshnotifier"]);

register("command", (...args) => {
    const isConfirmed = args[0] && args[0] === "noconfirm";
    resetRareCatchesTracker(!!isConfirmed);
    return;
}).setName("feeshResetRareCatches");

register("command", (...args) => {
    const isConfirmed = args[0] && args[0] === "noconfirm";
    resetCrimsonIsleTracker(!!isConfirmed);
    return;
}).setName("feeshResetCrimsonIsle");

register("command", (...args) => {
    const isConfirmed = args[0] && args[0] === "noconfirm";
    resetJerryWorkshopTracker(!!isConfirmed);
    return;
}).setName("feeshResetJerryWorkshop");
