useLibrary( 'diy' );
useLibrary( 'ui' );
useLibrary( 'markup' );
useLibrary( 'imageutils' );
useLibrary( 'fontutils' );

importClass( arkham.component.DefaultPortrait );

const CardTypes = [ 'Scenario', 'Scenario' ];
const BindingSuffixes = [ '', 'Back' ];

const PortraitTypeList = [ 'Portrait', 'BackPortrait', 'Collection-Both', 'Encounter-Both' ];

function create( diy ) {
	diy.frontTemplateKey = getExpandedKey( FACE_FRONT, 'Default', '-template' );	// not used, set card size
	diy.backTemplateKey = getExpandedKey( FACE_BACK, 'Default', '-template' );

	diy.faceStyle = FaceStyle.TWO_FACES;

	diy.name = '';

	setDefaults();
	createPortraits( diy, PortraitTypeList );
	setDefaultEncounter();
	setDefaultCollection();

	diy.version = 17;
}

function setDefaults() {
//	$PageType = 'Title';
//	$PageTypeBack = 'Title';
	$Template = 'Title';
	$TemplateBack = 'Title';

	$Artist = '';
	$ArtistBack = '';

	$Page = '1';
	$PageBack = '2';
	
	$Rules = '';
	$RulesBack = '';

	$ShowCollectionNumberFront = '1';
	$ShowCollectionNumberBack = '1';
	
	$ShowEncounterNumberFront = '1';
	$ShowEncounterNumberBack = '1';

	$ShowCopyrightFront = '1';
	$ShowCopyrightBack = '1';

	$Copyright = '';

	$TemplateReplacement = '';
	$TemplateReplacementBack = '';
}

function createInterface( diy, editor ) {
	var AHLCGObject = Eons.namedObjects.AHLCGObject;
	
	var bindings = new Bindings( editor, diy );
	
///	var TitlePanel = layoutTitleScenario( diy, bindings, [0, 1], FACE_FRONT );
	var TitlePanel = layoutTitle2( diy, bindings, [0], FACE_FRONT );
	var StatPanel = layoutScenarioStats( diy, bindings, FACE_FRONT );
	StatPanel.setTitle( @AHLCG-BasicData + ': ' + @AHLCG-Front );
///	var BackTitlePanel = layoutTitleScenario( diy, bindings, [1], FACE_BACK );
	var BackTitlePanel = layoutTitle2( diy, bindings, [1], FACE_BACK );
	BackTitlePanel.setTitle( @AHLCG-Title + ': ' + @AHLCG-Back );
	var BackStatPanel = layoutScenarioStats( diy, bindings, FACE_BACK );
	BackStatPanel.setTitle( @AHLCG-BasicData + ': ' + @AHLCG-Back );
	var CopyrightPanel = layoutCopyright( bindings, true, [0, 1], FACE_FRONT );

	var StatisticsTab = new Grid();
	StatisticsTab.editorTabScrolling = true;
	StatisticsTab.place(TitlePanel, 'wrap, pushx, growx', StatPanel, 'wrap, pushx, growx', BackTitlePanel, 'wrap, pushx, growx', BackStatPanel, 'wrap, pushx, growx', CopyrightPanel, 'wrap, pushx, growx' );
	StatisticsTab.addToEditor( editor , @AHLCG-General );

	PortraitTab = layoutPortraits( diy, bindings, 'Portrait', 'BackPortrait', true, false, true );
	PortraitTab.addToEditor(editor, @AHLCG-Portraits);

	var TextTab = layoutText( bindings, [ 'Rules' ], '', FACE_FRONT );
	TextTab.editorTabScrolling = true;
	TextTab.addToEditor( editor, @AHLCG-Rules + ': ' + @AHLCG-Front );

	var BackTextTab = layoutText( bindings, [ 'Rules' ], '', FACE_BACK );
	BackTextTab.editorTabScrolling = true;
	BackTextTab.addToEditor( editor, @AHLCG-Rules + ': ' + @AHLCG-Back );

	var CollectionImagePanel = new portraitPanel( diy, getPortraitIndex( 'Collection' ), @AHLCG-CustomCollection );
	var CollectionPanel = layoutCollection( bindings, CollectionImagePanel, false, true, [0, 1], FACE_FRONT );
	
	var CollectionTab = new Grid();
	CollectionTab.editorTabScrolling = true;
	CollectionTab.place( CollectionPanel, 'wrap, pushx, growx', CollectionImagePanel, 'wrap, pushx, growx' );
	CollectionTab.addToEditor(editor, @AHLCG-Collection);

	var EncounterImagePanel = new portraitPanel( diy, getPortraitIndex( 'Encounter' ), @AHLCG-CustomEncounterSet );
	var EncounterPanel = layoutEncounter( bindings, EncounterImagePanel, true, [0, 1], [0, 1], FACE_FRONT );
	
	var EncounterTab = new Grid();
	EncounterTab.editorTabScrolling = true;
	EncounterTab.place( EncounterPanel, 'wrap, pushx, growx', EncounterImagePanel, 'wrap, pushx, growx' );
	EncounterTab.addToEditor(editor, @AHLCG-EncounterSet);

	bindings.bind();
}

