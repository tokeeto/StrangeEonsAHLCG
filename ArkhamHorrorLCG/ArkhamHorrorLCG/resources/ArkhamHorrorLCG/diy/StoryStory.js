useLibrary( 'diy' );
useLibrary( 'ui' );
useLibrary( 'markup' );
useLibrary( 'imageutils' );
useLibrary( 'fontutils' );
useLibrary('tints');

importClass( arkham.component.DefaultPortrait );

const CardTypes = [ 'Story', 'Story' ];
const BindingSuffixes = [ '', 'Back' ];

const PortraitTypeList = [ 'Collection-Both', 'Encounter-Both' ];

function create( diy ) {
	diy.frontTemplateKey = getExpandedKey(FACE_FRONT, 'Default', '-template');	// not used, set card size
	diy.backTemplateKey = getExpandedKey(FACE_BACK, 'Default', '-template');

	diy.faceStyle = FaceStyle.TWO_FACES;

	diy.name = '';

	setDefaults();
	createPortraits( diy, PortraitTypeList );
	setDefaultEncounter();
	setDefaultCollection();

   	diy.setCornerRadius(8);
	diy.version = 18;
}

function setDefaults() {
	// front
	$Template = 'Story';
	$TemplateBack = 'Story';

	$TraitsA = '';
	$HeaderA = '';
	$AccentedStoryA = '';
	$RulesA = '';
	$HeaderB = '';
	$AccentedStoryB = '';
	$RulesB = '';
	$HeaderC = '';
	$AccentedStoryC = '';
	$RulesC = '';

	$TraitsASpacing = '0';
	$HeaderASpacing = '0';
	$AccentedStoryASpacing = '0';
	$HeaderBSpacing = '0';
	$AccentedStoryBSpacing = '0';
	$HeaderCSpacing = '0';
	$AccentedStoryCSpacing = '0';

	$Victory = '';
	$VictorySpacing = '0';
	$ScaleModifier = '100';

	$TrackerBox = '';
	$TrackerHeight = '100';

	$ShowCollectionNumberFront = '1';
	$ShowCollectionNumberBack = '1';

	$ShowEncounterNumberFront = '1';
	$ShowEncounterNumberBack = '1';

	$ShowCopyrightFront = '1';
	$ShowCopyrightBack = '1';

	// back
	$TitleBack = '';

	$TraitsABack = '';
	$HeaderABack = '';
	$AccentedStoryABack = '';
	$RulesABack = '';
	$HeaderBBack = '';
	$AccentedStoryBBack = '';
	$RulesBBack = '';
	$HeaderCBack = '';
	$AccentedStoryCBack = '';
	$RulesCBack = '';

	$TraitsABackSpacing = '0';
	$HeaderABackSpacing = '0';
	$AccentedStoryABackSpacing = '0';
	$HeaderBBackSpacing = '0';
	$AccentedStoryBBackSpacing = '0';
	$HeaderCBackSpacing = '0';
	$AccentedStoryCBackSpacing = '0';

	$VictoryBack = '';
	$VictoryBackSpacing = '0';
	$ScaleModifierBack = '100';

	$TrackerBoxBack = '';
	$TrackerHeightBack = '100';

	$TemplateReplacement = '';
	$TemplateReplacementBack = '';
}

