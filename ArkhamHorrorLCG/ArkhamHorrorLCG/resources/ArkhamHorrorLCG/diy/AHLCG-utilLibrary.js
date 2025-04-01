importClass( ca.cgjennings.ui.JUtilities );
importClass( arkham.diy.ListItem );
importClass( java.awt.geom.Point2D );
importClass( java.awt.AlphaComposite );
importClass( java.awt.Dimension );

const PortraitList = [];

var IconSize = 24;
const FACE_FRONT = 0;
const FACE_BACK = 1;

function getName() {
    return @AHLCG;
}

function getDescription() {
    return @AHLCG-Description;
}

function getVersion() {
    return 9.5;
}

function getLocale() {
	locale = String(Language.getGameLocale());

	mainLocale = locale.split('_');
	mainLocale = String(mainLocale[0]);

	return mainLocale;
}

// This function is a convenient shortcut for getting this plug-in's images
function image( resource, folder, ext ) {
	if( ext == undefined ) {
		ext = 'jp2';
	}

	var imageName = 'ArkhamHorrorLCG/';

	if( folder != undefined && folder.length > 0 ) imageName += folder + '/';

	imageName += resource + '.' + ext;

	return ImageUtils.get( imageName );
}

// readEncounter is for older versions of WeaknessEnemy and WeaknessTreachery that do not include an encounter portrait
function readPortraits( diy, oos, typeList, readEncounter ) {
	for ( let index = 0; index < typeList.length; index++ ) {
		// read portrait
		var fullKey = typeList[index];
		var partArray = fullKey.split('-');
		var key = partArray[0];

		if ( key == 'Encounter' && !readEncounter ) {
			createPortrait( diy, fullKey );
		}
		else {
			try {
				PortraitList[index] = oos.readObject();
			} catch ( ex ) {
				println( 'Unable to load portrait: ' + fullKey );

				createPortrait( diy, fullKey );
			}

			// update base keys for newer versions...
			let key = PortraitList[index].getBaseKey();

			let searchKey = '';
			let replaceKey = '';

			if ( key ) {
				if ( key.indexOf( 'EncounterPortrait' ) >= 0 ) {
					searchKey = 'EncounterPortrait';
					replaceKey = 'Encounter';
				}
				else if ( key.indexOf( 'CollectionPortrait' ) >= 0 ) {
					searchKey = 'CollectionPortrait';
					replaceKey = 'Collection';
				}
				else if ( key.indexOf( '-Investigator-PortraitPortrait' ) >= 0 ) {
					searchKey = '-Investigator-PortraitPortrait';
					replaceKey = '-InvestigatorBack-Portrait';
				}
				else if ( key.indexOf( 'PortraitPortrait' ) >= 0 ) {
					searchKey = 'PortraitPortrait';
					replaceKey = 'Portrait';
				}
			}

			if ( searchKey != '' ) {
				let splitArr = key.split( searchKey );

				let newKey = key.replace( searchKey, replaceKey );

				diy.settings.set( splitArr[0] + replaceKey + '-portrait-template', $( splitArr[0] + searchKey + '-portrait-template' ) );
				diy.settings.set( splitArr[0] + replaceKey + '-portrait-panx', $( splitArr[0] + searchKey + '-portrait-panx' ) );
				diy.settings.set( splitArr[0] + replaceKey + '-portrait-pany', $( splitArr[0] + searchKey + '-portrait-pany' ) );
				diy.settings.set( splitArr[0] + replaceKey + '-portrait-rotation', $( splitArr[0] + searchKey + '-portrait-rotation' ) );
				diy.settings.set( splitArr[0] + replaceKey + '-portrait-scale', $( splitArr[0] + searchKey + '-portrait-scale' ) );

				diy.settings.reset( splitArr[0] + searchKey + '-portrait-template' );
				diy.settings.reset( splitArr[0] + searchKey + '-portrait-panx' );
				diy.settings.reset( splitArr[0] + searchKey + '-portrait-pany' );
				diy.settings.reset( splitArr[0] + searchKey + '-portrait-rotation' );
				diy.settings.reset( splitArr[0] + searchKey + '-portrait-scale' );

				let newPortrait = new DefaultPortrait( newKey, PortraitList[index] );
				PortraitList[index] = newPortrait;
			}
		}
	}
}

function writePortraits( oos, typeList ) {
	for ( let index = 0; index < typeList.length; index++) {
		let portrait = getPortrait( index );

		oos.writeObject( portrait );
	}
}

function setDefaultEncounter() {
	$Encounter = Settings.getUser().get( 'AHLCG-DefaultEncounterSet' );
	$EncounterNumber = '1';
	$EncounterTotal = '1';

	updateEncounter();
}

function setDefaultCollection() {
	$Collection = Settings.getUser().get( 'AHLCG-DefaultCollection' );
	$CollectionNumber = '1';

	updateCollection();
}