function createFrontPainter( diy, sheet ) {	
	Name_box = markupBox(sheet);
	Name_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Name-style'), null);
	Name_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Name-alignment'));
	Name_box.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Name', '-tightness') + '-tightness') );	
	initBodyTags( diy, Name_box );	

	Header_box = markupBox(sheet);
	Header_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Header-style'), null);
	Header_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Header-alignment'));
	
	Body_box = markupBox(sheet);
	Body_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Body-style'), null);
	Body_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Body-alignment'));
	Body_box.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') );	
	initBodyTags( diy, Body_box );	

	Artist_box = markupBox(sheet);
	Artist_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_FRONT, 'Artist-style'), null);
	Artist_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_FRONT, 'Artist-alignment'));

//	Page_box = markupBox(sheet);
//	Page_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Page-style'), null);
//	Page_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Page-alignment'));
	Page_box = markupBox(sheet);
	Page_box.defaultStyle = diy.settings.getTextStyle('AHLCG-Scenario-Page-style', null);
	Page_box.alignment = diy.settings.getTextAlignment('AHLCG-Scenario-Page-alignment');

	Copyright_box = markupBox(sheet);
	Copyright_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_FRONT, 'Copyright-style'), null);
	Copyright_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_FRONT, 'Copyright-alignment'));
 
	initCopyrightTags( diy, Copyright_box );	

	Collection_box = markupBox(sheet);
	Collection_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_FRONT, 'CollectionNumber-style'), null);
	Collection_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_FRONT, 'CollectionNumber-alignment'));

	Encounter_box = markupBox(sheet);
	Encounter_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'EncounterNumber-style'), null);
	Encounter_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'EncounterNumber-alignment'));

	updateCardType( diy, $Template, FACE_FRONT, 'Scenario', '' );
}

function createBackPainter( diy, sheet ) {
	BackName_box = markupBox(sheet);
	BackName_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Name-style'), null);
	BackName_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Name-alignment'));
	initBodyTags( diy, BackName_box );	

	BackHeader_box = markupBox(sheet);
	BackHeader_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Header-style'), null);
	BackHeader_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Header-alignment'));
	
	BackBody_box = markupBox(sheet);
	BackBody_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Body-style'), null);
	BackBody_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Body-alignment'));
	BackBody_box.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') );	
	initBodyTags( diy, BackBody_box );	

	BackArtist_box = markupBox(sheet);
	BackArtist_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_BACK, 'Artist-style'), null);
	BackArtist_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_BACK, 'Artist-alignment'));

	BackPage_box = markupBox(sheet);
	BackPage_box.defaultStyle = diy.settings.getTextStyle('AHLCG-Scenario-Page-style', null);
	BackPage_box.alignment = diy.settings.getTextAlignment('AHLCG-Scenario-Page-alignment');

	BackCopyright_box = markupBox(sheet);
	BackCopyright_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_BACK, 'Copyright-style'), null);
	BackCopyright_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_BACK, 'Copyright-alignment'));
 
	initCopyrightTags( diy, BackCopyright_box );	

	BackCollection_box = markupBox(sheet);
	BackCollection_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_BACK, 'CollectionNumber-style'), null);
	BackCollection_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_BACK, 'CollectionNumber-alignment'));

	BackEncounter_box = markupBox(sheet);
	BackEncounter_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'EncounterNumber-style'), null);
	BackEncounter_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'EncounterNumber-alignment'));

	updateCardType( diy, $TemplateBack, FACE_BACK, 'Scenario', '' );
}

