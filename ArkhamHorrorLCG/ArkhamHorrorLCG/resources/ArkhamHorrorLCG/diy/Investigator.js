useLibrary( 'diy' );
useLibrary( 'ui' );
useLibrary( 'markup' );
useLibrary( 'imageutils' );
useLibrary( 'fontutils' );

importClass( arkham.component.DefaultPortrait );

const CardTypes = [ 'Investigator', 'InvestigatorBack' ];
const BindingSuffixes = [ '', 'Back' ];
const PortraitTypeList = [ 'TransparentPortrait-Both', 'Portrait-Back', 'Collection-Front' ];

function create( diy ) {
	diy.frontTemplateKey = getExpandedKey( FACE_FRONT, 'Default', '-template' );	// not used, set card size
	diy.backTemplateKey = getExpandedKey( FACE_BACK, 'Default', '-template' );

	diy.faceStyle = FaceStyle.TWO_FACES;

	diy.name = '';

	setDefaults();
	createPortraits( diy, PortraitTypeList );
	setDefaultCollection();

	diy.setCornerRadius(8);
	diy.version = 15;
}

function setDefaults() {
	$Unique = '1';
	$Subtitle = '';
	$CardClass = 'Guardian';
	$Willpower = '3';
	$Intellect = '3';
	$Combat = '3';
	$Agility = '3';
	$Stamina = '7';
	$Sanity = '7';

	$Traits = '';
	$Keywords = '';
	$Rules = '';
	$Flavor = '';

	$TraitsSpacing = '0';
	$KeywordsSpacing = '0';
	$RulesSpacing = '0';

	$Text1NameBack = 'Deck Size';
	$Text1Back = '30.';
	$Text1BackSpacing = '0';
	$Text2NameBack = 'Secondary Class Choice';
	$Text2Back = '';
	$Text2BackSpacing = '0';
	$Text3NameBack = 'Deckbuilding Options';
	$Text3Back = '';
	$Text3BackSpacing = '0';
	$Text4NameBack = 'Deckbuilding Requirements</hdr> (do not count toward deck size)<hdr>';
	$Text4Back = '';
	$Text4BackSpacing = '0';
	$Text5NameBack = 'Deckbuilding Restrictions';
	$Text5Back = '';
	$Text5BackSpacing = '0';
	$Text6NameBack = 'Additional Requirements';
	$Text6Back = '';
	$Text6BackSpacing = '0';
	$Text7NameBack = 'Additional Restrictions';
	$Text7Back = '';
	$Text7BackSpacing = '0';
	$Text8NameBack = '';
	$Text8Back = '';

	$InvStoryBack = '';
/*
	$DeckSizeBack = '30';
	$SecondaryClassBack = '';
	$DeckOptionsBack = '';
	$DeckRequirementsBack = '';
	$DeckRestrictionsBack = '';
	$AdditionalReqirementsBack = '';
	$InvStoryBack = '';

	$DeckSizeBackSpacing = '0';
	$SecondaryClassBackSpacing = '0';
	$DeckOptionsBackSpacing = '0';
	$DeckRequirementsBackSpacing = '0';
	$DeckRestrictionsBackSpacing = '0';
	$AdditionalRequirementsBackSpacing = '0';
*/
	$Artist = '';
	$Copyright = '';

	$PortraitShare = '1';

	$TemplateReplacement = '';
	$TemplateReplacementBack = '';
}