function createInterface( diy, editor ) {
	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	var bindings = new Bindings( editor, diy );

//	var TitlePanel = layoutTitle( diy, bindings, false, [0], FACE_FRONT );
	var TitlePanel = layoutTitle2( diy, bindings, [0], FACE_FRONT );
	TitlePanel.setTitle( @AHLCG-Title + ': ' + @AHLCG-Front );
	var StatPanel = layoutStoryStats( diy, bindings, FACE_FRONT );
	StatPanel.setTitle( @AHLCG-BasicData + ': ' + @AHLCG-Front );
//	var BackTitlePanel = layoutTitle( diy, bindings, false, [1], FACE_BACK );
	var BackTitlePanel = layoutTitle2( diy, bindings, [1], FACE_BACK );
	BackTitlePanel.setTitle( @AHLCG-Title + ': ' + @AHLCG-Back );
	var BackStatPanel = layoutStoryBackStats( diy ,bindings, FACE_BACK );
	BackStatPanel.setTitle( @AHLCG-BasicData + ': ' + @AHLCG-Back );
	var CopyrightPanel = layoutCopyright( bindings, true, [0, 1], FACE_FRONT );

	var StatisticsTab = new Grid();
	StatisticsTab.editorTabScrolling = true;
	StatisticsTab.place(TitlePanel, 'wrap, pushx, growx', StatPanel, 'wrap, pushx, growx', BackTitlePanel, 'wrap, pushx, growx', BackStatPanel, 'wrap, pushx, growx', CopyrightPanel, 'wrap, pushx, growx' );
	StatisticsTab.addToEditor( editor , @AHLCG-General );

//	var TextPanelTrait = layoutText( bindings, [ 'Traits' ], '', FACE_FRONT );
//	TextPanelTrait.setTitle( @AHLCG-Rules + ' (' + @AHLCG-Traits + ')' );
//	TextPanelTrait.editorTabScrolling = true;

	var TextPanelA = layoutText( bindings, [ 'Traits', 'Header', 'AccentedStory', 'Rules' ], 'A', FACE_FRONT );
	TextPanelA.setTitle( @AHLCG-Rules + ' (' + @AHLCG-Part + ' A)' );
	TextPanelA.editorTabScrolling = true;

	var TextPanelB = layoutText( bindings, [ 'Header', 'AccentedStory', 'Rules' ], 'B', FACE_FRONT );
	TextPanelB.setTitle( @AHLCG-Rules + ' (' + @AHLCG-Part + ' B)' );
	TextPanelB.editorTabScrolling = true;

	var TextPanelC = layoutText( bindings, [ 'Header', 'AccentedStory', 'Rules' ], 'C', FACE_FRONT );
	TextPanelC.setTitle( @AHLCG-Rules + ' (' + @AHLCG-Part + ' C)' );
	TextPanelC.editorTabScrolling = true;

	var VictoryPanel = layoutVictoryText( bindings, FACE_FRONT );

	var scaleSpinner = new spinner( 50, 150, 1, 100 );
	bindings.add( 'ScaleModifier', scaleSpinner, [0] );

	var TextTab = new Grid();
	TextTab.editorTabScrolling = true;
	TextTab.place(
		TextPanelA, 'wrap, pushx, growx',
		TextPanelB, 'wrap, pushx, growx',
		TextPanelC, 'wrap, pushx, growx',
		VictoryPanel, 'wrap, pushx, growx',
		@AHLCG-TextScale, 'align left, split', scaleSpinner, 'align left', '%', 'wrap, align left'
	);

	TextTab.addToEditor( editor, @AHLCG-Rules + ': ' + @AHLCG-Front );

//	var BackTextPanelTrait = layoutText( bindings, [ 'Traits' ], '', FACE_BACK );
//	BackTextPanelTrait.setTitle( @AHLCG-Rules + ' (' + @AHLCG-Traits + ')' );
//	BackTextPanelTrait.editorTabScrolling = true;

	var BackTextPanelA = layoutText( bindings, [ 'Traits', 'Header', 'AccentedStory', 'Rules' ], 'A', FACE_BACK );
	BackTextPanelA.setTitle( @AHLCG-Rules + ' (' + @AHLCG-Part + ' A)' );
	BackTextPanelA.editorTabScrolling = true;

	var BackTextPanelB = layoutText( bindings, [ 'Header', 'AccentedStory', 'Rules' ], 'B', FACE_BACK );
	BackTextPanelB.setTitle( @AHLCG-Rules + ' (' + @AHLCG-Part + ' B)' );
	BackTextPanelB.editorTabScrolling = true;

	var BackTextPanelC = layoutText( bindings, [ 'Header', 'AccentedStory', 'Rules' ], 'C', FACE_BACK );
	BackTextPanelC.setTitle( @AHLCG-Rules + ' (' + @AHLCG-Part + ' C)' );
	BackTextPanelC.editorTabScrolling = true;

	var BackVictoryPanel = layoutVictoryText( bindings, FACE_BACK );

	var backScaleSpinner = new spinner( 50, 150, 1, 100 );
	bindings.add( 'ScaleModifierBack', backScaleSpinner, [1] );

	var BackTextTab = new Grid();
	BackTextTab.editorTabScrolling = true;
	BackTextTab.place(
		BackTextPanelA, 'wrap, pushx, growx',
		BackTextPanelB, 'wrap, pushx, growx',
		BackTextPanelC, 'wrap, pushx, growx',
		BackVictoryPanel, 'wrap, pushx, growx',
		@AHLCG-TextScale, 'align left, split', backScaleSpinner, 'align left', '%', 'wrap, align left'
	);

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

	PortraitTab = layoutPortraits( diy, bindings, null, null, true, false, false );
	PortraitTab.addToEditor(editor, @AHLCG-Portraits);

	bindings.bind();
}

