importClass( ca.cgjennings.graphics.ImageUtilities );
useLibrary('tints');

importClass( java.awt.RenderingHints );
importClass( java.awt.Rectangle );
importClass( java.awt.font.TextLayout );
importClass( java.awt.BasicStroke );
importClass( java.lang.System );
importClass( java.awt.Toolkit );

importClass( java.lang.reflect.Field );

function drawTemplate( g, sheet, className ) {
	var faceIndex = sheet.getSheetIndex();
	var image;

	if ( useReplacementTemplate( faceIndex )) {
		drawReplacementTemplate( g, sheet, faceIndex );
		return;
	}

	if ( className != null && className.length > 0 ) {
		// asset basic weaknesses should use the AssetStory template
		if ( CardTypes[faceIndex] == 'Asset' && className == 'BasicWeakness' )
			image = ImageUtils.get('ArkhamHorrorLCG/templates/AHLCG-AssetStory' + '-' + getClassInitial( className ) + '.jp2');
		else
			image = ImageUtils.get('ArkhamHorrorLCG/templates/AHLCG-' + CardTypes[faceIndex] + '-' + getClassInitial( className ) + '.jp2');
	}
	else if ( CardTypes[faceIndex] == 'StoryChaos' || CardTypes[faceIndex] == 'ChaosStory' ) {
		image = ImageUtils.get('ArkhamHorrorLCG/templates/AHLCG-Chaos.jp2');
	}
	else if ( 'Concealed' ) {
		if ( $Template == 'Decoy' ) image = ImageUtils.get('ArkhamHorrorLCG/templates/AHLCG-' + CardTypes[faceIndex] + 'Decoy.jp2');
		else if ( $Template == 'NamedDecoy' ) image = ImageUtils.get('ArkhamHorrorLCG/templates/AHLCG-' + CardTypes[faceIndex] + 'NamedDecoy.jp2');
		else image = ImageUtils.get('ArkhamHorrorLCG/templates/AHLCG-' + CardTypes[faceIndex] + '.jp2');
	}
	else
	{
		image = ImageUtils.get('ArkhamHorrorLCG/templates/AHLCG-' + CardTypes[faceIndex] + '.jp2');
	}

	var w = image.getWidth();
	var h = image.getHeight();

	if ((CardTypes[faceIndex] == 'Act' || CardTypes[faceIndex] == 'Agenda') && $Orientation == 'Reversed' ) {
		sheet.paintImage( g, ImageUtils.mirror(image, true, false), new Region(0, 0, w, h) );
	}
	else {
		sheet.paintImage( g, image, new Region(0, 0, w, h) );
	}
}

function drawBackTemplate( g, sheet ) {
	var faceIndex = sheet.getSheetIndex();
	var image;

	if ( useReplacementTemplate( faceIndex )) {
		drawReplacementTemplate( g, sheet, faceIndex );
		return;
	}

	var templateSetting = getExpandedKey( faceIndex, 'Default-template');

	image = ImageUtils.get( $( templateSetting ) );

	var w = image.getWidth();
	var h = image.getHeight();

	sheet.paintImage( g, image, new Region(0, 0, w, h) );
}

function drawAssetTemplate( g, diy, sheet, className, className2, className3 ) {
	var faceIndex = sheet.getSheetIndex();

	if ( useReplacementTemplate( faceIndex )) {
		drawReplacementTemplate( g, sheet, faceIndex );
		return;
	}

	// normal
	if ( className == null || className.length == 0 || className2 == null && className3 == null ) {
		drawTemplate( g, sheet, className );
		return;
	}

	// don't draw dual class if the first class isn't a valid one or if the classes match
	var classes = getClassArray( className, className2, className3 );
	var classCount = classes.length;
	if ( classCount < 2 ) {
		drawTemplate( g, sheet, className );
		return;
	}

	// dual class
	var image = ImageUtils.get( 'ArkhamHorrorLCG/templates/AHLCG-' + CardTypes[faceIndex] + '-D.jp2' );

	var w = image.getWidth();
	var h = image.getHeight();

	sheet.paintImage( g, image, new Region(0, 0, w, h) );

	// draw class icons
	var classInitials = [ getClassInitial( className ), null, null ];

	if ( className2 == 'None' ) {
		classInitials[1] = getClassInitial( className3 );
	}
	else {
		classInitials[1] = getClassInitial( className2 );

		if ( className3 !== 'None' ) {
			classInitials[2] = getClassInitial( className3 );
		}
	}

	var startIndex = 3 - classCount;

	for (var i = 1; i <= classCount; i++) {
		var symbolImage = ImageUtils.get( 'ArkhamHorrorLCG/overlays/AHLCG-ClassSymbol-' + classInitials[i-1] + '.png' );
		var symbolRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'ClassSymbol' + (i+startIndex) + '-region') );
		sheet.paintImage( g, symbolImage, symbolRegion );
	}
}

function drawUltimatumTemplate( g, diy, sheet, ultimatum_type, subtitle) {
	var faceIndex = sheet.getSheetIndex();

	var ultimatum_subtype = subtitle.length == 0 ? 'Common' : 'Refraction';

	var image = ImageUtils.get( 'ArkhamHorrorLCG/templates/ultimatums/' + ultimatum_type + '-' + ultimatum_subtype + '.png' );

	var w = image.getWidth();
	var h = image.getHeight();

	sheet.paintImage( g, image, new Region(0, 0, w, h) );
}

function drawUltimatumSubtitle( g, diy, sheet, textBox, text ) {
	var faceIndex = sheet.getSheetIndex();
	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Subtitle-region') );

	textBox.markupText = text;
	textBox.drawAsSingleLine( g, region );
}

function drawUltimatumTraits( g, diy, sheet, textBox, text ) {
	var faceIndex = sheet.getSheetIndex();
	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Trait-region') );

	textBox.markupText = text;
	textBox.drawAsSingleLine( g, region );
}

function drawEventTemplate( g, diy, sheet, className, className2, className3 ) {
	var faceIndex = sheet.getSheetIndex();

	if ( useReplacementTemplate( faceIndex )) {
		drawReplacementTemplate( g, sheet, faceIndex );
		return;
	}

	var classOffsets = {
		'GK': [0, 0],
		'GR': [1, -1],
		'GM': [1, -3],
		'GV': [0, 2],
		'KG': [-2, -1],
		'KR': [-1, -1],
		'KM': [0, -3],
		'KV': [-2, 1],
		'RG': [0, 0],
		'RK': [0, 0],
		'RM': [2, -2],
		'RV': [-1, 2],
		'MG': [-1, 1],
		'MK': [-1, 1],
		'MR': [1, 1],
		'MV': [-1, 3],
		'VG': [2, -1],
		'VK': [1, -1],
		'VR': [2, -2],
		'VM': [3, -4
		]
	};

	// normal
	if ( className == null || className.length == 0 || className2 == null || className3 == null ) {
		drawTemplate( g, sheet, className );
		return;
	}

	// don't draw dual class if the first class isn't a valid one or if the classes match
	var classes = getClassArray( className, className2, className3 );
	var classCount = classes.length;

	if ( classCount < 2 ) {
		drawTemplate( g, sheet, className );
		return;
	}

	// dual class
	var image = ImageUtils.get( 'ArkhamHorrorLCG/templates/AHLCG-' + CardTypes[faceIndex] + '-D.jp2' );

	var w = image.getWidth();
	var h = image.getHeight();

	sheet.paintImage( g, image, new Region(0, 0, w, h) );

	// draw class icons
	var classInitials = [ getClassInitial( classes[0] ), getClassInitial( classes[1] )];
	var classString = classInitials[0] + classInitials[1];
	if ( classCount > 2 ) {
		classInitials.push( getClassInitial( classes[2] ));
		classString = classString + classInitials[2];
	}

	var startIndex = 0;

	for (var i = 1; i <= classCount; i++) {
		if ( i == 1 ) {
			let offsetString = classString.substring(0, 2);

			offset = classOffsets[offsetString][i-1];
			if ( classCount > 2 ) offset += classOffsets[offsetString][1];
		}
		else if ( i == 2 ) {
			offset = (classCount == 3) ? 0 : classOffsets[classString][1];
		}
		else if ( i == 3 ) {
			let offsetString = classString.substring(1, 3);

						offset = classOffsets[offsetString][0] + classOffsets[offsetString][1];
		}

		var symbolImage = ImageUtils.get( 'ArkhamHorrorLCG/overlays/AHLCG-ClassSymbol-' + classInitials[i-1] + '.png' );
		var symbolRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'ClassSymbol' + (classCount) + (i+startIndex) + '-region') );

		if (i == 1) symbolRegion.x -= offset;
		else symbolRegion.x += offset;

		sheet.paintImage( g, symbolImage, symbolRegion );
	}
}

function useReplacementTemplate( faceIndex ) {
	var string = 'TemplateReplacement' + (faceIndex == FACE_FRONT ? '' : 'Back');
	var templateReplacement = $( string );

	if ( templateReplacement && templateReplacement.length() > 0 ) {
		return true;
	}

	return false;
}

function drawReplacementTemplate(g, sheet, faceIndex ) {
	var string = 'TemplateReplacement' + (faceIndex == FACE_FRONT ? '' : 'Back');
	var templateReplacement = $( string );

	try {
		image = ImageUtils.read( templateReplacement );
		if (image) {
			sheet.paintImage( g, image, new Region(0, 0, sheet.getTemplateWidth(), sheet.getTemplateHeight()) );
			return true;
		}
	} catch ( ex ) {
		println('Error reading image file.');
	}
}

function drawGuideTemplate( diy, g, sheet, labelBox  ) {
	var faceIndex = sheet.getSheetIndex();
	var image = ImageUtils.get('ArkhamHorrorLCG/templates/AHLCG-' + CardTypes[faceIndex] + $PageType + '.jp2');

	var w = image.getWidth();
	var h = image.getHeight();

	if ( $PageType == 'Empty' && Number($Page) % 2 == 0 ) sheet.paintImage( g, ImageUtils.mirror( image, true, false ), new Region(0, 0, w, h) );
	else sheet.paintImage( g, image, new Region(0, 0, w, h) );

	if ( $PageType == 'Title' ) {
		// overlay header for supported languages
		var locale = getLocale();

		switch ( locale ) {
			case 'fr':
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Guide75Title-' + locale + '.png'), new Region(187, 51, 750, 188) );
				break;
			case 'it':
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Guide75Title-' + locale + '.png'), new Region(172, 147, 783, 90) );
				break;
			case 'de':
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Guide75Title-' + locale + '.png'), new Region(172, 147, 783, 94) );
				break;
		}

		var labelRegion = diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Label-region') );

		labelBox.markupText = #AHLCG-Label-CampaignGuide;
		labelBox.drawAsSingleLine( g, labelRegion );
	}
}

function drawGuideTemplateA4( diy, g, sheet, labelBox ) {
	var faceIndex = sheet.getSheetIndex();
	var image = ImageUtils.get('ArkhamHorrorLCG/templates/AHLCG-' + CardTypes[faceIndex] + $PageType + '.jp2');

	var w = image.getWidth();
	var h = image.getHeight();

	if ( $PageType == 'Empty' && Number($Page) % 2 == 0 ) sheet.paintImage( g, ImageUtils.mirror( image, true, false ), new Region(0, 0, w, h) );
	else sheet.paintImage( g, image, new Region(0, 0, w, h) );

	if ( $PageType == 'Title' ) {
		// overlay header for supported languages
		var locale = getLocale();

		switch ( locale ) {
			case 'fr':
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Guide75Title-' + locale + '.png'), new Region(206, 56, 827, 207) );
				break;
			case 'it':
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Guide75Title-' + locale + '.png'), new Region(189, 162, 865, 99) );
				break;
			case 'de':
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Guide75Title-' + locale + '.png'), new Region(190, 162, 863, 104) );
				break;
		}

		var labelRegion = diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Label-region') );

		labelBox.markupText = #AHLCG-Label-CampaignGuide;
		labelBox.drawAsSingleLine( g, labelRegion );
	}
}

function drawGuideTemplateLetter( diy, g, sheet, labelBox ) {
	var faceIndex = sheet.getSheetIndex();
	var image = ImageUtils.get('ArkhamHorrorLCG/templates/AHLCG-' + CardTypes[faceIndex] + $PageType + '.jp2');

	var w = image.getWidth();
	var h = image.getHeight();

	if ( $PageType == 'Empty' && Number($Page) % 2 == 0 ) sheet.paintImage( g, ImageUtils.mirror( image, true, false ), new Region(0, 0, w, h) );
	else sheet.paintImage( g, image, new Region(0, 0, w, h) );

	if ( $PageType == 'Title' ) {
		// overlay header for supported languages
		var locale = getLocale();

		switch ( locale ) {
			case 'fr':
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Guide75Title-' + locale + '.png'), new Region(223, 56, 827, 207) );
				break;
			case 'it':
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Guide75Title-' + locale + '.png'), new Region(206, 162, 865, 99) );
				break;
			case 'de':
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Guide75Title-' + locale + '.png'), new Region(207, 162, 863, 104) );
				break;
		}

		var labelRegion = diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Label-region') );

		labelBox.markupText = #AHLCG-Label-CampaignGuide;
		labelBox.drawAsSingleLine( g, labelRegion );
	}
}

function drawGuidePortraits( g, diy, sheet ) {
	var bodyRegion = diy.settings.getRegion( getExpandedKey( FACE_FRONT, 'Body-region') );

	for( let index = 0; index < PortraitList.length; index++ ) {
		var portrait = PortraitList[index];
		var image = portrait.getImage();
		var stencil = portrait.getClipStencil();

		if ( stencil != null ) {
			var invertStencil = createAlphaInvertedImage( stencil );

			var scale = portrait.getScale();
			var panX = portrait.getPanX();
			var panY = portrait.getPanY();

			var gs = invertStencil.getGraphics();
			gs.setComposite(AlphaComposite.SrcIn);
			gs.drawImage( image, stencil.getWidth()/2 - image.getWidth()*scale/2 + panX, stencil.getHeight()/2 - image.getHeight()*scale/2 + panY, image.getWidth()*scale, image.getHeight()*scale, null );

			gs.dispose();

			sheet.paintImage(g, invertStencil, bodyRegion );
		}
	}
}

function drawFadedPortrait( g, diy, sheet, portrait, mask ) {
	var image = PortraitList[getPortraitIndex( portrait )].getImage();
	var imagePanX = PortraitList[getPortraitIndex( portrait )].getPanX();
	var imagePanY = PortraitList[getPortraitIndex( portrait )].getPanY();
	var imageRotation = PortraitList[getPortraitIndex( portrait )].getRotation();
	var imageScale = PortraitList[getPortraitIndex( portrait )].getScale();

	var region = diy.settings.getRegion( getExpandedKey( FACE_FRONT, portrait + '-portrait-clip-region') );

	var s = imageScale;

	var imageScaled = ImageUtils.resize( image, image.width * s + 0.5, image.height * s + 0.5, true );

	// portrait center
	var cx = image.getWidth() / 2 - imagePanX;
	var cy = image.getHeight() / 2 - imagePanY;

	var sx = region.width / imageScale;
	var sy = region.height / imageScale;

	imageCropped = ImageUtils.crop( image, cx - sx/2, cy - sy/2, sx, sy );
	imageCropped = createStencilImage( imageCropped, mask );

	sheet.paintImage(g, imageCropped, region );
}

function drawSubtitleTemplate( g, sheet, className ) {
	var faceIndex = sheet.getSheetIndex();
	var image;

	if ( useReplacementTemplate( faceIndex )) {
		drawReplacementTemplate( g, sheet, faceIndex );
		return;
	}

	if (className != null && className.length > 0) {
		image = ImageUtils.get('ArkhamHorrorLCG/templates/AHLCG-' + CardTypes[faceIndex] + 'ST-' + getClassInitial( className ) + '.jp2');
	}
	else
	{
		image = ImageUtils.get('ArkhamHorrorLCG/templates/AHLCG-' + CardTypes[faceIndex] + 'ST.jp2');
	}

	var w = image.getWidth();
	var h = image.getHeight();

	sheet.paintImage( g, image, new Region(0, 0, w, h) );
}

function drawLocationEncounterOverlay( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();

	// don't draw this if a replacement template is being used
	var string = 'TemplateReplacement' + (faceIndex == FACE_FRONT ? '' : 'Back');
	var templateReplacement = $( string );

	if ( templateReplacement && templateReplacement.length > 0 ) return;

	var image = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-LocationEncounter.png');

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'EncounterOverlay-region' ) );

	sheet.paintImage( g, image, region );
}

function drawName( g, diy, sheet, nameBox ) {
	var faceIndex = sheet.getSheetIndex();
	var title = '';
	var unique = '';

	// can't make this work without creating a new box
	// otherwise, you have to edit the text for the color change to happen
	if ( CardTypes[faceIndex] == 'Investigator' || CardTypes[faceIndex] == 'InvestigatorBack') {
		if ( $CardClass != null && $CardClass.indexOf('Parallel') >= 0) {
			nameBox = markupBox(sheet);
			nameBox.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'ParallelName-style'), null);
			nameBox.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Name-alignment'));

			initBodyTags( diy, nameBox );
		}
	}

	unique = $( 'Unique' + BindingSuffixes[faceIndex] );
	if ( unique == null ) unique = $Unique;

	if (faceIndex == FACE_FRONT) title = String(diy.name);
	else {
		if ( $( 'Title' + BindingSuffixes[faceIndex] ))
			title = String( $( 'Title' + BindingSuffixes[faceIndex] ));
		else
			title = String(diy.name);
//		if ( title == null ) title = String(diy.name);

		// locations and keys are the only type that will copy the front title and unique symbol if back is left blank
		if ( title == '' && (CardTypes[faceIndex] == 'LocationBack' || CardTypes[faceIndex] == 'KeyBack') ) {
			title = String(diy.name);
			unique = $Unique;
		}
	}

	if ( title.length > 0) {
		if ( unique == '1' ) {
			title = '<uni>' + title;
		}

		var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Name-region') );

		if (CardTypes[faceIndex] == 'Ultimatum' && $Subtitle.length > 0) {
			region = diy.settings.getRegion( getExpandedKey( faceIndex, 'NameWithSubtitle-region') );
		}

		region.y += parseInt(Eons.namedObjects.AHLCGObject.titleFontOffset);
		if ( CardTypes[faceIndex] == 'Event' && $CardClass == 'Neutral' ) region.y -= 2;
		if ( CardTypes[faceIndex] == 'Event' && ( $CardClass == 'Weakness' || $CardClass == 'BasicWeakness' )) region.y -= 3;
		if ( CardTypes[faceIndex] == 'Skill' && ( $CardClass == 'Weakness' || $CardClass == 'BasicWeakness' )) region.y -= 1;
		if ( $Orientation == 'Reversed' ) region = reverseRegion( region );

		if ( CardTypes[faceIndex] == 'Asset' ) {
			let class1 = $CardClass;
			let class2 = $CardClass2;
			let class3 = $CardClass3;

			let classCount = getClassCount( class1, class2, class3 );

			// if dual, we should shrink the text box on both sides, to keep it centered,
			// but if the name is too long, we can extend the left side back out
			if ( classCount >= 2 ) {
				// using measure() is drawing an offset title for some reason, so we create a copy to get the size
				let testBox = markupBox(sheet);
				testBox.defaultStyle = diy.settings.getTextStyle(getExpandedKey( FACE_FRONT, 'Name-style'), null);
				testBox.alignment = diy.settings.getTextAlignment(getExpandedKey( FACE_FRONT, 'Name-alignment'));
//				testBox.markupText = nameBox.markupText;
				testBox.markupText = title;

				region.y -= 1;
				region.x += 30;
				region.width -= 55;

				if ( classCount > 2 ) region.width -= 45;	// don't move the x value here though, it stays offcenter

				let height = testBox.measure( g, region );

				if ( height < 22.0 || ( height > 25.0 && title.length > 20 ) ) {
					region.x -= 30;
					region.width += 30;
				}
			}
		}
		else if ( CardTypes[faceIndex] == 'Guide75' ) title = title.toUpperCase();
		else if ( CardTypes[faceIndex] == 'GuideA4' ) title = title.toUpperCase();
		else if ( CardTypes[faceIndex] == 'GuideLetter' ) title = title.toUpperCase();

		nameBox.markupText = "Size";
		var lineHeight = nameBox.measure( g, region );
		lineHeight = 20.0;

		var lines = title.split('\n');

		if ( !lines ) return;

		var width = 0;
		for ( let i = 0; i < lines.length; i++ ) {
			nameBox.markupText = lines[i];
			width = nameBox.drawAsSingleLine( g, region );	// return the width of the last line (what we want!)

			region.y += lineHeight * 0.8;
			region.height -= lineHeight * 0.8;
		}
	}
}

