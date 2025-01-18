import settings from "./settings";
import { overlayCoordsData } from "./data/overlayCoords";
import { AQUA, BLUE, BOLD, DARK_GRAY, DARK_PURPLE, DARK_RED, GOLD, GRAY, GREEN, LIGHT_PURPLE, RED, RESET, WHITE, YELLOW } from "./constants/formatting";
import { isInSkyblock } from "./utils/playerState";
import { decreaseScaleOrSetToMinimal } from "./moveOverlay";

export function moveAllGuis() {
    if (!isInSkyblock()) {
        return;
    }

    ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Drag the overlay to move it. Click the overlay and then press +/- or mouse scroll to increase/decrease size. Press ESC when you're done.`);
    settings.allOverlaysGui.open();
}

const SAMPLE_GUIS = [
    {
        toggleSettingKey: 'totemRemainingTimeOverlay',
        guiSettings: overlayCoordsData.totemRemainingTimeOverlay,
        sampleText: `${DARK_PURPLE}Totem of Corruption: ${WHITE}01m 58s`,
        isActive: false,
        width: 0,
        height: 0
    },
    {
        toggleSettingKey: 'flareRemainingTimeOverlay',
        guiSettings: overlayCoordsData.flareRemainingTimeOverlay,
        sampleText: `${DARK_PURPLE}SOS Flare: ${WHITE}01m 58s`,
        isActive: false,
        width: 0,
        height: 0
    },
    {
        toggleSettingKey: 'rareCatchesTrackerOverlay',
        guiSettings: overlayCoordsData.rareCatchesTrackerOverlay,
        sampleText: 
`${YELLOW}${BOLD}Rare catches tracker
${GRAY}- ${LIGHT_PURPLE}Thunder: ${WHITE}10
${GRAY}- ${DARK_PURPLE}Vanquisher: ${WHITE}8
${GRAY}- ${LIGHT_PURPLE}Lord Jawbus: ${WHITE}2`,
        isActive: false,
        width: 0,
        height: 0
    },
    {
        toggleSettingKey: 'seaCreaturesHpOverlay',
        guiSettings: overlayCoordsData.seaCreaturesHpOverlay,
        sampleText: `${YELLOW}${BOLD}Sea creatures HP\n${GRAY}[Lv600] ${RED}${BOLD}Lord Jawbus ${RESET}${GREEN}76m${WHITE}/${GREEN}100m${RED}❤`,
        isActive: false,
        width: 0,
        height: 0
    },
    {
        toggleSettingKey: 'seaCreaturesCountOverlay',
        guiSettings: overlayCoordsData.seaCreaturesCountOverlay,
        sampleText: `${GOLD}10 ${GRAY}sea creatures (${GOLD}03m 20s${GRAY})`,
        isActive: false,
        width: 0,
        height: 0
    },
    {
        toggleSettingKey: 'legionAndBobbingTimeOverlay',
        guiSettings: overlayCoordsData.legionAndBobbingTimeOverlay,
        sampleText: `${GOLD}Legion: ${WHITE}5 ${GRAY}players\n${GOLD}Bobbin' time: ${WHITE}3 hooks`,
        isActive: false,
        width: 0,
        height: 0
    },
    {
        toggleSettingKey: 'crimsonIsleTrackerOverlay',
        guiSettings: overlayCoordsData.crimsonIsleTrackerOverlay,
        sampleText:
`${DARK_RED}${BOLD}Crimson Isle tracker
${LIGHT_PURPLE}Thunder: ${WHITE}35 ${GRAY}catches ago ${DARK_GRAY}(${GRAY}avg: ${WHITE}70${DARK_GRAY})
${GRAY}Last on: ${WHITE}2024-11-30 12:00:00
${LIGHT_PURPLE}Lord Jawbus: ${WHITE}417 ${GRAY}catches ago ${DARK_GRAY}(${GRAY}avg: ${WHITE}454${DARK_GRAY})
${GRAY}Last on: ${WHITE}2024-11-30 11:30:00
${LIGHT_PURPLE}Radioactive Vials: ${WHITE}10
${GRAY}Last on: ${WHITE}2024-11-29 18:00:00
${GRAY}Last on: ${WHITE}6 Jawbuses ago`,
        isActive: false,
        width: 0,
        height: 0
    },
    {
        toggleSettingKey: 'jerryWorkshopTrackerOverlay',
        guiSettings: overlayCoordsData.jerryWorkshopTrackerOverlay,
        sampleText:
`${AQUA}${BOLD}Jerry Workshop tracker
${GOLD}Yeti: ${WHITE}70 ${GRAY}catches ago ${DARK_GRAY}(${GRAY}avg: ${WHITE}85${DARK_GRAY})
${GRAY}Last on: ${WHITE}2024-11-30 12:00:00
${GOLD}Reindrake: ${WHITE}417 ${GRAY}catches ago ${DARK_GRAY}(${GRAY}avg: ${WHITE}654${DARK_GRAY})
${GRAY}Last on: ${WHITE}2024-11-30 08:30:00
${GRAY}Baby Yeti pets: ${GOLD}3 ${DARK_PURPLE}7`,
        isActive: false,
        width: 0,
        height: 0
    },
    {
        toggleSettingKey: 'wormProfitTrackerOverlay',
        guiSettings: overlayCoordsData.wormProfitTrackerOverlay,
        sampleText:
`${AQUA}${YELLOW}Worm profit tracker
${GREEN}Total worms: ${WHITE}3 172
${GREEN}Total membranes: ${WHITE}1 574
${GOLD}Total coins (sell offer): ${WHITE}109.7m
${GOLD}Total coins (insta-sell): ${WHITE}108.8m

${GREEN}Worms/h: ${WHITE}963
${GREEN}Membranes/h: ${WHITE}478
${GOLD}Coins/h (sell offer): ${WHITE}33.3m
${GOLD}Coins/h (insta-sell): ${WHITE}33m

${AQUA}Elapsed time: ${WHITE}3:17:26`,
        isActive: false,
        width: 0,
        height: 0
    },
    {
        toggleSettingKey: 'magmaCoreProfitTrackerOverlay',
        guiSettings: overlayCoordsData.magmaCoreProfitTrackerOverlay,
        sampleText:
`${AQUA}${YELLOW}Magma Core profit tracker
${GREEN}Total sea creatures caught: ${WHITE}1 106
${BLUE}Total magma cores: ${WHITE}20
${GOLD}Total coins (sell offer): ${WHITE}41.3m
${GOLD}Total coins (insta-sell): ${WHITE}36m

${GREEN}Sea creatures caught/h: ${WHITE}931
${BLUE}Magma cores/h: ${WHITE}16
${GOLD}Coins/h (sell offer): ${WHITE}33m
${GOLD}Coins/h (insta-sell): ${WHITE}28.8m

${AQUA}Elapsed time: ${WHITE}1:11:13`,
        isActive: false,
        width: 0,
        height: 0
    },
    {
        toggleSettingKey: 'fishingProfitTrackerOverlay',
        guiSettings: overlayCoordsData.fishingProfitTrackerOverlay,
        sampleText:
`${AQUA}${BOLD}Fishing profit tracker
- 1x ${LIGHT_PURPLE}Radioactive Vial: ${GOLD}170m
- 1027x ${DARK_PURPLE}Silver Magmafish: ${GOLD}25m
- 3x ${LIGHT_PURPLE}Flash I ${WHITE}Book: ${GOLD}20m
- 2x ${AQUA}Fishing Experience I ${WHITE}Attribute Shard: ${GOLD}2m
- 20x Cheap items of 3 types: ${GOLD}3m

${AQUA}Total: ${GOLD}${BOLD}220M ${RESET}${GRAY}(${GOLD}171M${GRAY}/h)

${AQUA}Elapsed time: ${WHITE}1:17:14`,
        isActive: false,
        width: 0,
        height: 0
    },
];

