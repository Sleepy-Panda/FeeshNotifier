import settings, { allOverlaysGui } from "./settings";
import { overlayCoordsData } from "./data/overlayCoords";
import { AQUA, BLUE, BOLD, DARK_GRAY, DARK_PURPLE, GOLD, GRAY, GREEN, LIGHT_PURPLE, RED, RESET, WHITE, YELLOW } from "./constants/formatting";
import { isInSkyblock } from "./utils/playerState";
import { decreaseScaleOrSetToMinimal } from "./moveOverlay";

export function moveAllGuis() {
    if (!isInSkyblock()) {
        return;
    }

    ChatLib.chat(`${GOLD}[FeeshNotifier] ${WHITE}Drag the overlay to move it. Click the overlay and then press +/- or mouse scroll to increase/decrease size. Press ESC when you're done.`);
    allOverlaysGui.open();
}

const SAMPLE_GUIS = [
    {
        toggleSettingKey: 'deployablesRemainingTimeOverlay',
        guiSettings: overlayCoordsData.deployablesRemainingTimeOverlay,
        sampleText: `${DARK_PURPLE}Totem of Corruption: ${WHITE}01m 58s\n${DARK_PURPLE}Black Hole: ${WHITE}25s`,
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
        toggleSettingKey: 'consumablesRemainingTimeOverlay',
        guiSettings: overlayCoordsData.consumablesRemainingTimeOverlay,
        sampleText: `${DARK_PURPLE}Moby-Duck: ${WHITE}51m`,
        isActive: false,
        width: 0,
        height: 0
    },
    {
        toggleSettingKey: 'seaCreaturesTrackerOverlay',
        guiSettings: overlayCoordsData.seaCreaturesTrackerOverlay,
        sampleText: 
`${AQUA}${BOLD}Sea creatures tracker
${GRAY}- ${LIGHT_PURPLE}Thunder${GRAY}: ${WHITE}10 ${GRAY}| DH: ${WHITE}2 ${GRAY}(25%)
${GRAY}- ${DARK_PURPLE}Vanquisher${GRAY}: ${WHITE}8
${GRAY}- ${LIGHT_PURPLE}Lord Jawbus${GRAY}: ${WHITE}2 ${GRAY}| DH: ${WHITE}1 ${GRAY}(100%)
${GRAY}- ${LIGHT_PURPLE}Ragnarok${GRAY}: ${WHITE}1 ${GRAY}| DH: ${WHITE}0 ${GRAY}(0%)
${GRAY}Total: ${WHITE}21`,
        isActive: false,
        width: 0,
        height: 0
    },
    {
        toggleSettingKey: 'seaCreaturesHpOverlay',
        guiSettings: overlayCoordsData.seaCreaturesHpOverlay,
        sampleText: `${AQUA}${BOLD}Sea creatures HP\n${RED}${BOLD}Lord Jawbus ${RESET}${GREEN}76m${WHITE}/${GREEN}100m${RED}❤`,
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
        toggleSettingKey: 'seaCreaturesPerHourTrackerOverlay',
        guiSettings: overlayCoordsData.seaCreaturesPerHourTrackerOverlay,
        sampleText: `
${YELLOW}${BOLD}Sea creatures per hour
${WHITE}1 000 ${GRAY}per hour (${WHITE}2 000 ${GRAY}total)

${AQUA}Elapsed time: ${WHITE}2:00:00
`,
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
`${AQUA}${BOLD}Crimson Isle tracker
${GOLD}Fiery Scuttler: ${WHITE}1 ${GRAY}catch ago ${DARK_GRAY}(${GRAY}avg: ${WHITE}50${DARK_GRAY})
${GRAY}Last on: ${WHITE}1m ${GRAY}(${WHITE}2024-11-30 11:45:00${GRAY})
${LIGHT_PURPLE}Ragnarok: ${WHITE}36 ${GRAY}catches ago ${DARK_GRAY}(${GRAY}avg: ${WHITE}350${DARK_GRAY})
${GRAY}Last on: ${WHITE}15m ${GRAY}(${WHITE}2024-11-30 11:59:00${GRAY})
${LIGHT_PURPLE}Plhlegblast: ${WHITE}2000 ${GRAY}catches ago ${DARK_GRAY}(${GRAY}avg: ${WHITE}1500${DARK_GRAY})
${GRAY}Last on: ${WHITE}24h 15m ${GRAY}(${WHITE}2024-11-29 12:00:00${GRAY})
${LIGHT_PURPLE}Thunder: ${WHITE}35 ${GRAY}catches ago ${DARK_GRAY}(${GRAY}avg: ${WHITE}70${DARK_GRAY})
${GRAY}Last on: ${WHITE}15m ${GRAY}(${WHITE}2024-11-30 12:00:00${GRAY})
${LIGHT_PURPLE}Lord Jawbus: ${WHITE}417 ${GRAY}catches ago ${DARK_GRAY}(${GRAY}avg: ${WHITE}454${DARK_GRAY})
${GRAY}Last on: ${WHITE}45m ${GRAY}(${WHITE}2024-11-30 11:30:00${GRAY})
${LIGHT_PURPLE}Radioactive Vials: ${WHITE}10
${GRAY}Last on: ${WHITE}1d 0h 0m ${GRAY}(${WHITE}2024-11-29 12:15:00${GRAY})
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
${GRAY}Last on: ${WHITE}2d 5h 8m ${GRAY}(${WHITE}2024-11-30 12:00:00${GRAY})
${GRAY}Baby Yeti pets: ${GOLD}3 ${DARK_PURPLE}7
${LIGHT_PURPLE}Reindrake: ${WHITE}417 ${GRAY}catches ago ${DARK_GRAY}(${GRAY}avg: ${WHITE}654${DARK_GRAY})
${GRAY}Last on: ${WHITE}2d 9h 8m ${GRAY}(${WHITE}2024-11-30 08:00:00${GRAY})`,
        isActive: false,
        width: 0,
        height: 0
    },
    {
        toggleSettingKey: 'waterHotspotsAndBayouTrackerOverlay',
        guiSettings: overlayCoordsData.waterHotspotsAndBayouTrackerOverlay,
        sampleText:
`${AQUA}${BOLD}Water hotspots & Bayou tracker
${LIGHT_PURPLE}Titanoboa: ${WHITE}417 ${GRAY}catches ago ${DARK_GRAY}(${GRAY}avg: ${WHITE}654${DARK_GRAY})
${GRAY}Last on: ${WHITE}2d 9h 8m ${GRAY}(${WHITE}2024-11-30 08:00:00${GRAY})
${GOLD}Titanoboa Sheds: ${WHITE}2
${GRAY}Last on: ${WHITE}1d 0h 0m ${GRAY}(${WHITE}2024-11-29 12:15:00${GRAY})
${GRAY}Last on: ${WHITE}10 Titanoboas ago
${LIGHT_PURPLE}Wiki Tiki: ${WHITE}70 ${GRAY}catches ago ${DARK_GRAY}(${GRAY}avg: ${WHITE}85${DARK_GRAY})
${GRAY}Last on: ${WHITE}2d 5h 8m ${GRAY}(${WHITE}2024-11-30 12:00:00${GRAY})
${GOLD}Tiki Masks: ${WHITE}5
${GRAY}Last on: ${WHITE}1d 0h 0m ${GRAY}(${WHITE}2024-11-29 12:15:00${GRAY})
${GRAY}Last on: ${WHITE}6 Wiki Tikis ago`,
        isActive: false,
        width: 0,
        height: 0
    },
    {
        toggleSettingKey: 'wormProfitTrackerOverlay',
        guiSettings: overlayCoordsData.wormProfitTrackerOverlay,
        sampleText:
`${AQUA}${BOLD}Worm profit tracker
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
`${YELLOW}${BOLD}Magma Core profit tracker
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
        toggleSettingKey: 'abandonedQuarryTrackerOverlay',
        guiSettings: overlayCoordsData.abandonedQuarryTrackerOverlay,
        sampleText:
`${YELLOW}${BOLD}Abandoned Quarry tracker
${GREEN}Total Mithril Grubbers caught: ${WHITE}13 ${GRAY}(${WHITE}6 2 3 2${GRAY})
${GREEN}Total Mithril Powder: ${WHITE}23 250 ${GRAY}[+750 last added]
${GREEN}Avg Mithril Powder per catch: ${WHITE}1 000

${GREEN}Mithril Grubbers caught/h: ${WHITE}238
${GREEN}Mithril Powder/h: ${WHITE}427 000

${AQUA}Elapsed time: ${WHITE}3:16`,
        isActive: false,
        width: 0,
        height: 0
    },
    {
        toggleSettingKey: 'archfiendDiceProfitTrackerOverlay',
        guiSettings: overlayCoordsData.archfiendDiceProfitTrackerOverlay,
        sampleText:
`${YELLOW}${BOLD}Archfiend Dice profit tracker ${GREEN}[Session]

${DARK_PURPLE}${BOLD}Archfiend Dice
${WHITE}10${GRAY}x rolls | ${WHITE}1${GRAY}x ${DARK_PURPLE}6 ${GRAY}| ${WHITE}0${GRAY}x ${DARK_PURPLE}7
${AQUA}Profit: ${GREEN}5M

${GOLD}${BOLD}High Class Archfiend Dice
${WHITE}0${GRAY}x rolls | ${WHITE}0${GRAY}x ${DARK_PURPLE}6 ${GRAY}| ${WHITE}0${GRAY}x ${DARK_PURPLE}7
${AQUA}Profit: ${GREEN}0

${AQUA}${BOLD}Total profit: ${GREEN}5M`,
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
    if (allOverlaysGui.isOpen()) allOverlaysGui.close();
});

allOverlaysGui.registerClicked((x, y, button) => {
    if (!allOverlaysGui.isOpen()) {
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

allOverlaysGui.registerScrolled((x, y, direction) => {
    if (!allOverlaysGui.isOpen()) {
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

allOverlaysGui.registerKeyTyped((char, keyCode) => {
    if (!allOverlaysGui.isOpen()) {
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

allOverlaysGui.registerMouseDragged((x, y) => {
    if (!allOverlaysGui.isOpen()) {
        return;
    }

    const selectedGui = SAMPLE_GUIS.find(g => g.selected);
    if (!selectedGui) {
        return;
    }

    moveCurrentGui(selectedGui, x, y);
});

function isInOverlay(sampleGui, x, y) {
    if (!allOverlaysGui.isOpen()) {
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
    if (!allOverlaysGui.isOpen()) {
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