//function drawActAgendaName( g, diy, sheet, nameBox ) {
function draw2LineName( g, diy, sheet, nameBox ) {
	var faceIndex = sheet.getSheetIndex();
	var title = '';
	var unique = '';

	if (faceIndex == FACE_FRONT) title = String(diy.name);
	else {
		title = String($( 'Title' + BindingSuffixes[faceIndex] ));
		if ( title == null ) title = String(diy.name);

		// locations are the only type that will copy the front title if back is left blank
		if ( title == '' && CardTypes[faceIndex] == 'LocationBack' ) title = String(diy.name);
	}

	if ( CardTypes[faceIndex] == 'Concealed' && $Template == 'NamedDecoy' ) {
		nameBox = markupBox(sheet);
		nameBox.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'DecoyName-style'), null);
		nameBox.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'DecoyName-alignment'));
	}

	// If I don't do this, formatting changes from Story/Chaos don't happen immediately
	nameBox.markupText = '';

	if ( title.length > 0) {
		unique = $( 'Unique' + BindingSuffixes[faceIndex] );

		if ( unique == '1' ) {
			nameBox.markupText = '<uni>' + title;
		}
		else {
			nameBox.markupText = title;
		}

		var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Name-region') );
		if ( CardTypes[faceIndex] == 'Concealed' && $Template == 'NamedDecoy' ) region = diy.settings.getRegion( 'AHLCG-Concealed-DecoyName-region' );

		region.y += parseInt(Eons.namedObjects.AHLCGObject.titleFontOffset);
		if ( $Orientation == 'Reversed' ) region = reverseRegion( region );

		// new system - align tline 1 to top, line 2 to bottom / single line should be centered

//		nameBox.markupText = "Size";
//		var lineHeight = Math.ceil( nameBox.measure( g, region ) * 1.8 );
//		var lineHeight = 20.0;

		var lines = title.split('\n');

//		if (lines.length > 1) region.y -= 10;
		if ( lines.length > 1 ) {
			nameBox.markupText = lines[0];
			nameBox.alignment = LAYOUT_TOP | LAYOUT_CENTER;
			nameBox.drawAsSingleLine( g, region );

			if ( CardTypes[faceIndex] == 'Concealed' && $Template == 'NamedDecoy' && lines[1][0] == '(' ) {
				nameBox.markupText = '<size 85%>' + lines[1];
				region.height -= 5;
			}
			else nameBox.markupText = lines[1];
			nameBox.alignment = LAYOUT_BOTTOM | LAYOUT_CENTER;
			nameBox.drawAsSingleLine( g, region );
		}
		else {
			if ( CardTypes[faceIndex] == 'Concealed' ) {
				if ( $Template == 'NamedDecoy' ) region.y -= 4;
				else region.y -= 9;
			}
			else region.y += 1;

			nameBox.markupText = lines[0];
			nameBox.alignment = LAYOUT_MIDDLE | LAYOUT_CENTER;
			nameBox.drawAsSingleLine( g, region );
		}
	}
}

function drawActAgendaBackName( g, diy, sheet ) {
	var userSettings = Settings.getUser();
	var rotate = userSettings.getBoolean( 'AHLCG-DefaultRotateTitle', true );

	var faceIndex = sheet.getSheetIndex();
	var title = '';

	if (faceIndex == FACE_FRONT) title = diy.name;
	else {
		title = $( 'Title' + BindingSuffixes[faceIndex] );
		if (title == null) title = diy.name;
	}

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Name-region' ) );

	if (rotate) {
		// from LotR
		BackName_box.markupText = title;
		var oldTransform = g.getTransform();
		g.rotate(-Math.PI/2,0,0);

		var newRegion = region.clone();
		var x = region.getX();
		var y = region.getY();
		var w = region.getWidth();
		var h = region.getHeight();
		newRegion.setRect( -h-y, x, h, w );

		BackName_box.draw( g, newRegion );
		g.setTransform( oldTransform );
	}
	else if ( title.length > 0 ) {
		var text = '';
		text = title.split('').join('<br>');

		BackName_box.markupText = text;
		BackName_box.draw( g, region );
	}
}

function drawChaosName( g, diy, sheet, nameBox ) {
	var faceIndex = sheet.getSheetIndex();
	var AHLCGObject = Eons.namedObjects.AHLCGObject;
	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Name-region') );

	region.y += parseInt(Eons.namedObjects.AHLCGObject.titleFontOffset);

	nameBox.markupText = "Size";
	var lineHeight = nameBox.measure( g, region );

	var lines;

	if (faceIndex == FACE_FRONT) {
		if ( diy.name ) lines = diy.name.split('\n');
	}
	else {
		if ( $( 'Title' + BindingSuffixes[faceIndex] ) ) {
			lines = $( 'Title' + BindingSuffixes[faceIndex] ).split('\n');
		}
		else {
			lines = diy.name.split('\n');
		}
	}

	// assume 1 line
	if ( !lines ) return region.y + (lineHeight * 0.8) + 12;

	var width = 0;
	for ( let i = 0; i < lines.length; i++ ) {
		nameBox.markupText = lines[i];
		width = nameBox.drawAsSingleLine( g, region );	// return the width of the last line (what we want!)

		region.y += lineHeight * 0.8;
		region.height -= lineHeight * 0.8;
	}

	// I hope this calculation works everywhere
//	sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/images/HorizLines.png'),
//		new Region( region.x + (region.width - width) / 2, region.y + 1, width + 2, 6) );
	g.setPaint( new Color( 0.0, 0.0, 0.0 ) );
	g.setStroke( new BasicStroke( 1.0 ) );
	g.drawLine(region.x + (region.width - width) / 2, region.y + 2, region.x + (region.width + width) / 2 + 2, region.y + 2);
	g.drawLine(region.x + (region.width - width) / 2, region.y + 6, region.x + (region.width + width) / 2 + 2, region.y + 6);

	return region.y + 12;
}

function drawSubtitle( g, diy, sheet, subtitleBox, className, drawBox ) {
	var faceIndex = sheet.getSheetIndex();

	// not currently supported
//	if ( className == 'Dual' ) return;

	// can't make this work without creating a new box
	// otherwise, you have to edit the text for the color change to happen
	if ( className.indexOf('Parallel') >= 0) {
		subtitleBox = markupBox(sheet);
		subtitleBox.defaultStyle = diy.settings.getTextStyle(getExpandedKey(faceIndex, 'ParallelSubtitle-style'), null);
		subtitleBox.alignment = diy.settings.getTextAlignment(getExpandedKey(faceIndex, 'Subtitle-alignment'));
	}

	if ( drawBox ) {
		var image = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Subtitle-' + getClassInitial( className )  + '.png');

		var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Subtitle' + getClassInitial( className ) + '-region' ) );

		var iw = image.getWidth();
		var ih = image.getHeight();

		var x = region.x + (region.width - iw)/2;

		sheet.paintImage( g, image, new Region(x, region.y, iw, ih) );
	}

	var subtitle = $( 'Subtitle' + BindingSuffixes[faceIndex] );
	if (subtitle == null) subtitle = $Subtitle;

	// keys are the only type that will copy the front subtitle if back is left blank
	if ( subtitle == '' && CardTypes[faceIndex] == 'KeyBack' ) {
		subtitle = $Subtitle;
	}

	// keys are the only type that will copy the front subtitle if back is left blank
	if ( subtitle == '' && CardTypes[faceIndex] == 'KeyBack' ) subtitle = String($Subtitle);

	var textRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'SubtitleText' + getClassInitial( className ) + '-region' ) );
	textRegion.y += parseInt(Eons.namedObjects.AHLCGObject.subtitleFontOffset);
//	if ( Eons.namedObjects.AHLCGObject.bodyFamily == 'Times New Roman' ) textRegion.y -= 2;

	subtitleBox.markupText = subtitle;

//	subtitleBox.draw( g, textRegion );
	subtitleBox.drawAsSingleLine( g, textRegion );
}

function drawDifficulty( g, diy, sheet, textBox, text, y ) {
	var faceIndex = sheet.getSheetIndex();

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Difficulty-region') );
	region.y = y;
	region.y += parseInt(Eons.namedObjects.AHLCGObject.typeFontOffset);

//	if ( Eons.namedObjects.AHLCGObject.bodyFamily == 'Times New Roman' ) region.y -= 2;

	textBox.markupText = text;
	textBox.drawAsSingleLine( g, region );

	return y + 29;
}

function drawLabel( g, diy, sheet, textBox, text ) {
	var faceIndex = sheet.getSheetIndex();

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Label-region') );
	if ( CardTypes[faceIndex] === 'Asset' && $CardClass === 'Neutral' ) region.y -= 1;

	region.y += parseInt(Eons.namedObjects.AHLCGObject.typeFontOffset);
//	if ( Eons.namedObjects.AHLCGObject.bodyFamily == 'Times New Roman' ) region.y -= 2;
	if ( CardTypes[faceIndex] == 'Event' && Eons.namedObjects.AHLCGObject.bodyFamily == 'Times New Roman' ) region.y += 1;

	textBox.markupText = text.toUpperCase();
	textBox.drawAsSingleLine( g, region );
}

function drawScenarioResolutionHeader( g, diy, sheet, headerBox ) {
	var faceIndex = sheet.getSheetIndex();

	var headerRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'Header-region' ) );
	headerRegion.y += parseInt(Eons.namedObjects.AHLCGObject.victoryFontOffset);

	headerBox.markupText = #AHLCG-Scenario-Header1;

	var height = headerBox.measure( g, headerRegion );
	var width1 = headerBox.drawAsSingleLine( g, headerRegion ) + 4.0;

	headerRegion.y += height - 0.0;

	headerBox.markupText = '<size 80%>' + #AHLCG-Scenario-Header2 + '<size 125%>';

	height = headerBox.measure( g, headerRegion );
	var width2 = headerBox.drawAsSingleLine( g, headerRegion ) + 4.0;

	var headerWidth = Math.max( width1, width2 );

//	sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/images/HorizLines.png'),
//		new Region( headerRegion.x + (headerRegion.width - headerWidth)/ 2, headerRegion.y + height, headerWidth, 3) );
	g.setPaint( new Color( 0.0, 0.0, 0.0 ) );
	g.setStroke( new BasicStroke( 1.0 ) );
	g.drawLine(headerRegion.x + (headerRegion.width - headerWidth) / 2, headerRegion.y + height, headerRegion.x + (headerRegion.width + headerWidth) / 2, headerRegion.y + height);
	g.drawLine(headerRegion.x + (headerRegion.width - headerWidth) / 2, headerRegion.y + height + 4, headerRegion.x + (headerRegion.width + headerWidth) / 2, headerRegion.y + height + 4);
}

function drawBody( g, diy, sheet, bodyBox, partsArray ) {
	var faceIndex = sheet.getSheetIndex();
	var Text = '';

	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Body-region') );
	region.y += parseInt(Eons.namedObjects.AHLCGObject.bodyFontOffset);
	if ( $Orientation == 'Reversed' ) region = reverseRegion( region );
//	if ( AHLCGObject.bodyFamily == 'Times New Roman' ) region.y -= 2;

	// setting an action listener is hard because the box doesn't exist during layout, this is just easier...
	bodyBox.setReplacementForTag('fullnameb', $TitleBack );

	bodyBox.setLineTightness( $(getExpandedKey(faceIndex, 'Body', '-tightness') + '-tightness') * AHLCGObject.bodyFontTightness );
	bodyBox.setTextFitting( FIT_SCALE_TEXT );

	// if there is no trait text, add a little spacing
	var traitText = $( 'Traits' + BindingSuffixes[faceIndex] );

	// Acts/agendas created from CSV for translation project have $Trait = ''
	var ignoreTrait = ( CardTypes[faceIndex] == 'Act' || CardTypes[faceIndex] == 'Agenda' || CardTypes[faceIndex] == 'AgendaFrontPortrait' || CardTypes[faceIndex] == 'Ultimatum' );

	// null if it doesn't exist
	if ( !ignoreTrait && traitText == '' ) {
		Text = Text + '<image res://ArkhamHorrorLCG/images/empty1x1.png 1pt 6pt>';
	}

	for( let index = 0; index < partsArray.length; index++ ) {
		Text = addTextPart( faceIndex, Text, partsArray[index], diy );
		Text = addSpacing( faceIndex, Text, partsArray[index], diy );
	}

	bodyBox.markupText = Text;

	updateNameTags( bodyBox, diy );

	bodyBox.draw( g, region );
}

function drawInvBackBody( g, diy, sheet, bodyBox, partsArray ) {
	var faceIndex = sheet.getSheetIndex();
	var Text = '';

	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Body-region') );
	region.y += parseInt(Eons.namedObjects.AHLCGObject.bodyFontOffset);
	if ( $Orientation == 'Reversed' ) region = reverseRegion( region );
//	if ( AHLCGObject.bodyFamily == 'Times New Roman' ) region.y -= 2;

	bodyBox.setLineTightness( $(getExpandedKey(faceIndex, 'Body', '-tightness') + '-tightness') * AHLCGObject.bodyFontTightness );
	bodyBox.setTextFitting( FIT_SCALE_TEXT );

	// if there is no trait text, add a little spacing
	var traitText = $( 'Traits' + BindingSuffixes[faceIndex] );

	// null if it doesn't exist
	if ( traitText == '' ) {
		Text = Text + '<image res://ArkhamHorrorLCG/images/empty1x1.png 1pt 6pt>';
	}

	for( let index = 0; index < partsArray.length; index++ ) {
		Text = addTextPart( faceIndex, Text, partsArray[index], diy );
		Text = addSpacing( faceIndex, Text, partsArray[index], diy );
	}

	bodyBox.markupText = Text;

	updateNameTags( bodyBox, diy );
	bodyBox.draw( g, region );
}

function drawBodyWithRegionName( g, diy, sheet, bodyBox, partsArray, regionName ) {
	var faceIndex = sheet.getSheetIndex();
	var Text = '';

	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, regionName + '-region') );
	region.y += parseInt(Eons.namedObjects.AHLCGObject.bodyFontOffset);
//	if ( AHLCGObject.bodyFamily == 'Times New Roman' ) region.y -= 2;

	bodyBox.setLineTightness( $(getExpandedKey(faceIndex, 'Body', '-tightness') + '-tightness') * AHLCGObject.bodyFontTightness );
	bodyBox.setTextFitting( FIT_SCALE_TEXT );

	// if there is no trait text, add a little spacing
	var traitText = $( 'Traits' + BindingSuffixes[faceIndex] );

	// null if it doesn't exist
	if ( traitText == '' ) {
		Text = Text + '<image res://ArkhamHorrorLCG/images/empty1x1.png 1pt 6pt>';
	}

	for( let index = 0; index < partsArray.length; index++ ) {
		Text = addTextPart( faceIndex, Text, partsArray[index], diy );
		Text = addSpacing( faceIndex, Text, partsArray[index], diy );
	}

	bodyBox.markupText = Text;

	updateNameTags( bodyBox, diy );
	bodyBox.draw( g, region );
}

function drawIndentedStoryBody( g, diy, sheet, traitsBox, headerBox, storyBox, bodyBox ) {
	var faceIndex = sheet.getSheetIndex();
	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	var bodyAppend = '-region';
	var storyAppend = '-region';
	var tightnessAppend = '-tightness';

	// Chaos has two completely different setups, tokens or story -> BodyStory-region, StoryStory-region are for story layout
//	if ( CardTypes[faceIndex] == 'ChaosStory' || CardTypes[faceIndex] == 'ChaosStoryFull' ) {
//		bodyAppend = 'Story-region';
//		storyAppend = 'Story-region';
//		tightnessAppend = 'Story-tightness';
//	}

	var fullRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'Body' + bodyAppend ) );
	var traitsRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'Body' + bodyAppend ) );
	var headerRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'Body' + bodyAppend ) );
	var bodyRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'Body' + bodyAppend ) );
	var fullStoryRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'Story' + storyAppend ) );
	var storyRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'Story' + storyAppend ) );

	// if back and no TrackerBoxBack, use the front
	var trackerBox = null;
	var trackerHeight = 0;

	if ( $('TrackerBox' + BindingSuffixes[faceIndex]) ) {
		trackerBox = String( $('TrackerBox' + BindingSuffixes[faceIndex]) );
		trackerHeight = $('TrackerHeight' + BindingSuffixes[faceIndex]);
	}

	// if there is no tracker box interface for the back
	if ( !trackerBox == null) {
		trackerBox = String( $TrackerBox );
		trackerHeight = $TrackerHeight;
	}

	if ( trackerBox && trackerBox.length > 0 ) {
		var diff = 90 * trackerHeight / 100.0 + 10;	// +10: bottom of region starts below bottom of box, want it to end above top

		fullRegion.height -= diff;
		traitsRegion.height -= diff;
		headerRegion.height -= diff;
		bodyRegion.height -= diff;
		fullStoryRegion.height -= diff;
		storyRegion.height -= diff;
	}

	// setting an action listener is hard because the box doesn't exist during layout, this is just easier...
	bodyBox.setReplacementForTag('fullnameb', $TitleBack );

	// I hate this
	if ( CardTypes[faceIndex] == 'StoryChaos' ) {
		var title = faceIndex == FACE_FRONT ? diy.name : $TitleBack;
		var nlIndex = title.indexOf("\n");

		if (nlIndex > 0) {
			let offset = 24;

			fullRegion.y += offset;
			fullRegion.height -= offset;
			traitsRegion.y += offset;
			traitsRegion.height -= offset;
			headerRegion.y += offset;
			headerRegion.height -= offset;
			bodyRegion.y += offset;
			bodyRegion.height -= offset;
			fullStoryRegion.y += offset;
			fullStoryRegion.height -= offset;
			storyRegion.y += offset;
			storyRegion.height -= offset;
		}
	}

	var horizLineSpace1 = 8;
	var horizLineSpace2 = 8;
	var vertLineOffset1 = -1;
	var vertLineOffset2 = 4;

	if ( AHLCGObject.bodyFamily == 'Arno Pro' ) {
		horizLineSpace1 = 6;
		horizLineSpace2 = 10;
		vertLineOffset1 = -1;
		vertLineOffset2 = 4;
	}
	if ( AHLCGObject.bodyFamily == 'Times New Roman' ) {
		horizLineSpace1 = 8;
		horizLineSpace2 = 8;
		vertLineOffset1 = -4;
		vertLineOffset2 = 4;
/*
		fullRegion.y -= 2;
		headerRegion.y -= 2;
		bodyRegion.y -= 2;
		fullStoryRegion.y -= 2;
		storyRegion.y -= 2;

		horizLineSpace1 = 2;
		horizLineSpace2 = 14;
*/
	}

	var offset = parseInt(Eons.namedObjects.AHLCGObject.bodyFontOffset);

	fullRegion.y += offset;
	headerRegion.y += offset;
	bodyRegion.y += offset;
	fullStoryRegion.y += offset;
	storyRegion.y += offset;

