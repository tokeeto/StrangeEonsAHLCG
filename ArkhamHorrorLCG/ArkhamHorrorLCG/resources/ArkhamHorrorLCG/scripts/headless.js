useLibrary("threads");
importClass(java.io.File);
importClass(java.util.UUID);
importClass(arkham.project.ProjectUtilities);
importClass(arkham.sheet.RenderTarget);
importClass(ca.cgjennings.apps.arkham.project.Project);
importClass(ca.cgjennings.apps.arkham.diy.DIY);
importClass(ca.cgjennings.imageio.SimpleImageWriter);
importClass(ca.cgjennings.seplugins.csv.CsvFactory);
importClass(gamedata.ClassMap);

const PROJECT_FOLDER = "./test_output";
const TEMPLATE_FOLDER = "template";
const DATA_FOLDER = ".";
const CARD_FOLDER = "./test_output/cards";
const IMAGE_FOLDER = "images";

let headless = Eons.getScriptRunner() !== null;
let project = headless
    ? Project.open(new File(PROJECT_FOLDER))
    : Eons.getOpenProject();

// step 1: Find files
// step 2: read json files
let types = [];
//let data_file = new File("test_cards.json").read();
//let data = JSON.parse(data_file);

let cardFolder = new File(CARD_FOLDER);

let factory = new CsvFactory();
factory.setDelimiter(",");
factory.setQuote('"');
factory.setExtraSpaceIgnored(false);
factory.setIgnoreUnknownKeys(false);
factory.setTemplateClearedForEachRow(false);
factory.setOutputFolder(cardFolder);

// step 3: output to card images
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

    let cardFolder = new File(project.getFile(), CARD_FOLDER);
    cardFolder.mkdirs();
    syncProject();

    let imageWriter = new SimpleImageWriter("png");
    var data = [
        {
            title: "MonsterSlayer",
            type: "Event",
            cost: 4,
            class: ["Seeker", "Guardian"],
            icons: [0, 1, 1],
            text: "This is a test card",
        },
    ];

    for (let card of data) {
        diy = null;
        if (card.type == "Event") {
            let template = new DIY(
                "res://ArkhamHorrorLCG/diy/Event.js",
                "AHLCG",
                false,
            );
            println(template.getSettings().get("CardClass"));
            println(template.getSettings().get("$ResourceCost"));

            let csvFile = new File("temp_csv_file.csv");
            reportStatus(progress, "Processing " + csvFile.getName() + "...");
            let csv = ProjectUtilities.getFileText(csvFile, "utf-8");

            factory.process(template, csv);
            syncProject();
        }
    }

    for (var i = 1; i < data.length + 1; i++) {
        let cardFile = new File(CARD_FOLDER + "/" + String(i) + ".eon");
        let card = ResourceKit.getGameComponentFromFile(cardFile, true);
        let imageWriter = new SimpleImageWriter("png");
        let imageFile = new File(CARD_FOLDER + "/" + String(i) + ".png");

        let sheets = card.createDefaultSheets();
        let sheet = sheets[0];
        reportStatus(progress, "Making image of " + cardFile.getName() + "...");
        let image = sheet.paint(RenderTarget.EXPORT, 300, false);
        imageWriter.write(image, imageFile);
        syncProject();
    }
}

if (headless) {
    process({ cancelled: false });
    project.close();
} else {
    Thread.busyWindow(process, "Building...", true);
}
