importClass(java.io.File);

function getName() { return 'Reload AHLCG layout settings'; }
function getDescription() { return 'Re-import settings/*.settings from the open project and repaint editors'; }
function getVersion() { return 0.1; }
function getPluginType() { return arkham.plugins.Plugin.ACTIVATED; }

function run() {
    const project = Eons.getOpenProject();
    if (project == null) {
        alert('Open a project containing ArkhamHorrorLCG/ArkhamHorrorLCG first.', true);
        return;
    }

    const settingsDir = new File(project.getFile(), 'ArkhamHorrorLCG/resources/ArkhamHorrorLCG/settings');
    if (!settingsDir.listFiles()) {
        alert('ArkhamHorrorLCG/ArkhamHorrorLCG/resources not found in this project.', true);
        return;
    }

    let n = 0;
    const files = settingsDir.listFiles();
    const gameSettings = gamedata.Game.get('AHLCG').masterSettings;
    for (let i = 0; i < files.length; ++i) {
        if (files[i].getName().endsWith('.settings')) {
            gameSettings.addSettingsFrom(files[i].toURI().toString());
            ++n;
        }
    }

    Eons.window.redrawPreviews();
    println('Reloaded ' + n + ' settings files from ' + settingsDir);
}