//	if ( horizLineSpace1 < 8 ) horizLineSpace1 = 8;
//	if ( horizLineSpace2 < 8 ) horizLineSpace2 = 8;

	if ( traitsBox ) {
		traitsBox.setLineTightness( $(getExpandedKey(faceIndex, 'Header', tightnessAppend) + '-tightness') * AHLCGObject.bodyFontTightness );
//		traitsBox.setTextFitting( FIT_SCALE_TEXT );
		traitsBox.setTextFitting( FIT_NONE );
	}

	headerBox.setLineTightness( $(getExpandedKey(faceIndex, 'Header', tightnessAppend) + '-tightness') * AHLCGObject.bodyFontTightness );
//	headerBox.setTextFitting( FIT_SCALE_TEXT );
	headerBox.setTextFitting( FIT_NONE );
	storyBox.setLineTightness( $(getExpandedKey(faceIndex, 'Story', tightnessAppend) + '-tightness') * AHLCGObject.bodyFontTightness );
//	storyBox.setTextFitting( FIT_SCALE_TEXT );
	storyBox.setTextFitting( FIT_NONE );
	bodyBox.setLineTightness( $(getExpandedKey(faceIndex, 'Body', tightnessAppend) + '-tightness') * AHLCGObject.bodyFontTightness );
//	bodyBox.setTextFitting( FIT_SCALE_TEXT );
	bodyBox.setTextFitting( FIT_NONE );

//	var defaultSpacing = 8;

	if ( traitsBox ) {
		traitsBox.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Header-style'), null);
		var traitsDefaultSize = traitsBox.defaultStyle.get( SIZE );
	}

	headerBox.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Header-style'), null);
	storyBox.defaultStyle = diy.settings.getTextStyle('AHLCG-Story-Story-style', null);
	bodyBox.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'Body-style'), null);

	var bodyDefaultSize = bodyBox.defaultStyle.get( SIZE );
	var headerDefaultSize = headerBox.defaultStyle.get( SIZE );
	var storyDefaultSize = storyBox.defaultStyle.get( SIZE );

	var suffixArray = [ 'A', 'B', 'C' ];

	var traitsHeight = 0;
	var traitsSpacing = 0;
	var headerHeight = [ 0, 0, 0 ];
	var headerSpacing = [ 0, 0, 0 ];
	var storyHeight = [ 0, 0, 0 ];
	var storySpacing = [ 0, 0, 0 ];
	var bodyHeight = [ 0, 0, 0 ];
	var victoryHeight = 0;
	var victorySpacing = 0;
	var fullHeight = fullRegion.height;
	var totalHeight = 0;
	var traitsText = '';
	var headerText = [ '', '', ''];
	var storyText = [ '', '', '' ];
	var bodyText = [ '', '', '' ];
	var victoryText = '';

	var bodyTextSize = 100.0;
	var storyTextSize = 100.0;
	var headerTextSize = 100.0;
	var traitsTextSize = 100.0;
	var victoryTextSize = 100.0;

	if ( traitsBox ) {
		traitsSpacing = parseInt( $( 'TraitsA' + BindingSuffixes[faceIndex] + 'Spacing' ), 10 );
		traitsText = String( $( 'TraitsA' + BindingSuffixes[faceIndex] ));
	}

	victoryText = String($( 'Victory' + BindingSuffixes[faceIndex] ));
	victorySpacing = parseInt( $('Victory' + BindingSuffixes[faceIndex] + 'Spacing'), 10 );

	for ( let i = 0; i < 3; i++ ) {
		headerText[i] = String( $( 'Header' + suffixArray[i] + BindingSuffixes[faceIndex] ));
		headerSpacing[i] = headerText[i].length > 0 ? parseInt( $( 'Header' + suffixArray[i] + BindingSuffixes[faceIndex] + 'Spacing' ), 10 ) + 4 : 0;

		storyText[i] = String( $( 'AccentedStory' + suffixArray[i] + BindingSuffixes[faceIndex] ));
		storySpacing[i] = storyText[i].length > 0 ? parseInt( $( 'AccentedStory' + suffixArray[i] + BindingSuffixes[faceIndex] + 'Spacing' ), 10 ) + 4 : 0;

		bodyText[i] = '';
		bodyText[i] = addTextPart( faceIndex, bodyText[i], 'Rules' + suffixArray[i], diy );
		bodyText[i] = addSpacing( faceIndex, bodyText[i], 'Rules' + suffixArray[i], diy );
	}

	var scale = 1.0;
	var iterations = 0;

	do {
		totalHeight = 0;

		if ( traitsBox ) {
			let traitsStyle = traitsBox.getDefaultStyle();
			traitsStyle.add( SIZE, traitsDefaultSize * traitsTextSize / 100.0 );
			traitsBox.setDefaultStyle( traitsStyle );
			traitsBox.markupText = '';

			traitsBox.markupText = '<center><ts>' + traitsText + '</ts>';

			if ( traitsText.length > 0 ) {
				traitsHeight = traitsBox.measure( g, fullRegion );
				totalHeight += traitsHeight;
				totalHeight += traitsSpacing;
			}
		}

//		victoryText = String($( 'Victory' + BindingSuffixes[faceIndex] ));
		if ( victoryText.length > 0 ) {
			headerBox.markupText = '';	// we are reusing headerBox for each section - this is required to prevent oddness that I admit I don't understand
//			headerBox.markupText = $( 'Victory' + BindingSuffixes[faceIndex] + 'Text' );
			headerBox.markupText = victoryText;

			victoryHeight = headerBox.measure( g, fullRegion );
//			victorySpacing = parseInt( $('Victory' + BindingSuffixes[faceIndex] + 'Spacing'), 10 );

			totalHeight += victoryHeight;
			totalHeight += victorySpacing;
		}

		for ( let i = 0; i < 3; i++ ) {
//			headerText[i] = String( $( 'Header' + suffixArray[i] + BindingSuffixes[faceIndex] ));
//			headerSpacing[i] = headerText[i].length > 0 ? parseInt( $( 'Header' + suffixArray[i] + BindingSuffixes[faceIndex] + 'Spacing' ), 10 ) + 4 : 0;

//			storyText[i] = String( $( 'AccentedStory' + suffixArray[i] + BindingSuffixes[faceIndex] ));
//			storySpacing[i] = storyText[i].length > 0 ? parseInt( $( 'AccentedStory' + suffixArray[i] + BindingSuffixes[faceIndex] + 'Spacing' ), 10 ) + 4 : 0;
			let textExists = false;

			let headerStyle = headerBox.getDefaultStyle();
			headerStyle.add( SIZE, headerDefaultSize * headerTextSize / 100.0 );
			headerBox.setDefaultStyle( headerStyle );

			headerBox.markupText = '';	// we are reusing headerBox for each section - this is required to prevent oddness that I admit I don't understand
			headerBox.markupText = headerText[i];

			if (headerText[i].length > 0) {
				headerHeight[i] = headerBox.measure( g, fullRegion );
				totalHeight += headerHeight[i];
				totalHeight += headerSpacing[i];

				if ( i == 0 ) {
					totalHeight += 4;	// if there's a first header, it needs to be moved down a bit
				}

				textExists = true;
			}

			let storyStyle = storyBox.getDefaultStyle();
			storyStyle.add( SIZE, storyDefaultSize * storyTextSize / 100.0 );
			storyBox.setDefaultStyle( storyStyle );

			storyBox.markupText = '';	// we are reusing storyBox for each section - this is required to prevent oddness that I admit I don't understand
			storyBox.markupText = storyText[i];

			if (storyText[i].length > 0) {
				storyHeight[i] = storyBox.measure( g, fullStoryRegion );
				totalHeight += storyHeight[i];
				totalHeight += storySpacing[i];

				textExists = true;
			}

//			bodyText[i] = '';

//			bodyText[i] = addTextPart( faceIndex, bodyText[i], 'Rules' + suffixArray[i], diy );
//			bodyText[i] = addSpacing( faceIndex, bodyText[i], 'Rules' + suffixArray[i], diy );

			let bodyStyle = bodyBox.getDefaultStyle();
			bodyStyle.add( SIZE, bodyDefaultSize * bodyTextSize / 100.0 );
			bodyBox.setDefaultStyle( bodyStyle );

			bodyBox.markupText = '';	// we are reusing bodyBox for each section - this is required to prevent oddness that I admit I don't understand
			bodyBox.markupText = bodyText[i];

			updateNameTags( bodyBox, diy );

			if ((bodyText[i]).length > 0) {
				bodyHeight[i] = bodyBox.measure( g, fullRegion );
				totalHeight += bodyHeight[i];

				textExists = true;
			}

			if (textExists) {
				totalHeight += 16;	// for the rule and spacing
			}
		}

//?		totalHeight -= 28;	// don't need the final rule/spacing, tweaked to make Victory look better
		totalHeight -= 16;	// don'tneed the final rule/spacing

		iterations++;
//		var ratio = fullHeight / totalHeight;
//		if ( ratio > 1) scale = scale * (1 + (ratio - 1) / 2);
//		else scale = scale * (1 - (1 - ratio) / 2);	// ratio
		if ( totalHeight > fullHeight ) scale -= 0.04;
		bodyTextSize = scale * 100.0;
		storyTextSize = scale * 100.0;
		headerTextSize = scale * 100.0;
		traitsTextSize = scale * 100.0;
		victoryTextSize = scale * 100.0;
	} while ( totalHeight > fullHeight );

	var scaleModifier = $( 'ScaleModifier' + BindingSuffixes[faceIndex], 100 );
	if ( scaleModifier == null ) scaleModifier = $ScaleModifier;

	if (totalHeight > fullHeight) scale = scale * fullHeight / totalHeight;	// ratio

	// this is more or less a guess that works so far
	var textScale = scale * 0.98;

//	if (totalHeight > fullHeight) {
//		if ( trackerBox && trackerBox.length > 0 ) textScale = Math.sqrt(scale);
//		else textScale = Math.sqrt( scale ) * 0.93;	// I think this would be better if this weren't here, but to support old cards, I'm leaving it
//	}

	bodyTextSize = textScale * scaleModifier;
	storyTextSize = textScale * scaleModifier;
	headerTextSize = textScale * scaleModifier;
	traitsTextSize = textScale * scaleModifier;
	victoryTextSize = textScale * scaleModifier;

	if ( traitsBox && traitsText.length > 0 ) {
		let traitsStyle = traitsBox.getDefaultStyle();
		traitsStyle.add( SIZE, traitsDefaultSize * traitsTextSize / 100.0 );
		traitsBox.setDefaultStyle( traitsStyle );
		traitsBox.markupText = '';

		traitsRegion.height = Math.ceil( traitsHeight * scale );
//		traitsBox.markupText = '<center><ts><size ' + traitsTextSize + '%>' + traitsText + '</ts>';
		traitsBox.markupText = '<center><ts>' + traitsText + '</ts>';

		traitsHeight = traitsBox.measure( g, fullRegion );
		traitsRegion.height = Math.ceil( traitsHeight );
		traitsBox.draw( g, traitsRegion );

		headerRegion.y += traitsHeight + Math.ceil( traitsSpacing * scale );
	}

	for ( let i = 0; i < 3; i++ ) {
		if ( i == 0 ) {
			if ( headerText[i].length > 0 ) {
				headerRegion.y += 4*textScale; // if this is the first text after traits, it needs to be moved down a bit
			}
		}
		else {
			if ( headerHeight[i] > 0 || storyHeight[i] > 0 || bodyHeight[i] > 0) {
//				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/images/HRLine.png'),
//					new Region( headerRegion.x, headerRegion.y + ( horizLineSpace1 * scale * $ScaleModifier / 100.0 ), headerRegion.width, 7) );

				g.setPaint( new Color( 0.0, 0.0, 0.0 ) );
				g.setStroke( new BasicStroke( 1.0 ) );

				headerRegion.y += Math.ceil( horizLineSpace1 * scale * $ScaleModifier / 100.0);
//				g.drawLine(headerRegion.x, headerRegion.y + ( horizLineSpace1 * scale + $ScaleModifier / 100.0 ), headerRegion.x + headerRegion.width, headerRegion.y + ( horizLineSpace1 * scale + $ScaleModifier / 100.0 ));
				g.drawLine(headerRegion.x, headerRegion.y, headerRegion.x + headerRegion.width, headerRegion.y);

				headerRegion.y += Math.ceil( horizLineSpace2 * scale * $ScaleModifier / 100.0);
			}
		}

		// if we are scaling down, the text won't necessarily fill the box, so we are recalculating the height
		headerRegion.height = Math.ceil( headerHeight[i] * scale );	// is this actually valid?
		if (headerText[i].length > 0) {
			let headerStyle = headerBox.getDefaultStyle();
			headerStyle.add( SIZE, headerDefaultSize * headerTextSize / 100.0 );
			headerBox.setDefaultStyle( headerStyle );
			headerBox.markupText = '';

//			headerBox.markupText = '<size ' + headerTextSize + '%>' + headerText[i];
			headerBox.markupText = headerText[i];

			headerHeight[i] = headerBox.measure( g, fullRegion );
			headerRegion.height = Math.ceil( headerHeight[i] );
		}

		storyRegion.y = headerRegion.y + headerRegion.height + Math.ceil( headerSpacing[i] * scale * ($ScaleModifier / 100.0 ) );
		storyRegion.height = Math.ceil( storyHeight[i] * scale );

		if ( i == 0 && headerText[i].length < 1 ) {
			if ( storyText[i].length > 0 ) {
				storyRegion.y += 4*textScale; // if this is the first text after traits, it needs to be moved down a bit
			}
		}

		if (storyText[i].length > 0) {
			let storyStyle = storyBox.getDefaultStyle();
			storyStyle.add( SIZE, storyDefaultSize * storyTextSize / 100.0 );
			storyBox.setDefaultStyle( storyStyle );
			storyBox.markupText = '';

//			storyBox.markupText = '<size ' + storyTextSize + '%>' + storyText[i];
			storyBox.markupText = storyText[i];

			storyHeight[i] = storyBox.measure( g, fullStoryRegion );
			storyRegion.height = Math.ceil( storyHeight[i] ) + 2;
		}

		bodyRegion.y = storyRegion.y + storyRegion.height + Math.ceil( storySpacing[i]  * scale * ($ScaleModifier / 100.0 ) );
		bodyRegion.height = Math.ceil( bodyHeight[i] * scale );

		if ( i == 0 && headerText[i].length < 1 && storyText[i].length < 1 ) {
			if ( bodyText[i].length > 0 ) {
				bodyRegion.y += 4*textScale; // if this is the first text after traits, it needs to be moved down a bit
			}
		}

		if (bodyText[i].length > 0) {
			let bodyStyle = bodyBox.getDefaultStyle();
			bodyStyle.add( SIZE, bodyDefaultSize * bodyTextSize / 100.0 );
			bodyBox.setDefaultStyle( bodyStyle );
			bodyBox.markupText = '';

//			bodyBox.markupText = '<size ' + bodyTextSize + '%>' + bodyText[i];
			bodyBox.markupText = bodyText[i];
			bodyHeight[i] = bodyBox.measure( g, fullRegion );
			bodyRegion.height = Math.ceil( bodyHeight[i] );
		}

		if (headerHeight[i] > 0) {
			let headerStyle = headerBox.getDefaultStyle();
			headerStyle.add( SIZE, headerDefaultSize * headerTextSize / 100.0 );
			headerBox.setDefaultStyle( headerStyle );
			headerBox.markupText = '';

//			headerBox.markupText = '<size ' + headerTextSize + '%>' + headerText[i];
			headerBox.markupText = headerText[i];
			headerBox.draw( g, headerRegion );
		}

		if ( storyHeight[i] > 0 ) {
			let storyStyle = storyBox.getDefaultStyle();
			storyStyle.add( SIZE, storyDefaultSize * storyTextSize / 100.0 );
			storyBox.setDefaultStyle( storyStyle );
			storyBox.markupText = '';

//			storyBox.markupText = '<size ' + storyTextSize + '%>' + storyText[i];
			storyBox.markupText = storyText[i];
			storyBox.draw( g, storyRegion );

//			sheet.paintImage( g, createDarkenedImage( ImageUtils.get('ArkhamHorrorLCG/images/Lines.png') ),
//				new Region( storyRegion.x - 18, storyRegion.y, 6, storyRegion.height - 2) );
			g.setPaint( new Color( 0.0, 0.0, 0.0 ) );
			g.setStroke( new BasicStroke( 1.0 ) );
			g.drawLine(storyRegion.x - 15, storyRegion.y - vertLineOffset1*scale, storyRegion.x - 15, storyRegion.y + storyRegion.height - vertLineOffset2*scale);
			g.drawLine(storyRegion.x - 12, storyRegion.y - vertLineOffset1*scale, storyRegion.x - 12, storyRegion.y + storyRegion.height - vertLineOffset2*scale);
		}

		if (bodyHeight[i] > 0) {
			let bodyStyle = bodyBox.getDefaultStyle();
			bodyStyle.add( SIZE, bodyDefaultSize * bodyTextSize / 100.0 );
			bodyBox.setDefaultStyle( bodyStyle );
			bodyBox.markupText = '';

//			bodyBox.markupText = '<size ' + bodyTextSize + '%>' + bodyText[i];
			bodyBox.markupText = bodyText[i];
			bodyBox.draw( g, bodyRegion );
		}

		// update regions (everything is based off of headerRegion.y)
		if ( bodyText[i] && bodyText[i].length > 0 ) {
			headerRegion.y = bodyRegion.y + bodyRegion.height + ( 2 * scale );
		}
		else {
			headerRegion.y = storyRegion.y + storyRegion.height;
		}
	}

	if ( victoryText.length > 0 ) {
		let headerStyle = headerBox.getDefaultStyle();
		headerStyle.add( SIZE, headerDefaultSize * headerTextSize / 100.0 );
		headerBox.setDefaultStyle( headerStyle );
		headerBox.markupText = '';

		headerRegion.height = Math.ceil( victoryHeight * scale );
		headerRegion.y += victorySpacing;

//		headerBox.markupText = '<center><hdr><size ' + headerTextSize + '%>' + victoryText + '</size></hdr>';
		headerBox.markupText = '<center><hdr>' + victoryText + '</hdr>';

		victoryHeight = headerBox.measure( g, fullRegion );
		headerRegion.height = Math.ceil( victoryHeight );

		headerBox.draw( g, headerRegion );
	}
}

