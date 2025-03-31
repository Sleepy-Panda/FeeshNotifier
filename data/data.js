import PogObject from "PogData";

export const persistentData = new PogObject("FeeshNotifier", {
    "rareCatches": {},
    "totalRareCatches": 0,
    "crimsonIsle": {
        "thunder": {
            "catchesSinceLast": 0,
            "lastCatchTime": null,
            "catchesHistory": [],
            "averageCatches": 0
        },
        "lordJawbus": {
            "catchesSinceLast": 0,
            "lastCatchTime": null,
            "catchesHistory": [],
            "averageCatches": 0
        },
        "radioactiveVials": {
            "count": 0,
            "lordJawbusCatchesSinceLast": 0,
            "dropsHistory": []
        }
     },
     "jerryWorkshop": {
        "yeti": {
            "catchesSinceLast": 0,
            "lastCatchTime": null,
            "catchesHistory": [],
            "averageCatches": 0
        },
        "reindrake": {
            "catchesSinceLast": 0,
            "lastCatchTime": null,
            "catchesHistory": [],
            "averageCatches": 0
        },
        "babyYetiPets": {
            "epic": {
                "count": 0
            },
            "legendary": {
                "count": 0
            },
        }
    },
    "backwaterBayou": {
        "wikiTiki": {
            "catchesSinceLast": 0,
            "lastCatchTime": null,
            "catchesHistory": [],
            "averageCatches": 0
        },
        "titanoboa": {
            "catchesSinceLast": 0,
            "lastCatchTime": null,
            "catchesHistory": [],
            "averageCatches": 0
        },
        "tikiMasks": {
            "count": 0,
            "wikiTikiCatchesSinceLast": 0,
            "dropsHistory": []
        },
        "titanoboaSheds": {
            "count": 0,
            "titanoboaCatchesSinceLast": 0,
            "dropsHistory": []
        },
    },
    "fishingProfit": {
        "profitTrackerItems": {},
        "totalProfit": 0,
        "elapsedSeconds": 0
    },
    "rareDropNotifications": {
        "items": {}
    },
    "isFishingBagEnabled": null
}, 'config/data.json');