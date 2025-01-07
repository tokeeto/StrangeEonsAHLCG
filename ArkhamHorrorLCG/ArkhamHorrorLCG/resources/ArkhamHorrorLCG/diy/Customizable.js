
useLibrary( 'diy' );
useLibrary( 'ui' );
useLibrary( 'markup' );
useLibrary( 'imageutils' );
useLibrary( 'fontutils' );

importClass( arkham.component.DefaultPortrait );

const CardTypes = [ 'Customizable', 'CustomizableBack' ];
const BindingSuffixes = [ '', 'Back' ];

const PortraitTypeList = [ 'Collection-Front' ];

function create( diy ) {
	diy.frontTemplateKey = getExpandedKey( FACE_FRONT, 'Default', '-template' );	// not used, set card size
	diy.backTemplateKey = getExpandedKey( FACE_BACK, 'Default', '-template' );

	diy.faceStyle = FaceStyle.TWO_FACES;

	diy.name = '';

	setDefaults();
	createPortraits( diy, PortraitTypeList );

	diy.setCornerRadius(8);
	diy.version = 3;
}

function setDefaults() {
	$CustHeader = '';
	$CustHeaderSpacing = '0';

	$CustCost1 = '1';
	$CustText1 = '';
	$CustText1Spacing = '0';
	$CustName1 = '';

	$CustCost2 = '2';
	$CustText2 = '';
	$CustText2Spacing = '0';
	$CustName2 = '';

	$CustCost3 = '2';
	$CustText3 = '';
	$CustText3Spacing = '0';
	$CustName3 = '';

	$CustCost4 = '2';
	$CustText4 = '';
	$CustText4Spacing = '0';
	$CustName4 = '';

	$CustCost5 = '2';
	$CustText5 = '';
	$CustText5Spacing = '0';
	$CustName5 = '';

	$CustCost6 = '2';
	$CustText6 = '';
	$CustText6Spacing = '0';
	$CustName6 = '';

	$CustCost7 = '2';
	$CustText7 = '';
	$CustText7Spacing = '0';
	$CustName7 = '';

	$CutCost8 = '2';
	$CustText8 = '';
	$CustText8Spacing = '0';
	$CustName8 = '';

	$CutCost9 = '2';
	$CustText9 = '';
	$CustText9Spacing = '0';
	$CustName9 = '';

	$CutCost10 = '2';
	$CustText10 = '';
	$CustText10Spacing = '0';
	$CustName10 = '';

	$ScaleModifier = '100';

	$Copyright = '';

	$TemplateReplacement = '';
	$TemplateReplacementBack = '';

	$BackTypeBack = 'PlayerPurple';
}

function createInterface( diy, editor ) {

	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	var bindings = new Bindings( editor, diy );

	var TitlePanel = layoutTitle( diy, bindings, false, [0], FACE_FRONT );
//	var StatPanel = layoutCustomizableStats( diy, bindings, FACE_FRONT );
//	StatPanel.setTitle( @AHLCG-BasicData + ': ' + @AHLCG-Front );
//	var BackStatPanel = layoutBackTypeStats( diy, bindings, FACE_BACK );
//	BackStatPanel.setTitle( @AHLCG-BasicData + ': ' + @AHLCG-Back );
	var CopyrightPanel = layoutCopyright( bindings, false, [0], FACE_FRONT );

	var StatisticsTab = new Grid();
	StatisticsTab.editorTabScrolling = true;
	StatisticsTab.place(TitlePanel, 'wrap, pushx, growx', CopyrightPanel, 'wrap, pushx, growx' );
	StatisticsTab.addToEditor( editor, @AHLCG-General );

	var TextPanelHeader = layoutCustomizableText( bindings, 0, 'Header', false, true, FACE_FRONT );
	TextPanelHeader.setTitle( @AHLCG-Rules + ' (' + @AHLCG-Header + ')' );
	TextPanelHeader.editorTabScrolling = true;

	var TextPanel = new Array(10);
	for ( let i = 1; i <= 8; i++ ) {
		TextPanel[i-1] = layoutCustomizableText( bindings, i.toString(), 'Text', true, i < 8, FACE_FRONT );
		TextPanel[i-1].setTitle( @AHLCG-Rules + ' (' + @AHLCG-Option + ' ' + i + ')' );
		TextPanel[i-1].editorTabScrolling = true;
	}

	var scaleSpinner = new spinner( 50, 150, 1, 100 );
	bindings.add( 'ScaleModifier', scaleSpinner, [0] );

	var TextTab = new Grid();
	TextTab.editorTabScrolling = true;
	TextTab.place(
		TextPanelHeader, 'wrap, pushx, growx',
		TextPanel[0], 'wrap, pushx, growx',
		TextPanel[1], 'wrap, pushx, growx',
		TextPanel[2], 'wrap, pushx, growx',
		TextPanel[3], 'wrap, pushx, growx',
		TextPanel[4], 'wrap, pushx, growx',
		TextPanel[5], 'wrap, pushx, growx',
		TextPanel[6], 'wrap, pushx, growx',
		TextPanel[7], 'wrap, pushx, growx',
		@AHLCG-TextScale, 'align left, split', scaleSpinner, 'align left', '%', 'wrap, align left'
	);

	TextTab.addToEditor( editor, @AHLCG-Rules + ': ' + @AHLCG-Front );
/*
	var TextTab = layoutText( bindings, [ 'Traits', 'Keywords', 'Rules', 'Flavor', 'Victory' ], '', FACE_FRONT );
	TextTab.editorTabScrolling = true;
	TextTab.addToEditor( editor, @AHLCG-Rules );
*/
//	PortraitTab = layoutPortraits( diy, bindings, 'Portrait', null, true, false, false );
//	PortraitTab.addToEditor(editor, @AHLCG-Portraits);

	bindings.bind();
}

function createFrontPainter( diy, sheet ) {

	Label_box  = markupBox(sheet);
	Label_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Label-style'), null);
	Label_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Label-alignment'));

	Name_box = markupBox(sheet);
	Name_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Name-style'), null);
	Name_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Name-alignment'));

	initBodyTags( diy, Name_box );

	Body_box = markupBox(sheet);
	Body_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Body-style'), null);
	Body_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Body-alignment'));

	initBodyTags( diy, Body_box );

	Copyright_box = markupBox(sheet);
	Copyright_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Copyright-style'), null);
	Copyright_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Copyright-alignment'));

	initCopyrightTags( diy, Copyright_box );
}

function createBackPainter( diy, sheet ) {
}

function paintFront( g, diy, sheet ) {
	clearImage( g, sheet );

//	PortraitList[getPortraitIndex( 'Portrait' )].paint( g, sheet.getRenderTarget() );

	drawTemplate( g, sheet );

	drawLabel( g, diy, sheet, Label_box, #AHLCG-Label-Customizable );
	drawName( g, diy, sheet, Name_box );

	drawBody( g, diy, sheet, Body_box, new Array( 'CustHeader', 'CustText1', 'CustText2', 'CustText3', 'CustText4', 'CustText5', 'CustText6', 'CustText7', 'CustText8' ) );
	drawCollectorInfo( g, diy, sheet, null, false, false, null, false, Copyright_box, null );
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

	if ( diy.version < 2 ) {
		$BackTypeBack = 'PlayerPurple';
	}

	diy.setCornerRadius(8);
	diy.version = 2;
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