function drawGuideBody( g, diy, sheet, bodyBox, headerBox, bodyRegion, text, spacing ) {
	var faceIndex = sheet.getSheetIndex();
	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	if ( isNaN( spacing ) ) spacing = 100;

	var tightness = AHLCGObject.bodyFontTightness * 1.2 * spacing / 100.0;

	if ( AHLCGObject.bodyFamily == 'Times New Roman' ) {
//		bodyRegion.y -= 2;
		tightness = tightness * 0.98;
//		tightness = tightness * 1.4;

		var bodyStyle = bodyBox.getDefaultStyle();
		bodyStyle.add( WIDTH, 0.96 );
		bodyStyle.add( TRACKING, -0.01 );
		bodyBox.setDefaultStyle( bodyStyle );
	}

	bodyRegion.y += parseInt(Eons.namedObjects.AHLCGObject.bodyFontOffset);

	while (text.length > 0) {
//		let startMatch = /<section>|<header>|<box(?:res|sa|key|int|fla)(?:\s+bracket|\s+header|\s+colou?r\s*=\s*-?[0-9]+\.?[0-9]*\s*,\s*-?[0-9]+\.?[0-9]*\s*,\s*-?[0-9]+\.?[0-9]*)*>/.exec( text );
		let startMatch = /<(?:section|header)(?:\s+colou?r\s*=\s*[A-Fa-f0-9\.]{6})*>|<box(?:res|sa|key|int|fla)(?:\s+bracket|\s+header|\s+colou?r\s*=\s*-?[0-9]+\.?[0-9]*\s*,\s*-?[0-9]+\.?[0-9]*\s*,\s*-?[0-9]+\.?[0-9]*)*>/.exec( text );
//		let startMatch = /<section|header(?:\s+colou?r\s*=\s*-?[0-9]+\.?[0-9]*\s*,\s*-?[0-9]+\.?[0-9]*\s*,\s*-?[0-9]+\.?[0-9]*)*>|<box(?:res|sa|key|int|fla)(?:\s+bracket|\s+header|\s+colou?r\s*=\s*-?[0-9]+\.?[0-9]*\s*,\s*-?[0-9]+\.?[0-9]*\s*,\s*-?[0-9]+\.?[0-9]*)*>/.exec( text );
//		let startMatch = /<(?:section|header)(?:\s+colou?r\s*=\s*-?[0-9]+\.?[0-9]*\s*,\s*-?[0-9]+\.?[0-9]*\s*,\s*-?[0-9]+\.?[0-9]*)*>/.exec( text );
//		let startMatch = /<(?:section|header)(?:\s+colou?r\s*=\s*[A-Fa-f0-9\.]{6})*>/.exec( text );
//		let startMatch = /<section\s*.*>|<header\s*.*>|<box(?:res|sa|int)\s*.*>/.exec( text );
		let endMatch = null;
		let matchIndex = -1;
		let preSpecialText = '';
		let specialText = '';
		let postSpecialText = '';
		let sectionHeight = 0;
		let intCupShape = null;
		let textRegion = new Region( bodyRegion );

		if ( startMatch ) {
			let tagMatch = /<([a-zA-Z]+)/.exec( startMatch[0] );
			let colorMatch = null;

			switch ( tagMatch[1] ) {
				case 'section':
					colorMatch = /colou?r\s*=\s*([A-Fa-f0-9\.]{6})/.exec( startMatch[0] );
					endMatch = /<\/section>/.exec( text );

					if ( startMatch.index > 0) {
						preSpecialText = text.slice( 0, startMatch.index );

						if ( /\S/.test( preSpecialText ) ) preSpecialText = preSpecialText + '<lvs>';

						bodyBox.markupText = preSpecialText;
						bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') * tightness );
						sectionHeight = bodyBox.measure( g, bodyRegion );

						bodyBox.draw( g, bodyRegion );
						bodyBox.markupText = '';

						bodyRegion.y += sectionHeight;
						bodyRegion.height -= sectionHeight;
					}

					if ( endMatch ) {
						specialText = text.slice( startMatch.index, endMatch.index + 10 );
						postSpecialText = text.slice( endMatch.index + 10 );
					}
					else {
						specialText = text.slice( startMatch.index );
					}

					specialText = specialText.replace( /<section.*?>/, '<section>' );

					if ( colorMatch ) {
						specialText = specialText.replace( /<section>/, '<section><color ' + colorMatch[1] + '>' );
						specialText = specialText.replace( /<\section>/, '<\color><\section>' );
					}
					else {
						specialText = specialText.replace( /<section>/, '<section><color 415a55>' );
						specialText = specialText.replace( /<\section>/, '<\color><\section>' );
					}

					bodyBox.markupText = specialText;
					bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'BodySection', '-tightness') + '-tightness')  * tightness );
					sectionHeight = bodyBox.measure( g, bodyRegion );

					bodyBox.draw( g, bodyRegion );
					bodyBox.markupText = '';

//					sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/images/HorizLines.png'),
//						new Region( bodyRegion.x, bodyRegion.y + sectionHeight - 2, bodyRegion.width + 2, 6) );
					if ( colorMatch ) {
						let aRgbHex = colorMatch[1].match(/.{1,2}/g);
						let aRgb = [
							parseInt(aRgbHex[0], 16),
							parseInt(aRgbHex[1], 16),
							parseInt(aRgbHex[2], 16)
						];

						g.setPaint( new Color( aRgb[0]/256.0, aRgb[1]/256.0, aRgb[2]/256.0 ) );
						}
					else {
						g.setPaint( new Color( 0.255, 0.353, 0.333 ) );
					}
					g.setStroke( new BasicStroke( 1.0 ) );
					g.drawLine(bodyRegion.x, bodyRegion.y + sectionHeight - 1, bodyRegion.x + bodyRegion.width + 2, bodyRegion.y + sectionHeight - 1);
					g.drawLine(bodyRegion.x, bodyRegion.y + sectionHeight + 3, bodyRegion.x + bodyRegion.width + 2, bodyRegion.y + sectionHeight + 3);

					bodyRegion.y += sectionHeight - 4;
					bodyRegion.height -= (sectionHeight - 4);

					bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') * tightness );

					text = postSpecialText;
					break;
				case 'header':
					colorMatch = /colou?r\s*=\s*([A-Fa-f0-9\.]{6})/.exec( startMatch[0] );
					endMatch = /<\/header>/.exec( text );

					if ( startMatch.index > 0) {
						preSpecialText = text.slice( 0, startMatch.index );

						if ( /\S/.test( preSpecialText ) ) preSpecialText = preSpecialText + '<lvs>';

						bodyBox.markupText = preSpecialText;
						bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') * tightness );
						sectionHeight = bodyBox.measure( g, bodyRegion );

						bodyBox.draw( g, bodyRegion );
						bodyBox.markupText = '';

						bodyRegion.y += sectionHeight;
						bodyRegion.height -= sectionHeight;
					}

					if ( endMatch ) {
						specialText = text.slice( startMatch.index, endMatch.index + 9 );
						postSpecialText = text.slice( endMatch.index + 9 );
					}
					else {
						specialText = text.slice( startMatch.index );
					}

					bodyRegion.y += 8;
					bodyRegion.height -= 8;

					specialText = specialText.replace( /<header.*?>/, '<header>' );

					if (colorMatch) {
						specialText = specialText.replace( /<header>/, '<header><color ' + colorMatch[1] + '>' );
						specialText = specialText.replace( /<\header>/, '<\color><\header>' );
					}
					else {
						specialText = specialText.replace( /<header>/, '<header><color 415a55>' );
						specialText = specialText.replace( /<\header>/, '<\color><\header>' );
					}

//					var defaultStyle = diy.settings.getTextStyle( 'GuideHeader-style', null );
//					if (colorMatch) {
//						var textStyle = defaultStyle;

//						if ( colorMatch ) {
//							textStyle.add( COLOR, new Color( Color.HSBtoRGB(colorMatch[1], colorMatch[2], colorMatch[3]) ) );
//						}

//						bodyBox.setStyleForTag( 'header', textStyle );
//					}
/*
					var textStyle = diy.settings.getTextStyle( 'GuideHeader-style', null );
					if (colorMatch) {
						var textStyle = diy.settings.getTextStyle( 'GuideHeader-style', null );
						var coloredStyle = textStyle;
						coloredStyle.add( COLOR, new Color( Color.HSBtoRGB(colorMatch[1], colorMatch[2], colorMatch[3]) ));
						bodyBox.setDefaultStyle(coloredStyle);
					}
*/
					bodyBox.markupText = specialText;
					bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'BodySection', '-tightness') + '-tightness') * tightness );
					sectionHeight = bodyBox.measure( g, bodyRegion );

					bodyBox.draw( g, bodyRegion );
					bodyBox.markupText = '';

//					if (colorMatch) {
//						bodyBox.setDefaultStyle( textStyle );
//						bodyBox.setStyleForTag( 'header', defaultStyle );
//					}

					bodyRegion.y += sectionHeight - 12;
					bodyRegion.height -= (sectionHeight - 12);

					bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') * tightness );

					text = postSpecialText;
					break;
				default:	//	<box...>
					colorMatch = /colou?r\s*=\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*,\s*([0-9\.]+)/.exec( startMatch[0] );

					let res = ( /boxres/.exec( startMatch[0] ) != null );
					let sa = ( /boxsa/.exec( startMatch[0] ) != null );
					let keybox = ( /boxkey/.exec( startMatch[0] ) != null );
					let interlude = ( /boxint/.exec( startMatch[0] ) != null );
					let flashback = ( /boxfla/.exec( startMatch[0] ) != null );
					let header = ( /\sheader/.exec( startMatch[0] ) != null );
					let bracket = ( /\sbracket/.exec( startMatch[0] ) != null );

					if ( flashback ) {
						if ( colorMatch == null ) {
							colorMatch = [ 'color', '0.630', '0.48', '0.48' ];
						}

						interlude = true;
					}

					if ( keybox ) {
						if ( colorMatch == null ) {
							colorMatch = [ 'color', '0.000', '0.97', '0.55' ];
						}
					}

					if ( res ) endMatch = /<\/boxres>/.exec( text );
					else if ( sa ) endMatch = /<\/boxsa>/.exec( text );
					else if ( keybox ) endMatch = /<\/boxkey>/.exec( text );
					else if ( flashback ) {
						endMatch = /<\/boxfla>/.exec( text );
						interlude = true;
					}
					else if ( interlude ) {
						endMatch = /<\/boxint>/.exec( text );
						header = false;
						bracket = false;
					}

					if ( interlude ) {
						header = false;
						bracket = false;
					}

					if ( startMatch.index > 0) {
						preSpecialText = text.slice( 0, startMatch.index );

						if ( /\S/.test( preSpecialText ) ) preSpecialText = preSpecialText + '<br>';

						bodyBox.markupText = preSpecialText;
						bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') * tightness );
						sectionHeight = bodyBox.measure( g, bodyRegion );

						bodyBox.draw( g, bodyRegion );
						bodyBox.markupText = '';

						bodyRegion.y += sectionHeight;
						bodyRegion.height -= sectionHeight;
					}

					if ( endMatch ) {
//						let len = (res || interlude) ? 9 : 8;
						let len = endMatch[0].length;

						specialText = text.slice( startMatch.index, endMatch.index + len );
						postSpecialText = text.slice( endMatch.index + len );
					}
					else {
						specialText = text.slice( startMatch.index );
					}

					let headerHeight = 0;
					if ( header ) {
						headerHeight = res ? 80 : 47;
					}

//					let boxRegion = new Region( bodyRegion.x - 7, bodyRegion.y, bodyRegion.width + 36, bodyRegion.height );
// matched, but caused text to go beyond right edge
//					let boxRegion = new Region( bodyRegion.x - 15, bodyRegion.y, bodyRegion.width + 12, bodyRegion.height );
					let boxRegion = (CardTypes[0] == 'Guide75') ?
						new Region( bodyRegion.x - 22, bodyRegion.y, bodyRegion.width + 30, bodyRegion.height ) :		// 7.5
						new Region( bodyRegion.x - 15, bodyRegion.y, bodyRegion.width + 30, bodyRegion.height );		// A4

					if ( interlude ) {
						boxRegion.x += 5;
						boxRegion.width -= 7;

						bodyRegion.y += 5;
						bodyRegion.height -= 10;
					}

					// space before header/first text, if you change these you must change the -= below
//					bodyRegion.x += 34;
//					bodyRegion.width -= 48;

					if ( CardTypes[0] == 'Guide75' ) {
						bodyRegion.x += 16;
						bodyRegion.width -= 48;
					}
					else {	// A4
						bodyRegion.x += 24;
						bodyRegion.width -= 48;
					}

					if ( header ) {
						bodyRegion.y += 29;
						bodyRegion.height -= 29;
					}
					else {
						bodyRegion.y += 27;
						bodyRegion.height -= 27;
					}

					textRegion.x = bodyRegion.x;
					textRegion.y = bodyRegion.y;
					textRegion.width = bodyRegion.width;
					textRegion.height = bodyRegion.height;

					if ( interlude ) {
						textRegion.width += 5;
					}


					bodyBox.markupText = specialText;
					bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') * tightness );
					sectionHeight = bodyBox.measure( g, textRegion );

					if (interlude) {
						let inset = 24;
						bodyBox.setPageShape( new PageShape.CompoundShape(
							new PageShape.CupShape(24, 24, bodyRegion.y + 12, 0, 0),
							bodyRegion.y + sectionHeight - 12,
							new PageShape.InsetShape(inset, inset)
							) );

						textRegion.height = sectionHeight + 2;

						// test again, sectionHeight may have increased by a line because of the CupShape
						let newSectionHeight = bodyBox.measure( g, textRegion );
						while (newSectionHeight > sectionHeight) {
							sectionHeight = newSectionHeight;

							bodyBox.setPageShape( new PageShape.CompoundShape(
								new PageShape.CupShape(24, 24, bodyRegion.y + 12, 0, 0),
								bodyRegion.y + sectionHeight - 12,
								new PageShape.InsetShape(inset, inset)
								) );

							textRegion.height = sectionHeight + 2;
							newSectionHeight = bodyBox.measure( g, textRegion );
							}

						// test again if it shrunk again, means with the indents it doesn't fit, but without the indents,
						// it doesn't need the extra line.  Shrink the indents.
						if (newSectionHeight < sectionHeight) {
							sectionHeight = newSectionHeight;

							do {
								inset -= 4;

								bodyBox.setPageShape( new PageShape.CompoundShape(
									new PageShape.CupShape(24, 24, bodyRegion.y + 12, 0, 0),
									bodyRegion.y + sectionHeight - 12,
									new PageShape.InsetShape(inset, inset)
									) );

								textRegion.height = sectionHeight + 2;
								newSectionHeight = bodyBox.measure( g, textRegion );
							} while (newSectionHeight > sectionHeight && inset > 0);
						}

						sectionHeight = newSectionHeight;

						if (interlude && sectionHeight < 60) sectionHeight = 60;
						textRegion.height = sectionHeight + 2;

						bodyBox.setPageShape( new PageShape.CompoundShape(
							new PageShape.CupShape(24, 24, bodyRegion.y + 12, 0, 0),
							bodyRegion.y + sectionHeight - 12,
							new PageShape.InsetShape(inset, inset)
							) );
					}

					let boxTopImage = null;
					let boxBotImage = null;
					let boxMidImage = null;
					// Bracket images only used in color
					let boxTopBracketImage = null;
					let boxBotBracketImage = null;

					let boxType = 'SA';
					if ( res ) boxType = 'Res';
					else if ( interlude ) boxType = 'Int';
// colors:
// Resolution     : 0.019, 0.70, 0.38
// SA			  : 0.480, 0.58, 0.36
// Key			  : 0.000, 0.97, 0.55
// Interlude (TFA): 0.489, 0.56, 0.36
// Flashback (TIC): 0.630, 0.48, 0.48
// Keys (TIC)     : 0.992, 0.76, 0.37

// res box tint
					if ( colorMatch != null ) {
//						if ( bracket && !interlude ) boxTopImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + 'Bracket.png');
//						else boxTopImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + 'Red.png');

//						if ( interlude || endMatch == bracket) boxBotImage = boxTopImage;
//						else if ( endMatch ) boxBotImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + 'Bracket.png');
//						else boxBotImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + 'Red.png');

//						boxMidImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + 'LineRed.png');

						var h = parseFloat(colorMatch[1]);
						var s = parseFloat(colorMatch[2]);
						var b = parseFloat(colorMatch[3]);
						var b2 = b;

						if ( !interlude ) {
							b2 += 0.3;
							if ( b2 > 1.0 ) b2 = 1.0;
						}

//						var tc = new TintCache( new TintFilter() );
						var tcBox = null;
						var tcBracket = null;
						var tcMid = null;

						if ( interlude ) {
							tcBox = AHLCGObject.getIntBoxTint();
							tcMid = AHLCGObject.getIntMidTint();
						}
						else if ( bracket ) {
							tcBox = AHLCGObject.getResBoxTint();
							tcBracket = AHLCGObject.getBracketTint();
							tcMid = AHLCGObject.getResMidTint();
//							if ( !endMatch ) tcBot = AHLCGObject.getResTopTint();
//							if ( endMatch ) tcBotBracket = AHLCGObject.getBracketTint();
						}
						else {
							tcBox = AHLCGObject.getResBoxTint();
							tcMid = AHLCGObject.getResMidTint();
							if ( endMatch ) tcBracket = AHLCGObject.getBracketTint();
						}

						tcBox.setFactors(h, s, b2);
						boxTopImage = tcBox.getTintedImage();
						boxBotImage = boxTopImage;

						tcMid.setFactors(h, s, b2);
						boxMidImage = tcMid.getTintedImage();

						if ( tcBracket ) {
							tcBracket.setFactors(h, s, b);
						}
						if ( bracket ) {
							boxTopBracketImage = tcBracket.getTintedImage();
						}
						if ( !interlude && endMatch ) {
							boxBotBracketImage = tcBracket.getTintedImage();
						}
//						else {
//							boxBotImage = boxTopImage;
//						}
					}
					else {
						if ( bracket && !interlude ) boxTopImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + 'Bracket.png');
						else boxTopImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + '.png');

						if ( interlude || endMatch == bracket) boxBotImage = boxTopImage;
						else if ( endMatch ) boxBotImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + 'Bracket.png');
						else boxBotImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + '.png');

						boxMidImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Box' + boxType + 'Line.png');
					}
/*
			// ok from scratch now
					var mask = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-BoxMask.png');
					var color = ImageUtils.create(mask.getWidth(), mask.getHeight(), true);
					var gc = color.createGraphics();
					gc.setPaint( new Color(1, 1, 1) );
					gc.fillRect( 0, 0, color.getWidth(), color.getHeight() );

					boxTopImage = createStencilImage(color, 'Box');
*/
					let ar = boxTopImage.height / boxTopImage.width;
					let topHeight = Math.round( boxRegion.width * ar );
					let rSectionHeight = Math.round( sectionHeight );
					let rHeaderHeight = Math.round( headerHeight );

					sheet.paintImage( g, boxTopImage,
						new Region( boxRegion.x, boxRegion.y, boxRegion.width, topHeight ) );
					if ( boxTopBracketImage ) {
						sheet.paintImage( g, boxTopBracketImage,
							new Region( boxRegion.x, boxRegion.y, boxRegion.width, topHeight ) );
					}