function paintFront( g, diy, sheet ) {
	clearImage( g, sheet );

	var drawCollectionInfo = false;

	Name_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Name-style'), null);
	Name_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Name-alignment'));
	Header_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Header-style'), null);
	Body_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Body-style'), null);
	Body_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Body-alignment'));
	Body_box.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') );	

	if ( $Template == 'Portrait' ) {
		PortraitList[getPortraitIndex( 'Portrait' )].paint( g, sheet.getRenderTarget() );
	}
	else {
		drawTemplate( g, sheet, '' );
	}

	if ( $Template == 'Chaos' ) {
		drawCollectionInfo = true;

		if ( diy.name != '' ) y = drawChaosName( g, diy, sheet, Name_box );
	}
	else if ( $Template == 'ChaosFull' ) {
		drawCollectionInfo = true;
	}
	else if ( $Template == 'Resolution' ) {
		drawPageNumber( g, diy, sheet, Page_box );
		drawScenarioResolutionHeader( g, diy, sheet, Header_box );
	}
	else if ( $Template == 'Title' ) {
		draw2LineName( g, diy, sheet, Name_box );
		drawPageNumber( g, diy, sheet, Page_box );
	}
	
//	if ( $Template == 'Title' ) drawName( g, diy, sheet, Name_box );
//	else if ( $Template == 'Resolution' ) drawScenarioResolutionHeader( g, diy, sheet, Header_box );
	
	drawScenarioBody( g, diy, sheet, Body_box, new Array( 'Rules' ) );	
	
	if ( drawCollectionInfo ) {
		var collectionSuffix = false;

		var showCollectionNumberBack = ( $ShowCollectionNumberBack == '1' );
		if ( $TemplateBack == 'Portrait' || $TemplateBack == 'Resolution' || $TemplateBack == 'Title' ) showCollectionNumberBack = false;
	
		if ( $ShowCollectionNumberFront == '1' && showCollectionNumberBack == '1' ) collectionSuffix = true;
		var encounterIcon = ($Template == 'ChaosFull') ? false : true;
	
		var collectionBox = $ShowCollectionNumberFront == '1' ? Collection_box : null;
		var encounterBox = $ShowEncounterNumberFront == '1' ? Encounter_box :  null;
		var copyrightBox = $ShowCopyrightFront == '1' ? Copyright_box : null;

		drawCollectorInfo( g, diy, sheet, collectionBox, collectionSuffix, $ShowCollectionNumberFront == '1', encounterBox, encounterIcon, copyrightBox, null );
	}
	
	if ( $Artist != '' ) drawArtist( g, diy, sheet, Artist_box, false );
}

function paintBack( g, diy, sheet ) {
	clearImage( g, sheet );

	var drawCollectionInfo = false;

	BackName_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Name-style'), null);
	BackName_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Name-alignment'));
	BackHeader_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Header-style'), null);
	BackBody_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Body-style'), null);
	BackBody_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Body-alignment'));
	BackBody_box.setLineTightness( $(getExpandedKey(FACE_BACK, 'Body', '-tightness') + '-tightness') );	

	if ( $TemplateBack == 'Portrait' ) {
		PortraitList[getPortraitIndex( 'BackPortrait' )].paint( g, sheet.getRenderTarget() );
	}
	else {
		drawTemplate( g, sheet, '' );
	}

	if ( $TemplateBack == 'Chaos' ) {
		drawCollectionInfo = true;

		if ( diy.name != '' ) y = drawChaosName( g, diy, sheet, BackName_box );
	}
	else if ( $TemplateBack == 'ChaosFull' ) {
		drawCollectionInfo = true;
	}
	else if ( $TemplateBack == 'Resolution' ) {
		drawPageNumber( g, diy, sheet, BackPage_box );
		drawScenarioResolutionHeader( g, diy, sheet, BackHeader_box );
	}
	else if ( $TemplateBack == 'Title' ) {
		draw2LineName( g, diy, sheet, BackName_box );
		drawPageNumber( g, diy, sheet, BackPage_box );
	}
	
	drawScenarioBody( g, diy, sheet, BackBody_box, new Array( 'Rules' ) );	

	if ( drawCollectionInfo ) {
		var collectionSuffix = false;

		var showCollectionNumberBack = ( $ShowCollectionNumberBack == '1' );
		if ( $Template == 'Portrait' || $Template == 'Resolution' || $Template == 'Title' ) showCollectionNumberFront = false;
	
		if ( $ShowCollectionNumberFront == '1' && showCollectionNumberBack == '1' ) collectionSuffix = true;
		var encounterIcon = ($TemplateBack == 'ChaosFull') ? false : true;
	
		var collectionBox = $ShowCollectionNumberBack == '1' ? BackCollection_box : null;
		var encounterBox = $ShowEncounterNumberBack == '1' ? BackEncounter_box :  null;
		var copyrightBox = $ShowCopyrightBack == '1' ? BackCopyright_box : null;

		drawCollectorInfo( g, diy, sheet, collectionBox, collectionSuffix, $ShowCollectionNumberFront == '1', encounterBox, encounterIcon, copyrightBox, null );
	}

	if ( $ArtistBack != '' ) drawArtist( g, diy, sheet, BackArtist_box, false );
} 

