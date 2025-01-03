useLibrary( 'diy' );
useLibrary( 'ui' );
useLibrary( 'markup' );
useLibrary( 'imageutils' );
useLibrary( 'fontutils' );

importClass( arkham.component.DefaultPortrait );

const CardTypes = [ 'Concealed', 'ConcealedBack' ];
const BindingSuffixes = [ '', 'Back' ];

const PortraitTypeList = [ 'Portrait-Front' ];

function create( diy ) {
	diy.frontTemplateKey = getExpandedKey( FACE_FRONT, 'Default', '-template' );	// not used, set card size	
	diy.backTemplateKey = getExpandedKey( FACE_BACK, 'Default', '-template' );

	diy.faceStyle = FaceStyle.TWO_FACES;

	diy.name = '';

	setDefaults();
	createPortraits( diy, PortraitTypeList );

	diy.version = 1;
}

function setDefaults() {		
	$Template = 'Standard';
	
	$BackTypeBack = 'Concealed';

	$TemplateReplacement = '';
	$TemplateReplacementBack = '';
}

function createInterface( diy, editor ) {

	var AHLCGObject = Eons.namedObjects.AHLCGObject;
	
	var bindings = new Bindings( editor, diy );
		
//	var TitlePanel = layoutTitle( diy, bindings, false, [0], FACE_FRONT );
	var TitlePanel = layoutTitle2( diy, bindings, [0], FACE_FRONT );
	var StatPanel = layoutConcealedStats( diy, bindings, FACE_FRONT );
	StatPanel.setTitle( @AHLCG-BasicData + ': ' + @AHLCG-Front );
	
	var StatisticsTab = new Grid();
	StatisticsTab.editorTabScrolling = true;
	StatisticsTab.place(TitlePanel, 'wrap, pushx, growx', StatPanel, 'wrap, pushx, growx' );
	StatisticsTab.addToEditor( editor , @AHLCG-General );
	
	PortraitTab = layoutPortraits( diy, bindings, 'Portrait', null, true, false, false );
	PortraitTab.addToEditor(editor, @AHLCG-Portraits);

	bindings.bind();	
}

function createFrontPainter( diy, sheet ) {
	Name_box = markupBox(sheet);
	Name_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Name-style'), null);
	Name_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Name-alignment'));

	initBodyTags( diy, Name_box );	
/*
	Subtype_box = markupBox(sheet);
	Subtype_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Subtype-style'), null);
	Subtype_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Subtype-alignment'));

	Body_box = markupBox(sheet);
	Body_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Body-style'), null);
	Body_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Body-alignment'));
//	createTextShape( Body_box, diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Body-region') ) );
	setTextShape( Body_box, diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Body-region') ) );

	initBodyTags( diy, Body_box );	
	
	Artist_box = markupBox(sheet);
	Artist_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Artist-style'), null);
	Artist_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Artist-alignment'));

	Copyright_box = markupBox(sheet);
	Copyright_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Copyright-style'), null);
	Copyright_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Copyright-alignment'));

	initCopyrightTags( diy, Copyright_box );	

	Collection_box = markupBox(sheet);
	Collection_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'CollectionNumber-style'), null);
	Collection_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'CollectionNumber-alignment'));
*/
}

function createBackPainter( diy, sheet ) {
}

function paintFront( g, diy, sheet ) {
	clearImage( g, sheet );

	PortraitList[getPortraitIndex( 'Portrait' )].paint( g, sheet.getRenderTarget() );

	drawTemplate( g, sheet, '' );

//	drawName( g, diy, sheet, Name_box );
	draw2LineName( g, diy, sheet, Name_box );
/*
	var subtypeRegion = diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Subtype-region' ) );
	if ( Eons.namedObjects.AHLCGObject.bodyFamily == 'Times New Roman' ) subtypeRegion.y -= 2;
	
	if ($CardClass == 'Weakness' ) {	
		drawSubtype( g, diy, sheet, Subtype_box, #AHLCG-Label-Weakness );
	}
	else if ($CardClass == 'BasicWeakness' ) {	
		drawSubtype( g, diy, sheet, Subtype_box, #AHLCG-Label-BasicWeakness );
		
		drawOverlay( g, diy, sheet, 'BasicWeaknessEvent' );
		drawBasicWeaknessIcon( g, diy, sheet );
	}
	else {
		drawLevel( g, diy, sheet, $CardClass );
	}

	drawCost( g, diy, sheet );
	
	drawSkillIcons( g, diy, sheet, $CardClass );
	
	var regionName = 'Body';
	if ( $CardClass == 'Weakness' || $CardClass == 'BasicWeakness') regionName = 'WeaknessBody';
	drawBodyWithRegionName( g, diy, sheet, Body_box, new Array( 'Traits', 'Keywords', 'Rules', 'Flavor', 'Victory' ), regionName );

//	drawCollectorInfo( g, diy, sheet, true, false, false, false, true );
	drawCollectorInfo( g, diy, sheet, Collection_box, false, true, null, false, Copyright_box, Artist_box );
*/
}

function paintBack( g, diy, sheet ) {
	clearImage( g, sheet );

	drawBackTemplate( g, sheet );
}

function onClear() {
	setDefaults();
}

// These can be used to perform special processing during open/save.
// For example, you can seamlessly upgrade from a previous version
// of the script.
function onRead(diy, oos) {
	readPortraits( diy, oos, PortraitTypeList, true );

	if ( diy.version < 9 ) {
		$Skill5 = 'None';
	}
	if ( diy.version < 12 ) {
		$BackTypeBack = 'Player';
	}
	else if ( diy.version < 17 ) {
		if ( $BackTypeundefined ) {	// fix for bug causing undefined binding suffix
			$BackTypeBack = $BackTypeundefined;
			diy.settings.reset('BackTypeundefined');
		}
		
		if ( $BackTypeBack == null ) $BackTypeBack = 'Player';	// some cards created during testing might have both as null
	}

	if (diy.version < 15) {
		$CardClass2 = 'None';
		$CardClass3 = 'None';
		$TemplateReplacement = '';
		$TemplateReplacementBack = '';
	}
	if ( diy.version < 16 ) {
		diy.faceStyle = FaceStyle.TWO_FACES;	// change was in v15, but I forgot to add this
	}
	
	updateCollection();
	
	diy.version = 17;
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