//					boxRegion.y += boxRegion.width * ar;
//					boxRegion.height -= boxRegion.width * ar;
					boxRegion.y += topHeight;
					boxRegion.height -= topHeight;

					let minHeight = 84;
					if ( interlude ) minHeight = 60;

					if ( rSectionHeight + rHeaderHeight > minHeight ) {
						sheet.paintImage( g, boxMidImage,
							new Region( boxRegion.x, boxRegion.y, boxRegion.width, rSectionHeight + rHeaderHeight - minHeight ) );
					}

					if ( rSectionHeight + rHeaderHeight < minHeight ) rSectionHeight = minHeight - rHeaderHeight;
					boxRegion.y += rSectionHeight + rHeaderHeight;
					boxRegion.height -= ( rSectionHeight + rHeaderHeight );

					ar = boxBotImage.height / boxBotImage.width;

					sheet.paintImage( g, ImageUtils.mirror( boxBotImage, false, true ),
						new Region( boxRegion.x, boxRegion.y - minHeight, boxRegion.width, topHeight ));
					if ( boxBotBracketImage ) {
						sheet.paintImage( g, ImageUtils.mirror( boxBotBracketImage, false, true ),
							new Region( boxRegion.x, boxRegion.y - minHeight, boxRegion.width, topHeight ));
					}

					// draw header
					if ( header ) {
						if ( res ) {
							let headerRegion = new Region2D( bodyRegion.x, bodyRegion.y, bodyRegion.width, bodyRegion.height );
/*
							var textStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'ResHeader-style'), null);

							textStyle.add( COLOR, new Color( 1.0, 1.0, 0.0) );
*/
							headerBox.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'ResHeader-style'), null);

							headerBox.markupText = #AHLCG-Scenario-Header1;

							let height = headerBox.measure( g, headerRegion );
							let width1 = headerBox.drawAsSingleLine( g, headerRegion ) + 4.0;

							headerRegion.y += height;

							headerBox.markupText = '<size 80%>' + #AHLCG-Scenario-Header2 + '<size 125%>';

							height += headerBox.measure( g, headerRegion );
							let width2 = headerBox.drawAsSingleLine( g, headerRegion ) + 4.0;

							let headerWidth = Math.max( width1, width2 );

//							sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/images/HorizLines.png'),
//								new Region( headerRegion.x + (headerRegion.width - headerWidth)/ 2, bodyRegion.y + height, headerWidth, 6) );
//							g.setPaint( new Color( 0.282, 0.012, 0.0 ) );
							g.setPaint( new Color( 0.388, 0.145, 0.114 ) );
							g.setStroke( new BasicStroke( 1.0 ) );
							g.drawLine(headerRegion.x + (headerRegion.width - headerWidth) / 2, bodyRegion.y + height, headerRegion.x + (headerRegion.width - headerWidth) / 2 + headerWidth, bodyRegion.y + height);
							g.drawLine(headerRegion.x + (headerRegion.width - headerWidth) / 2, bodyRegion.y + height + 5, headerRegion.x + (headerRegion.width - headerWidth) / 2 + headerWidth, bodyRegion.y + height + 5);
						}
						else if ( sa ) {
							headerBox.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'SAHeader-style'), null);

							headerBox.markupText = '<size 90%>' + #AHLCG-Guide-Standalone + '<size 111%>';
							let height = headerBox.measure( g, bodyRegion );
							let width = headerBox.drawAsSingleLine( g, bodyRegion ) + 4.0;

//							sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/images/HorizLines.png'),
//								new Region( bodyRegion.x + (bodyRegion.width - width)/ 2, bodyRegion.y + height - 2, width, 6) );
//							g.setPaint( new Color( 0.255, 0.353, 0.333 ) );
							g.setPaint( new Color( 0.176, 0.357, 0.345 ) );
							g.setStroke( new BasicStroke( 1.0 ) );
							g.drawLine(bodyRegion.x + (bodyRegion.width - width) / 2, bodyRegion.y + height - 2, bodyRegion.x + (bodyRegion.width + width) / 2, bodyRegion.y + height - 2);
							g.drawLine(bodyRegion.x + (bodyRegion.width - width) / 2, bodyRegion.y + height + 3, bodyRegion.x + (bodyRegion.width + width) / 2, bodyRegion.y + height + 3);
						}
						else {	// Keys
							headerBox.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'KeyHeader-style'), null);

							headerBox.markupText = '<size 90%>' + #AHLCG-Guide-Keys + '<size 111%>';
							let height = headerBox.measure( g, bodyRegion );
							let width = headerBox.drawAsSingleLine( g, bodyRegion ) + 4.0;

							g.setPaint( new Color( 0.494, 0.024, 0.027 ) );
							g.setStroke( new BasicStroke( 1.0 ) );
							g.drawLine(bodyRegion.x + (bodyRegion.width - width) / 2, bodyRegion.y + height - 2, bodyRegion.x + (bodyRegion.width + width) / 2, bodyRegion.y + height - 2);
							g.drawLine(bodyRegion.x + (bodyRegion.width - width) / 2, bodyRegion.y + height + 3, bodyRegion.x + (bodyRegion.width + width) / 2, bodyRegion.y + height + 3);
						}

						bodyRegion.y += headerHeight;
						bodyRegion.height -= headerHeight;
					}

					textRegion.y = bodyRegion.y;
					textRegion.height = bodyRegion.height;

					// draw main box text
					if ( res ) bodyBox.setStyleForTag( 'boxbullet', diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'ResBullet-style'), null) );
					else bodyBox.setStyleForTag( 'boxbullet', diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'SABullet-style'), null) );
/*
					// draw box
					g.setPaint(Color.blue);
					g.draw(new Rectangle(bodyRegion.x, bodyRegion.y, bodyRegion.width, bodyRegion.height));
					g.setPaint(Color.red);
					g.draw(new Rectangle(textRegion.x, textRegion.y, textRegion.width, textRegion.height));
*/
					bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') * tightness );
					bodyBox.draw( g, textRegion );
					bodyBox.markupText = '';

//					bodyRegion.x -= 34;
					bodyRegion.x -= 24;
					bodyRegion.width += 48;

//					if ( interlude ) bodyRegion.width -= 5;

					bodyRegion.y += sectionHeight + 55;
					bodyRegion.height -= (sectionHeight + 55);

					text = postSpecialText;

					bodyBox.setPageShape(null);
					break;
			}
		}
		else {
			bodyBox.markupText = text;
			bodyBox.setLineTightness( $(getExpandedKey(FACE_FRONT, 'Body', '-tightness') + '-tightness') * tightness );
			bodyBox.draw( g, bodyRegion );
			bodyBox.markupText = '';

			text = '';
		}
	}
}

// header = story/chaos
// this is a nightmare.  I'm sorry.
function drawChaosBody( g, diy, sheet, textBoxes, headerBox, y ) {
	var tokenName = [ 'Skull', 'Cultist', 'Tablet', 'ElderThing' ];
	var faceIndex = sheet.getSheetIndex();
	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Body-region' ) );
	var originalHeight = region.height;

	// if back and no TrackerBoxBack, use the front
	var trackerBox = null;
	var trackerHeight = 0;
	if ( $('TrackerBox' + BindingSuffixes[faceIndex]) ) {
		trackerBox = String( $('TrackerBox' + BindingSuffixes[faceIndex]) );
		trackerHeight = $('TrackerHeight' + BindingSuffixes[faceIndex]);
	}

	if ( !trackerBox ) {
		trackerBox = String( $TrackerBox );
		trackerHeight = $TrackerHeight;
	}

//	var trackerBox = String( $TrackerBox );
//	var trackerHeight = $TrackerHeight;

	var headerRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'Header-region' ) );
//	var trackingHeader = $( 'TrackerBox' + BindingSuffixes[faceIndex] );

	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	// y is based on how many lines of header

	// difference between the received y and the expected region
	var difference = y - region.y;
	// keep region bottom at the same place, but use the bottom-most of the expected region and the received y
	if ( difference < 0 ) difference = 0;
	else {
		region.y = y;
		region.height -= difference;
	}

	if ( headerBox ) {
		difference = y - headerRegion.y;

		// header box is for special things like Disappearance of Elina Harper; difference is smaller when tracker displayed because we are working to fit everything
		if ( trackerBox.length == 0 ) difference += 12;
		else difference += 2;

		// add difference, but keep bottom in same place
		headerRegion.y += difference;
		headerRegion.height -= difference;

		headerBox.markupText = $HeaderBack;

		// Chinese language seems to be making this return 0 in some cases
		let newY = headerBox.draw( g, headerRegion );

		if ( newY <= 0 ) {
			let hHeight = headerBox.measure( g, headerRegion );
			newY = headerRegion.y + hHeight;
		}

		let dy = newY - region.y;

		// space after header; again, difference is smaller when tracker displayed because we are working to fit everything
		if ( trackerBox.length == 0 ) difference = 15;
		else difference = 5;

		// add difference, but keep bottom in same place
		region.y = newY + difference;
		region.height -= dy + difference;
	}

	var iconRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'BodyIcon-region' ) );

	// raise bottom if tracker box is active
	if ( trackerBox.length > 0 ) {
//			region.height -= 95;
//		region.height -= 90
		region.height -= 90 * trackerHeight / 100.0;
	}

	var tokenRegion = [];
	var tokenText = [];
	var tokenHeight = [];
	var tokenSpacing = [ 0, 0, 0, 0 ];
	var tokenIcon = [];
	var tokenGroup = [ 1, 2, 3, 4 ];
	var tokensInGroup = [ 0, 0, 0, 0 ];

	var minHeight;
	var minCenterSpacing;
	var minSpacing;
	var scaledSpacing;
//	var maxSpacing;
	var useOffsetPct;

	// minHeight and minCenterSpacing are based on how many tokens are being displayed (1-4)
	minHeight = [ 48, 100, 152, 204 ];
	minCenterSpacing = [ 115, 102, 85, 65 ];	// spaces them out if there aren't a full set
	minSpacing = 15;							// default spacing between token blocks
	useOffsetPct = 0.6;

	var index = 0;
	var mergeIndex = 0;
//	var startingOffset = 0;

	// eliminate tokens with no text
	for ( let i = 0; i < 4; i++ ) {
		let fieldName = tokenName[i] + BindingSuffixes[faceIndex];
		let text = $( fieldName );

		if ( text.length() <= 0 ) tokenGroup[i] = 15;	// invalid
	}

	// divide into groups
	for ( let i = 0; i < 4; i++ ) {
		let fieldName = tokenName[i] + BindingSuffixes[faceIndex];
		let text = $( fieldName );
		let spacing = $( fieldName + 'Spacing' );
		let merge = $( 'Merge' + fieldName );

		if ( merge != 'None' ) {
			for ( let j = 0; j < 4; j++ ) {
				if ( merge == tokenName[j] ) {
					let minGroup = Math.min( tokenGroup[i], tokenGroup[j] );

					tokenGroup[i] = minGroup;
					tokenGroup[j] = minGroup;
				}
			}
		}
	}

	// minimize the group numbers
	var groupCount = 0;
	for ( let group = 1; group <= 4; group++ ) {
		let inGroup = 0;
		for ( let i = group-1; i < 4; i++) {
			if ( tokenGroup[i] == group ) inGroup++;
		}

		if (inGroup == 0) {
			let found = false;
			for ( let i = 0; i < 4; i++) {
				if ( tokenGroup[i] > group && tokenGroup[i] <= 4 ) {
					tokenGroup[i]--;
					found = true;
				}
			}

			if ( found ) group--;	// look at the current index again
		}
		else {
			tokensInGroup[group-1] = inGroup;
			groupCount++;
		}
	}

	var numTokens = 0;
	for ( let i = 0; i < 4; i++ ) {
		if ( tokenGroup[i] > 0 && tokenGroup[i] <= 4 ) numTokens++;
	}

	// help everything fit
	if ( trackerBox.length > 0 && numTokens > 3) {
		region.y -= 5;
//		minSpacing = 1;
	}

	var heightSum = 0;
	for ( let i = 1; i <= 4; i++ ) {	// group
		for ( let j = 0; j < 4; j++) {	// token
			if ( tokenGroup[j] == i ) {
				let fieldName = tokenName[j] + BindingSuffixes[faceIndex];
				let text = $( fieldName );
				let spacing = $( fieldName + 'Spacing' );

				// we will print the first defined text string for a grouping
				if ( text.length() > 0 && tokenText[i-1] == null ) {
					tokenRegion[i-1] = new Region(region);
					tokenText[i-1] = text;

					if (spacing != null && spacing.length() > 0) {
						tokenSpacing[i-1] = parseInt($( fieldName + 'Spacing'), 0);
					}
				}

				tokenIcon[j] = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Chaos' + tokenName[j] + '.png');
			}
		}
	}

	var totalHeight = 0;
	var totalEqualSpacingHeight = 0;
	var maxEqualCenterSpacing = 0;
	var firstBlockOffset = 0;

	for (let i = 0; i < groupCount; i++) {
		// if we don't use a separate box, it draws twice, another thing I don't really understand
		let Test_box = markupBox(sheet);
		Test_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(faceIndex, 'Body-style'), null);
		Test_box.alignment = diy.settings.getTextAlignment(getExpandedKey(faceIndex, 'Body-alignment'));
		Test_box.setLineTightness( $(getExpandedKey(faceIndex, 'Body', '-tightness') + '-tightness') * AHLCGObject.bodyFontTightness );
		Test_box.setTextFitting( FIT_SCALE_TEXT );

		Test_box.markupText = tokenText[i];
		tokenHeight[i] = Test_box.measure( g, tokenRegion[i] );

		// if there's a tracking box, this lets the icon extend up above the normal region top, so the text is at the top of the region, to save space
		if ( !headerBox && i == 0 && tokenHeight[i] < iconRegion.height ) {
			firstBlockOffset = (iconRegion.height - tokenHeight[i]) / 2;
			if (firstBlockOffset > 10) firstBlockOffset = 10;
		}

		if (tokenHeight[i] < minHeight[tokensInGroup[i]-1]) tokenHeight[i] = minHeight[tokensInGroup[i]-1];

		totalHeight += tokenHeight[i];
	}

	if ( trackerBox.length > 0 || headerBox ) firstBlockOffset = 0;	// hmm

	// calculate the maximum spacing between box centers
	if ( groupCount > 1 ) {
//g.setPaint(Color.BLUE);
//g.drawRect(region.x-2, region.y, region.width+4, region.height);
		// calculate how tall each box should be to fit in region
		var fittedCenterSpacing = ((region.height - (tokenHeight[0] + tokenHeight[groupCount-1] ) / 2) / (groupCount-1));
		if ( fittedCenterSpacing < 52 ) fittedCenterSpacing = 52;

		for ( let i = 0; i < groupCount-1; i++ ) {
			let spacing = (tokenHeight[i] + tokenHeight[i+1]) / 2;	// spacing between centers

			if ( spacing > maxEqualCenterSpacing ) maxEqualCenterSpacing = spacing;
		}

		if ( maxEqualCenterSpacing < minCenterSpacing[groupCount-1] ) maxEqualCenterSpacing = minCenterSpacing[groupCount-1];

		totalEqualHeight = (maxEqualCenterSpacing + minSpacing)*(groupCount-1) + (tokenHeight[0] + tokenHeight[groupCount-1]) / 2;

		if ( totalEqualHeight > region.height ) {
			minSpacing = Math.floor( fittedCenterSpacing / 10 );
			fittedCenterSpacing -= minSpacing - 1;

			maxEqualCenterSpacing = fittedCenterSpacing;
			totalEqualHeight = (maxEqualCenterSpacing + minSpacing)*(groupCount-1) + (tokenHeight[0] + tokenHeight[groupCount-1]) / 2;
		}
	}
	else {
		maxEqualCenterSpacing = tokenHeight[0];
		totalEqualHeight = tokenHeight[0];
	}

	var spacingType = 1;	// 0 = center, 1 = top/bottom

	if ( totalEqualHeight <= region.height ) {
		spacingType = 0;

		totalHeight = totalEqualHeight;

		// if total height is less than a certain % of the total height, center-ish it vertically (try to match existing cards)
		if (totalHeight <= region.height*useOffsetPct)
			region.y += (region.height - totalEqualHeight) * 0.35;
	}
	else {
		minSpacing = 1;
		totalHeight = totalEqualHeight;
	}

	var scale = 1.0;

	// if rescaling needed, we're going to keep decreasing scale until it fits
	// just calculating a ratio and using that significantly overestimated the reduction of scale needed
	scaledSpacing = minSpacing;

	if (region.height < totalHeight) {
		if ( !headerBox ) {
			// give a little more space
			region.y -= 5;
			region.height += 5;
			region.y -= firstBlockOffset;
			region.height += firstBlockOffset;
		}

		// recalculate heights based on minimum values
		var minTotalHeight = 0;
		for ( let i = 0; i < groupCount; i++ ) {
			minTotalHeight += minHeight[tokensInGroup[i]-1];
		}
		minTotalHeight += minSpacing * (groupCount-1);

		if ( region.height < minTotalHeight ) {
			region.height = minTotalHeight;
		}
//g.setPaint(Color.RED);
//g.drawRect(region.x-4, region.y, region.width+8, region.height);

		do {
			scale -= 0.05;

			totalHeight = 0;
			for (let i = 0; i < groupCount; i++) {
				let Test_box = markupBox(sheet);
				Test_box.defaultStyle = diy.settings.getTextStyle(getExpandedKey(faceIndex, 'Body-style'), null);
				Test_box.alignment = diy.settings.getTextAlignment(getExpandedKey(faceIndex, 'Body-alignment'));
				Test_box.setLineTightness( $(getExpandedKey(faceIndex, 'Body', '-tightness') + '-tightness') * AHLCGObject.bodyFontTightness );
				Test_box.setTextFitting( FIT_SCALE_TEXT );

				Test_box.markupText = Test_box.markupText = '<size ' + scale*100 + '%>' + tokenText[i] + '<size ' + (1/scale)*100 + '%>';
				tokenHeight[i] = Test_box.measure( g, tokenRegion[i] );

				if (tokenHeight[i] < minHeight[tokensInGroup[i]-1]) tokenHeight[i] = minHeight[tokensInGroup[i]-1];

				totalHeight += tokenHeight[i];
			}

			minSpacing = (region.height - totalHeight) / (groupCount-1);
			if (scaledSpacing < minSpacing) scaledSpacing = minSpacing;
			totalHeight += scaledSpacing * (groupCount-1);
		} while (region.height < totalHeight && scale > 0.1);
	}

	if (scale > 1) scale = 1;
	else if (scale < 0.5) scale = 0.5;

	var yOffset;

	if (spacingType == 0) {
		yOffset = region.y + (tokenHeight[0]*scale) / 2;

		for (let i = 0; i < groupCount; i++) {
			yIconMin = 1000;
			yIconMax = 0;

			tokenRegion[i].y = yOffset - tokenHeight[i] / 2;
			tokenRegion[i].height = tokenHeight[i];

			if (tokensInGroup[i] > 1) {
				tokenRegion[i].x += 8;
				tokenRegion[i].width -= 8;
			}
			else {
				tokenRegion[i].x = region.x;
				tokenRegion[i].width = region.width;
			}

			if (scale < 1) textBoxes[i].markupText = '<size ' + scale*100 + '%>' + tokenText[i] + '<size ' + (1/scale)*100 + '%>';
			else textBoxes[i].markupText = tokenText[i];

//g.setPaint(Color.BLUE);
//g.drawRect(tokenRegion[i].x, tokenRegion[i].y, 250, tokenRegion[i].height);
			modifiedRegion = new Region( tokenRegion[i].x, tokenRegion[i].y, tokenRegion[i].width, tokenRegion[i].height );
			modifiedRegion.y += parseInt(Eons.namedObjects.AHLCGObject.bodyFontOffset);

//			if ( Eons.namedObjects.AHLCGObject.bodyFamily == 'Times New Roman' ) modifiedRegion.y -= 2;
//g.setPaint(Color.CYAN);
//g.drawRect(tokenRegion[i].x, tokenRegion[i].y, tokenRegion[i].width, tokenRegion[i].height);

			textBoxes[i].draw( g, modifiedRegion );

			let tokenIndex = 0;
			for ( let j = 0; j < 4; j++ ) {				// token
				if ( tokenGroup[j] == i+1 ) {
//					let iconY = tokenRegion[i].y + tokenRegion[i].height/2 - iconRegion.height*tokensInGroup[i]/2 + tokenIndex*iconRegion.height + 1;
					let iconY = tokenRegion[i].y + tokenRegion[i].height/2 - iconRegion.height*tokensInGroup[i]/2 + tokenIndex*iconRegion.height - 1;

					if (iconY + 1 < yIconMin) yIconMin = iconY + 1;
					if (tokenRegion[i].y < yIconMin) yIconMin = tokenRegion[i].y;
					if (iconY + iconRegion.height - 3 > yIconMax) yIconMax = iconY + iconRegion.height - 3;
					if (tokenRegion[i].y + tokenRegion[i].height > yIconMax) yIconMax = tokenRegion[i].y + tokenRegion[i].height;
//g.setPaint(Color.YELLOW);
//g.drawRect(iconRegion.x, iconY, iconRegion.width, iconRegion.height);
					sheet.paintImage( g, tokenIcon[j],
						 new Region( iconRegion.x, iconY, iconRegion.width, iconRegion.height ) );

					tokenIndex++;
				}
			}

			// draw vertical lines
			if (tokensInGroup[i] > 1) {
//				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/images/Lines.png'),
//					new Region( iconRegion.x + iconRegion.width + 2, yIconMin, 3, yIconMax - yIconMin) );
				g.setPaint( new Color( 0.0, 0.0, 0.0 ) );
				g.setStroke( new BasicStroke( 0.5 ) );
				g.drawLine(iconRegion.x + iconRegion.width + 2, yIconMin + 1, iconRegion.x + iconRegion.width + 2, yIconMax - 6);
				g.drawLine(iconRegion.x + iconRegion.width + 4, yIconMin + 1, iconRegion.x + iconRegion.width + 4, yIconMax - 6);
			}

//			yOffset += minSpacing + maxEqualCenterSpacing*scale;
			yOffset += scaledSpacing + maxEqualCenterSpacing*scale;
		}
	}
	else {
		yOffset = region.y;

		for (let i = 0; i < groupCount; i++) {
			yIconMin = 1000;
			yIconMax = 0;

			tokenRegion[i].y = yOffset;
			tokenRegion[i].height = tokenHeight[i];

			if (tokensInGroup[i] > 1) {
				tokenRegion[i].x += 8;
				tokenRegion[i].width -= 8;
			}
			else {
				tokenRegion[i].x = region.x;
				tokenRegion[i].width = region.width;
			}

			if (scale < 1) textBoxes[i].markupText = '<size ' + scale*100 + '%>' + tokenText[i] + '<size ' + (1/scale)*100 + '%>';
			else textBoxes[i].markupText = tokenText[i];
//g.setPaint(Color.RED);
//g.drawRect(tokenRegion[i].x, tokenRegion[i].y, tokenRegion[i].width, tokenRegion[i].height);

			textBoxes[i].draw( g, tokenRegion[i] );

			let tokenIndex = 0;
			for ( let j = 0; j < 4; j++ ) {				// token
				if ( tokenGroup[j] == i+1 ) {
					let iconY = tokenRegion[i].y + tokenRegion[i].height/2 - iconRegion.height*tokensInGroup[i]/2 + tokenIndex*iconRegion.height + 1;

					if (iconY + 1 < yIconMin) yIconMin = iconY + 1;
					if (tokenRegion[i].y < yIconMin) yIconMin = tokenRegion[i].y;
					if (iconY + iconRegion.height - 3 > yIconMax) yIconMax = iconY + iconRegion.height - 3;
					if (tokenRegion[i].y + tokenRegion[i].height > yIconMax) yIconMax = tokenRegion[i].y + tokenRegion[i].height;

//g.setPaint(Color.GREEN);
//g.drawRect(iconRegion.x, iconY, iconRegion.width, iconRegion.height);
					sheet.paintImage( g, tokenIcon[j],
						 new Region( iconRegion.x, iconY, iconRegion.width, iconRegion.height ) );

					tokenIndex++;
				}
			}

			// draw vertical lines
			if (tokensInGroup[i] > 1) {
//				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/images/Lines.png'),
//					new Region( iconRegion.x + iconRegion.width + 2, yIconMin, 3, yIconMax - yIconMin) );
				g.setPaint( new Color( 0.0, 0.0, 0.0 ) );
				g.setStroke( new BasicStroke( 0.5 ) );
				g.drawLine(iconRegion.x + iconRegion.width + 2, yIconMin + 1, iconRegion.x + iconRegion.width + 2, yIconMax - 1);
				g.drawLine(iconRegion.x + iconRegion.width + 4, yIconMin + 1, iconRegion.x + iconRegion.width + 4, yIconMax - 1);
			}

			yOffset += minSpacing + tokenHeight[i];
		}
	}
}

