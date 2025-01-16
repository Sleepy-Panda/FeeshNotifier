import settings from "./settings"

register("command", (...args) => {
    settings.openGUI();
    return;
}).setName("feesh").setAliases(["feeshnotifier"])