function createFrontPainter( diy, sheet ) {
	// create label box no matter what, but have to hardcode Story because Chaos template doesn't have a label
	Label_box = markupBox(sheet);
	Label_box.defaultStyle = diy.settings.getTextStyle('AHLCG-Story-Label-style', null);
	Label_box.alignment = diy.settings.getTextAlignment('AHLCG-Story-Label-alignment');

	Name_box = markupBox(sheet);
	Name_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_FRONT, 'Name-style'), null);
	Name_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_FRONT, 'Name-alignment'));

	initBodyTags( diy, Name_box );

	Traits_box = markupBox(sheet);
	Traits_box.defaultStyle = diy.settings.getTextStyle( 'AHLCG-Header-style', null );
	Traits_box.alignment = diy.settings.getTextAlignment( 'AHLG-Header-alignment' );
	Traits_box.setLineTightness( $('AHLCG-Header-tightness') );

	Header_box = markupBox(sheet);
	Header_box.defaultStyle = diy.settings.getTextStyle( 'AHLCG-Header-style', null );
	Header_box.alignment = diy.settings.getTextAlignment( 'AHLCG-Header-alignment' );
	Header_box.setLineTightness( $('AHLCG-Header-tightness') );

	Story_box = markupBox(sheet);
	Story_box.defaultStyle = diy.settings.getTextStyle('AHLCG-Story-Story-style', null );
	Story_box.alignment = diy.settings.getTextAlignment('AHLCG-Story-Story-alignment');
	Story_box.setLineTightness( $('AHLCG-Story-Story-tightness') );

	Body_box = markupBox(sheet);
	Body_box.defaultStyle = diy.settings.getTextStyle( 'AHLCG-Body-style', null );
	Body_box.alignment = diy.settings.getTextAlignment( 'AHLCG-Body-alignment' );
	Body_box.setLineTightness( $('AHLCG-Body-tightness') );

	initBodyTags( diy, Traits_box );
	initBodyTags( diy, Header_box );
	initBodyTags( diy, Story_box );
	initBodyTags( diy, Body_box );

	Tracker_box = markupBox(sheet);
	Tracker_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'TrackerName-style'), null);
	Tracker_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'TrackerName-alignment'));

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

	updateCardType( diy, $Template, FACE_FRONT, 'Story', '' );
}

