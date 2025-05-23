useLibrary("threads");
importClass(java.io.File);
importClass(java.io.FileWriter);
importClass(java.nio.file.Files);
importClass(java.nio.file.Paths);
importClass(arkham.project.ProjectUtilities);
importClass(ca.cgjennings.apps.arkham.project.Project);

const PROJECT_FOLDER = "/home/toke/Documents/Blood of Walachia/";
const OUTPUT_FILE = "result_raw.json";

const front_types = {
    "Act.js": "act",
    "ActAssetStory.js": "act",
    "ActEnemy.js": "act",
    "ActLocation.js": "act",
    "ActPortrait.js": "act",
    "Agenda.js": "agenda",
    "AgendaAssetStory.js": "agenda",
    "AgendaEnemy.js": "agenda",
    "AgendaFrontPortrait.js": "agenda",
    "AgendaLocation.js": "agenda",
    "AgendaPortrait.js": "agenda",
    "AgendaTreachery.js": "agenda",
    "Asset.js": "asset",
    "AssetAsset.js": "asset",
    "AssetStory.js": "asset",
    "AssetStoryAsset.js": "asset",
    "AssetStoryEnemy.js": "asset",
    "AssetStoryPortrait.js": "asset",
    "Chaos.js": "chaos",
    "Concealed.js": "concealed",
    "Customizable.js": "customizable",
    "Enemy.js": "enemy",
    "EnemyEnemy.js": "enemy",
    "EnemyLocation.js": "enemy_location",
    "EnemyPortrait.js": "enemy",
    "Event.js": "event",
    "Investigator.js": "investigator",
    "InvestigatorStory.js": "investigator",
    "Key.js": "key",
    "Location.js": "location",
    "LocationLocation.js": "location",
    "Scenario.js": "scenario",
    "Skill.js": "skill",
    "StoryAsset.js": "story",
    "StoryChaos.js": "story",
    "StoryEnemy.js": "story",
    "StoryLocation.js": "story",
    "StoryStory.js": "story",
    "StoryTreachery.js": "story",
    "Treachery.js": "treachery",
    "TreacheryLocation.js": "treachery",
    "TreacheryPortrait.js": "treachery",
    "TreacheryStory.js": "treachery",
    "Ultimatum.js": "ultimatum",
    "WeaknessEnemy.js": "enemy",
    "WeaknessTreachery.js": "treachery",
    "MiniInvestigator.js": "mini",
};

const back_types = {
    "Act.js": "act_back",
    "ActAssetStory.js": "asset",
    "ActEnemy.js": "enemy",
    "ActLocation.js": "location",
    "ActPortrait.js": "act_back",
    "Agenda.js": "agenda_back",
    "AgendaAssetStory.js": "asset",
    "AgendaEnemy.js": "enemy",
    "AgendaFrontPortrait.js": "agenda_back",
    "AgendaLocation.js": "location",
    "AgendaPortrait.js": "agenda_back",
    "AgendaTreachery.js": "treachery",
    "Asset.js": "player",
    "AssetAsset.js": "asset",
    "AssetStory.js": "story",
    "AssetStoryAsset.js": "asset",
    "AssetStoryEnemy.js": "enemy",
    "AssetStoryPortrait.js": "story",
    "Chaos.js": "chaos_back",
    "Concealed.js": "concealed_back",
    "Customizable.js": "customizable_back",
    "Enemy.js": "encounter",
    "EnemyEnemy.js": "enemy",
    "EnemyLocation.js": "location_back",
    "EnemyPortrait.js": "encounter",
    "Event.js": "player",
    "Investigator.js": "investigator_back",
    "InvestigatorStory.js": "investigator_back",
    "Key.js": "key_back",
    "Location.js": "location_back",
    "LocationLocation.js": "location",
    "Scenario.js": "scenario_back",
    "Skill.js": "player",
    "StoryAsset.js": "asset",
    "StoryChaos.js": "chaos",
    "StoryEnemy.js": "enemy",
    "StoryLocation.js": "location",
    "StoryStory.js": "story",
    "StoryTreachery.js": "treachery",
    "Treachery.js": "encounter",
    "TreacheryLocation.js": "location",
    "TreacheryPortrait.js": "encounter",
    "TreacheryStory.js": "story",
    "Ultimatum.js": "ultimatum_back",
    "WeaknessEnemy.js": "player",
    "WeaknessTreachery.js": "player",
    "MiniInvestigator.js": "mini_back",
};

let headless = Eons.getScriptRunner() !== null;
let project = headless
    ? Project.open(new File(PROJECT_FOLDER))
    : Eons.getOpenProject();