function drawTrackerBox( g, diy, sheet, box ) {
	var faceIndex = sheet.getSheetIndex();

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'TrackerBox-region') );

	var nameRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'TrackerName-region') );
	nameRegion.y += parseInt(Eons.namedObjects.AHLCGObject.titleFontOffset);

	// if back and no TrackerBoxBack, use the front
	var trackerBox = null;
	var trackerHeight = 0;
	if ( $('TrackerBox' + BindingSuffixes[faceIndex]) ) {
		trackerBox = $('TrackerBox' + BindingSuffixes[faceIndex]);
		trackerHeight = $('TrackerHeight' + BindingSuffixes[faceIndex]);
	}
	if ( !trackerBox ) {
		trackerBox = $TrackerBox;
		trackerHeight = $TrackerHeight;
	}

	let diff = region.height * (100.0 - trackerHeight) / 100.0;
	region.y += diff;
	region.height -= diff;
	nameRegion.y += diff;

//	var image = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-ChaosTrackerBox.png');
//	var image = ImageUtils.get('ArkhamHorrorLCG/overlays/TestTracker.png');
	var boxImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-BoxTracker.png');
	var lineImage = ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-BoxTrackerLine.png');

	var w = boxImage.getWidth();
	var h = boxImage.getHeight();

//	sheet.paintImage( g, image, region );
	// top section, line expanded, bottom region (same as top, flipped)
	sheet.paintImage( g, boxImage,
		new Region( region.x, region.y, w, h ));
	sheet.paintImage( g, lineImage,
		new Region( region.x, region.y + h, w, region.height - h*2 ));
	sheet.paintImage( g, ImageUtils.mirror( boxImage, false, true ),
		new Region( region.x, region.y + region.height - h, w, h ));

//	box.markupText = $( 'TrackerBox' + BindingSuffixes[faceIndex] );
	if ( trackerBox ) {
		box.markupText = trackerBox;
		box.drawAsSingleLine( g, nameRegion );
	}
}

function drawScenarioBody( g, diy, sheet, bodyBox ) {
	var faceIndex = sheet.getSheetIndex();

	var showTitle = false;
	var region;

	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	bodyBox.setLineTightness( $(getExpandedKey(faceIndex, 'Body', '-tightness') + '-tightness') * AHLCGObject.bodyFontTightness );
	bodyBox.setTextFitting( FIT_SCALE_TEXT );

	// setting an action listener is hard because the box doesn't exist during layout, this is just easier...
	bodyBox.setReplacementForTag('fullnameb', $TitleBack );

	var pageType = $( 'Template' + BindingSuffixes[faceIndex] );

	if ( pageType == 'Title' ) {
		if ( faceIndex == FACE_FRONT ) {
			if ( diy.name != '' ) showTitle = true;
		}
		else {
			if ( $TitleBack != '' ) showTitle = true;
		}

		if ( showTitle ) region = diy.settings.getRegion( getExpandedKey( faceIndex, 'BodyName-region') );
		else region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Body-region') );
	}
	else if ( pageType == 'Resolution' ) {
		region = diy.settings.getRegion( getExpandedKey( faceIndex, 'BodyResolution-region') );
	}
	else {
		region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Body-region') );
	}

//	if ( AHLCGObject.bodyFamily == 'Times New Roman' ) region.y -= 2;
	region.y += parseInt(Eons.namedObjects.AHLCGObject.bodyFontOffset);

	// I hate this
	if ( CardTypes[faceIndex] == 'StoryChaos' ) {
		var title = faceIndex == FACE_FRONT ? diy.name : $TitleBack;
		var nlIndex = title.indexOf("\n");

		if (nlIndex > 0) {
			let offset = 24;

			region.y += offset;
			region.height -= offset;
		}
	}

	bodyBox.markupText = $( 'Rules' + BindingSuffixes[faceIndex] );

	updateNameTags( bodyBox, diy );
	bodyBox.draw( g, region );
}

function drawVictory( g, diy, sheet, victoryBox ) {
	var faceIndex = sheet.getSheetIndex();

	let victory_text = $( 'Victory' + BindingSuffixes[faceIndex] );
	if (victory_text != '' && victory_text.slice(-1) != '.'){
		victory_text = victory_text + '.';
	}
	victoryBox.markupText = '<vic>' + victory_text + '</vic>';
	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Victory-region') );
	region.y += parseInt(Eons.namedObjects.AHLCGObject.victoryFontOffset);

	victoryBox.draw( g, region );
}

function drawArtist( g, diy, sheet, artistBox, forceFrontValue ) {
	var faceIndex = sheet.getSheetIndex();

	var valueIndex = forceFrontValue ? 0 : faceIndex;

	var artistText = String( $( 'Artist' + BindingSuffixes[valueIndex] ) );
	if ( artistText == '' && $PortraitShare && $PortraitShare == '1' ) {
		artistText = String( $Artist );
	}

	if ( artistText.length > 0 ) {
		var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Artist-region' ) );
		if ( $Orientation == 'Reversed' ) region = shiftRegion( region, CardTypes[faceIndex] );
//		if ( Eons.namedObjects.AHLCGObject.bodyFamily == 'Times New Roman' ) region.y -= 1;
		region.y += parseInt(Eons.namedObjects.AHLCGObject.collectionFontOffset);

		artistBox.markupText = #AHLCG-IllustratorShort + ' ' + artistText;
		artistBox.drawAsSingleLine( g, region );
	}
}

function drawCopyright( g, diy, sheet, copyrightBox, collectorX ) {
	var faceIndex = sheet.getSheetIndex();

	var copyright = $Copyright;

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Copyright-region' ) );
	region.y += parseInt(Eons.namedObjects.AHLCGObject.collectionFontOffset);
	if ( $Orientation == 'Reversed' ) region = shiftRegion( region, CardTypes[faceIndex] );

	if ( Eons.namedObjects.AHLCGObject.bodyFamily == 'Times New Roman' ) region.y -= 1;

	// Please don't ask me why I have to do a markupText += X in order to get the color to change
	copyrightBox.markupText = '';
	copyrightBox.markupText += copyright;
	var width = copyrightBox.drawAsSingleLine( g, region );

	return region.x - width;
}

// draws collection, encounter, and copyright info, keeps track of offset because of Threads of Fate style regions
function drawCollectorInfo( g, diy, sheet, collectionNumberBox, collectionSuffix, collectionIcon, encounterNumberBox, encounterIcon, copyrightBox, artistBox ) {
	var faceIndex = sheet.getSheetIndex();

	if ( collectionNumberBox ) collectionNumberBox.defaultStyle = diy.settings.getTextStyle(getExpandedKey( faceIndex, 'CollectionNumber-style'), null);
	if ( encounterNumberBox ) encounterNumberBox.defaultStyle = diy.settings.getTextStyle(getExpandedKey( faceIndex, 'EncounterNumber-style'), null);
	if ( copyrightBox ) copyrightBox.defaultStyle = diy.settings.getTextStyle(getExpandedKey( faceIndex, 'Copyright-style'), null);

	var collectorX = sheet.getTemplateWidth();

	if ( collectionNumberBox ) {
		collectorX = drawCollectionNumber( g, diy, sheet, collectionNumberBox, collectionSuffix );
		collectorX -= 3;
	}

	if ( collectionIcon ) {
		collectorX = drawCollectionIcon( g, diy, sheet, collectorX );
		collectorX -= 11;
	}
	else {
		collectorX -= 21;
	}

	if ( encounterIcon ) {
		drawEncounterIcon( g, diy, sheet );
	}

	if ( encounterNumberBox ) {
		collectorX = drawEncounterInfo( g, diy, sheet, encounterNumberBox, collectorX );
		collectorX -= 20;
	}

	if ( copyrightBox ) collectorX = drawCopyright( g, diy, sheet, copyrightBox, collectorX );

	if ( artistBox ) drawArtist( g, diy, sheet, artistBox, false );
}

function drawSubtype( g, diy, sheet, box, text ) {
	var faceIndex = sheet.getSheetIndex();

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Subtype-region' ) );
	region.y += parseInt(Eons.namedObjects.AHLCGObject.typeFontOffset);
//	if ( Eons.namedObjects.AHLCGObject.bodyFamily == 'Times New Roman' ) region.y -= 2;

	box.markupText = text.toUpperCase();
	box.draw( g, region );
}

function drawCost( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();

	var cost = $( 'ResourceCost' + BindingSuffixes[faceIndex] );
	var costRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'Cost-region' ) );

	if ( cost == '-' ) {
		if ( CardTypes[ faceIndex ] == 'AssetStory' )
			drawDash( g, diy, sheet, costRegion, 0, -2 );
		else if ( $CardClass == 'Weakness' || $CardClass == 'BasicWeakness' )
			drawDash( g, diy, sheet, costRegion, 0, 0 );
		else
			drawDash( g, diy, sheet, costRegion, 2, 0 );
	}
	else if ( cost == 'X' ) {
		sheet.drawOutlinedTitle( g, cost, costRegion, Eons.namedObjects.AHLCGObject.costFont, 14.0, 0.8, new Color(1, 1, 1), new Color(0, 0, 0), 0, true );
	}
	else {
		sheet.drawOutlinedTitle( g, cost, costRegion, Eons.namedObjects.AHLCGObject.costFont, 16.0, 0.8, new Color(1, 1, 1), new Color(0, 0, 0), 0, true );
	}
}

function drawLevel( g, diy, sheet, className ) {
	var faceIndex = sheet.getSheetIndex();
	var level = $( 'Level' + BindingSuffixes[faceIndex] );

	if (level == 'None') {
		if ( CardTypes[ faceIndex] == 'Skill' ) {
			sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-NoLevelSkill.png'),
				diy.settings.getRegion( getExpandedKey( faceIndex, 'NoLevel-region' ) ) );
		}
		else {
			sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-NoLevel.png'),
				diy.settings.getRegion( getExpandedKey( faceIndex, 'NoLevel-region' ) ) );
		}
	}
	else if (level > 0) {
		sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Level-' + level + '.png'),
			diy.settings.getRegion( getExpandedKey( faceIndex, 'Level-region' ) ) );
	}
}

function drawSkillIcons( g, diy, sheet, className ) {
	var faceIndex = sheet.getSheetIndex();

	var maxIcons = 5;
	if ( CardTypes[faceIndex] == 'Skill' ) maxIcons = 6;

	for ( let index = 1; index <= maxIcons; index++ ) {
		let skillName = $( 'Skill' + index + BindingSuffixes[faceIndex] );

		if ( skillName != 'None' ) {
			sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-SkillBox-' + getClassInitial( className ) + '.png'),
				diy.settings.getRegion( getExpandedKey( faceIndex, 'Skill' + index + '-region' ) ) );

			if ( className == 'Weakness' || className == 'BasicWeakness' || className == 'StoryWeakness' ) {
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-SkillIcon-' + getSkillInitial( String(skillName) ) + 'W.png'),
					diy.settings.getRegion( getExpandedKey( faceIndex, 'SkillIcon' + index + '-region') ) );
			}
			else {
				sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-SkillIcon-' + getSkillInitial( String(skillName) ) + '.png'),
					diy.settings.getRegion( getExpandedKey( faceIndex, 'SkillIcon' + index + '-region') ) );
			}
		}
	}
}

function drawSlots( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();

	var slotName1 = $( 'Slot' + BindingSuffixes[ faceIndex] );
	var slotName2 = $( 'Slot2' + BindingSuffixes[ faceIndex] );

	if (slotName2 != 'None' ) {
		sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Slot-' + slotName1 + '.png'),
			diy.settings.getRegion( getExpandedKey( faceIndex, 'Slot2' + '-region' ) ) );

		sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Slot-' + slotName2 + '.png'),
			diy.settings.getRegion( getExpandedKey( faceIndex, 'Slot-region' ) ) );
	}
	else if (slotName1 != 'None' ) {
		sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Slot-' + slotName1 + '.png'),
			diy.settings.getRegion( getExpandedKey( faceIndex, 'Slot-region' ) ) );
	}
}

function drawSkills( g, diy, sheet, boxArray, nameArray ) {
	var faceIndex = sheet.getSheetIndex();
	var skillBox;

	for ( let i = 0; i < boxArray.length; i++ ) {
		skillBox = boxArray[i];

		// can't make this work without creating a new box
		// otherwise, you have to edit the text for the color change to happen
		if ( $CardClass != null && $CardClass.indexOf('Parallel') >= 0) {
			skillBox = markupBox(sheet);
			skillBox.defaultStyle = diy.settings.getTextStyle(getExpandedKey(FACE_FRONT, 'ParallelSkill-style'), null);
			skillBox.alignment = diy.settings.getTextAlignment(getExpandedKey(FACE_FRONT, 'Skill-alignment'));
		}

		skillBox.markupText = $( nameArray[i] + BindingSuffixes[faceIndex] );

		skillBox.drawAsSingleLine( g, diy.settings.getRegion( getExpandedKey( faceIndex, nameArray[i] + '-region' ) ) );
	}
}

