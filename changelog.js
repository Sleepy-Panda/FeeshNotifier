import { AQUA, BOLD, GOLD, GRAY, WHITE } from "./constants/formatting";
import { persistentData } from "./data/data";

const welcomeMessageRegister = register("step", () => {
    if (!World.isLoaded() || !persistentData) return;
    if (persistentData.isWelcomeMessageShown) {
        welcomeMessageRegister.unregister();
        return;
    }

    const chatBreak = ChatLib.getChatBreak(`${GRAY}-`);
    ChatLib.chat(chatBreak);
    ChatLib.chat(`${AQUA}α ${WHITE}${BOLD}Welcome to ${GOLD}${BOLD}FeeshNotifier${WHITE}${BOLD}!`);
    ChatLib.chat(`${GRAY}- ${WHITE}To open the settings, do ${AQUA}/feesh`);
    ChatLib.chat(`${GRAY}- ${WHITE}To move the enabled GUIs, do ${AQUA}/feeshMoveAllGuis`);
    ChatLib.chat(`${GRAY}Happy Feeshing!`);
    ChatLib.chat(chatBreak);

    persistentData.isWelcomeMessageShown = true;
    persistentData.save();
    welcomeMessageRegister.unregister();
}).setFps(1);