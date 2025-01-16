import settings from "./settings"
import { resetRareCatchesTracker } from './features/overlays/rareCatchesTracker';
import { resetCrimsonIsleTracker, setRadioactiveVials } from "./features/overlays/crimsonIsleTracker";
import { resetJerryWorkshopTracker } from "./features/overlays/jerryWorkshopTracker";
import { resetWormMembraneProfitTracker } from "./features/overlays/wormMembraneProfitTracker";
import { resetMagmaCoreProfitTracker } from "./features/overlays/magmaCoreProfitTracker";
import { resetFishingProfitTracker } from "./features/overlays/fishingProfitTracker";
import { resetDropNumbers } from "./features/chat/messageOnDrop";

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

register("command", (...args) => {
    const isConfirmed = args[0] && args[0] === "noconfirm";
    resetWormMembraneProfitTracker(!!isConfirmed);
    return;
}).setName("feeshResetWormProfit");

register("command", (...args) => {
    const isConfirmed = args[0] && args[0] === "noconfirm";
    resetMagmaCoreProfitTracker(!!isConfirmed);
    return;
}).setName("feeshResetMagmaCoreProfit");

register("command", (...args) => {
    const isConfirmed = args[0] && args[0] === "noconfirm";
    resetFishingProfitTracker(!!isConfirmed);
    if (isConfirmed) {
        resetDropNumbers();
    }
    return;
}).setName("feeshResetProfitTracker");

register("command", (...args) => {
    const count = args[0];
    const lastOn = args[1];
    setRadioactiveVials(+count, lastOn);
    return;
}).setName("feeshSetRadioactiveVials");
