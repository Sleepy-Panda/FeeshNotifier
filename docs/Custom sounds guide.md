# Custom sounds guide

This guide allows you to set custom sounds when you catch a rare sea creature, or drop a rare item.
List of sea creatures and drops matches the alerts available in the module settings.

## Preparing sounds

1. Make sure `Meme` sound mode is selected in the module settings.
1. Prepare your custom sounds converted to the `.ogg` format.
1. Optionally, rename your custom sounds. Make their filenames start from some prefix, e.g. `feeshcustom_`:
  - Filename example will be `feeshcustom_whatever-sound-name-goes-here.ogg`.
  - This is needed to prevent overwriting sounds from other CT modules, which may have same filename.
  - Also you can easier cleanup sounds if needed.
1. Open CT assets folder (`/config/ChatTriggers/assets`).
1. Copy your custom .ogg sounds into the current folder.
1. Check that new sounds are played correctly, using the command `/feeshPlaySound filename.ogg`.

## Changing configs

1. Navigate to the module's config folder - `/config/ChatTriggers/modules/FeeshNotifier/config`.
1. Use your custom sounds filenames in the `userCatchSounds.json` / `userDropSounds.json` instead of the default sounds.
  - For pet IDs, `;4` after pet name means Legendary, `;3` - Epic, `;2` - Rare, `;2` - Uncommon, `;1` - Common. E.g. `BABY_YETI;4` is Legendary Baby Yeti.
1. After modifying the configs, run `/ct load` ingame or restart your game.

## Reset to default

1. Navigate to the module's config folder - `/config/ChatTriggers/modules/FeeshNotifier/config`.
1. Remove `userCatchSounds.json` / `userDropSounds.json` files.
1. Run `/ct load` ingame or restart your game, it will regenerate the files with default sounds.