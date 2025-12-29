import { GREEN, RED, YELLOW } from "./formatting";

// For module versions 1.x.x
export const CHANGELOG_V1 = [
    {
        categoryDisplayName: `${GREEN}Features`,
        entries: [
            'Reworked Fishing Hook Timer to have stable position on player\'s screen. Re-enable in Settings -> Overlays -> Fishing Hook, and move to proper position like other overlays!',
            'Added Burnt Texts drop alert & party message.',
            'Added Vanquisher to the HP tracker.'
        ],
    },
    {
        categoryDisplayName: `${RED}Bugfixes`,
        entries: [
            'When auto-resetting is enabled, skip resetting the trackers on CT modules reloading.',
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