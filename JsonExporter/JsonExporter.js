useLibrary("threads");
importClass(java.io.File);
importClass(java.io.FileWriter);
importClass(java.nio.file.Files);
importClass(java.nio.file.Paths);
importClass(arkham.project.ProjectUtilities);
importClass(ca.cgjennings.apps.arkham.project.Project);

const PROJECT_FOLDER = "/home/toke/Documents/Blood of Walachia/";
const OUTPUT_FILE = "result_raw.json";

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

    let collection = [];
    for (let path of cards) {
        let card = ResourceKit.getGameComponentFromFile(new File(path), true);
        let out = {};

        println("processing " + path);
        out["name"] = card.getFullName();
        out["comment"] = card.getComment();
        let keys = card.getSettings().getKeySet();
        for (let k of keys) {
            out[k] = card.getSettings().get(k);
        }
        out["Portraits"] = [];
        for (
            let portrait_index = 0;
            portrait_index < card.getPortraitCount();
            portrait_index++
        ) {
            out["Portraits"].push(card.getPortrait(portrait_index).getSource());
        }
        out["DIYScript"] = card.getClassName();
        collection.push(out);
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