function onClear() {
	setDefaults();
}

// These can be used to perform special processing during open/save.
// For example, you can seamlessly upgrade from a previous version
// of the script.
function onRead(diy, oos) {
	if ( diy.version < 2 ) {
		$PageType = 'Title';
		$PageTypeBack = 'Title';

		$Artist = '';
		$ArtistBack = '';
	}
	if ( diy.version < 15 ) {
		$TemplateReplacement = '';
		$TemplateReplacementBack = '';
	}
	if ( diy.version < 16 ) {
		$Template = $PageType;
		$TemplateBack = $PageTypeBack;
	}
	if ( diy.version < 17 ) {
		setDefaultEncounter();
		setDefaultCollection();

		// Create defaults for the new encounter/collection portraits
		for ( let i = 2; i < 4; i++ ) {
			let fullKey = PortraitTypeList[i];
			createPortrait( diy, fullKey );
		}
	}
	
	if ( $Template == 'Portrait' ) PortraitList[0] = oos.readObject();
	else createPortrait( diy, PortraitTypeList[0] );
	
	if ( $PageTypeBack == 'Portrait' ) PortraitList[1] = oos.readObject();
	else createPortrait( diy, PortraitTypeList[1] );

	if ( $Template == 'Chaos' || $TemplateBack == 'Chaos' ) PortraitList[2] = oos.readObject();
	else createPortrait( diy, PortraitTypeList[2] );
			
	if ( $Template == 'Chaos' || $Template == 'ChaosFull' || $TemplateBack == 'Chaos' || $TemplateBack == 'ChaosFull' ) PortraitList[3] = oos.readObject();
	else createPortrait( diy, PortraitTypeList[3] );

	diy.version = 17;
}

function onWrite( diy, oos ) {
	if ( $Template == 'Portrait' ) oos.writeObject( getPortrait(0) );
	if ( $TemplateBack == 'Portrait' ) oos.writeObject( getPortrait(1) );
	if ( $Template == 'Chaos' || $TemplateBack == 'Chaos' ) oos.writeObject( getPortrait(2) );
	if ( $Template == 'Chaos' || $Template == 'ChaosFull' || $TemplateBack == 'Chaos' || $TemplateBack == 'ChaosFull' ) oos.writeObject( getPortrait(3) );
}

// This is part of the diy library; calling it from within a
// script that defines the needed functions for a DIY component
// will create the DIY from the script and add it as a new editor;
// however, saving and loading the new component won't work correctly.
// This means you can test your script directly by running it without
// having to create a plug-in (except to make any required resources
// available).
if( sourcefile == 'Quickscript' ) {
	useLibrary('project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy/AHLCG-utilLibrary.js');
	useLibrary('project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy/AHLCG-layoutLibrary.js');
	useLibrary('project:ArkhamHorrorLCG/resources/ArkhamHorrorLCG/diy/AHLCG-drawLibrary.js');

	testDIYScript();
}
else {
	useLibrary('res://ArkhamHorrorLCG/diy/AHLCG-utilLibrary.js');
	useLibrary('res://ArkhamHorrorLCG/diy/AHLCG-layoutLibrary.js');
	useLibrary('res://ArkhamHorrorLCG/diy/AHLCG-drawLibrary.js');
}