function createInterface( diy, editor ) {
	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	var bindings = new Bindings( editor, diy );

	var TitlePanel = layoutTitleUnique( diy, bindings, true, [0, 1], FACE_FRONT );
	var StatPanel = layoutInvestigatorStats( diy, bindings, FACE_FRONT );
	var CopyrightPanel = layoutCopyright( bindings, false, [0], FACE_FRONT );

	var StatisticsTab = new Grid();
	StatisticsTab.editorTabScrolling = true;
	StatisticsTab.place(TitlePanel, 'wrap, pushx, growx', StatPanel, 'wrap, pushx, growx', CopyrightPanel, 'wrap, pushx, growx' );
	StatisticsTab.addToEditor( editor , @AHLCG-General );

	var TextTab = layoutText( bindings, [ 'Traits', 'Keywords', 'Rules', 'Flavor' ], '', FACE_FRONT );
	TextTab.editorTabScrolling = true;
	TextTab.addToEditor( editor, @AHLCG-Rules + ': ' + @AHLCG-Front );

	var BackTextArray = layoutInvestigatorTextBack( diy, bindings, FACE_BACK );
	var BackTextTab = new Grid();
	BackTextTab.editorTabScrolling = true;
	BackTextTab.place(BackTextArray[0], 'wrap, pushx, growx', BackTextArray[1], 'wrap, pushx, growx' );
	BackTextTab.addToEditor( editor, @AHLCG-Rules + ': ' + @AHLCG-Back );

	PortraitTab = layoutPortraits( diy, bindings, 'TransparentPortrait', 'Portrait', true, false, false );
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
	Name_box = markupBox(sheet);
	Name_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Name-style'), null);
	Name_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Name-alignment'));

	initBodyTags( diy, Name_box );

	Subtitle_box = markupBox(sheet);
	Subtitle_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Subtitle-style'), null);
	Subtitle_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Subtitle-alignment'));

	Skill_box_array = [];
	for ( let i = 0; i < 4; i++ ) {
		Skill_box_array[i] = markupBox(sheet);
		Skill_box_array[i].defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Skill-style'), null);
		Skill_box_array[i].alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Skill-alignment'));
	}

	Body_box = markupBox(sheet);
	Body_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Body-style'), null);
	Body_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Body-alignment'));

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
	BackName_box = markupBox(sheet);
	BackName_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Name-style'), null);
	BackName_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Name-alignment'));

	initBodyTags( diy, BackName_box );

	BackSubtitle_box = markupBox(sheet);
	BackSubtitle_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Subtitle-style'), null);
	BackSubtitle_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Subtitle-alignment'));

	BackBody_box = markupBox(sheet);
	BackBody_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_BACK, 'Body-style'), null);
	BackBody_box.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_BACK, 'Body-alignment'));
//	createBackTextShape( BackBody_box, diy.settings.getRegion( getExpandedKey( FACE_BACK, 'Body-region') ), $CardClass );
	setBackTextShape( BackBody_box, diy.settings.getRegion( getExpandedKey( FACE_BACK, 'Body-region') ), $CardClass );

	initBodyTags( diy, BackBody_box );
}

function paintFront( g, diy, sheet ) {
	clearImage( g, sheet );

	drawTemplate( g, sheet, $CardClass );

	drawFadedPortrait( g, diy, sheet, 'TransparentPortrait', 'Investigator' );

	drawName( g, diy, sheet, Name_box );

	if ( $Subtitle.length > 0 ) drawSubtitle( g, diy, sheet, Subtitle_box, $CardClass, false );

	drawSkills( g, diy, sheet, Skill_box_array, [ 'Willpower', 'Intellect', 'Combat', 'Agility' ] );

	drawStamina( g, diy, sheet );
	drawSanity( g, diy, sheet );

	drawBody( g, diy, sheet, Body_box, new Array( 'Traits', 'Keywords', 'Rules', 'Flavor' ) );

//	drawCollectorInfo( g, diy, sheet, true, false, false, false, true );
	drawCollectorInfo( g, diy, sheet, Collection_box, false, true, null, false, Copyright_box, Artist_box );
}

function paintBack( g, diy, sheet ) {
	clearImage( g, sheet );

	PortraitList[getPortraitIndex( 'Portrait' )].paint( g, sheet.getRenderTarget() );

	drawTemplate( g, sheet, $CardClass );

	drawName( g, diy, sheet, BackName_box, $CardClass.indexOf('Parallel') > 0 );

	if ( $Subtitle.length > 0 ) drawSubtitle( g, diy, sheet, BackSubtitle_box, $CardClass, false );

//	drawBody( g, diy, sheet, BackBody_box, new Array( 'DeckSize', 'SecondaryClass', 'DeckOptions', 'DeckRequirements', 'DeckRestrictions', 'AdditionalRequirements', 'InvStory' ) );
	drawInvBackBody( g, diy, sheet, BackBody_box, new Array( 'Text1', 'Text2', 'Text3', 'Text4', 'Text5', 'Text6', 'Text7', 'Text8', 'InvStory' ) );
}

function onClear() {
	setDefaults();
}
/*
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
		case 'Neutral':
			pointArray[0] = new Array( 0.400, 0.357, 0.010, 0.010, 1.0, 1.0 );
			pointArray[1] = new Array( 0.000, 0.468, 0.468, 1.000, 1.0, 0.0 );
			break;
	}

	return pointArray;
}

function createBackTextShape( textBox, textRegion, className ) {
	var x = textRegion.x;
	var y = textRegion.y;
	var w = textRegion.width;
	var h = textRegion.height;

	var pointArrays = getPathPointArrays( className );

	var xPathPoints = pointArrays[0];
	var yPathPoints = pointArrays[1];

	var path = new java.awt.geom.Path2D.Double();

	var numPoints = xPathPoints.length;

	path.moveTo( x + w * xPathPoints[0], y + h * yPathPoints[0] );

	for (let i = 0; i < numPoints; i++) {
		path.lineTo( x + w * xPathPoints[i], y + h * yPathPoints[i] );
	}

	path.lineTo( x + w * xPathPoints[0], y + h * yPathPoints[0] );

	textBox.pageShape = PageShape.GeometricShape( path, textRegion );
}
*/
function setBackTextShape( box, region, className ) {
	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	box.pageShape = AHLCGObject.getInvestigatorBackTextShape( region, className );
}