register('renderOverlay', () => renderSampleOverlays());

register("worldUnload", () => {
    if (settings.allOverlaysGui.isOpen()) settings.allOverlaysGui.close();
});

settings.allOverlaysGui.registerClicked((x, y, button) => {
    if (!settings.allOverlaysGui.isOpen()) {
        return;
    }

    SAMPLE_GUIS.forEach(sampleGui => {
        if (isInOverlay(sampleGui, x, y)) {
            sampleGui.selected = true;
        } else {
            sampleGui.selected = false;
        }
    });
});

settings.allOverlaysGui.registerScrolled((x, y, direction) => {
    if (!settings.allOverlaysGui.isOpen()) {
        return;
    }

    const selectedGui = SAMPLE_GUIS.find(g => g.selected);
    if (!selectedGui) {
        return;
    }

    if (direction > 0) {
        zoomInCurrentGui(selectedGui);
    } else if (direction < 0) {
        zoomOutCurrentGui(selectedGui);
    }
});

settings.allOverlaysGui.registerKeyTyped((char, keyCode) => {
    if (!settings.allOverlaysGui.isOpen()) {
        return;
    }

    const selectedGui = SAMPLE_GUIS.find(g => g.selected);
    if (!selectedGui) {
        return;
    }

    if (keyCode == 13) { // "+" character
        zoomInCurrentGui(selectedGui);
    } else if (keyCode == 12) { // "-" character
        zoomOutCurrentGui(selectedGui);
    }
});

settings.allOverlaysGui.registerMouseDragged((x, y) => {
    if (!settings.allOverlaysGui.isOpen()) {
        return;
    }

    const selectedGui = SAMPLE_GUIS.find(g => g.selected);
    if (!selectedGui) {
        return;
    }

    moveCurrentGui(selectedGui, x, y);
});

function isInOverlay(sampleGui, x, y) {
    if (!settings.allOverlaysGui.isOpen()) {
        return false;
    }

    if (!sampleGui || !sampleGui.sampleText) {
        return false;
    }

    if (!settings[sampleGui.toggleSettingKey]) {
        return false;
    }

    if (x >= sampleGui.guiSettings.x && x <= sampleGui.guiSettings.x + sampleGui.width &&
        y >= sampleGui.guiSettings.y && y <= sampleGui.guiSettings.y + sampleGui.height
    ) {
        return true;
    } else {
        return false;
    }
}

function renderSampleOverlays() {
    if (!settings.allOverlaysGui.isOpen()) {
        return;
    }

    SAMPLE_GUIS.filter(sampleGui => settings[sampleGui.toggleSettingKey]).forEach(sampleGui => {
        const overlay = new Text(sampleGui.sampleText, sampleGui.guiSettings.x, sampleGui.guiSettings.y)
            .setShadow(true)
            .setScale(sampleGui.guiSettings.scale);
        overlay.draw();

        sampleGui.width = overlay.getWidth();
        sampleGui.height = overlay.getHeight();
    });
}

function moveCurrentGui(selectedGui, x, y) {
    selectedGui.guiSettings.x = x;
    selectedGui.guiSettings.y = y;
    overlayCoordsData.save();
}

function zoomInCurrentGui(selectedGui) {
    selectedGui.guiSettings.scale += 0.1;
    overlayCoordsData.save();
}

function zoomOutCurrentGui(selectedGui) {
    decreaseScaleOrSetToMinimal(selectedGui.guiSettings);
    overlayCoordsData.save();
}