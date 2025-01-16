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
}, 'config/data.json');