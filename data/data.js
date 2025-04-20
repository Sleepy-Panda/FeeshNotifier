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
    "archfiendDiceProfit": {
        "session": {
            "archfiend": {
                "rollsCount": 0,
                "rollsCost": 0,  
                "count6": 0,
                "count7": 0,
                "lostDicesCost": 0,
                "earnedCost": 0,
                "profit": 0
            },
            "highClass": {
                "rollsCount": 0,
                "rollsCost": 0,  
                "count6": 0,
                "count7": 0,
                "lostDicesCost": 0,
                "earnedCost": 0,
                "profit": 0
            },
            "profit": 0,
        },
        "total": {
            "archfiend": {
                "rollsCount": 0,
                "rollsCost": 0,  
                "count6": 0,
                "count7": 0,
                "lostDicesCost": 0,
                "earnedCost": 0,
                "profit": 0
            },
            "highClass": {
                "rollsCount": 0,
                "rollsCost": 0,  
                "count6": 0,
                "count7": 0,
                "lostDicesCost": 0,
                "earnedCost": 0,
                "profit": 0
            },
            "profit": 0,
        },
        "viewMode": 'SESSION'
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