function drawStamina( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();

	var stamina = $( 'Stamina' + BindingSuffixes[ faceIndex] );
	if ( stamina == 'Star' ) stamina = '*';
	var perInvestigator = $( 'PerInvestigatorStamina' + BindingSuffixes[faceIndex] );

	var offsetX = {
		'-': -1,
		'X': -2,
		'': -1,
		'*': -2,
		'1': -1,
		'2': -2,
		'3': -2,
		'4': -1,
		'5': -1,
		'6': -1,
		'7': -1,
		'8': -1,
		'9': -1,
		'10': -1,
		'11': -1,
		'12': -1,
		'13': -1,
		'14': -1,
		'15': -1 };

	var offsetY = {
		'-': -5,
		'*': 14,
		'X': -4,
		'': -1,
		'1': -3,
		'2': -3,
		'3': -3,
		'4': -3,
		'5': -4,
		'6': -4,
		'7': -4,
		'8': -4,
		'9': -4,
		'10': -4,
		'11': -4,
		'12': -4,
		'13': -4,
		'14': -4,
		'15': -4 };

    if (stamina != 'None') {
        let region = diy.settings.getRegion(getExpandedKey(faceIndex, 'Stamina-region'));
        sheet.paintImage(g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-StaminaBase.png'), region);
        try {
            region.x += offsetX[stamina];
            region.y += offsetY[stamina];
        } catch (e) {
            region.x += offsetX["X"];
            region.y += offsetY["X"];
        }

        if (stamina == '-') {
            sheet.drawOutlinedTitle(g, stamina, region, Eons.namedObjects.AHLCGObject.symbolFont, 9.8, 1.5, new Color(0.996, 0.945, 0.859), new Color(0.68, 0.12, 0.22), 0, true);
        }
        else if (stamina == '*') {
            // Teutonic
            sheet.drawOutlinedTitle(g, stamina, region, Eons.namedObjects.AHLCGObject.costFont, 18.5, 1.5, new Color(0.996, 0.945, 0.859), new Color(0.68, 0.12, 0.22), 0, true);
        }
        else if (perInvestigator == '1') {
            let staminaPerInvRegion = diy.settings.getRegion(getExpandedKey(faceIndex, 'StaminaPerInvIcon-region'));
            region.x -= 5;

            let fontSize = 14;
            let symbolFontSize = 6.5;

            if (stamina == 1) {
                region.x -= 1;
                staminaPerInvRegion.x -= 4;
            }
            else if (stamina > 9) {
                fontSize = 12;
                symbolFontSize = 5.5;
                staminaPerInvRegion.x += 4;
            }

            sheet.drawOutlinedTitle(g, stamina, region, Eons.namedObjects.AHLCGObject.enemyFont, fontSize, 1.5, new Color(0.996, 0.945, 0.859), new Color(0.68, 0.12, 0.22), 0, true);
            sheet.drawOutlinedTitle(g, 'p', staminaPerInvRegion, Eons.namedObjects.AHLCGObject.symbolFont, symbolFontSize, 1.5, new Color(0.996, 0.945, 0.859), new Color(0.68, 0.12, 0.22), 0, true);
        }
        else if (stamina.length() > 1) {	// 10+
            sheet.drawOutlinedTitle(g, stamina, region, Eons.namedObjects.AHLCGObject.enemyFont, 11.5, 1.5, new Color(0.996, 0.945, 0.859), new Color(0.68, 0.12, 0.22), 0, true);
        }
        else {
            sheet.drawOutlinedTitle(g, stamina, region, Eons.namedObjects.AHLCGObject.enemyFont, 14, 1.5, new Color(0.996, 0.945, 0.859), new Color(0.68, 0.12, 0.22), 0, true);
        }
   	}
}

function drawSanity( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();

	var sanity = $( 'Sanity' + BindingSuffixes[faceIndex] );
	if ( sanity == 'Star' ) sanity = '*';
	var perInvestigator = $( 'PerInvestigatorSanity' + BindingSuffixes[faceIndex] );

	var offsetX = {
		'-': 0,
		'X': -2,
		'': -1,
		'*': 0,
		'1': -1,
		'2': 0,
		'3': 0,
		'4': -1,
		'5': 0,
		'6': 0,
		'7': 0,
		'8': -1,
		'9': 0,
		'10': 0,
		'11': 0,
		'12': 0,
		'13': 0,
		'14': 0,
		'15': 0 };

	var offsetY = {
		'-': -7,
		'X': -4,
		'': -1,
		'*': 12,
		'1': -5,
		'2': -5,
		'3': -5,
		'4': -5,
		'5': -6,
		'6': -6,
		'7': -6,
		'8': -6,
		'9': -6,
		'10': -6,
		'11': -6,
		'12': -6,
		'13': -6,
		'14': -6,
		'15': -6 };

	if (sanity != 'None') {
		let region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Sanity-region' ) );
		sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-SanityBase.png'), region );
        try {
            region.x += offsetX[sanity];
            region.y += offsetY[sanity];
        } catch (e) {
            region.x += offsetX["X"];
            region.y += offsetY["X"];
        }

		if ( sanity == '-' ) {
			sheet.drawOutlinedTitle( g, sanity, region, Eons.namedObjects.AHLCGObject.symbolFont, 9.8, 1.5, new Color(0.996, 0.945, 0.859), new Color(0.25, 0.33, 0.44), 0, true );
		}
		else if ( sanity == '*' ) {
			// Teutonic
			sheet.drawOutlinedTitle( g, sanity, region, Eons.namedObjects.AHLCGObject.costFont, 18.5, 1.5, new Color(0.996, 0.945, 0.859), new Color(0.25, 0.33, 0.44), 0, true );
		}
		else if (perInvestigator == '1') {
			let sanityPerInvRegion = diy.settings.getRegion( getExpandedKey(faceIndex, 'SanityPerInvIcon-region' ) );
			region.x -= 5;

			let fontSize = 14;
			let symbolFontSize = 6.5;

			if ( sanity == 1 ) {
				region.x -= 1;
				sanityPerInvRegion.x -= 4;
			}
			else if ( sanity > 9 ) {
				fontSize = 12;
				symbolFontSize = 5.5;
				sanityPerInvRegion.x += 4;
			}

			sheet.drawOutlinedTitle( g, sanity, region, Eons.namedObjects.AHLCGObject.enemyFont, fontSize, 1.5, new Color(0.996, 0.945, 0.859), new Color(0.25, 0.33, 0.44), 0, true );
			sheet.drawOutlinedTitle( g, 'p', sanityPerInvRegion, Eons.namedObjects.AHLCGObject.symbolFont, symbolFontSize, 1.5, new Color(0.996, 0.945, 0.859), new Color(0.25, 0.33, 0.44), 0, true );
		}
		else if ( sanity.length() > 1 ) {	// 10+
			sheet.drawOutlinedTitle( g, sanity, region, Eons.namedObjects.AHLCGObject.enemyFont, 11.5, 1.5, new Color(0.996, 0.945, 0.859), new Color(0.25, 0.33, 0.44), 0, true );
		}
		else {
			sheet.drawOutlinedTitle( g, sanity, region, Eons.namedObjects.AHLCGObject.enemyFont, 14, 1.5, new Color(0.996, 0.945, 0.859), new Color(0.25, 0.33, 0.44), 0, true );
		}

//		sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Sanity-' + sanity + '.png'),
//			diy.settings.getRegion( getExpandedKey( faceIndex, 'Sanity-region' ) ) );
	}
}

function drawCollectionNumber( g, diy, sheet, collectionNumberBox, drawSuffix ) {
	var faceIndex = sheet.getSheetIndex();

	var collectionNumber = $( 'CollectionNumber' + BindingSuffixes[faceIndex] );
	if (collectionNumber == null) collectionNumber = $CollectionNumber;

	// Translation project
	if ( collectionNumber == '' ) return;

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'CollectionNumber-region' ) );
	region.y += parseInt(Eons.namedObjects.AHLCGObject.collectionFontOffset);
	if ( $Orientation == 'Reversed' ) region = shiftRegion( region, CardTypes[faceIndex] );
//	if ( Eons.namedObjects.AHLCGObject.bodyFamily == 'Times New Roman' ) region.y -= 1;

	collectionNumberBox.markupText = collectionNumber;

	if (drawSuffix) {
		if (faceIndex == FACE_FRONT) collectionNumberBox.markupText += 'a';
		else collectionNumberBox.markupText += 'b';
	}

	var width = collectionNumberBox.drawAsSingleLine( g, region );

	return region.x + region.width - width;	// return left edge
}

function drawCollectionIcon( g, diy, sheet, collectorX ) {
	var faceIndex = sheet.getSheetIndex();

	var iconName = $Collection;
	var icon;

	let region = diy.settings.getRegion(
		getExpandedKey( faceIndex, 'DefaultCollection-portrait-clip-region' ),
		// default - if no DefaultCollection defined, use normal Collection
		diy.settings.getRegion( getExpandedKey( faceIndex, 'Collection-portrait-clip-region' ) )
	);

	if ( faceIndex == FACE_FRONT && $Orientation == 'Reversed' ) region = shiftRegion( region, CardTypes[faceIndex] );

	// x = left edge of region, using collectorX
	var x = collectorX - region.width;

	// we want the leftmost (if more space is being taken up because of Threads-like numbers)
	if (x < region.x) region.x = collectorX - region.width;

	// resource
	if ( $CollectionType == '0' ) {
		if ( CardTypes[faceIndex] == 'Story' ) {
			icon = ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-' + iconName + '.png');
		} else {
			icon = createInvertedImage( ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-' + iconName + '.png') );
		}
		sheet.paintImage( g, icon, region );
	} else {
		icon = PortraitList[getPortraitIndex('Collection')].getImage();
		if (CardTypes[faceIndex] != 'Story'){
			icon = createInvertedImage(icon);
		}
		sheet.paintImage( g, icon, region);
	}

	return region.x;
}

function drawEncounterInfo( g, diy, sheet, encounterInfoBox, collectorX ) {
	var faceIndex = sheet.getSheetIndex();

	var encounterNumber = $( 'EncounterNumber' + BindingSuffixes[faceIndex] );
	if (encounterNumber == null) encounterNumber = $EncounterNumber;

	var encounterTotal = $( 'EncounterTotal' + BindingSuffixes[faceIndex] );
	if (encounterTotal == null) encounterTotal = $EncounterTotal;

	if ( encounterNumber == '' && encounterTotal == '' ) return 0;

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'EncounterNumber-region' ) );
	region.y += parseInt(Eons.namedObjects.AHLCGObject.collectionFontOffset);

	if ( $Orientation == 'Reversed' ) region = shiftRegion( region, CardTypes[faceIndex] );

	// x = left edge of region, using collectorX
	var x = collectorX - region.width;

	// we want the leftmost (if more space is being taken up because of Threads-like numbers)
	if (x < region.x) region.x = collectorX - region.width;

//	if ( Eons.namedObjects.AHLCGObject.bodyFamily == 'Times New Roman' ) region.y -= 1;

	// Please don't ask me why I have to do a markupText += X in order to get the color to change
	encounterInfoBox.markupText = encounterNumber;
	if ( Eons.namedObjects.AHLCGObject.OS == 'Mac' ) {
		encounterInfoBox.markupText += '\u200a/\u200a' + encounterTotal;
	}
	else {
		encounterInfoBox.markupText += ' / ' + encounterTotal;
	}

	var width = encounterInfoBox.drawAsSingleLine( g, region );

	return region.x + region.width - width;		// return left edge
}

function drawEncounterIcon( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();

	var iconName = $Encounter;
	var returnSet = false;

	// To prevent issues with changing icon locations across card types, we reset this one to the default
	// before doing the below manipulations. This is only required for custom icons on events, but never hurt.
	diy.settings.reset('AHLCG-' + CardTypes[0] + '-Encounter-portrait-clip-region');
	diy.settings.reset('AHLCG-' + CardTypes[0] + '-ReturnEncounter-portrait-clip-region');

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'DefaultEncounter-portrait-clip-region' ),
		// default - if no DefaultEncounter defined, use normal Encounter
		diy.settings.getRegion( getExpandedKey( faceIndex, 'Encounter-portrait-clip-region' ) ) );

	if ( faceIndex == FACE_FRONT && $Orientation == 'Reversed' ) {
		region = reverseRegion( region );
	}

	if ( iconName.substring(0, 6) == 'Return') {
		region = diy.settings.getRegion( getExpandedKey( faceIndex, 'DefaultReturnEncounter-portrait-clip-region' ),
			// default - if no DefaultReturnEncounter defined, use normal ReturnEncounter
			diy.settings.getRegion( getExpandedKey( faceIndex, 'ReturnEncounter-portrait-clip-region' ) ) );

		if ( faceIndex == FACE_FRONT && $Orientation == 'Reversed' ) {
			region = reverseRegion( region );
		}

		// special draw, doesn't use Return icon, fills space and removes the original icon
		if ( CardTypes[faceIndex] == 'Enemy' || CardTypes[faceIndex] == 'WeaknessEnemy' ||
			 CardTypes[faceIndex] == 'Location' || CardTypes[faceIndex] == 'LocationBack' ||
			 CardTypes[faceIndex] == 'Treachery' || CardTypes[faceIndex] == 'WeaknessTreachery' ) {

			returnSet = true;
			iconName = iconName.substring(8);

			if ( iconName == 'ExtracurricularActivities' )
				iconName = 'ExtracurricularActivity';

			if ( iconName == 'TheRainforest' )
				iconName = 'Rainforest';

			// resource
			if ( $EncounterType == '0' ) {
				sheet.paintImage( g, createReturnToImage( ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-' + iconName + '.png') ), region );
			}
			// custom
			else {
				sheet.paintImage( g, createReturnToImage( PortraitList[getPortraitIndex( 'Encounter' )].getImage() ), region );
			}
		}
		else {
			let icon = ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-' + iconName + '.png');
			sheet.paintImage( g, icon, region );
		}
	} else {
		// resource
		if ( $EncounterType == '0' ) {
            let icon = ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-' + iconName + '.png');

            if (CardTypes[faceIndex] == 'Ultimatum'){
				icon = createInvertedImage(icon);
            }

			sheet.paintImage( g, icon, region );
		}
		// custom
		else {
			// using this way even though a bit convoluted because it allows the scale and other settings in the SE interface to function properly
			// [0] because that is the type the portrait is reading its setting from
			diy.settings.setRegion( 'AHLCG-' + CardTypes[0] + '-Encounter-portrait-clip-region', region );
			let portrait = PortraitList[getPortraitIndex('Encounter')];
            portrait.paint( g, sheet.getRenderTarget() );
		}
	}
}

function drawBasicWeaknessIcon( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();

	if ( useReplacementTemplate( faceIndex )) return;

	sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-BasicWeakness.png'),
		diy.settings.getRegion( getExpandedKey( faceIndex, 'BasicWeaknessIcon-region' ) ) );
}

function drawOverlay( g, diy, sheet, overlayName ) {
	var faceIndex = sheet.getSheetIndex();

	// currently drawOverlay is only for weakness icons
	if ( useReplacementTemplate( faceIndex )) return;

	sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-' + overlayName + '.png'),
		diy.settings.getRegion( getExpandedKey( faceIndex, overlayName + '-region' ) ) );
}

function drawEnemyStats( g, diy, sheet, statNames ) {
	var faceIndex = sheet.getSheetIndex();

	for (let i = 0; i < statNames.length; i++) {
		let stat = statNames[i];
		let statValue = $( stat + BindingSuffixes[faceIndex] );
		let perInvestigator = $( 'PerInvestigator' + stat + BindingSuffixes[faceIndex] );
		let statRegion = diy.settings.getRegion( getExpandedKey(faceIndex, stat + '-region' ) );

		if ( statValue == '-' ) {
			statRegion.y += 6.0;

			sheet.drawOutlinedTitle( g, '\u2014', statRegion, Eons.namedObjects.AHLCGObject.costFont, 11.5, 0.8, new Color(1, 1, 1), new Color(0, 0, 0), 0, true );
		}
		else if (perInvestigator == '1') {
			let statRegion = diy.settings.getRegion( getExpandedKey(faceIndex, stat + 'PerInv-region' ) );
			let statPerInvRegion = diy.settings.getRegion( getExpandedKey(faceIndex, stat + 'PerInvIcon-region' ) );

			let fontSize = 11.5;
			let symbolFontSize = 5.5;

//			if ( statValue == 'X' ) {
//				statRegion.x += 2;
//				statPerInvRegion.x += 2;
//			}
			if ( statValue == 1 ) {
				statRegion.x -= 1;
				statPerInvRegion.x -= 4;

			}
			else if ( statValue > 9 ) {
				fontSize = 10.5;
				symbolFontSize = 5.0;
				statPerInvRegion.x += 4;
			}

			sheet.drawOutlinedTitle( g, statValue, statRegion, Eons.namedObjects.AHLCGObject.enemyFont, fontSize, 0.8, new Color(1, 1, 1), new Color(0, 0, 0), 0, true );
			sheet.drawOutlinedTitle( g, 'p', statPerInvRegion, Eons.namedObjects.AHLCGObject.symbolFont, symbolFontSize, 0.8, new Color(1, 1, 1), new Color(0, 0, 0), 0, true );
		}
		else {
			sheet.drawOutlinedTitle( g, statValue, statRegion, Eons.namedObjects.AHLCGObject.enemyFont, 11.0, 0.8, new Color(1, 1, 1), new Color(0, 0, 0), 0, true );
		}
	}
}

function drawEnemyLocationHealth( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();
	var perInvestigator = $( 'PerInvestigatorHealth' + BindingSuffixes[faceIndex] );
	var health = $( 'Health' + BindingSuffixes[faceIndex] );

	if ( health == '-' ) {
		let healthRegion = diy.settings.getRegion( getExpandedKey(faceIndex, 'HealthPerInv-region' ) );
		healthRegion.x += 5.0;
		healthRegion.y += 6.0;

		sheet.drawOutlinedTitle( g, '\u2014', healthRegion, Eons.namedObjects.AHLCGObject.costFont, 11.5, 0.8, new Color(1, 1, 1), new Color(0, 0, 0), 0, true );
	}
	else if (perInvestigator == '1') {
		let healthRegion = diy.settings.getRegion( getExpandedKey(faceIndex, 'HealthPerInv-region' ) );
		let healthPerInvRegion = diy.settings.getRegion( getExpandedKey(faceIndex, 'HealthPerInvIcon-region' ) );
		let fontSize = 13.5;

		if ( health == 'X' ) {
			healthRegion.x += 2;
			healthPerInvRegion.x += 2;
		}

		if ( health > 9 ) {
			fontSize = 13.0;
			healthPerInvRegion.x += 4;
		}

		sheet.drawOutlinedTitle( g, health, healthRegion, Eons.namedObjects.AHLCGObject.enemyFont, fontSize, 0.8, new Color(1, 1, 1), new Color(0, 0, 0), 0, true );
		sheet.drawOutlinedTitle( g, 'p', healthPerInvRegion, Eons.namedObjects.AHLCGObject.symbolFont, 6.5, 0.8, new Color(1, 1, 1), new Color(0, 0, 0), 0, true );
	}
	else {
		sheet.drawOutlinedTitle( g, health, diy.settings.getRegion( getExpandedKey(faceIndex, 'Health-region' ) ), Eons.namedObjects.AHLCGObject.enemyFont, 13.5, 0.8, new Color(1, 1, 1), new Color(0, 0, 0), 0, true );
	}
}

function drawEnemyHealth( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();
	var perInvestigator = $( 'PerInvestigator' + BindingSuffixes[faceIndex] );
	var health = $( 'Health' + BindingSuffixes[faceIndex] );

	if ( health == '-' ) {
		let healthRegion = diy.settings.getRegion( getExpandedKey(faceIndex, 'HealthPerInv-region' ) );
		healthRegion.x += 5.0;
		healthRegion.y += 6.0;

		sheet.drawOutlinedTitle( g, '\u2014', healthRegion, Eons.namedObjects.AHLCGObject.costFont, 11.5, 0.8, new Color(1, 1, 1), new Color(0, 0, 0), 0, true );
	}
	else if (perInvestigator == '1') {
		let healthRegion = diy.settings.getRegion( getExpandedKey(faceIndex, 'HealthPerInv-region' ) );
		let healthPerInvRegion = diy.settings.getRegion( getExpandedKey(faceIndex, 'HealthPerInvIcon-region' ) );
		let fontSize = 13.5;

		if ( health == 'X' ) {
			healthRegion.x += 2;
			healthPerInvRegion.x += 2;
		}

		if ( health > 9 ) {
			fontSize = 13.0;
			healthPerInvRegion.x += 4;
		}

		sheet.drawOutlinedTitle( g, health, healthRegion, Eons.namedObjects.AHLCGObject.enemyFont, fontSize, 0.8, new Color(1, 1, 1), new Color(0, 0, 0), 0, true );
		sheet.drawOutlinedTitle( g, 'p', healthPerInvRegion, Eons.namedObjects.AHLCGObject.symbolFont, 6.5, 0.8, new Color(1, 1, 1), new Color(0, 0, 0), 0, true );
	}
	else {
		sheet.drawOutlinedTitle( g, health, diy.settings.getRegion( getExpandedKey(faceIndex, 'Health-region' ) ), Eons.namedObjects.AHLCGObject.enemyFont, 13.5, 0.8, new Color(1, 1, 1), new Color(0, 0, 0), 0, true );
	}
}

