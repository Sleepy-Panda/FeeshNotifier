import { GREEN, RED, YELLOW } from "./formatting";

// For module versions 1.x.x
export const CHANGELOG_V1 = [
    {
        categoryDisplayName: `${GREEN}Features`,
        entries: [
            `Added [Session] and [Total] view modes for Fishing Profit Tracker and Sea creatures tracker. All your historical data will be shown in [Total] mode. You can enable autoresetting the [Session] in settings.`,
            `Show total amount of all sea creatures in Rare mode of Sea creatures tracker.`,
        ],
    },
    {
        categoryDisplayName: `${RED}Bugfixes`,
        entries: [
            `Added Ent Shard to Fishing profit tracker.`
        ],     
    },
    {
        categoryDisplayName: `${YELLOW}Other`,
        entries: [
            'Disabled some overlays by default in the settings.',
            'Added welcome message for the users who just downloaded the module.',
            'Added changelog for the users who just downloaded a new module version.',
        ],     
    }
];

// For module versions 2.x.x
export const CHANGELOG_V2 = [

];