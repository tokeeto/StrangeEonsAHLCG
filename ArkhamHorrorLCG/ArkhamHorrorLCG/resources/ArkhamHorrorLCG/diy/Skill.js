useLibrary( 'diy' );
useLibrary( 'ui' );
useLibrary( 'markup' );
useLibrary( 'imageutils' );
useLibrary( 'fontutils' );

importClass( arkham.component.DefaultPortrait );

const CardTypes = [ 'Skill', 'SkillBack' ];
const BindingSuffixes = [ '', 'Back' ];

const PortraitTypeList = [ 'Portrait-Front', 'Collection-Front' ];

function create( diy ) {
	diy.frontTemplateKey = getExpandedKey(FACE_FRONT, 'Default', '-template');	// not used, set card size
	diy.backTemplateKey = getExpandedKey(FACE_BACK, 'Default', '-template');

	diy.faceStyle = FaceStyle.TWO_FACES;

	diy.name = '';

	setDefaults();
	createPortraits( diy, PortraitTypeList );
	setDefaultCollection();

	diy.setCornerRadius(8);
	diy.version = 16;
}

function setDefaults() {
	$CardClass = 'Guardian';
	$Level = '0';
	$Skill1 = 'None';
	$Skill2 = 'None';
	$Skill3 = 'None';
	$Skill4 = 'None';
	$Skill5 = 'None';
	$Skill6 = 'None';

	$BackTypeBack = 'Player';

	$Traits = '';
	$Keywords = '';
	$Rules = '';
	$Flavor = '';
	$Victory = '';

	$TraitsSpacing = '0';
	$KeywordsSpacing = '0';
	$RulesSpacing = '0';
	$FlavorSpacing = '0';

	$Artist = '';
	$Copyright = '';

	$TemplateReplacement = '';
	$TemplateReplacementBack = '';
}

function createInterface( diy, editor ) {
	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	var bindings = new Bindings( editor, diy );

	var TitlePanel = layoutTitle( diy, bindings, false, [0], FACE_FRONT );
	var StatPanel = layoutSkillStats( bindings, FACE_FRONT );
	StatPanel.setTitle( @AHLCG-BasicData + ': ' + @AHLCG-Front );
	var BackStatPanel = layoutBackTypeStats( diy, bindings, FACE_BACK );
	BackStatPanel.setTitle( @AHLCG-BasicData + ': ' + @AHLCG-Back );
	var CopyrightPanel = layoutCopyright( bindings, false, [0], FACE_FRONT );

	var StatisticsTab = new Grid();
	StatisticsTab.editorTabScrolling = true;
	StatisticsTab.place(TitlePanel, 'wrap, pushx, growx', StatPanel, 'wrap, pushx, growx', BackStatPanel, 'wrap, pushx, growx', CopyrightPanel, 'wrap, pushx, growx' );
	StatisticsTab.addToEditor( editor , @AHLCG-General );

	var TextTab = layoutText( bindings, [ 'Traits', 'Keywords', 'Rules', 'Flavor', 'Victory' ], '', FACE_FRONT );
	TextTab.editorTabScrolling = true;
	TextTab.addToEditor( editor, @AHLCG-Rules );

	PortraitTab = layoutPortraits( diy, bindings, 'Portrait', null, true, false, false );
	PortraitTab.addToEditor(editor, @AHLCG-Portraits);

	var CollectionImagePanel = new portraitPanel( diy, getPortraitIndex( 'Collection' ), @AHLCG-CustomCollection );
	var CollectionPanel = layoutCollection( bindings, CollectionImagePanel, false, false, [0], FACE_FRONT );

	var CollectionTab = new Grid();
	CollectionTab.editorTabScrolling = true;
	CollectionTab.place( CollectionPanel, 'wrap, pushx, growx', CollectionImagePanel, 'wrap, pushx, growx' );
	CollectionTab.addToEditor(editor, @AHLCG-Collection);

	bindings.bind();
}

function createFrontPainter( diy, sheet ) {
	Label_box  = markupBox(sheet);
	Label_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Label-style'), null);
	Label_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Label-alignment'));

	Name_box = markupBox(sheet);
	Name_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Name-style'), null);
	Name_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Name-alignment'));

	Subtype_box = markupBox(sheet);
	Subtype_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Subtype-style'), null);
	Subtype_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Subtype-alignment'));

	Body_box = markupBox(sheet);
	Body_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Body-style'), null);
	Body_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Body-alignment'));
	Body_box.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') );
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
}

