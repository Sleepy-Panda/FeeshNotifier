import { GREEN, RED, YELLOW } from "./formatting";

// For module versions 1.x.x
export const CHANGELOG_V1 = [
    {
        categoryDisplayName: `${GREEN}Features`,
        entries: [
            "Added a keybind to send Lootshare! message to the party chat, and added alert when such message appears.",
            "Added alert when a Salt has expired.",
            "Added Carrot King to rare sea creatures HP widget.",
        ],
    },
    {
        categoryDisplayName: `${RED}Bugfixes`,
        entries: [
            'Changed rarity of Scuttler Shell and Vampire Fang',
            'Fixed Obfuscated trophy fish not counted in the Fishing profit tracker.',
        ],     
    },
    {
        categoryDisplayName: `${YELLOW}Other`,
        entries: [
        ],     
    }
];

// For module versions 2.x.x
export const CHANGELOG_V2 = [

];