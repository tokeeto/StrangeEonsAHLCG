useLibrary( 'diy' );
useLibrary( 'ui' );
useLibrary( 'markup' );
useLibrary( 'imageutils' );
useLibrary( 'fontutils' );

importClass( arkham.component.DefaultPortrait );

const CardTypes = [ 'PackCover' ];
const BindingSuffixes = [''];

const PortraitTypeList = [ 'Portrait-Front' ];

function create( diy ) {
	diy.frontTemplateKey = getExpandedKey( FACE_FRONT, 'Default', '-template' );	// not used, set card size

	diy.faceStyle = FaceStyle.ONE_FACE;
	diy.name = '';

	setDefaults();
	createPortraits( diy, PortraitTypeList );

	diy.version = 1;
}

function setDefaults() {
	$tint = '0,1,1';
}

function createInterface( diy, editor ) {
	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	var bindings = new Bindings( editor, diy );

	// do this first, we need the portrait panels for the title listener
	var PortraitTabArray = layoutPortraitsWithPanels( diy, bindings, 'Portrait', null, true, false, false );
	var PortraitTab = PortraitTabArray[0];
	PortraitTabArray.splice( 0, 1 );

	var HSBPanel = layoutHSBPanel(diy, bindings);
	HSBPanel.addToEditor(editor, 'Tint');

	var TitlePanel = layoutTitle2( diy, bindings, [0], FACE_FRONT );
	TitlePanel.setTitle( @AHLCG-Title + ': ' + @AHLCG-Front );

	var StatisticsTab = new Grid();
	StatisticsTab.editorTabScrolling = true;
	StatisticsTab.place(TitlePanel, 'wrap, pushx, growx');
	StatisticsTab.addToEditor( editor , @AHLCG-General );

	PortraitTab.addToEditor(editor, @AHLCG-Portraits);

	bindings.bind();
}

function createFrontPainter( diy, sheet ) {
	Name_box = markupBox(sheet);
	Name_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Name-style'), null);
	Name_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Name-alignment'));


	initBodyTags( diy, Name_box );
}

function paintFront(g, diy, sheet) {
    clearImage(g, sheet);

    PortraitList[0].paint( g, sheet.getRenderTarget() );

    var hsb = $$tint.tint;
    var tintable_image = ImageUtils.get('ArkhamHorrorLCG/templates/AHLCG-PackCoverTintable.png');
	let tinted_image = ImageUtils.tint(tintable_image, hsb);
    sheet.paintImage(g, tinted_image, diy.settings.getRegion('AHLCG-PackCover-Tint-region'));

	drawBackTemplate( g, sheet, '' );

	drawName( g, diy, sheet, Name_box );
}

function onClear() {
	setDefaults();
}

// These can be used to perform special processing during open/save.
// For example, you can seamlessly upgrade from a previous version
// of the script.
function onRead(diy, oos) {
	readPortraits( diy, oos, PortraitTypeList, true );
	diy.version = 1;
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
