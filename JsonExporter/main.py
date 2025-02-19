from zipfile import ZipFile
import os, shutil
import subprocess

path_orig = '~/.StrangeEons3/plug-ins/ArkhamHorrorLCG.seext'
path_backup = '~/.StrangeEons3/plug-ins/ArkhamHorrorLCG.seext_bak'

path_orig = os.path.expanduser(path_orig)
path_backup = os.path.expanduser(path_backup)


def create_plugin_file():
    with ZipFile('./test_bundle.seext', 'w') as zipf:
        for root, dirs, files in os.walk('./ArkhamHorrorLCG/'):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, './ArkhamHorrorLCG/')
                zipf.write(file_path, arcname)


def ensure_output_folder_exist():
    shutil.rmtree("./test_output")
    os.makedirs("./test_output/cards")
    if not os.path.exists("./test_output/seproject"):
        open("./test_output/seproject", "x").close()
    with open("./test_output/seproject", "w") as file:
        file.write("type = PROJECT")


def install_plugin():
    if os.path.exists(path_orig):
        os.replace(path_orig, path_backup)
    os.replace('./test_bundle.seext', path_orig)


def restore_old_plugin():
    os.replace(path_backup, path_orig)


def run_script():
    command = [
        "/usr/lib/jvm/java-11-openjdk/bin/java",
        "--illegal-access=permit",
        "-javaagent:/home/toke/Downloads/strange-eons33.jar",
        #"-javaagent:/home/toke/Downloads/strange-eons-b4421a/strange-eons.jar",
        "-cp",
        "/home/toke/Downloads/strange-eons-b4421a/strange-eons.jar",
        "strangeeons",
        "--run",
        "./ArkhamHorrorLCG/resources/ArkhamHorrorLCG/scripts/headless.js",
    ]
    result = subprocess.run(command, capture_output=True, text=True)
    print("--- stderr ---")
    print(result.stderr)
    print("--- stdout ---")
    print(result.stdout)


if __name__ == '__main__':
    create_plugin_file()
    ensure_output_folder_exist()
    install_plugin()
    try:
        run_script()
    finally:
        restore_old_plugin()