function createBackPainter( diy, sheet ) {
}

function paintFront( g, diy, sheet ) {
	clearImage( g, sheet );

	PortraitList[getPortraitIndex( 'Portrait' )].paint( g, sheet.getRenderTarget() );

	drawTemplate( g, sheet, $CardClass );
	drawLabel( g, diy, sheet, Label_box, #AHLCG-Label-Skill );
	drawName( g, diy, sheet, Name_box );

	if ($CardClass == 'Weakness' ) {
		drawSubtype( g, diy, sheet, Subtype_box, #AHLCG-Label-Weakness );
	}
	else if ($CardClass == 'BasicWeakness' ) {
		drawSubtype( g, diy, sheet, Subtype_box, #AHLCG-Label-BasicWeakness );

		drawOverlay( g, diy, sheet, 'BasicWeaknessSkill' );
		drawBasicWeaknessIcon( g, diy, sheet );
	}
	else {
		drawLevel( g, diy, sheet, $CardClass );
	}

	drawSkillIcons( g, diy, sheet, $CardClass );

	var regionName = 'Body';
	if ( $CardClass == 'Weakness' || $CardClass == 'BasicWeakness') regionName = 'WeaknessBody';
	drawBodyWithRegionName( g, diy, sheet, Body_box, new Array( 'Traits', 'Keywords', 'Rules', 'Flavor', 'Victory' ), regionName );

//	drawCollectorInfo( g, diy, sheet, true, false, false, false, true );
	drawCollectorInfo( g, diy, sheet, Collection_box, false, true, null, false, Copyright_box, Artist_box );
}

function paintBack( g, diy, sheet ) {
	clearImage( g, sheet );

	drawBackTemplate( g, sheet );
}

function onClear() {
	setDefaults();
}
/*
function createTextShape( textBox, textRegion ) {
	var x = textRegion.x;
	var y = textRegion.y;
	var w = textRegion.width;
	var h = textRegion.height;

	var path = new java.awt.geom.Path2D.Double();

	var xPathPoints = new Array( 0.0, 0.015 );
	var yPathPoints = new Array( 0.0, 1.000 );

	var xControlPoints = new Array( 0.053, 0.088 );
	var yControlPoints = new Array( 0.307, 0.600 );

	var numPoints = xPathPoints.length;

	path.moveTo( x + w * xPathPoints[0], y + h * yPathPoints[0] );

	for (let i = 1; i < numPoints; i++) {
		path.curveTo( x + w * xControlPoints[i*2 - 2], y + h * yControlPoints[i*2 - 2],
					  x + w * xControlPoints[i*2 - 1], y + h * yControlPoints[i*2 - 1],
					  x + w * xPathPoints[i], y + h * yPathPoints[i]
		);
	}

	path.lineTo( x + w * (1 + xPathPoints[numPoints-1]), y + h * yPathPoints[numPoints-1] );

	for (let i = numPoints-2; i >= 0; i--) {
		path.curveTo( x + w * (1.0 + xControlPoints[i*2 + 1]), y + h * yControlPoints[i*2 + 1],
					  x + w * (1.0 + xControlPoints[i*2]), y + h * yControlPoints[i*2],
					  x + w * (1.0 + xPathPoints[i]), y + h * yPathPoints[i]
		);
	}

	path.lineTo( x + w * xPathPoints[0], y + h * yPathPoints[0] );

	textBox.pageShape = PageShape.GeometricShape( path, textRegion );
}
*/
function setTextShape( box, region ) {
	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	box.pageShape = AHLCGObject.getSkillTextShape( region );
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
	else {
		if ( diy.version < 16 ) {
			diy.settings.reset('BackStatBack');			// there was a typo in setDefaults (BackStatBack)... oops
		}
		if ( diy.version < 17 ) {
			if ( $BackTypeundefined ) {	// fix for bug causing undefined binding suffix
				$BackTypeBack = $BackTypeundefined;
				diy.settings.reset('BackTypeundefined');
			}

			if ( $BackTypeBack == null ) $BackTypeBack = 'Player';	// some cards created during testing might have both as null
		}
	}

	if ( diy.version < 13 ) {
		$Skill6 = 'None';
	}
	if ( diy.version < 15 ) {
		$TemplateReplacement = '';
		$TemplateReplacementBack = '';
	}
	if ( diy.version < 16 ) {
		diy.faceStyle = FaceStyle.TWO_FACES;	// change was in v15, but I forgot to add this
	}

	updateCollection();

	diy.setCornerRadius(8);
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