function process(progress) {
    function syncProject() {
        if (!headless) {
            project.synchronizeAll();
        }
    }

    function reportStatus(progress, status) {
        if (headless) {
            println(status);
        } else {
            progress.status = status;
        }
    }

    let cards = [];
    Files.walk(Paths.get(PROJECT_FOLDER)).forEach((card) => {
        if (card.toString().slice(-4) === ".eon") {
            cards.push(card.toString());
            println(card);
        }
    });

    let collection = {
        cards: [],
        encounter_sets: {
            "0_": { name: "Other", cards: [] },
            "1_Village": { name: "Village", cards: [] },
            "2_Forest": { name: "Forest", cards: [] },
            "3_Vila": { name: "Vila", cards: [] },
            "4_Monestary": { name: "Monestary", cards: [] },
            "5_Swamp": { name: "Swamp", cards: [] },
            "6_Castle": { name: "Castle", cards: [] },
            "7_Tower": { name: "Tower", cards: [] },
            "8_Stairs": { name: "Stairs", cards: [] },
        },
    };
    for (let path of cards) {
        let card = ResourceKit.getGameComponentFromFile(new File(path), true);
        let settings = card.getSettings();
        let out = {};

        let target_collection = null;
        for (encounter in collection.encounter_sets) {
            if (path.indexOf(encounter) > -1) {
                target_collection = collection.encounter_sets[encounter].cards;
                break;
            }
        }
        if (path.indexOf('/Investigator/') > -1){
            target_collection = collection.cards;
        }
        if (target_collection === null) {
            continue;
        }
        target_collection.push(out);

        println("processing " + path);
        if (card.getFullName() != ""){
            out["name"] = card.getFullName();
        } else {
            let file_name = /\/([^\/]+)$/.exec(path)[1];
            out["name"] = file_name;
        }
        let script_parts = card.getClassName().split("/");
        let script_name = script_parts[script_parts.length - 1];
        out["front"] = {
            type: front_types[script_name],
        };
        out["back"] = {
            type: back_types[script_name],
        };

        if (settings.get("Keywords") || settings.get("Rules")){
            out["front"]["text"] = settings.get("Keywords") + "\n" + settings.get("Rules");
        }
        if (settings.get("AgendaStory") || settings.get("ActStory")){
            out["front"]["text"] = "<i>" + settings.get("AgendaStory") + settings.get("ActStory") + "</i>\n" + out["front"]["text"];
        }
        if (settings.get("Flavor")){
            out["front"]["flavor_text"] = settings.get("Flavor");
        }
        if (settings.get("Traits")){
            out["front"]["traits"] = settings.get("Traits");
        }
        if (settings.get("Victory")){
            out["front"]["victory"] = settings.get("Victory");
        }
        if (settings.get("CardClass") && settings.get("CardClass2") != "None"){
            out["front"]["class"] = "multi";
            out["front"]["classes"] = [settings.get("CardClass"), settings.get("CardClass2")];
            if (settings.get("CardClass3") != "None"){
                out["front"]["classes"].push(settings.get("CardClass3"))
            }
        } else if (settings.get("CardClass")) {
            out["front"]["class"] = settings.get("CardClass");
        }

        try {
            out["front"]["illustration"] = card.getPortrait(0).getSource();
            out["front"]["illustration_scale"] = min(card.getPortrait(0).getScale()*2, 1);
            out["front"]["illustration_pan_x"] = card.getPortrait(0).getPanX();
            out["front"]["illustration_pan_y"] = card.getPortrait(0).getPanY();
        } catch (e) {}

        try {
            if (card.getPortraitCount() > 3) {
                out["back"]["illustration"] = card.getPortrait(1).getSource();
                out["back"]["illustration_scale"] = card
                    .getPortrait(1)
                    .getScale();
                out["back"]["illustration_pan_x"] = card
                    .getPortrait(1)
                    .getPanX();
                out["back"]["illustration_pan_y"] = card
                    .getPortrait(1)
                    .getPanY();
            }
        } catch (e) {}

        if (settings.get("Clues")){
            out["front"]["clues"] = settings.get("Clues") + (settings.get("PerInvestigator") == "0" ? "" : '<per>');
        }
        if (settings.get("Shroud")){
            out["front"]["shroud"] = settings.get("Shroud") + (settings.get("ShroudPerInvestigator")  == "0" ? "" : '<per>');
        }
        if (settings.get("Doom")){
            out["front"]["doom"] = settings.get("Doom") + (settings.get("PerInvestigator") == "0" ? "" : '<per>');
        }
        if (settings.get("ScenarioIndex")){
            out["front"]["scenarioIndex"] = settings.get("ScenarioIndex") + settings.get("ScenarioDeckID");
        }        
        if (settings.get("LocationIcon")){
            out["front"]["connection"] = settings.get("LocationIcon");
        }
        if (settings.get("Connection1Icon")){
            out["front"]["connections"] = [
                settings.get("Connection1Icon"),
                settings.get("Connection2Icon"),
                settings.get("Connection3Icon"),
                settings.get("Connection4Icon"),
                settings.get("Connection5Icon"),
                settings.get("Connection6Icon"),
            ];
        }
    }

    let output_file = new File(PROJECT_FOLDER, OUTPUT_FILE);
    output_file.createNewFile(); // returns true/false depending on if created or exists
    let writer = new FileWriter(output_file);
    writer.write(JSON.stringify(collection));
    writer.close();
    println("Done writing to " + String(output_file));
}

if (headless) {
    process({ cancelled: false });
    project.close();
} else {
    Thread.busyWindow(process, "Building...", true);
}
