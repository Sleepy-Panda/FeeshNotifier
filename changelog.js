import { CHANGELOG_V1 } from "./constants/changelogMessages";
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

const CURRENT_CHANGELOG_VERSION = JSON.parse(FileLib.read("FeeshNotifier", "metadata.json")).version;

const changelogMessageRegister = register("step", () => {
    if (!World.isLoaded() || !persistentData || !persistentData.isWelcomeMessageShown) return;
    if (persistentData.lastVersionChangelogShown === CURRENT_CHANGELOG_VERSION) {
        changelogMessageRegister.unregister();
        return;
    }

    const chatBreak = ChatLib.getChatBreak(`${GRAY}-`);
    ChatLib.chat(chatBreak);
    ChatLib.chat(`${GOLD}${BOLD}FeeshNotifier ${WHITE}${BOLD}v${CURRENT_CHANGELOG_VERSION}`);
    CHANGELOG_V1.forEach((category) => {
        if (!category.entries.length) return;
        ChatLib.chat(`${category.categoryDisplayName}:`);
        ChatLib.chat(category.entries.map(entry => `${GRAY}- ${WHITE}${entry}`).join(`\n`));
    });
    ChatLib.chat(chatBreak);

    persistentData.lastVersionChangelogShown = CURRENT_CHANGELOG_VERSION;
    persistentData.save();
    changelogMessageRegister.unregister();
}).setFps(1);