import settings from "./settings";
import { moveAllGuis } from "./moveAllOverlays";
import { resetSeaCreaturesTracker } from './features/overlays/seaCreaturesTracker';
import { resetCrimsonIsleTracker, setRadioactiveVials } from "./features/overlays/crimsonIsleTracker";
import { resetJerryWorkshopTracker } from "./features/overlays/jerryWorkshopTracker";
import { resetWormMembraneProfitTracker } from "./features/overlays/wormMembraneProfitTracker";
import { resetMagmaCoreProfitTracker } from "./features/overlays/magmaCoreProfitTracker";
import { resetFishingProfitTracker } from "./features/overlays/fishingProfitTracker";
import { resetDropNumbers } from "./features/chat/messageOnDrop";
import { calculateFishingPetPrices } from "./features/commands/calculateFishingPetsPrices";
import { calculateGearCraftPrices } from "./features/commands/calculateGearCraftPrices";
import { showSpidersDenRainSchedule } from "./features/commands/showSpidersDenRainSchedule";
import { resetAbandonedQuarryTracker } from "./features/overlays/abandonedQuarryTracker";
import { resetSeaCreaturesPerHourTracker } from "./features/overlays/seaCreaturesPerHourTracker";
import { resetTreasureFishingTracker, setTreasureDyes } from "./features/overlays/treasureFishingTracker";
import { resetArchfiendDiceProfitTracker } from "./features/overlays/archfiendDiceProfitTracker";
import { SESSION_VIEW_MODE, TOTAL_VIEW_MODE } from "./constants/viewModes";
import { resetWaterHotspotsAndBayouTracker, setTikiMasks, setTitanoboaSheds } from "./features/overlays/waterHotspotsAndBayouTracker";

register("command", (...args) => {
    settings.getConfig().openGui();
}).setName("feesh").setAliases(["feeshnotifier"]);

register("command", (...args) => {
    const isConfirmed = args[0] && args[0] === "noconfirm";
    resetSeaCreaturesTracker(!!isConfirmed, SESSION_VIEW_MODE);
}).setName("feeshResetSeaCreatures");

register("command", (...args) => {
    const isConfirmed = args[0] && args[0] === "noconfirm";
    resetSeaCreaturesTracker(!!isConfirmed, TOTAL_VIEW_MODE);
}).setName("feeshResetSeaCreaturesTotal");

register("command", (...args) => {
    const isConfirmed = args[0] && args[0] === "noconfirm";
    resetSeaCreaturesPerHourTracker(!!isConfirmed);
}).setName("feeshResetSeaCreaturesPerHour");

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
    resetWaterHotspotsAndBayouTracker(!!isConfirmed);
}).setName("feeshResetWaterHotspotsAndBayou");

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
    resetAbandonedQuarryTracker(!!isConfirmed);
}).setName("feeshResetAbandonedQuarry");

register("command", (...args) => {
    const isConfirmed = args[0] && args[0] === "noconfirm";
    resetArchfiendDiceProfitTracker(!!isConfirmed, SESSION_VIEW_MODE);
}).setName("feeshResetArchfiendDiceProfit");

register("command", (...args) => {
    const isConfirmed = args[0] && args[0] === "noconfirm";
    resetTreasureFishingTracker(!!isConfirmed);
}).setName("feeshResetTreasureFishing");

register("command", (...args) => {
    const isConfirmed = args[0] && args[0] === "noconfirm";
    resetArchfiendDiceProfitTracker(!!isConfirmed, TOTAL_VIEW_MODE);
}).setName("feeshResetArchfiendDiceProfitTotal");

register("command", (...args) => {
    const isConfirmed = args[0] && args[0] === "noconfirm";
    resetFishingProfitTracker(!!isConfirmed);
    if (isConfirmed) {
        resetDropNumbers();
    }
}).setName("feeshResetProfitTracker");

register("command", (dropId, count, ...dateParts) => {
    const lastOn = dateParts.join(' ');

    switch (dropId) {
        case 'RADIOACTIVE_VIAL':
            setRadioactiveVials(+count, lastOn);
            break;
        case 'TITANOBOA_SHED':
            setTitanoboaSheds(+count, lastOn);
            break;
        case 'TIKI_MASK':
            setTikiMasks(+count, lastOn);
            break;
        case 'DYE_TREASURE':
            setTreasureDyes(+count, lastOn);
            break;
    }
}).setName("feeshSetTrackerDrops");

register("command", (...args) => {
    calculateFishingPetPrices();
}).setName("feeshPetLevelUpPrices");

register("command", (...args) => {
    calculateGearCraftPrices();
}).setName("feeshGearCraftPrices");

register("command", (...args) => {
    showSpidersDenRainSchedule();
}).setName("feeshSpidersDenRainSchedule");

register("command", (...args) => {
    moveAllGuis();
}).setName("feeshMoveAllGuis");