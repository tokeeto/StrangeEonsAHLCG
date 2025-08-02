useLibrary( 'diy' );
useLibrary( 'ui' );
useLibrary( 'markup' );
useLibrary( 'imageutils' );
useLibrary( 'fontutils' );

importClass( arkham.component.DefaultPortrait );

const CardTypes = [ 'GuideLetter' ];
const BindingSuffixes = [ '' ];

const PortraitTypeList = [ 'Portrait1-Front', 'Portrait2-Front' ];

function create( diy ) {
	diy.frontTemplateKey = getExpandedKey( FACE_FRONT, 'Default', '-template' );	// not used, set card size

	diy.faceStyle = FaceStyle.ONE_FACE;

	diy.name = '';

	setDefaults();
	createPortraits( diy, PortraitTypeList );

	diy.version = 16;
}

function setDefaults() {
	$PageType = 'Empty';

	$Page = '1';
	
	$RulesLeft = '';
	$RulesRight = '';

	$PositionPortrait1 = 'TopLeftSmall';
	$PositionPortrait2 = 'BottomLarge';
	
	$LineSpacingLeft = '100';
	$LineSpacingRight = '100';
}

function createInterface( diy, editor ) {
	var AHLCGObject = Eons.namedObjects.AHLCGObject;
	
	var bindings = new Bindings( editor, diy );

	// do this first, we need the portrait panels for the title listener
	var PortraitTabArray = layoutGuidePortraits( diy, bindings, 'Portrait1', 'Portrait2', true );
	var PortraitTab = PortraitTabArray[0];
	PortraitTabArray.splice( 0, 1 );

	var TitlePanel = layoutTitleGuide( diy, bindings, [0], FACE_FRONT, PortraitTabArray );
	var StatPanel = layoutGuideStats( bindings, FACE_FRONT );
	StatPanel.setTitle( @AHLCG-BasicData );

	var StatisticsTab = new Grid();
	StatisticsTab.editorTabScrolling = true;
	StatisticsTab.place(TitlePanel, 'wrap, pushx, growx', StatPanel, 'wrap, pushx, growx' );
	StatisticsTab.addToEditor( editor , @AHLCG-General );

	PortraitTab.addToEditor(editor, @AHLCG-Portraits);

//	var LeftTextTab = layoutText( bindings, [ 'Rules' ], 'Left', FACE_FRONT );
	var LeftTextPanel = layoutText( bindings, [ 'Rules' ], 'Left', FACE_FRONT );
//	LeftTextTab.editorTabScrolling = true;
//	LeftTextTab.addToEditor( editor, @AHLCG-Rules + ': ' + @AHLCG-Left );

	var spacingLeftSpinner = new spinner( 10, 300, 1, 100 );
	bindings.add( 'LineSpacingLeft', spacingLeftSpinner, [0] );

	var LeftTextTab = new Grid();
	LeftTextTab.editorTabScrolling = true;
	LeftTextTab.place(
		LeftTextPanel, 'wrap, pushx, growx', 
		@AHLCG-LineSpacing, 'align left, split', spacingLeftSpinner, 'align left', '%', 'pushx, growx, wrap, align left'
	);
	
	LeftTextTab.addToEditor( editor, @AHLCG-Rules + ': ' + @AHLCG-Left );

	var RightTextPanel = layoutText( bindings, [ 'Rules' ], 'Right', FACE_FRONT );

	var spacingRightSpinner = new spinner( 10, 300, 1, 100 );
	bindings.add( 'LineSpacingRight', spacingRightSpinner, [0] );

	var RightTextTab = new Grid();
	RightTextTab.editorTabScrolling = true;
	RightTextTab.place(
		RightTextPanel, 'wrap, pushx, growx', 
		@AHLCG-LineSpacing, 'align left, split', spacingRightSpinner, 'align left', '%', 'pushx, growx, wrap, align left'
	);
	
	RightTextTab.addToEditor( editor, @AHLCG-Rules + ': ' + @AHLCG-Right );

	bindings.bind();
}

function createFrontPainter( diy, sheet ) {	
	Name_box = markupBox(sheet);
	Name_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Name-style'), null);
	Name_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Name-alignment'));
	initBodyTags( diy, Name_box );	

	Header_box = markupBox(sheet);
	Header_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'ResHeader-style'), null);
	Header_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Header-alignment'));

	Label_box  = markupBox(sheet);
	Label_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Label-style'), null);
	Label_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Label-alignment'));

	Body_box = markupBox(sheet);
	Body_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Body-style'), null);
	Body_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Body-alignment'));
	Body_box.setTextFitting( FIT_NONE );
	initBodyTags( diy, Body_box );	
	initGuideTags( diy, Body_box );

	Page_box = markupBox(sheet);
	Page_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Page-style'), null);
	Page_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Page-alignment'));

	setupGuidePortrait( diy, 0, $PositionPortrait1, false );
	setupGuidePortrait( diy, 1, $PositionPortrait2, false );
}

function createBackPainter( diy, sheet ) {
}

function paintFront( g, diy, sheet ) {
	clearImage( g, sheet );

	drawGuideTemplateLetter( diy, g, sheet, Label_box );
	
	if ( $PageType == 'Title' ) drawName( g, diy, sheet, Name_box );

	var bodyRegions = [ 
		diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Body' + 'Left' + $PageType + '-region' ) ), 
		diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Body' + 'Right' + $PageType + '-region' ) ), 
		];

	drawGuidePortraits( g, diy, sheet );
	portraitBodyRegions = updateGuideBodyRegions( diy, bodyRegions );

	if ( $PageType == 'Empty' ) drawPageNumber( g, diy, sheet, Page_box );

	drawGuideBody( g, diy, sheet, Body_box, Header_box, portraitBodyRegions[0], $RulesLeft, parseInt( $LineSpacingLeft ));
	drawGuideBody( g, diy, sheet, Body_box, Header_box, portraitBodyRegions[1], $RulesRight, parseInt( $LineSpacingRight ));	
}

function paintBack( g, diy, sheet ) {
} 

function onClear() {
	setDefaults();
}

// These can be used to perform special processing during open/save.
// For example, you can seamlessly upgrade from a previous version
// of the script.
function onRead(diy, oos) {
	readPortraits( diy, oos, PortraitTypeList, true );

	diy.version = 16;
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