function createBackPainter( diy, sheet ) {
	// create label box no matter what, but have to hardcode Story because Chaos template doesn't have a label
	BackLabel_box = markupBox(sheet);
	BackLabel_box.defaultStyle = diy.settings.getTextStyle('AHLCG-Story-Label-style', null);
	BackLabel_box.alignment = diy.settings.getTextAlignment('AHLCG-Story-Label-alignment');

	BackName_box = markupBox(sheet);
	BackName_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Name-style'), null);
	BackName_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Name-alignment'));

	initBodyTags( diy, BackName_box );

	BackTraits_box = markupBox(sheet);
	BackTraits_box.defaultStyle = diy.settings.getTextStyle( 'AHLCG-Header-style', null );
	BackTraits_box.alignment = diy.settings.getTextAlignment( 'AHLCG-Header-alignment' );
	BackTraits_box.setLineTightness( $('AHLCG-Header-tightness') );

	BackHeader_box = markupBox(sheet);
	BackHeader_box.defaultStyle = diy.settings.getTextStyle( 'AHLCG-Header-style', null);
	BackHeader_box.alignment = diy.settings.getTextAlignment( 'AHLCG-Header-alignment' );
	BackHeader_box.setLineTightness( $('AHLCG-Header-tightness') );

	BackStory_box = markupBox(sheet);
//	BackStory_box.defaultStyle = diy.settings.getTextStyle('AHLCG-Story-Story-style', null);
//	BackStory_box.alignment = diy.settings.getTextAlignment('AHLCG-Story-Story-alignment');
	BackStory_box.defaultStyle = diy.settings.getTextStyle('AHLCG-Story-Story-style', null);
	BackStory_box.alignment = diy.settings.getTextAlignment('AHLCG-Story-Story-alignment');
	BackStory_box.setLineTightness( $('AHLCG-Story-Story-tightness') );

	BackBody_box = markupBox(sheet);
	BackBody_box.defaultStyle = diy.settings.getTextStyle( 'AHLCG-Body-style', null);
	BackBody_box.alignment = diy.settings.getTextAlignment( 'AHLCG-Body-alignment');
	BackBody_box.setLineTightness( $('AHLCG-Body-tightness') );

	initBodyTags( diy, BackTraits_box );
	initBodyTags( diy, BackHeader_box );
	initBodyTags( diy, BackStory_box );
	initBodyTags( diy, BackBody_box );

	BackTracker_box = markupBox(sheet);
	BackTracker_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'TrackerName-style'), null);
	BackTracker_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'TrackerName-alignment'));

	BackCopyright_box = markupBox(sheet);
	BackCopyright_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Copyright-style'), null);
	BackCopyright_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Copyright-alignment'));

	initCopyrightTags( diy, BackCopyright_box );

	BackCollection_box = markupBox(sheet);
	BackCollection_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_BACK, 'CollectionNumber-style'), null);
	BackCollection_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_BACK, 'CollectionNumber-alignment'));

	BackEncounter_box = markupBox(sheet);
	BackEncounter_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_BACK, 'EncounterNumber-style'), null);
	BackEncounter_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_BACK, 'EncounterNumber-alignment'));

	updateCardType( diy, $TemplateBack, FACE_BACK, 'Story', 'AHLCG-Story-Default-template' );
}

function paintFront( g, diy, sheet ) {
	clearImage( g, sheet );

	drawTemplate( g, sheet, '' );

	Name_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_FRONT, 'Name-style'), null);
	Name_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_FRONT, 'Name-alignment'));

	// I do not know why I have to recreate these, but some of them don't change color if I don't
	Copyright_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_FRONT, 'Copyright-style'), null);
	Encounter_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_FRONT, 'EncounterNumber-style'), null);
	Collection_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_FRONT, 'CollectionNumber-style'), null);

	if ( $Template == 'Story' ) {
		drawLabel( g, diy, sheet, Label_box, #AHLCG-Label-Story );
		draw2LineName( g, diy, sheet, Name_box );
	}
	else if ( $Template == 'Chaos' ) {
		if ( diy.name != '' ) y = drawChaosName( g, diy, sheet, Name_box );
	}

	if ( $TrackerBox.length > 0 ) drawTrackerBox( g, diy, sheet, Tracker_box );

	drawIndentedStoryBody( g, diy, sheet, Traits_box, Header_box, Story_box, Body_box );

	var collectionSuffix = false;

	var showCollectionNumberBack = ( $ShowCollectionNumberBack == '1' );
	if ( $TemplateBack == 'Player' || $TemplateBack == 'Encounter' ) showCollectionNumberBack = false;

	if ( $ShowCollectionNumberFront == '1' && showCollectionNumberBack == '1' ) collectionSuffix = true;
	var encounterIcon = ($Template == 'ChaosFull') ? false : true;

	var collectionBox = $ShowCollectionNumberFront == '1' ? Collection_box : null;
	var encounterBox = $ShowEncounterNumberFront == '1' ? Encounter_box :  null;
	var copyrightBox = $ShowCopyrightFront == '1' ? Copyright_box : null;

	drawCollectorInfo( g, diy, sheet, collectionBox, collectionSuffix, $ShowCollectionNumberFront == '1', encounterBox, encounterIcon, copyrightBox, null );
}