// These can be used to perform special processing during open/save.
// For example, you can seamlessly upgrade from a previous version
// of the script.
function onRead(diy, oos) {
	readPortraits( diy, oos, PortraitTypeList, true );

	if ( diy.version < 2 ) {
		$DeckRestrictionsBack = '';
		$DeckRestrictionsBackSpacing = '0';
	}
	if ( diy.version < 4 ) {
		$AdditionalRequirementsBack = '';
		$AdditionalRequirementsBackSpacing = '0';
	}
	if ( diy.version < 10 ) {
		$Unique = '1';
	}
	if ( diy.version < 11 ) {
		$SecondaryClassBack = '';
		$SecondaryClassBackSpacing = '0';
	}
	if ( diy.version < 12 ) {
		$Text1NameBack = 'Deck Size';
		$Text2NameBack = 'Secondary Class Choice';
		$Text3NameBack = 'Deckbuilding Options';
		$Text4NameBack = 'Deckbuilding Requirements</hdr> (do not count toward deck size)<hdr>';
		$Text5NameBack = 'Deckbuilding Restrictions';
		$Text6NameBack = 'Additional Requirements';
		$Text7NameBack = 'Additional Restrictions';
		$Text8NameBack = '';

		$Text1Back = $DeckSizeBack;
		$Text2Back = $SecondaryClassBack;
		$Text3Back = $DeckOptionsBack;
		$Text4Back = $DeckRequirementsBack;
		$Text5Back = $DeckRestrictionsBack;
		$Text6Back = $AdditionalReqirementsBack;
		$Text7Back = '';
		$Text8Back = '';

		// this may just be needed because of corrupt .eon files, but it can't hurt
		if ( $Text1Back == null ) $Text1Back = '';
		if ( $Text2Back == null ) $Text2Back = '';
		if ( $Text3Back == null ) $Text3Back = '';
		if ( $Text4Back == null ) $Text4Back = '';
		if ( $Text5Back == null ) $Text5Back = '';
		if ( $Text6Back == null ) $Text6Back = '';

		$Text1BackSpacing = $DeckSizeBackSpacing;
		$Text2BackSpacing = $SecondaryClassBackSpacing;
		$Text3BackSpacing = $DeckOptionsBackSpacing;
		$Text4BackSpacing = $DeckRequirementsBackSpacing;
		$Text5BackSpacing = $DeckRestrictionsBackSpacing;
		$Text6BackSpacing = $AdditionalRequirementsBackSpacing;
		$Text7BackSpacing = '0';

		if ( $Text1BackSpacing == null ) $Text1BackSpacing = '0';
		if ( $Text2BackSpacing == null ) $Text2BackSpacing = '0';
		if ( $Text3BackSpacing == null ) $Text3BackSpacing = '0';
		if ( $Text4BackSpacing == null ) $Text4BackSpacing = '0';
		if ( $Text5BackSpacing == null ) $Text5BackSpacing = '0';
		if ( $Text6BackSpacing == null ) $Text6BackSpacing = '0';

		diy.settings.reset('DeckSizeBack');
		diy.settings.reset('SecondaryClassBack');
		diy.settings.reset('DeckOptionsBack');
		diy.settings.reset('DeckRequirementsBack');
		diy.settings.reset('DeckRestrictionsBack');
		diy.settings.reset('AdditionalReuirementsBack');
		diy.settings.reset('DeckSizeBackSpacing');
		diy.settings.reset('SecondaryClassBackSpacing');
		diy.settings.reset('DeckOptionsBackSpacing');
		diy.settings.reset('DeckRequirementsBackSpacing');
		diy.settings.reset('DeckRestrictionsBackSpacing');
		diy.settings.reset('AdditionalRequirementsBackSpacing');
	}
	if ( diy.version < 15 ) {
		$TemplateReplacement = '';
		$TemplateReplacementBack = '';
	}

	updateCollection();

	diy.setCornerRadius(8);
	diy.version = 15;
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