function drawDamage( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();

	var damage = $( 'Damage' + BindingSuffixes[faceIndex] );

	for ( let i = 1; i <= damage; i++ ) {
		sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Damage.png'),
			diy.settings.getRegion( getExpandedKey(faceIndex, 'Damage' + i + '-region' ) ) );
	}
}

function drawHorror( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();

	var horror = $( 'Horror' + BindingSuffixes[faceIndex] );

	for ( let i = 1; i <= horror; i++ ) {
		sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-Horror.png'),
			diy.settings.getRegion( getExpandedKey(faceIndex, 'Horror' + i + '-region' ) ) );
	}
}

function drawLocationIcon( g, diy, sheet, locationIconName, drawBaseCircle )
{
	var faceIndex = sheet.getSheetIndex();
	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	if (drawBaseCircle) {
		sheet.paintImage( g, ImageUtils.get('ArkhamHorrorLCG/overlays/AHLCG-LocationCircle.png'),
			diy.settings.getRegion( getExpandedKey( faceIndex, 'BaseIcon-region' ) ) );
	}

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, locationIconName + '-region' ) );

	var locationIcon = $( locationIconName + BindingSuffixes[faceIndex] );

	if ( locationIcon == 'Copy front' )	locationIcon = $( locationIconName );

	if ( locationIcon != 'None' && locationIcon != 'Empty' && locationIcon != null) {
		var index = AHLCGObject.locationIcons.indexOf( locationIcon );

		var icon_tinter = new TintCache( new TintFilter(), Eons.namedObjects.AHLCGObject.baseLocationIcon );
		var hsb = diy.settings.getTint( 'AHLCG-' + locationIcon + '-tint' );
		icon_tinter.setFactors( hsb[0], hsb[1], hsb[2] );

		var locationImage = icon_tinter.getTintedImage();

		var ig = locationImage.createGraphics();
		ig.drawImage( ImageUtils.get( 'ArkhamHorrorLCG/icons/AHLCG-Loc' + locationIcon + '.png' ), 5, 5, null );

		sheet.paintImage(g, locationImage, region );
	}
}

function drawShroud( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();
	var piIconSize = 7.5;

	var lightColor = new Color(0.996, 0.945, 0.859);
	var darkColor = new Color(0, 0, 0);

	var textColor = lightColor;
	var borderColor = darkColor;

	var perInvestigator = $( 'ShroudPerInvestigator' + BindingSuffixes[faceIndex] );
	var shroud = $( 'Shroud' + BindingSuffixes[faceIndex] );

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Shroud-region' ) );

	if ( Number.isInteger( shroud ) && shroud > 9 ) {	// is possible??
		piIconSize = 7.0;
	}

	if ( shroud == 1 || shroud == 4 ) {
		region.x -= 2;
	}
	else if ( shroud == 'X' ) region.x -= 1;


	if ( shroud == '-' ) {
		sheet.drawOutlinedTitle( g, shroud, region, Eons.namedObjects.AHLCGObject.symbolFont, 12.0, 1.5, textColor, borderColor, 0, true );
	}
	else if ( perInvestigator == '1' ) {
		var perInvShroudRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'ShroudPerInv-region' ) );
		var perInvRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'ShroudPerInvIcon-region' ) );

		if ( Number.isInteger( shroud ) && shroud > 9 ) {
			perInvRegion.x += 1;
		}
		if ( Number.isInteger( shroud ) && shroud > 19 ) {
			perInvShroudRegion.x += 1;
			perInvRegion.x += 3;
		}

		let fontSize = 14.0;

		if ( shroud == 'X' ) {
			perInvShroudRegion.x += 3;
			perInvRegion.x += 3;
		}
		else if ( shroud == 1 ) {
			perInvRegion.x -= 4;
		}
		else if ( shroud.length() > 1 ) {
			perInvRegion.x += 2;
			fontSize = 11.0;
		}

		if ( shroud == 'Star' ) {
			perInvShroudRegion.x += 1;
			perInvShroudRegion.y += 2;
			perInvRegion.x -= 2;
			sheet.drawOutlinedTitle( g, '*', perInvShroudRegion, Eons.namedObjects.AHLCGObject.chaosFont, 12.0, 0.8, textColor, borderColor, 0, true );
		}
		else {
			sheet.drawOutlinedTitle( g, shroud, perInvShroudRegion, Eons.namedObjects.AHLCGObject.enemyFont, fontSize, 0.8, textColor, borderColor, 0, true );
		}
		sheet.drawOutlinedTitle( g, 'p', perInvRegion, Eons.namedObjects.AHLCGObject.symbolFont, piIconSize, 0.8, textColor, borderColor, 0, true );
	}
	else {
		if ( shroud == 'Star' ) {
			region.y += 2;
			sheet.drawOutlinedTitle( g, '*', region, Eons.namedObjects.AHLCGObject.chaosFont, 12.0, 0.8, textColor, borderColor, 0, true );
		}
		else {
			sheet.drawOutlinedTitle( g, shroud, region, Eons.namedObjects.AHLCGObject.enemyFont, 14.0, 0.8, textColor, borderColor, 0, true );
		}
	}

//	sheet.drawOutlinedTitle( g, $( 'Shroud' + BindingSuffixes[faceIndex] ), region, Eons.namedObjects.AHLCGObject.enemyFont, 14.0, 0.8, lightColor, darkColor, 0, true );
}

function drawClues( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();
//	var piIconSize = 5.0;
	var piIconSize = 7.5;

	// 254, 241, 219
	var lightColor = new Color(0.996, 0.945, 0.859);
	var darkColor = new Color(0, 0, 0);

	var textColor;
	var borderColor;

	var perInvestigator = $( 'PerInvestigator' + BindingSuffixes[faceIndex] );
	var asterisk = $( 'Asterisk' + BindingSuffixes[faceIndex] );
	var clues = $( 'Clues' + BindingSuffixes[faceIndex] );

	if ( CardTypes[faceIndex] == 'Act' ) {
		if ( Number.isInteger( clues ) && clues > 9 ) {
			piIconSize = 5.5;
		}
		else {
			piIconSize = 6.0;
		}

		textColor = lightColor;
		borderColor = darkColor;
	}
	else {
		if ( Number.isInteger( clues ) && clues > 9 ) {
			piIconSize = 7.0;
		}

		textColor = darkColor;
		borderColor = lightColor;
	}

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Clues-region' ) );
	if ( $Orientation == 'Reversed' ) region = reverseRegion( region );

	if ( clues == '-' ) {
		drawDash( g, diy, sheet, region, 0, 6 );
//		sheet.drawOutlinedTitle( g, clues, region, Eons.namedObjects.AHLCGObject.symbolFont, 12.0, 1.5, textColor, borderColor, 0, true );
	}
	else if ( perInvestigator == '1' ) {
		var perInvCluesRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'CluesPerInv-region' ) );
		var perInvRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'CluesPerInvIcon-region' ) );

		if ( Number.isInteger( clues ) && clues > 9 ) {
			perInvRegion.x += 1;
		}
		if ( Number.isInteger( clues ) && clues > 19 ) {
			perInvCluesRegion.x += 1;
			perInvRegion.x += 3;
		}

		if ( $Orientation == 'Reversed' ) {
			perInvCluesRegion = reverseRegion( perInvCluesRegion );
			perInvRegion = reverseRegion( perInvRegion );

			// flip positions
			perInvCluesRegion.x = region.x + ( (region.x + region.width) - (perInvCluesRegion.x + perInvCluesRegion.width) );
			perInvRegion.x = region.x + ( (region.x + region.width) - (perInvRegion.x + perInvRegion.width) );
		}

		let fontSize = 14.0;

		if ( clues == 'X' ) {
			perInvCluesRegion.x += 3;
			perInvRegion.x += 3;
		}
		else if ( clues == 1 ) {
			perInvRegion.x -= 4;
		}
		else if ( clues.length() > 1 ) {
			perInvRegion.x += 2;
			fontSize = 11.0;
		}

		if ( clues == 'Star' ) {
			perInvCluesRegion.x += 1;
			perInvCluesRegion.y += 2;
			perInvRegion.x -= 2;
			sheet.drawOutlinedTitle( g, '*', perInvCluesRegion, Eons.namedObjects.AHLCGObject.chaosFont, 12.0, 0.8, textColor, borderColor, 0, true );
		}
		else {
			sheet.drawOutlinedTitle( g, clues, perInvCluesRegion, Eons.namedObjects.AHLCGObject.enemyFont, fontSize, 0.8, textColor, borderColor, 0, true );
		}
		sheet.drawOutlinedTitle( g, 'p', perInvRegion, Eons.namedObjects.AHLCGObject.symbolFont, piIconSize, 0.8, textColor, borderColor, 0, true );
	}
	else if ( asterisk == '1' ) {
		let fontSize = 14.0;
		let regionXOffset = 7;
		let regionYOffset = 7;

		if (clues == 'Star') {
			regionXOffset = 4;
		}
		else if ( Number.isInteger(clues) && clues == 1 ) {
			regionXOffset = 4;
		}
		else if ( clues.length() > 1 ) {
			region.x -= 1;
			regionXOffset = 6;
			regionYOffset = 7;
			fontSize = 13.0;
		}

		if ( clues == 'Star' ) {
			region.x -= 4;
			region.y += 2;
			sheet.drawOutlinedTitle( g, '*', region, Eons.namedObjects.AHLCGObject.chaosFont, 12.0, 0.8, textColor, borderColor, 0, true );
		}
		else {
			region.x -= 4;
			sheet.drawOutlinedTitle( g, clues, region, Eons.namedObjects.AHLCGObject.enemyFont, fontSize, 0.8, textColor, borderColor, 0, true );
		}

		let asteriskFont = new Font( Eons.namedObjects.AHLCGObject.bodyFamily, Font.ITALIC, 12.0 );

		region.x += regionXOffset;
		region.y += regionYOffset;

		if ( clues == 'Star' ) {
			region.x += 6;
		}
		else {
			region.x += g.getFontMetrics(asteriskFont).stringWidth(clues);
		}
		sheet.drawOutlinedTitle( g, '*', region, asteriskFont, 12.0, 0.8, textColor, borderColor, 0, true );
	}
	else {
		if ( clues == 'Star' ) {
			region.y += 2;
			sheet.drawOutlinedTitle( g, '*', region, Eons.namedObjects.AHLCGObject.chaosFont, 12.0, 0.8, textColor, borderColor, 0, true );
		}
		else {
			sheet.drawOutlinedTitle( g, clues, region, Eons.namedObjects.AHLCGObject.enemyFont, 14.0, 0.8, textColor, borderColor, 0, true );
		}
	}
}

function drawDoom( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();

	var perInvestigator = $( 'PerInvestigator' + BindingSuffixes[faceIndex] );
	var asterisk = $( 'Asterisk' + BindingSuffixes[faceIndex] );
	var doom = $( 'Doom' + BindingSuffixes[faceIndex] );

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Doom-region' ) );
	if ( $Orientation == 'Reversed' ) region = reverseRegion( region );

	var textColor = new Color(0.996, 0.945, 0.859);
	var borderColor = new Color(0, 0, 0);
	var piIconSize = 6.5;

	if ( doom == '-' ) {
		drawDash( g, diy, sheet, region, 0, 6 );
	}
	else if (perInvestigator == '1') {
		let perInvDoomRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'DoomPerInv-region' ) );
		let perInvRegion = diy.settings.getRegion( getExpandedKey( faceIndex, 'DoomPerInvIcon-region' ) );

		if ( $Orientation == 'Reversed' ) {
			perInvDoomRegion = reverseRegion( perInvDoomRegion );
			perInvRegion = reverseRegion( perInvRegion );

			// flip positions
			perInvDoomRegion.x = region.x + ( (region.x + region.width) - (perInvDoomRegion.x + perInvDoomRegion.width) );
			perInvRegion.x = region.x + ( (region.x + region.width) - (perInvRegion.x + perInvRegion.width) );
		}

		let fontSize = 14.0;

		if ( doom.length() > 1 ) {
			perInvDoomRegion.x -= 1;
			perInvRegion.x += 1;
			fontSize = 11.0;
			piIconSize = 6.0;
		}

		if ( doom == 'Star' ) {
			perInvDoomRegion.x += 1;
			perInvDoomRegion.y += 2;
			perInvRegion.x -= 3;
			sheet.drawOutlinedTitle( g, '*', perInvDoomRegion, Eons.namedObjects.AHLCGObject.chaosFont, 12.0, 0.8, textColor, borderColor, 0, true );
		}
		else {
			sheet.drawOutlinedTitle( g, doom, perInvDoomRegion, Eons.namedObjects.AHLCGObject.enemyFont, fontSize, 0.8, textColor, borderColor, 0, true );
		}
		sheet.drawOutlinedTitle( g, 'p', perInvRegion, Eons.namedObjects.AHLCGObject.symbolFont, piIconSize, 0.8, textColor, borderColor, 0, true );
	}
	else if ( asterisk == '1' ) {
		let fontSize = 14.0;
		let regionXOffset = 7;
		let regionYOffset = 7;

		if ( doom == 'Star' ) {
			regionXOffset = 4;
		}
		else if ( Number.isInteger(doom) && doom == 1 ) {
			regionXOffset = 4;
		}
		else if ( doom.length() > 1 ) {
			region.x -= 1;
			regionXOffset = 7;
			regionYOffset = 7;
			fontSize = 13.0;
		}

		if ( doom == 'Star' ) {
			region.x -= 4;
			region.y += 2;
			sheet.drawOutlinedTitle( g, '*', region, Eons.namedObjects.AHLCGObject.chaosFont, 12.0, 0.8, textColor, borderColor, 0, true );
		}
		else {
			region.x -= 4;
			sheet.drawOutlinedTitle( g, doom, region, Eons.namedObjects.AHLCGObject.enemyFont, fontSize, 0.8, textColor, borderColor, 0, true );
		}

		let asteriskFont = new Font( Eons.namedObjects.AHLCGObject.bodyFamily, Font.ITALIC, 12.0 );

		region.x += regionXOffset;
		region.y += regionYOffset;

		if ( doom == 'Star' ) {
			region.x += 6;
		}
		else {
			region.x += g.getFontMetrics(asteriskFont).stringWidth(doom);
		}

		sheet.drawOutlinedTitle( g, '*', region, asteriskFont, 12.0, 0.8, textColor, borderColor, 0, true );
	}
	else {
		if ( doom == 'Star' ) {
			region.y += 2;
			sheet.drawOutlinedTitle( g, '*', region, Eons.namedObjects.AHLCGObject.chaosFont, 12.0, 0.8, textColor, borderColor, 0, true );
		}
		else {
			if ( $Orientation == 'Reversed' ) {
				region.x -= 1;
				}

			sheet.drawOutlinedTitle( g, doom, region, Eons.namedObjects.AHLCGObject.enemyFont, 14.0, 0.8, new Color(0.996, 0.945, 0.859), new Color(0, 0, 0), 0, true );
		}
	}
}

// for scenario index text, any space has to be in the string from game properties text file
function drawScenarioIndexFront( g, diy, sheet, typeText, textBox ) {
	var faceIndex = sheet.getSheetIndex();

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'ScenarioIndex-region' ) );
	region.y += parseInt(Eons.namedObjects.AHLCGObject.typeFontOffset);
//	if ( Eons.namedObjects.AHLCGObject.bodyFamily == 'Times New Roman' ) region.y -= 2;

	if ( $Orientation == 'Reversed' ) {
		region = reverseRegion( region );
		region.x -= 1;
	}

	var text = typeText + '<suf>' + $ScenarioIndex;
	text = text + $ScenarioDeckID + '</suf>';

	textBox.markupText = text;
	textBox.drawAsSingleLine( g, region );
}

function drawScenarioIndexBack( g, diy, sheet, typeText, textBox ) {
	var faceIndex = sheet.getSheetIndex();

	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'BackScenarioIndex-region' ) );
	region.y += parseInt(Eons.namedObjects.AHLCGObject.typeFontOffset);
//	if ( Eons.namedObjects.AHLCGObject.bodyFamily == 'Times New Roman' ) region.y -= 2;

	var text = typeText.toUpperCase() + '<sufb>' + $ScenarioIndex;
	text = text + String.fromCharCode( $ScenarioDeckID.charCodeAt(0) + 1 ) + '</sufb>';

	textBox.markupText = '';
	textBox.markupText = text;
	var height = textBox.measure(g, region);
	textBox.markupText = '';

	if ( height < 15 ) {	// fits on one line
		textBox.markupText = text;
		textBox.drawAsSingleLine( g, region );
	}
	else {
		var lineHeight = region.height / 2;

		// first line
		region.height -= lineHeight;

		text = '<sufb>' + $ScenarioIndex + String.fromCharCode( $ScenarioDeckID.charCodeAt(0) + 1 ) + '</sufb>';

		textBox.markupText = typeText.toUpperCase();
		textBox.drawAsSingleLine( g, region );

		// second line
		region.y += lineHeight;

		textBox.markupText = '<size 90%>' + text;
		textBox.drawAsSingleLine( g, region );
	}
}

function drawDash( g, diy, sheet, region, offsetX, offsetY ) {
	var faceIndex = sheet.getSheetIndex();

	var dashX = 26;
	var dashY = 10;

	// center in region
	region.x = region.x + ( region.width - dashX ) / 2 + offsetX;
	region.y = region.y + ( region.height - dashY ) / 2 + offsetY;
	region.width = 26;
	region.height = 10;

	var hsb = diy.settings.getTint( getExpandedKey( faceIndex, 'Dash-tint' ) );

	var dashImage = hsb[2] >= 0 ? ImageUtils.get( 'ArkhamHorrorLCG/numbers/AHLCG-Cost--.png', true ) :
		ImageUtils.get( 'ArkhamHorrorLCG/numbers/AHLCG-Cost--Inverted.png', true );

	var filter = new ca.cgjennings.graphics.filters.TintFilter( hsb[0], hsb[1], Math.abs(hsb[2]) );

	dashImage = filter.filter( dashImage, null );

	sheet.paintImage(g, dashImage, region );
}

function drawPageNumber ( g, diy, sheet, pageBox ) {
	var faceIndex = sheet.getSheetIndex();

	var pageNumber = $( 'Page' + BindingSuffixes[faceIndex] );
	var region;

	if ( Number($Page) % 2 == 0 ) region = diy.settings.getRegion( getExpandedKey( faceIndex, 'PageEven-region' ) );
	else region = diy.settings.getRegion( getExpandedKey( faceIndex, 'PageOdd-region' ) );

	if ( region ) {	// only if Scenario type
		pageBox.markupText = pageNumber;
		pageBox.drawAsSingleLine( g, region );
	}
}

function drawWatermark( g, diy, sheet ) {
	var faceIndex = sheet.getSheetIndex();

	var image = null;
	var region = diy.settings.getRegion( getExpandedKey( faceIndex, 'Watermark-portrait-clip-region' ) );

	if ( $EncounterType == '0' ) {
		image = ImageUtils.get('ArkhamHorrorLCG/icons/AHLCG-' + $Encounter + '.png');
		}
	// custom
	else {
		image = PortraitList[getPortraitIndex( 'Encounter' )].getImage();
	}

	var sizedImage = ImageUtils.resize( image, region.width, region.height );

	g.setComposite( AlphaComposite.SrcOver.derive(0.06) );
	g.drawImage( sizedImage, region.x, region.y, null );
}
