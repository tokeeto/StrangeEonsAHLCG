import json

FILE_PATH = '/home/toke/Documents/Blood of Walachia/result_raw.json'

def update_json():
    # Read the JSON file
    with open(FILE_PATH, 'r') as file:
        data = json.load(file)

    # Process each element in the list
    for item in data:
        # Create factions list from existing fields
        factions = []
        for slot in ['CardClass', 'CardClass2', 'CardClass3']:
            if slot in item:
                faction = item.pop(slot)
                if faction != 'None':
                    factions.append(faction)

        # Create icon list from existing fields
        icons = []
        for slot in [f'Skill{n}' for n in range(1,7)]:
            if slot in item:
                icon = item.pop(slot)
                if icon != 'None':
                    icons.append(icon)

        # Add factions list to item
        item['factions'] = factions
        item['icons'] = icons

    # Write updated data back to file
    with open('result.json', 'x') as file:
        json.dump(data, file, indent=4)

# Run the update
update_json()