function updateUsedEncounterSets( o ) {
	var settings = Settings.getUser();

	o.comboEncounter = [];
	o.encounterTypes = [];

	o.comboEncounter = o.comboEncounter.concat( o.basicEncounterList );
	for ( let index = 0; index < o.comboEncounter.length; index++ ) {
		let item = o.comboEncounter[index];

		o.comboEncounter[index] = ListItem(
			item, @('AHLCG-' + item),
			ImageUtils.createIcon(ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-' + item + '.png'), 24, 24)
		);

		// Custom (index == 0): -1
		// All others: 0
		if (index == 0) o.encounterTypes[index] = -1;
		else o.encounterTypes[index] = 0;
	}

	// Standard: 0
	for( let index = 0; index < o.standardEncounterList.length; index++ ) {
		let entry = o.standardEncounterList[index];
		let item = entry[0];

		let used = loadUsedValue( 'Encounter', entry[3] );

		if (used) {
			o.comboEncounter[o.comboEncounter.length] = ListItem(
				item, @('AHLCG-' + item),
				ImageUtils.createIcon(ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-' + item + '.png'), 24, 24)
			);

			o.encounterTypes[o.encounterTypes.length] = 0;
		}
	}

	var userCount = settings.getInt( 'AHLCG-UserEncounterCount', 0 );

	// User: Settings index
	for ( let index = 0; index < userCount; index++) {
		let used = settings.getBoolean( 'AHLCG-UseUserEncounter' + (index+1) );

		if (used) {
			let name = settings.get( 'AHLCG-UserEncounterName' + (index+1), '' );
			let item = createUserSettingValue( name );
			let icon = settings.get( 'AHLCG-UserEncounterIcon' + (index+1), '' );

			try {
				let image = ImageUtils.createIcon( ImageUtils.read( icon ), 24, 24);

				o.comboEncounter[o.comboEncounter.length] = ListItem(
					item, name,
					image
				);

				o.encounterTypes[o.encounterTypes.length] = index+1;
			} catch (ex) {
				if ( ex.javaException instanceof javax.imageio.IIOException ) {
					// means image could not be read
					// don't add it to list, we can safely ignore this
				}
				else {
		 			Error.handleUncaught( ex );
				}
			}
		}
	}
}

function updateUsedCollections( o ) {
	var settings = Settings.getUser();

	o.comboCollection = [];
	o.collectionTypes = [];

	o.comboCollection = o.comboCollection.concat( o.basicCollectionList );
	for ( let index = 0; index < o.comboCollection.length; index++ ) {
		let item = o.comboCollection[index];

		o.comboCollection[index] = ListItem(
			item, @('AHLCG-' + item),
			ImageUtils.createIcon(ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-' + item + '.png'), 24, 24)
		);

		// Custom (index == 0): -1
		// All others: 0
		if (index == 0) o.collectionTypes[index] = -1;
		else o.collectionTypes[index] = 0;
	}

	// Standard: 0
	for( let index = 0; index < o.standardCollectionList.length; index++ ) {
		let entry = o.standardCollectionList[index];
		let item = entry[0];

//		let used = loadUsedValue( 'Collection', index );
		let used = loadUsedValue( 'Collection', entry[2] );

		if (used) {
			o.comboCollection[o.comboCollection.length] = ListItem(
				item, @('AHLCG-' + item),
				ImageUtils.createIcon(ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-' + item + '.png'), 24, 24)
			);

			o.collectionTypes[o.collectionTypes.length] = 0;
		}
	}

	var userCount = settings.getInt( 'AHLCG-UserCollectionCount', 0 );

	// User: Settings index
	for ( let index = 0; index < userCount; index++) {
		let used = settings.getBoolean( 'AHLCG-UseUserCollection' + (index+1) );

		if (used) {
			let name = settings.get( 'AHLCG-UserCollectionName' + (index+1), '' );
			let item = createUserSettingValue( name );
			let icon = settings.get( 'AHLCG-UserCollectionIcon' + (index+1), '' );

			try {
				let image = ImageUtils.createIcon( ImageUtils.read( icon ), 24, 24);

				o.comboCollection[o.comboCollection.length] = ListItem(
					item, name,
					image
				);

				o.collectionTypes[o.collectionTypes.length] = index+1;
			} catch (ex) {
				if ( ex.javaException instanceof javax.imageio.IIOException ) {
					// means image could not be read
					// don't add it to list, we can safely ignore this
				}
				else {
		 			Error.handleUncaught( ex );
				}
			}
		}
	}
}

function storeUsedValue( type, index, value ) {
	var charToInsert = value ? '1' : '0';
	var usedIndex = Math.floor( ( index / 40 ) + 1 );
	var usedString = Settings.getUser().get( 'AHLCG-Use' + type + usedIndex, 0 );

	usedString = usedString.substring( 0, index % 40 ) + charToInsert + usedString.substring( ( index % 40 ) + 1 );

	Settings.getUser().set('AHLCG-Use' + type + usedIndex, usedString );
}

function loadUsedValue( type, index ) {
	var usedIndex = Math.floor( ( index / 40 ) + 1 );
	var usedString = Settings.getUser().get( 'AHLCG-Use' + type + usedIndex, '' );

	if ( usedString.length() < (index % 40) + 1 ) return true;	// set new ones to true
	if ( usedString.charAt( index % 40 ) == 49 ) return true;	// == '1'?
	return false;
}

function createUserSettingValue( string ) {
	return String(string).replace(/\W/g, '');
}

// changed Eons.namedObjects for Preferences encounter/collection update, 4/2/2017
function updateCollection() {
	if ( $Collection == 'StrangeEonsLight' ) $Collection = 'StrangeEons';

	var settings = Settings.getUser();

	if ( $Collection == 'CustomCollection' ) {
		$CollectionType = '-1';
		return;
	}

	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	for ( let index = 0; index < AHLCGObject.basicCollectionList.length; index++ ) {
		if ( $Collection == AHLCGObject.basicCollectionList[ index ] ) {
			$CollectionType = '0';
			return;
		}
	}

	for ( let index = 0; index < AHLCGObject.standardCollectionList.length; index++ ) {
		let entry = AHLCGObject.standardCollectionList[index];

		if ( $Collection == entry[0] ) {
			// [2] is index of set in the used setting strings
			let used = loadUsedValue( 'Collection', entry[2] );

			if ( !used ) {
				storeUsedValue( 'Collection', entry[2], true );
				updateUsedCollections( AHLCGObject );
			}

			$CollectionType = '0';
			return;
		}
	}

	var userCount = settings.getInt( 'AHLCG-UserCollectionCount', 0 );

	for ( let index = 0; index < userCount; index++) {
		let name = settings.get( 'AHLCG-UserCollectionName' + (index+1), '' );
		let icon = settings.get( 'AHLCG-UserCollectionIcon' + (index+1), '' );
		let source = PortraitList[getPortraitIndex( 'Collection' )].getSource();

		if ( $Collection == createUserSettingValue( name ) && ( source == '' || icon == source ) ) {
			if ( source == '' ) {
				PortraitList[ getPortraitIndex( 'Collection' ) ].setSource( icon );
			}

			let used = settings.getBoolean( 'AHLCG-UseUserCollection' + (index+1) );

			if ( !used ) {
				settings.setBoolean( 'AHLCG-UseUserCollection' + (index+1), true );
				updateUsedEncounterSets( AHLCGObject );
			}

			$CollectionType = index+1;
			return;
		}
	}

	// was a collection created elsewhere, or that no longer exists
	$Collection = 'CustomCollection';
	$CollectionType = '-1';
}

function updateEncounter() {
	var settings = Settings.getUser();

	if ( $Encounter == 'CustomEncounterSet' ) {
		$EncounterType = '-1';
		return;
	}

	var AHLCGObject = Eons.namedObjects.AHLCGObject;
	var found = false;

	for ( let index = 0; index < AHLCGObject.basicEncounterList.length; index++ ) {
		if ( $Encounter == AHLCGObject.basicEncounterList[ index ] ) {
			$EncounterType = '0';
			return;
		}
	}

	for ( let index = 0; index < AHLCGObject.standardEncounterList.length; index++ ) {
		let entry = AHLCGObject.standardEncounterList[index];

		if ( $Encounter == entry[0] ) {
			// [3] is index of set in the used setting strings
			let used = loadUsedValue( 'Encounter', entry[3] );

			if ( !used ) {
				storeUsedValue( 'Encounter', entry[3], true );
				updateUsedEncounterSets( AHLCGObject );
			}

			$EncounterType = '0';
			return;
		}
	}

	var userCount = settings.getInt( 'AHLCG-UserEncounterCount', 0 );

	for ( let index = 0; index < userCount; index++) {
		let name = settings.get( 'AHLCG-UserEncounterName' + (index+1), '' );
		let icon = settings.get( 'AHLCG-UserEncounterIcon' + (index+1), '' );
		let source = PortraitList[getPortraitIndex( 'Encounter' )].getSource();

		if ( $Encounter == createUserSettingValue( name ) && ( source == '' || icon == source ) ) {
			// if no source exists (presumably because it's just been created), load it
			if ( source == '' ) {
				PortraitList[ getPortraitIndex( 'Encounter' ) ].setSource( icon );
			}

			let used = settings.getBoolean( 'AHLCG-UseUserEncounter' + (index+1) );

			if ( !used ) {
				settings.setBoolean( 'AHLCG-UseUserEncounter' + (index+1), true );
				updateUsedEncounterSets( AHLCGObject );
			}

			$EncounterType = index+1;
			return;
		}
	}

	// was a set created elsewhere, or that no longer exists
	$Encounter = 'CustomEncounterSet';
	$EncounterType = '-1';
}

function clearImage ( g, sheet ) {
	var w = sheet.getTemplateWidth();
	var h = sheet.getTemplateHeight();

	var image = ImageUtils.create(w, h);

	sheet.paintImage( g, image, new Region(0, 0, w, h) );
}

function getForceDisplay( key ) {
	var forceDisplay = false;

	switch ( key ) {
		case 'DeckOptions':
		case 'DeckRequirements':
			forceDisplay = true;
			break;
	}

	return forceDisplay;
}

function addSpacing( faceIndex, text, key, diy ) {
	var forceDisplay = getForceDisplay( key );

	var sectionText = $( key + BindingSuffixes[faceIndex] );
	var sectionSpacing = $( key + BindingSuffixes[faceIndex] + 'Spacing' );

	if (sectionSpacing == null) return text;

	var spacing = 0;

	if ( forceDisplay || sectionText != '' ) {
		if (key == 'Traits') spacing = 0.5;
		else spacing = 1.5;

		if (sectionSpacing != null && sectionSpacing > 0) spacing += parseInt(sectionSpacing);

		text = text + '\n<image res://ArkhamHorrorLCG/images/empty1x1.png 1pt ' + spacing + 'pt>';
	}
	else if ( sectionSpacing != null && sectionSpacing > 0 ) {
		spacing = sectionSpacing;

		text = text + '<image res://ArkhamHorrorLCG/images/empty1x1.png 1pt ' + spacing + 'pt>';
	}

	return text;
}

function addTextPart( faceIndex, text, key, diy ) {
	var forceDisplay = getForceDisplay( key );

	if (forceDisplay == true || diy.settings.get( key + BindingSuffixes[faceIndex], '' ) != '') {
		if ( text != '' ) {
			text = text + '\n';
		}

		var format = '';
		var formatEnd = '';
		var alignment = '';
		var entryText = $( key + BindingSuffixes[faceIndex] );

		switch( key ) {
			case 'Traits':
				format = diy.settings.get( 'AHLCG-Traits-format', '<ts>' );
				formatEnd = diy.settings.get( 'AHLCG-Traits-formatEnd', '</ts>' );
				alignment = diy.settings.get( 'AHLCG-Traits-alignment', '<center>' );
				break;
			case 'Keywords':
				format = diy.settings.get('AHLCG-Keywords-format','');
				formatEnd = diy.settings.get('AHLCG-Keywords-formatEnd','');
				alignment = diy.settings.get('AHLCG-Keywords-alignment','<left>');
				break;
			case 'Rules':
				format = diy.settings.get('AHLCG-Rules-format','');
				formatEnd = diy.settings.get('AHLCG-Rules-formatEnd','');
				alignment = diy.settings.get('AHLCG-Rules-alignment','<left>');
				break;
			case 'Victory':
				format = diy.settings.get('AHLCG-Victory-format','<vic>');
				formatEnd = diy.settings.get('AHLCG-Victory-formatEnd','</vic>');
				alignment = diy.settings.get('AHLCG-Victory-alignment','<center>');
				break;
			case 'Story':
				format = diy.settings.get('AHLCG-Story-format','<i>');
				formatEnd = diy.settings.get('AHLCG-Story-formatEnd','</i>');
				alignment = '<' + diy.settings.get('AHLCG-Story-alignment','left') + '>';
				break;
			case 'ActStory':
				format = diy.settings.get('AHLCG-Story-format','<css>');
				formatEnd = diy.settings.get('AHLCG-Story-formatEnd','</css>');
				alignment = '<' + diy.settings.get('AHLCG-Story-alignment','left') + '>';
				break;
			case 'AgendaStory':
				format = diy.settings.get('AHLCG-Story-format','<gss>');
				formatEnd = diy.settings.get('AHLCG-Story-formatEnd','</gss>');
				alignment = '<' + diy.settings.get('AHLCG-Story-alignment','left') + '>';
				break;
			case 'Flavor':
				format = diy.settings.get('AHLCG-Flavor-format','<fs>');
				formatEnd = diy.settings.get('AHLCG-Flavor-formatEnd','</fs>');
				alignment = '<' + diy.settings.get('AHLCG-Flavor-alignment','center') +'>';
				break;
			case 'InvStory':
				format = diy.settings.get('AHLCG-SmallStory-format','<iss>');
				formatEnd = diy.settings.get('AHLCG-SmallStory-formatEnd','</iss>');
				alignment = '<' + diy.settings.get('AHLCG-SmallStory-alignment','left') + '>';
				break;
			case 'Text1':
			case 'Text2':
			case 'Text3':
			case 'Text4':
			case 'Text5':
			case 'Text6':
			case 'Text7':
			case 'Text8':
				format = '<hdr>' + $(key + 'NameBack') + '</hdr>: ';
				formatEnd = '';
				alignment = '<left>';
				break;
			case 'CustText1':
			case 'CustText2':
			case 'CustText3':
			case 'CustText4':
			case 'CustText5':
			case 'CustText6':
			case 'CustText7':
			case 'CustText8':
			case 'CustText9':
			case 'CustText10':
				var xpBox = '⧠';
				// I do not know why this is necessary for Times New Roman
				var xpStart = '<family>';
				var xpEnd = '</family>';

				if ( Eons.namedObjects.AHLCGObject.bodyFamily == 'Arno Pro' ) {
					xpBox = '☐';
					xpStart = '';
					xpEnd = '';
				}

				format = xpStart;

				let index = key.match(/\d+/);
				let costStr = $( 'CustCost' + index[0] );
				if ( costStr ) cost = parseInt(costStr);

				for ( let i = 0; i < cost; i++ ) {
					format = format + xpBox;
				}
				format = format + xpEnd + ' <hdr>' + $( 'CustName' + index[0] ) + '.</hdr> ';
				formatEnd = '';
				alignment = '<left>';
				break;
			}

		return text + alignment + format + entryText + formatEnd;
	}
	else {
		return text;
	}
}

function getExpandedKey( faceIndex, key, appendix ) {
	var fullKey = null;

	var subtypes = {
		'AgendaPortrait': 'Agenda',
		'WeaknessEnemy': 'Enemy',
		'WeaknessTreachery': 'Treachery',
		'ChaosStory': 'Chaos',
		'StoryChaos': 'Chaos',
		'StoryChaosFull': 'Chaos',
		'KeyBack': 'Key'
	};

	if ( appendix == null ) appendix = '';

	if ( $( 'AHLCG-' + CardTypes[faceIndex] + '-' + key + appendix ) != null ) {
		fullKey = 'AHLCG-' + CardTypes[faceIndex] + '-' + key;
	}
	else if ( subtypes[CardTypes[faceIndex]] && $( 'AHLCG-' + subtypes[CardTypes[faceIndex]] + '-' + key + appendix ) != null) {
		fullKey = 'AHLCG-' + subtypes[CardTypes[faceIndex]] + '-' + key;
	}
	else {
		fullKey = 'AHLCG-' + key;
	}

	return fullKey;
}

function initBodyTags( diy, textBox ) {
	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	for( let index = 0; index < AHLCGObject.TagList.length; index++ ){
		let item = AHLCGObject.TagList[index];
		let repl = $(item+'-tag-replacement');

		if (repl != null && repl.startsWith('#'))
		{
			textBox.setReplacementForTag($(item+'-tag'), #(repl.substr(1)));
		}
		else
		{
			textBox.setReplacementForTag($(item+'-tag'), repl);
		}
	}

	for( let index = 0; index < AHLCGObject.StyleList.length; index++ ) {
		let item = AHLCGObject.StyleList[index];
		textBox.setStyleForTag($(item+'-tag'), diy.settings.getTextStyle(item+'-style',null));
	}

	textBox.setReplacementForTag( 'bultab', '     ' );

	for ( let index = 0; index < AHLCGObject.standardEncounterList.length; index++ ) {
		let entry = AHLCGObject.standardEncounterList[ index ];

		let used = loadUsedValue( 'Encounter', entry[3] );

		if ( used ) {
			textBox.setReplacementForTag( entry[2] + 's', '<image res://ArkhamHorrorLCG/icons/AHLCG-' + entry[0] + '.png 0.14in baseline>' );
			textBox.setReplacementForTag( entry[2] + 'm', '<image res://ArkhamHorrorLCG/icons/AHLCG-' + entry[0] + '.png 0.35in baseline>' );
			textBox.setReplacementForTag( entry[2] + 'l', '<image res://ArkhamHorrorLCG/icons/AHLCG-' + entry[0] + '.png 0.60in baseline>' );
		}
	}

	var settings = Settings.getUser();
	var userCount = settings.getInt( 'AHLCG-UserEncounterCount', 0 );

	for ( let index = 1; index <= userCount; index++ ) {
		let tag = settings.get( 'AHLCG-UserEncounterTag' + index ).toLowerCase();;
		let icon = settings.get( 'AHLCG-UserEncounterIcon' + index );
		let used = settings.getBoolean( 'AHLCG-UseUserEncounter' + index, true );

		if ( used ) {
			textBox.setReplacementForTag( tag + 's', '<image "' + icon + '" 0.14in baseline>' );
			textBox.setReplacementForTag( tag + 'm', '<image "' + icon + '" 0.35in baseline>' );
			textBox.setReplacementForTag( tag + 'l', '<image "' + icon + '" 0.60in baseline>' );
		}
	}

	for ( let index = 0; index < AHLCGObject.standardCollectionList.length; index++ ) {
		let entry = AHLCGObject.standardCollectionList[ index ];

		let used = loadUsedValue( 'Collection', entry[2] );

		if (used) {
			textBox.setReplacementForTag( entry[1] + 's', '<image res://ArkhamHorrorLCG/icons/AHLCG-' + entry[0] + '.png 0.14in baseline>' );
			textBox.setReplacementForTag( entry[1] + 'm', '<image res://ArkhamHorrorLCG/icons/AHLCG-' + entry[0] + '.png 0.35in baseline>' );
			textBox.setReplacementForTag( entry[1] + 'l', '<image res://ArkhamHorrorLCG/icons/AHLCG-' + entry[0] + '.png 0.60in baseline>' );
		}
	}

	userCount = settings.getInt( 'AHLCG-UserCollectionCount', 0 );

	for ( let index = 1; index <= userCount; index++ ) {
		let tag = settings.get( 'AHLCG-UserCollectionTag' + index ).toLowerCase();;
		let icon = settings.get( 'AHLCG-UserCollectionIcon' + index );
		let used = settings.getBoolean( 'AHLCG-UseUserCollection' + index, true );

		if ( used ) {
			textBox.setReplacementForTag( tag + 's', '<image "' + icon + '" 0.14in baseline>' );
			textBox.setReplacementForTag( tag + 'm', '<image "' + icon + '" 0.35in baseline>' );
			textBox.setReplacementForTag( tag + 'l', '<image "' + icon + '" 0.60in baseline>' );
		}
	}

	for( let index = 0; index < AHLCGObject.locationIcons.length; index++ ){
		let item = AHLCGObject.locationIcons[index];

		textBox.setReplacementForTag( $('Loc'+item+'-tag'), '<image res://ArkhamHorrorLCG/icons/AHLCG-Loc' + item + '.png 0.14in center>' );
	}
}

function initCopyrightTags( diy, textBox ) {
	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	for( let index = 0; index < AHLCGObject.CopyrightTagList.length; index++ ){
		let item = AHLCGObject.CopyrightTagList[index];
		textBox.setReplacementForTag($(item+'-tag'), $(item+'-tag-replacement'));
	}
}

function initSuffixTags( diy, textBox ) {
	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	for( let index = 0; index < AHLCGObject.SuffixTagList.length; index++ ){
		let item = AHLCGObject.SuffixTagList[index];
		textBox.setStyleForTag($(item+'-tag'), diy.settings.getTextStyle(item+'-style',null));
	}
}

function initGuideTags( diy, textBox ) {
	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	for( let index = 0; index < AHLCGObject.GuideStyleList.length; index++ ){
		let item = AHLCGObject.GuideStyleList[index];
		textBox.setStyleForTag($(item+'-tag'), diy.settings.getTextStyle(item+'-style',null));
	}
}

function setPortraitDefaults( diy, faceIndex, key, portraitKey ) {
	if ( diy.settings.get( getExpandedKey( faceIndex, portraitKey + '-portrait-template' ), '' ) == '') {
		diy.settings.set( 'AHLCG-' + CardTypes[faceIndex] + '-' + portraitKey + '-portrait-template', 'ArkhamHorrorLCG/images/empty1x1.png' );
	}

	if ( diy.settings.get( getExpandedKey( faceIndex, portraitKey + '-portrait-rotation' ), '' ) == '' ) {
		diy.settings.set( 'AHLCG-' + CardTypes[faceIndex] + '-' + portraitKey + '-portrait-rotation', '0' );
	}
	if ( diy.settings.get( getExpandedKey( faceIndex, portraitKey + '-portrait-clip-region' ), '' ) == '' ) {
		diy.settings.set( 'AHLCG-' + CardTypes[faceIndex] + '-' + portraitKey + '-portrait-clip-region', $( getExpandedKey( faceIndex, key + '-portrait-clip-region' ) ) );
	}
}

function createPortrait( diy, fullKey ) {
	var partArray = fullKey.split('-');

	var key = partArray[0];
	var portraitKey = key;
	var settingsFace;
	var fillBackground;
	var allowRotation;
	var scaleUsesMinimum = false;

	var faces = partArray[1];
	var facesArray;

	switch ( faces ) {
		case 'Back':
			facesArray = [0, 1];	// making this [0, 1] seems to get rid of the masking in the portrait panel
			settingsFace = FACE_BACK;
			break;
		case 'Both':
			facesArray = [0, 1];
			settingsFace = FACE_FRONT;
			break;
		default:
			facesArray = [0];
			settingsFace = FACE_FRONT;
			break;
	}

	let portraitIndex = getPortraitIndex( key );

	switch( key ) {
		case 'Portrait':
		case 'BackPortrait':
			fillBackground = true;
			allowRotation = true;
			break;
		case 'TransparentPortrait':
			fillBackground = false;
			allowRotation = false;
			break;
		case 'Portrait1':
		case 'Portrait2':
			fillBackground = false;
			allowRotation = false;
			scaleUsesMinimum = true;
			break;
		default:
			fillBackground = false;
			allowRotation = true;
			break;
	}

	setPortraitDefaults( diy, settingsFace, key, portraitKey );
	if ( faces == 'Both' ) 	setPortraitDefaults( diy, FACE_BACK, key, portraitKey );
    print('Portrait name:');
    print(getExpandedKey(settingsFace, portraitKey, '-portrait-template'));
    print('\n');
	PortraitList[portraitIndex] = new DefaultPortrait( diy, getExpandedKey( settingsFace, portraitKey, '-portrait-template' ), allowRotation );

	PortraitList[portraitIndex].facesToUpdate = facesArray;
	PortraitList[portraitIndex].backgroundFilled = fillBackground;
	PortraitList[portraitIndex].setScaleUsesMinimum( scaleUsesMinimum );
	PortraitList[portraitIndex].installDefault();
}

function createPortraits( diy, portraitKeys ) {
    diy.customPortraitHandling = true;

	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	diy.bleedMargin = 0;

	for ( let index = 0; index < portraitKeys.length; index++ ) {
		let fullKey = portraitKeys[index];

		createPortrait( diy, fullKey );
	}
}

function getGuidePortraitRegion( diy, position ) {
	var region = null;
	var pageWidth = diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Body-region') ).width;
	var pageHeight = diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Body-region') ).height;
	var bodyHeight = diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'BodyLeft' + $PageType + '-region') ).height;
	var pageOffset = pageHeight - bodyHeight;

	var divisions = 3;
	if ( $PageType == 'Title' ) divisions = 2;

	var boxWidth = pageWidth / 2;
	var boxHeight = bodyHeight / divisions;

	switch ( position ) {
		case 'TopLeftSmall':
			region = new Region( 0, pageOffset, boxWidth, boxHeight );
			break;
		case 'TopLeftMedium':
			region = new Region( 0, pageOffset, boxWidth, bodyHeight/2 );
			break;
		case 'BottomLeftSmall':
			region = new Region( 0, pageHeight - boxHeight, boxWidth, boxHeight );
			break;
		case 'BottomLeftMedium':
			region = new Region( 0, pageHeight - bodyHeight/2, boxWidth, bodyHeight/2 );
			break;
		case 'TopRightSmall':
			region = new Region( pageWidth - boxWidth, pageOffset, boxWidth, boxHeight );
			break;
		case 'TopRightMedium':
			region = new Region( pageWidth - boxWidth, pageOffset, boxWidth, bodyHeight/2 );
			break;
		case 'BottomRightSmall':
			region = new Region( pageWidth - boxWidth, pageHeight - boxHeight, boxWidth, boxHeight );
			break;
		case 'BottomRightMedium':
			region = new Region( pageWidth - boxWidth, pageHeight - bodyHeight/2, boxWidth, bodyHeight/2 );
			break;
		case 'TopLarge':
			region = new Region( 0, pageOffset, pageWidth, boxHeight );
			break;
		case 'TopHalf':
			region = new Region( 0, pageOffset, pageWidth, bodyHeight/2 );
			break;
		case 'BottomLarge':
			region = new Region( 0, pageHeight - boxHeight, pageWidth, boxHeight );
			break;
		case 'BottomHalf':
			region = new Region( 0, pageHeight - bodyHeight/2, pageWidth, bodyHeight/2 );
			break;
		case 'LeftLarge':
			region = new Region( 0, pageOffset, boxWidth, bodyHeight );
			break;
		case 'RightLarge':
			region = new Region( pageWidth - boxWidth, pageOffset, boxWidth, bodyHeight );
			break;
		case 'TopLeftCorner':
			region = new Region( 0, pageOffset, pageWidth, boxHeight*2 );
			break;
		case 'BottomLeftCorner':
			region = new Region( 0, pageHeight - boxHeight*2, pageWidth, boxHeight*2 );
			break;
		case 'TopRightCorner':
			region = new Region( 0, pageOffset, pageWidth, boxHeight*2 );
			break;
		case 'BottomRightCorner':
			region = new Region( 0, pageHeight - boxHeight*2, pageWidth, boxHeight*2 );
			break;
		case 'FullPage':
			region = new Region( 0, pageOffset, pageWidth, bodyHeight );
			break;
	}

	return region;
}

function createPortraitStencil( diy, portrait, position, pageType ) {
	var offset = 30;	// blurring is clipped otherwise
	var pageOffset = 0;
	var bodyWidth = diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Body-region') ).width;
	var pageHeight = diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Body-region') ).height;
	var bodyHeight = diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'BodyLeft' + pageType + '-region') ).height;
	var divisions = 3;
	if ( pageType == 'Title' ) {
//		if ( CardTypes[0] == 'Guide75' ) pageOffset = 307;
		if ( CardTypes[0] == 'Guide75' ) pageOffset = 313;
		else pageOffset = 352;

		divisions = 2;
	}

	var boxWidth = bodyWidth / 2;
	var boxHeight = bodyHeight / divisions;
	var stencil = ImageUtils.create( bodyWidth, pageHeight, true );
	var g = stencil.getGraphics();
	g.setColor( new Color( 0, 0, 0, 1.0 ) );
	g.fillRect(0, 0, bodyWidth, pageHeight);
	g.setComposite(AlphaComposite.Src);
	g.setColor( new Color( 0, 0, 0, 0.0 ) );

	switch ( position ) {
		case 'TopLeftSmall':
			g.fillRoundRect(offset, pageOffset + offset, boxWidth - offset*2, boxHeight - offset*2, 75, 75 );
			break;
		case 'TopLeftMedium':
			g.fillRoundRect(offset, pageOffset + offset, boxWidth - offset*2, bodyHeight/2 - offset*2, 75, 75 );
			break;
		case 'BottomLeftSmall':
			g.fillRoundRect(offset, pageHeight - boxHeight + offset, boxWidth - offset*2, boxHeight - offset*2, 75, 75 );
			break;
		case 'BottomLeftMedium':
			g.fillRoundRect(offset, pageHeight - bodyHeight/2 + offset, boxWidth - offset*2, bodyHeight/2 - offset*2, 75, 75 );
			break;
		case 'TopRightSmall':
			g.fillRoundRect(bodyWidth - boxWidth + offset, pageOffset + offset, boxWidth - offset*2, boxHeight - offset*2, 75, 75 );
			break;
		case 'TopRightMedium':
			g.fillRoundRect(bodyWidth - boxWidth + offset, pageOffset + offset, boxWidth - offset*2, bodyHeight/2 - offset*2, 75, 75 );
			break;
		case 'BottomRightSmall':
			g.fillRoundRect(bodyWidth - boxWidth + offset, pageHeight - boxHeight + offset, boxWidth - offset*2, boxHeight - offset*2, 75, 75 );
			break;
		case 'BottomRightMedium':
			g.fillRoundRect(bodyWidth - boxWidth + offset, pageHeight - bodyHeight/2 + offset, boxWidth - offset*2, bodyHeight/2 - offset*2, 75, 75 );
			break;
		case 'TopLarge':
			g.fillRoundRect(offset, pageOffset + offset, bodyWidth - offset*2, boxHeight - offset*2, 75, 75 );
			break;
		case 'TopHalf':
			g.fillRoundRect(offset, pageOffset + offset, bodyWidth - offset*2, bodyHeight/2 - offset*2, 75, 75 );
			break;
		case 'BottomLarge':
			g.fillRoundRect(offset, pageHeight - boxHeight + offset, bodyWidth - offset*2, boxHeight - offset*2, 75, 75 );
			break;
		case 'BottomHalf':
			g.fillRoundRect(offset, pageHeight - bodyHeight/2 + offset, bodyWidth - offset*2, bodyHeight/2 - offset*2, 75, 75 );
			break;
		case 'LeftLarge':
			g.fillRoundRect(offset, pageOffset + offset, boxWidth - offset*2, bodyHeight - offset*2, 75, 75 );
			break;
		case 'RightLarge':
			g.fillRoundRect(bodyWidth - boxWidth + offset, pageOffset + offset, boxWidth - offset*2, bodyHeight - offset*2, 75, 75 );
			break;
		case 'TopLeftCorner':
			g.fillRoundRect(offset, pageOffset + offset, bodyWidth - offset*2, boxHeight - offset*2, 75, 75 );
			g.fillRoundRect(offset, pageOffset + offset, boxWidth - offset*2, boxHeight*2 - offset*2, 75, 75 );
			break;
		case 'BottomLeftCorner':
			g.fillRoundRect(offset, pageHeight - boxHeight + offset, bodyWidth - offset*2, boxHeight - offset*2, 75, 75 );
			g.fillRoundRect(offset, pageHeight - boxHeight*2 + offset, boxWidth - offset*2, boxHeight*2 - offset*2, 75, 75 );
			break;
		case 'TopRightCorner':
			g.fillRoundRect(offset, pageOffset + offset, bodyWidth - offset*2, boxHeight - offset*2, 75, 75 );
			g.fillRoundRect(bodyWidth - boxWidth + offset, pageOffset + offset, boxWidth - offset*2, boxHeight*2 - offset*2, 75, 75 );
			break;
		case 'BottomRightCorner':
			g.fillRoundRect(offset, pageHeight - boxHeight + offset, bodyWidth - offset*2, boxHeight - offset*2, 75, 75 );
			g.fillRoundRect(bodyWidth - boxWidth + offset, pageHeight - boxHeight*2 + offset, boxWidth - offset*2, boxHeight*2 - offset*2, 75, 75 );
			break;
		case 'FullPage':
			g.fillRoundRect(offset, pageOffset + offset, bodyWidth - offset*2, bodyHeight - offset*2, 75, 75 );
			break;
	}

	g.dispose();

	stencil = createBlurredImage( stencil );

	portrait.setClipStencil( stencil );
}

function updateGuideBodyRegions( diy, bodyRegions ) {
	// use portrait options to modify text regions
	var pageOffset = 0;
	var bodyHeight = 995;
	var pageHeight = 995;
//??	var bodyHeight = 947;
//??	var pageHeight = 947;
//	var bodyHeight = 1196;
//	var pageHeight = 1196;
	var divisions = 3;
	var spacer = 15;

	if ( $PageType == 'Title' ) {
		pageOffset = 313;
		bodyHeight = 682;
//		bodyHeight = 640;

		if ( CardTypes[0] == 'GuideA4' ) {
			pageOffset = 352;
			bodyHeight = 1272;
			spacer = -15;
		}

		divisions = 2;
	}
	else if ( CardTypes[0] == 'GuideA4' ) {
		bodyHeight = 1559;
		pageHeight = 1559;
		spacer = -15;
	}

	var boxHeight = bodyHeight / divisions;

	var leftDown = 0;
	var rightDown = 0;
	var leftUp = 0;
	var rightUp = 0;

	for ( let index = 1; index <= 2; index++ ) {
		switch ( (String)($( 'PositionPortrait' + index )) ) {
			case 'TopLeftSmall':
				leftDown = Math.max( leftDown, boxHeight );
				break;
			case 'TopLeftMedium':
				leftDown = Math.max( leftDown, bodyHeight/2 );
				break;
			case 'BottomLeftSmall':
				leftUp = Math.max( leftUp, boxHeight );
				break;
			case 'BottomLeftMedium':
				leftUp = Math.max( leftUp, bodyHeight/2 );
				break;
			case 'TopRightSmall':
				rightDown = Math.max( rightDown, boxHeight );
				break;
			case 'TopRightMedium':
				rightDown = Math.max( rightDown, bodyHeight/2 );
				break;
			case 'BottomRightSmall':
				rightUp = Math.max( rightUp, boxHeight );
				break;
			case 'BottomRightMedium':
				rightUp = Math.max( rightUp, bodyHeight/2 );
				break;
			case 'TopLarge':
				leftDown = Math.max( leftDown, boxHeight );
				rightDown = Math.max( rightDown, boxHeight );
				break;
			case 'TopHalf':
				leftDown = Math.max( leftDown, bodyHeight/2 );
				rightDown = Math.max( rightDown, bodyHeight/2 );
				break;
			case 'BottomLarge':
				leftUp = Math.max( leftUp, boxHeight );
				rightUp = Math.max( rightUp, boxHeight );
				break;
			case 'BottomHalf':
				leftUp = Math.max( leftUp, bodyHeight/2 );
				rightUp = Math.max( rightUp, bodyHeight/2 );
				break;
			case 'TopLeftCorner':
				rightDown = Math.max( rightDown, boxHeight );
				leftDown = Math.max( leftDown, boxHeight*2 );
				break;
			case 'BottomLeftCorner':
				rightUp = Math.max( rightUp, boxHeight );
				leftUp = Math.max( leftUp, boxHeight*2 );
				break;
			case 'TopRightCorner':
				leftDown = Math.max( leftDown, boxHeight );
				rightDown = Math.max( rightDown, boxHeight*2 );
				break;
			case 'BottomRightCorner':
				leftUp = Math.max( leftUp, boxHeight );
				rightUp = Math.max( rightUp, boxHeight*2 );
				break;
			case 'Full':
				leftDown = Math.max( leftDown, bodyHeight );
				rightDown = Math.max( rightDown, bodyHeight );
				break;
		}
	}

	if (leftDown > spacer) bodyRegions[0].y += leftDown - spacer;
	if (leftDown > spacer) bodyRegions[0].height -= leftDown - spacer;
	if (leftUp > spacer) bodyRegions[0].height -= leftUp - spacer - 30;	// -30 is to give a little extra room to avoid unnecessary red boxes
	if (rightDown > spacer) bodyRegions[1].y += rightDown - spacer;
	if (rightDown > spacer) bodyRegions[1].height -= rightDown - spacer;
	if (rightUp > spacer) bodyRegions[1].height -= rightUp - spacer - 30;

	return bodyRegions;
}

function getPortraitCount() {
	return PortraitList.length;
}

function getPortrait( index ) {
	if( index < 0 || index >= PortraitList.length ) {
		throw new Error( 'Invalid portrait index: ' + index);
	}
	return PortraitList[ index ];
}

function getPortraitIndex( portraitName ) {
	var index = null;
	for (let i = 0; i < PortraitTypeList.length; i++) {
		let key = PortraitTypeList[i];

		let partArray = key.split('-');

		if (partArray[0] == portraitName ) {
			index = i;
			break;
		}
	}

	return index;
}

function getPortraitLocation( portraitName ) {
	var location = '';
	for (let i = 0; i < PortraitTypeList.length; i++) {
		let key = PortraitTypeList[i];

		let partArray = key.split('-');

		if (partArray[0] == portraitName ) {
			location == partArray[1];
			break;
		}
	}

	return location;
}

function getClassInitial( className ) {
	var initial;

	switch ( className ) {
		case 'Guardian':
			initial = 'G';
			break;
		case 'ParallelGuardian':
			initial = 'GP';
			break;
		case 'Seeker':
			initial = 'K';
			break;
		case 'ParallelSeeker':
			initial = 'KP';
			break;
		case 'Rogue':
			initial = 'R';
			break;
		case 'ParallelRogue':
			initial = 'RP';
			break;
		case 'Mystic':
			initial = 'M';
			break;
		case 'ParallelMystic':
			initial = 'MP';
			break;
		case 'Survivor':
			initial = 'V';
			break;
		case 'ParallelSurvivor':
			initial = 'VP';
			break;
		case 'Weakness':
		case 'BasicWeakness':
			initial = 'W';
			break;
		case 'Encounter':
			initial = 'E';
			break;
		case 'Neutral':
			initial = 'N';
			break;
		case 'ParallelNeutral':
			initial = 'NP';
			break;
		case 'Story':
			initial = 'S';
			break;
		case 'Dual':
			initial = 'D';
			break;
		case 'Test':
			initial = 'T';
			break;
		default:
			initial = '';
			break;
	}

	return initial;
}

function getSkillInitial( skillName )
{
	var initial;

	switch (skillName) {
		case 'Willpower':
			initial = 'W';
			break;
		case 'Intellect':
			initial = 'I';
			break;
		case 'Combat':
			initial = 'C';
			break;
		case 'Agility':
			initial = 'A';
			break;
		default:
			initial = 'D';
			break;
	}

	return initial;
}

function getClassArray( cardClass, cardClass2, cardClass3 ) {
	// return an array of classes
	var classes = [ cardClass ];

	if ( cardClass2 == null ) cardClass2 = 'None';
	if ( cardClass3 == null ) cardClass3 = 'None';

	if ( cardClass2 == 'None' && cardClass3 == 'None' ) return classes;

	let classInitial = getClassInitial( cardClass );

	// if not basic class, only return the first class
	if ( classInitial != 'G' && classInitial != 'K' && classInitial != 'R' && classInitial != 'M' && classInitial != 'V' ) return classes;

	// not dual class if the first class isn't a valid one or if the classes match
	if ( cardClass2 !== cardClass && cardClass2 !== 'None' ) classes.push( cardClass2 );
	if ( cardClass3 !== cardClass && cardClass3 !== cardClass2 && cardClass3 !== 'None' ) classes.push( cardClass3 );

	return classes;
}

function getClassCount( cardClass, cardClass2, cardClass3 ) {
	return getClassArray( cardClass, cardClass2, cardClass3 ).length;
}

function setPortraitPanelFileFieldEnabled( panel, enabled ) {
	var components = panel.getComponents();

	for ( var i = 0; i < components.length; i++ ) {
		let component = components[i];

		if ( /TextField/.test( component.getClass().getName() ) ) component.setEnabled( enabled );
	}
}

function setPortraitPanelFileFieldListener( panel, f ) {
	var components = panel.getComponents();

	for ( var i = 0; i < components.length; i++ ) {
		let component = components[i];
		if ( /TextField/.test( component.getClass().getName() ) ) {
			component.addActionListener( f );
		}
	}
}

function createPortraitMirrorButton( portraitName, portraitPanel ) {
	var portraitIndex = getPortraitIndex( portraitName );

	return new button(
		@AHLCG-Mirror, null,
		function(){
			var scale = PortraitList[portraitIndex].getScale();
			var rotation = PortraitList[portraitIndex].getRotation();
			var panX = PortraitList[portraitIndex].getPanX();
			var panY = PortraitList[portraitIndex].getPanY();
			PortraitList[portraitIndex].setImage(
				PortraitList[portraitIndex].getSource(),
				ImageUtils.mirror(PortraitList[portraitIndex].getImage(),true,false)
			);
			PortraitList[portraitIndex].setScale(scale);
			PortraitList[portraitIndex].setRotation(rotation);
			PortraitList[portraitIndex].setPanX(panX);
			PortraitList[portraitIndex].setPanY(panY);

			portraitPanel.updatePanel();
		}
	);
}

function createPortraitInvertButton( portraitName ) {
	var portraitIndex = getPortraitIndex( portraitName );

	return new button(
		"Invert", null,
		function(){
			var scale = PortraitList[portraitIndex].getScale();
			var rotation = PortraitList[portraitIndex].getRotation();
			var panX = PortraitList[portraitIndex].getPanX();
			var panY = PortraitList[portraitIndex].getPanY();
			PortraitList[portraitIndex].setImage(
				PortraitList[portraitIndex].getSource(),
				ImageUtils.invert(PortraitList[portraitIndex].getImage())
			);
			PortraitList[portraitIndex].setScale(scale);
			PortraitList[portraitIndex].setRotation(rotation);
			PortraitList[portraitIndex].setPanX(panX);
			PortraitList[portraitIndex].setPanY(panY);
		}
	);
}

// unused
//function createPortraitShareButton( portraitPanel, artistPanel ) {
function createPortraitShareButton( bindings ) {
	var shareButton = new toggleButton(
		@AHLCG-Share, null
	);

	bindings.add('PortraitShare', shareButton, [1]);

	return shareButton;
}

function reverseRegion( region ) {
	region.x = 525 - ( region.x + region.width );

	return region;
}

function shiftRegion( region, cardType ) {
	// default shift right
	var offset = 209;

	if ( cardType == 'Agenda' ) {
		// shift left
		offset = -209;
	}

	region.x = region.x + offset;

	return region;
}

function updateReversableTextBoxShape( diy, orientation ) {
	var reverse = false;
	var region = diy.settings.getRegion( getExpandedKey(FACE_FRONT, 'Body-region') );

	if ( orientation == 'Reversed' ) {
		region = reverseRegion( region );
		reverse = true;
	}

//	if ( Body_box != null ) createTextShape( Body_box, region, reverse );
	setTextShape( Body_box, region, reverse );
}

function updateCardType( diy, type, faceIndex, defaultType, setting ) {
	var templateName = defaultType;

	if ( type == 'Story' ) {
 		CardTypes[faceIndex] = 'Story';
 		templateName = 'Story';
 	}
	else if ( type == 'Chaos' ) {
 		CardTypes[faceIndex] = 'StoryChaos';
 		templateName = 'Chaos';
 	}
	else if ( type == 'ChaosFull' ) {
 		CardTypes[faceIndex] = 'StoryChaosFull';
 		templateName = 'Chaos';
 	}
	else if ( type == 'Player' ) {
 		CardTypes[faceIndex] = defaultType;
		templateName = 'PlayerBack';
	}
	else if ( type == 'Encounter' ) {
 		CardTypes[faceIndex] = defaultType;
		templateName = 'EncounterBack';
 	}
 	else {
 		CardTypes[faceIndex] = defaultType;
 		templateName = defaultType;
 	}

 	if ( setting.length > 0 ) {
 		diy.settings.set(setting, 'ArkhamHorrorLCG/templates/AHLCG-' + templateName + '.jp2');
 	}
}

function filterFunction(filter){
	var f = function filter(source){
		return filter.filter.filter(source,null);
	};
	f.filter = filter;
	return f;
}

const createGreyscaleImage = filterFunction(
	new ca.cgjennings.graphics.filters.GreyscaleFilter()
);

const createInvertedImage = filterFunction(
	new ca.cgjennings.graphics.filters.InversionFilter()
);

const createBlurredImage = filterFunction(
	new ca.cgjennings.graphics.filters.GaussianBlurFilter( 40 )
);

const createAlphaInvertedImage = filterFunction(
	new ca.cgjennings.graphics.filters.AlphaInversionFilter()
);

const createHSBImage = filterFunction(
	new ca.cgjennings.graphics.filters.TintFilter( 0.4, 0.8, 0.6 )
);

function tintImage(image, tint) {
    var filter = new ca.cgjennings.graphics.filters.TintFilter(tint[0], tint[1], tint[2]);
    return filter.filter(image,null);
}

function createStencilImage( source, mask )
{
	var stencilImage = ImageUtils.resize( ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-' + mask + 'Mask.png'), source.width, source.height );

	var destImage = ImageUtils.create( source.width, source.height, true );
	var g = destImage.createGraphics();
	g.drawImage( stencilImage, 0, 0, null );
	g.setComposite( java.awt.AlphaComposite.SrcIn );
	g.drawImage( source, 0, 0, null );
	g.dispose();

	return destImage;
}

const createDarkenedImage = filterFunction(
	new ca.cgjennings.graphics.filters.BrightnessContrastFilter(-0.5,0.0)
);

function createReturnToImage( iconImage )
{
	var icon = ImageUtils.resize( iconImage, 28, 28 );
	var base = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-ReturnToBase.png');

	var destImage = ImageUtils.create( 36, 33, true );
	var g = destImage.createGraphics();
	g.drawImage( base, 0, 0, null );
	g.setComposite( java.awt.AlphaComposite.DstOut );
	g.drawImage(icon, 4, 4, null);
	g.dispose();

	return destImage;
}

function getPathPointArrays( className ) {
	pointArray = [];

	switch ( className )
	{
		case 'Guardian':
		case 'ParallelGuardian':
			pointArray[0] = new Array( 0.355, 0.337, 0.271, 0.267, 0.010, 0.010, 1.0, 1.0 );
			pointArray[1] = new Array( 0.000, 0.566, 0.566, 0.600, 0.600, 1.000, 1.0, 0.0 );
			break;
		case 'Seeker':
		case 'ParallelSeeker':
			pointArray[0] = new Array( 0.355, 0.322, 0.296, 0.275, 0.010, 0.010, 1.0, 1.0 );
			pointArray[1] = new Array( 0.000, 0.585, 0.578, 0.630, 0.622, 1.000, 1.0, 0.0 );
			break;
		case 'Rogue':
		case 'ParallelRogue':
			pointArray[0] = new Array( 0.355, 0.326, 0.272, 0.264, 0.000, 0.0, 1.0, 1.0 );
//			pointArray[1] = new Array( 0.000, 0.511, 0.511, 0.593, 0.593, 1.0, 1.0, 0.0 );
			pointArray[1] = new Array( 0.000, 0.511, 0.511, 0.583, 0.583, 1.0, 1.0, 0.0 );
			break;
		case 'Mystic':
		case 'ParallelMystic':
		case 'Survivor':
		case 'ParallelSurvivor':
			pointArray[0] = new Array( 0.355, 0.315, 0.276, 0.264, 0.010, 0.010, 1.0, 1.0 );
//			pointArray[1] = new Array( 0.000, 0.544, 0.544, 0.631, 0.631, 1.000, 1.0, 0.0 );
			pointArray[1] = new Array( 0.000, 0.544, 0.544, 0.611, 0.611, 1.000, 1.0, 0.0 );
			break;
		case 'ParallelNeutral':
			pointArray[0] = new Array( 0.400, 0.357, 0.010, 0.010, 1.0, 1.0 );
			pointArray[1] = new Array( 0.000, 0.468, 0.468, 1.000, 1.0, 0.0 );
			break;
		case 'Neutral':
			pointArray[0] = new Array( 0.400, 0.357, 0.010, 0.010, 1.0, 1.0 );
			pointArray[1] = new Array( 0.000, 0.468, 0.468, 1.000, 1.0, 0.0 );
			break;
	}

	return pointArray;
}