function paintBack( g, diy, sheet ) {
	clearImage( g, sheet );

	BackName_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_BACK, 'Name-style'), null);
	BackName_box.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_BACK, 'Name-alignment'));

	BackCopyright_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_BACK, 'Copyright-style'), null);
	BackEncounter_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_BACK, 'EncounterNumber-style'), null);
	BackEncounter_box.setAlignment( diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'EncounterNumber-alignment')) );
	BackCollection_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_BACK, 'CollectionNumber-style'), null);

	var collectionSuffix = false;
	if ( $ShowCollectionNumberFront == '1' && $ShowCollectionNumberBack == '1' ) collectionSuffix = true;

	var collectionBox = $ShowCollectionNumberBack == '1' ? BackCollection_box : null;
	var encounterBox = $ShowEncounterNumberBack == '1' ? BackEncounter_box :  null;
	var copyrightBox = $ShowCopyrightBack == '1' ? BackCopyright_box : null;

	if ( $TemplateBack == 'Story' ) {
		drawTemplate( g, sheet, '' );
		drawLabel( g, diy, sheet, BackLabel_box, #AHLCG-Label-Story );
		draw2LineName( g, diy, sheet, BackName_box );

		if ( $TrackerBoxBack.length > 0 ) drawTrackerBox( g, diy, sheet, BackTracker_box );

		drawIndentedStoryBody( g, diy, sheet, BackTraits_box, BackHeader_box, BackStory_box, BackBody_box );

		drawCollectorInfo( g, diy, sheet, collectionBox, collectionSuffix, $ShowCollectionNumberBack == '1', encounterBox, true, copyrightBox, null );
	}
	else if ( $TemplateBack == 'Chaos' ) {
		drawTemplate( g, sheet, '' );
		if ( $TitleBack != '' ) y = drawChaosName( g, diy, sheet, BackName_box );

		if ( $TrackerBoxBack.length > 0 ) drawTrackerBox( g, diy, sheet, BackTracker_box );

		drawIndentedStoryBody( g, diy, sheet, BackTraits_box, BackHeader_box, BackStory_box, BackBody_box );

		drawCollectorInfo( g, diy, sheet, collectionBox, collectionSuffix, $ShowCollectionNumberBack == '1', encounterBox, true, copyrightBox, null );
	}
	else if ( $TemplateBack == 'ChaosFull' ) {
		drawTemplate( g, sheet, '' );

		if ( $TrackerBoxBack.length > 0 ) drawTrackerBox( g, diy, sheet, BackTracker_box );

		drawIndentedStoryBody( g, diy, sheet, BackTraits_box, BackHeader_box, BackStory_box, BackBody_box );

		drawCollectorInfo( g, diy, sheet, collectionBox, collectionSuffix, $ShowCollectionNumberBack == '1', encounterBox, false, copyrightBox, null );
	}
	else {
		drawBackTemplate( g, sheet );
	}
}

function onClear() {
	setDefaults();
}

// These can be used to perform special processing during open/save.
// For example, you can seamlessly upgrade from a previous version
// of the script.
function onRead(diy, oos) {
	readPortraits( diy, oos, PortraitTypeList, true );

	updateCollection();
	updateEncounter();

	if ( diy.version < 7 ) {
		$HeaderA = '';
		$HeaderASpacing = '0';
	}
	if ( diy.version < 12 ) {
		$TraitsA = '';
		$TraitsASpacing = '0';
		$TraitsABack = '';
		$TraitsABackSpacing = '0';
	}
	if ( diy.version < 13 ) {
		$Victory = '';
		$VictorySpacing = '0';
		$VictoryBack = '';
		$VictoryBackSpacing = '0';
	}
	if ( diy.version < 14 ) {
		$Template = 'Story';
	}
	if ( diy.version < 15 ) {
		$TitleBack = '';
		$TemplateBack = 'Story';
		$TemplateReplacement = '';
		$TemplateReplacementBack = '';

		$ShowCollectionNumberFront = '1';
		$ShowCollectionNumberBack = '1';
		$ShowEncounterNumberFront = '1';
		$ShowEncounterNumberBack = '1';
	}
	if ( diy.version < 16 ) {
		$ShowCopyrightFront = '1';
		$ShowCopyrightBack = '1';
	}
	if ( diy.version < 17 ) {
		if ( $Template == 'ChaosFullText' ) $Template = 'ChaosFull';
		if ( $TemplateBack == 'ChaosFullText' ) $TemplateBack = 'ChaosFull';
	}
	if ( diy.version < 18 ) {
		$TrackerBox = '';
		$TrackerHeight = '100';
		$TrackerBoxBack = '';
		$TrackerHeightBack = '100';
	}

	diy.setCornerRadius(8);
	diy.version = 18;
}

function onWrite( diy, oos ) {
	writePortraits( oos, PortraitTypeList );
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
