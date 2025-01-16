import settings from "./settings";
import { resetRareCatchesTracker } from './features/overlays/rareCatchesTracker';
import { resetCrimsonIsleTracker, setRadioactiveVials } from "./features/overlays/crimsonIsleTracker";
import { resetJerryWorkshopTracker } from "./features/overlays/jerryWorkshopTracker";
import { resetWormMembraneProfitTracker } from "./features/overlays/wormMembraneProfitTracker";
import { resetMagmaCoreProfitTracker } from "./features/overlays/magmaCoreProfitTracker";
import { resetFishingProfitTracker } from "./features/overlays/fishingProfitTracker";
import { resetDropNumbers } from "./features/chat/messageOnDrop";
import { calculateFishingPetPrices } from "./features/commands/calculateFishingPetsPrices";
import { calculateGearCraftPrices } from "./features/commands/calculateGearCraftPrices";
import { moveAllGuis } from "./moveAllOverlays";

register("command", (...args) => {
    settings.openGUI();
}).setName("feesh").setAliases(["feeshnotifier"]);

register("command", (...args) => {
    const isConfirmed = args[0] && args[0] === "noconfirm";
    resetRareCatchesTracker(!!isConfirmed);
}).setName("feeshResetRareCatches");

register("command", (...args) => {
    const isConfirmed = args[0] && args[0] === "noconfirm";
    resetCrimsonIsleTracker(!!isConfirmed);
}).setName("feeshResetCrimsonIsle");

register("command", (...args) => {
    const isConfirmed = args[0] && args[0] === "noconfirm";
    resetJerryWorkshopTracker(!!isConfirmed);
}).setName("feeshResetJerryWorkshop");

register("command", (...args) => {
    const isConfirmed = args[0] && args[0] === "noconfirm";
    resetWormMembraneProfitTracker(!!isConfirmed);
}).setName("feeshResetWormProfit");

register("command", (...args) => {
    const isConfirmed = args[0] && args[0] === "noconfirm";
    resetMagmaCoreProfitTracker(!!isConfirmed);
}).setName("feeshResetMagmaCoreProfit");

register("command", (...args) => {
    const isConfirmed = args[0] && args[0] === "noconfirm";
    resetFishingProfitTracker(!!isConfirmed);
    if (isConfirmed) {
        resetDropNumbers();
    }
}).setName("feeshResetProfitTracker");

register("command", (...args) => {
    const count = args[0];
    const lastOn = args[1];
    setRadioactiveVials(+count, lastOn);
}).setName("feeshSetRadioactiveVials");

register("command", (...args) => {
    calculateFishingPetPrices();
}).setName("feeshPetLevelUpPrices");

register("command", (...args) => {
    calculateGearCraftPrices();
}).setName("feeshGearCraftPrices");

register("command", (...args) => {
    moveAllGuis();
}).setName("feeshMoveAllGuis");