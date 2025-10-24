import { GREEN, RED, YELLOW } from "./formatting";

// For module versions 1.x.x
export const CHANGELOG_V1 = [
    {
        categoryDisplayName: `${GREEN}Features`,
        entries: [
            `Added [Session] and [Total] view modes for Sea creatures tracker. All your historical data will be shown in [Total] mode. You can enable autoresetting the [Session] in settings.`,
            'Added welcome message for the users who just downloaded the module.',
            'Added changelog for the users who just downloaded a new module version.'
        ],
    },
    {
        categoryDisplayName: `${RED}Bugfixes`,
        entries: [
        ],     
    },
    {
        categoryDisplayName: `${YELLOW}Other`,
        entries: [
            'Disabled some overlays by default in the settings.',
        ],     
    }
];

// For module versions 2.x.x
export const CHANGELOG_V2 = [

];