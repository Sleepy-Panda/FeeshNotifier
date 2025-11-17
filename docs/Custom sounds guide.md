# Custom sounds guide

This guide allows you to set custom sounds when you catch a rare sea creature, or drop a rare item.
List of sea creatures and drops matches the alerts available in the module settings.

## Preparing sounds

1. Make sure `Meme` sound mode is selected in the module settings.
1. Prepare your custom sounds converted to the `.ogg` format.
1. Rename your custom sounds. Make their filenames start from some prefix, e.g. `feeshcustom_`:
  - Filename example will be `feeshcustom_whatever-sound-name-goes-here.ogg`.
  - This is needed to prevent overwriting sounds from other CT modules, which may have same filename. The prefix solves this issue, all Feesh sounds start with it, making the filename unique among all your modules.
1. Open module folder (`/config/ChatTriggers/modules/FeeshNotifier`) and navigate to the `/assets` folder.
1. Copy your custom .ogg sounds into `/assets`.
1. Run `/ct load` ingame or restart your game, to make new files visible for CT.
1. Check that new sounds are played correctly, using the command `/feeshPlaySound filename.ogg`

## Changing configs

1. Navigate to the module's `/config` folder.
1. Use your custom sounds filenames in the `userCatchSounds.json` / `userDropSounds.json` instead of the default sounds.
  - For example, to set custom sound for Grim Reaper catch, change from `"GRIM REAPER": "feesh_notification.ogg",` to `"GRIM REAPER": "feeshcustom_your-filename.ogg",`.
1. After modifying the configs, run `/ct load` ingame or restart your game.
