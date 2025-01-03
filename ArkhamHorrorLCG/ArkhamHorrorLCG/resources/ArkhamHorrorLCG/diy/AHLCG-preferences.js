importPackage( arkham.dialog.prefs );
importPackage( ca.cgjennings.ui.table );
importPackage( java.io );
importPackage( javax.swing.event );
importClass( arkham.diy.ListItem );
importClass( javax.swing.JPanel );
importClass( javax.swing.JTextField );
importClass( javax.swing.JLabel );
importClass( java.awt.Dimension );
importClass( java.util.Vector );
importClass( javax.swing.JComboBox );
importClass( javax.swing.BoxLayout );
importClass( javax.swing.Box );
importClass( javax.swing.JButton );
importClass( javax.swing.BorderFactory );
importClass( javax.swing.JComponent );
importClass( javax.swing.JScrollPane );
importClass( javax.swing.table.DefaultTableModel );
importClass( ca.cgjennings.apps.arkham.diy.SBDropDown );

useLibrary( 'res://ArkhamHorrorLCG/diy/AHLCG-layoutLibrary.js' );
useLibrary( 'res://ArkhamHorrorLCG/diy/AHLCG-utilLibrary.js' );

var defaultFontSettingsChanged;

function createSetData() {
	var data = {
		seTableModel: new JavaAdapter( javax.swing.table.DefaultTableModel, {					 
			getColumnClass: function(index) {
				if (index == 0) return java.lang.Boolean;
		
				return java.lang.String;
			},
			getColumnCount: function() {
				return 4;
			},
			isCellEditable: function( row, column ) {
				if (column == 0) return true;
			
				return false;
			},
			addToComboBox: function( box ) {
				try {
					var encounterList = Eons.namedObjects.AHLCGObject.standardEncounterList;
				
					for ( let index = 0; index < encounterList.length && index < this.getRowCount(); index++) {
						let value = this.getValueAt( index, 0 );

						if ( value == java.lang.Boolean(true) ) {
							let entry = encounterList[ index ];
							
							box.addItem( new ListItem( entry[0], @('AHLCG-' + entry[0]) ) );
						}
					}	
				} catch ( ex ) {
					Error.handleUncaught( ex );
				}			
			}
		}),
		ueTableModel: new JavaAdapter( javax.swing.table.DefaultTableModel, {					 
			getColumnClass: function(index) {
				if (index == 0) return java.lang.Boolean;
		
				return java.lang.String;
			},
			getColumnCount: function() {
				return 4;
			},
			isCellEditable: function( row, column ) {
				if (column == 0) return true;
			
				return false;
			},
			addToComboBox: function( box ) {
				try {
					for ( let index = 0; index < this.getRowCount(); index++) {
						let value = this.getValueAt( index, 0 );

						if ( value == java.lang.Boolean(true) ) {
							let name = this.getValueAt( index, 1 ); 

							box.addItem( new ListItem( createUserSettingValue( name), name ) );
						}
					}				
				} catch ( ex ) {
					Error.handleUncaught( ex );
				}
			}
		}),
		scTableModel: new JavaAdapter( javax.swing.table.DefaultTableModel, {					 
			getColumnClass: function(index) {
				if (index == 0) return java.lang.Boolean;
		
				return java.lang.String;
			},
			getColumnCount: function() {
				return 3;
			},
			isCellEditable: function( row, column ) {
				if (column == 0) return true;
			
				return false;
			},
			addToComboBox: function( box ) {
				var collectionList = Eons.namedObjects.AHLCGObject.standardCollectionList;
				
				for ( let index = 0; index < collectionList.length && index < this.getRowCount(); index++) {
					let value = this.getValueAt( index, 0 );

					if ( value == java.lang.Boolean(true) ) {
						let entry = collectionList[ index ];

						box.addItem( new ListItem( entry[0], @('AHLCG-' + entry[0]) ) );
					}
				}	
			}
		}),
		ucTableModel: new JavaAdapter( javax.swing.table.DefaultTableModel, {					 
			getColumnClass: function(index) {
				if (index == 0) return java.lang.Boolean;
		
				return java.lang.String;
			},
			getColumnCount: function() {
				return 4;
			},
			isCellEditable: function( row, column ) {
				if (column == 0) return true;
			
				return false;
			},
			addToComboBox: function( box ) {
				try {
					for ( let index = 0; index < this.getRowCount(); index++) {
						let value = this.getValueAt( index, 0 );

						if ( value == java.lang.Boolean(true) ) {
							let name = this.getValueAt( index, 1 ); 

							box.addItem( new ListItem( createUserSettingValue( name), name ) );
						}
					}				
				} catch ( ex ) {
					Error.handleUncaught( ex );
				}
			}

		}),
		initialize: function() {
			try {
				this.seTableModel.setColumnIdentifiers( [ '', @AHLCG-Pref-Name, @AHLCG-Pref-Cycle, @AHLCG-Pref-Tag ] );
				this.ueTableModel.setColumnIdentifiers( [ '', @AHLCG-Pref-Name, @AHLCG-Pref-Icon, @AHLCG-Pref-Tag ] );
				this.scTableModel.setColumnIdentifiers( [ '', @AHLCG-Pref-Name, @AHLCG-Pref-Tag ] );
				this.ucTableModel.setColumnIdentifiers( [ '', @AHLCG-Pref-Name, @AHLCG-Pref-Icon, @AHLCG-Pref-Tag ] );
			
				var itemArray = new Array( );

				for ( let index = 0; index < Eons.namedObjects.AHLCGObject.basicEncounterList.length; index++ ) {
					let value = Eons.namedObjects.AHLCGObject.basicEncounterList[ index ];

					itemArray[index] = ListItem( value, @( 'AHLCG-'+value ) );
				}
			
				this.deComboBox = comboBox( itemArray );
				var boxSize = this.deComboBox.getPreferredSize();
				boxSize.width = 200;
				this.deComboBox.setPreferredSize( boxSize );

				itemArray.length = 0;

				for ( let index = 0; index < Eons.namedObjects.AHLCGObject.basicCollectionList.length; index++ ) {
					let value = Eons.namedObjects.AHLCGObject.basicCollectionList[ index ];

					itemArray[index] = ListItem( value, @( 'AHLCG-'+value ) );
				}

				this.dcComboBox = comboBox( itemArray );
				this.dcComboBox.setPreferredSize( boxSize );

				// font controls
				var fontArray = createFontData();

				function modifyFont( actionEvent ) {
					defaultFontSettingsChanged = true;
				}

				this.fTitleComboBox = comboBox( fontArray, modifyFont );
				this.fSubtitleComboBox = comboBox( fontArray, modifyFont );
				this.fCardTypeComboBox = comboBox( fontArray, modifyFont );
				this.fBodyComboBox = comboBox( fontArray, modifyFont );
				this.fTraitComboBox = comboBox( fontArray, modifyFont );
				this.fVictoryComboBox = comboBox( fontArray, modifyFont );
				this.fFlavorComboBox = comboBox( fontArray, modifyFont );
				this.fStoryComboBox = comboBox( fontArray, modifyFont );
				this.fCollectionComboBox = comboBox( fontArray, modifyFont );
				
				this.fTitleSize = spinner( 1, 200, 1, 100, modifyFont );
				this.fSubtitleSize = spinner( 1, 200, 1, 100, modifyFont );
				this.fCardTypeSize = spinner( 1, 200, 1, 100, modifyFont );
				this.fBodySize = spinner( 1, 200, 1, 100, modifyFont );
				this.fTraitSize = spinner( 1, 200, 1, 100, modifyFont );
				this.fVictorySize = spinner( 1, 200, 1, 100, modifyFont );
				this.fFlavorSize = spinner( 1, 200, 1, 100, modifyFont );
				this.fStorySize = spinner( 1, 200, 1, 100, modifyFont );
				this.fCollectionSize = spinner( 1, 200, 1, 100, modifyFont );

				this.fTitleOffset = spinner( -10, 10, 1, 0, modifyFont );
				this.fSubtitleOffset = spinner( -10, 10, 1, 0, modifyFont );
				this.fCardTypeOffset = spinner( -10, 10, 1, 0, modifyFont );
				this.fBodyOffset = spinner( -10, 10, 1, 0, modifyFont );
				this.fTraitOffset = spinner( -10, 10, 1, 0, modifyFont );
				this.fVictoryOffset = spinner( -10, 10, 1, 0, modifyFont );
				this.fFlavorOffset = spinner( -10, 10, 1, 0, modifyFont );
				this.fStoryOffset = spinner( -10, 10, 1, 0, modifyFont );
				this.fCollectionOffset = spinner( -10, 10, 1, 0, modifyFont );

				this.fRotateTitleCheckBox = checkBox( @AHLCG-Pref-RotateTitle, true, modifyFont );
			} catch ( ex ) {
				Error.handleUncaught( ex );
			} 
		}
	};
		
	return data;
}

function createFontData() {
	let families = FontUtils.availableFontFamilies();
	families.splice( 0, 0, 'Default' );
	
	return families;
}
/*
function defaultFontListener( actionEvent ) {
	defaultFontSettingsChanged = true;
}
*/
function addPreferences() {
try {
	var data = createSetData();
	data.initialize();
	
	var seTable = new JResizableTable( data.seTableModel );
	seTable.getColumnModel().getColumn(0).setPreferredWidth(20);
	seTable.getColumnModel().getColumn(1).setPreferredWidth(250);
	seTable.getColumnModel().getColumn(2).setPreferredWidth(200);
	seTable.getColumnModel().getColumn(3).setPreferredWidth(70);
	seTable.setAutoCreateRowSorter( true ); 
	
	var seScrollPane = new JScrollPane( seTable );
	seScrollPane.setPreferredSize( new Dimension( 520, 175 ) );
	seScrollPane.getViewport().setBackground( Color.white );

	var ueTable = new JResizableTable( data.ueTableModel );
	ueTable.getColumnModel().getColumn(0).setPreferredWidth(20);
	ueTable.getColumnModel().getColumn(1).setPreferredWidth(150);
	ueTable.getColumnModel().getColumn(2).setPreferredWidth(300);
	ueTable.getColumnModel().getColumn(3).setPreferredWidth(70);
	ueTable.setAutoCreateRowSorter( true );

	var ueScrollPane = new JScrollPane( ueTable );
	ueScrollPane.setPreferredSize( new Dimension( 520, 175 ) );
	ueScrollPane.getViewport().setBackground( Color.white );

	var scTable = new JResizableTable( data.scTableModel );
	scTable.getColumnModel().getColumn(0).setPreferredWidth(20);
	scTable.getColumnModel().getColumn(1).setPreferredWidth(450);
	scTable.getColumnModel().getColumn(2).setPreferredWidth(70);
	scTable.setAutoCreateRowSorter( true );
	
	var scScrollPane = new JScrollPane( scTable );
	scScrollPane.setPreferredSize( new Dimension( 520, 175 ) );
	scScrollPane.getViewport().setBackground( Color.white );

	var ucTable = new JResizableTable( data.ucTableModel );
	ucTable.getColumnModel().getColumn(0).setPreferredWidth(20);
	ucTable.getColumnModel().getColumn(1).setPreferredWidth(150);
	ucTable.getColumnModel().getColumn(2).setPreferredWidth(300);
	ucTable.getColumnModel().getColumn(3).setPreferredWidth(70);
	ucTable.setAutoCreateRowSorter( true );

	var ucScrollPane = new JScrollPane( ucTable );
	ucScrollPane.setPreferredSize( new Dimension( 520, 175 ) );
	ucScrollPane.getViewport().setBackground( Color.white );

	var eTableListener = new JavaAdapter( TableModelListener, {
		tableChanged: function ( event ) {
			updateDefaultEncounterSet( data ); 
		}
	} );

	var cTableListener = new JavaAdapter( TableModelListener, {
		tableChanged: function ( event ) {
			updateDefaultCollection( data ); 
		}
	} );

	var pc = new JavaAdapter( ca. cgjennings.apps.arkham.dialog.prefs.FillInPreferenceCategory, {
		loadSettings: function() {			
			loadAHLCGPreferences( data );
		},
		storeSettings: function() {
			storeAHLCGPreferences( data );
		}
	}, @AHLCG, 'ArkhamHorrorLCG/icons/AHLCG-GameL.png' );	

	pc.heading( @AHLCG-Pref-DefaultValues );
	
	pc.label( @AHLCG-Pref-DefaultSet );
	pc.join();
	pc.addUnmanagedControl( data.deComboBox );
	
	pc.label( @AHLCG-Pref-DefaultCollection );
	pc.join();
	pc.addUnmanagedControl( data.dcComboBox );
	
	data.seTableModel.addTableModelListener( eTableListener );
	data.ueTableModel.addTableModelListener( eTableListener );

	data.scTableModel.addTableModelListener( cTableListener );
	data.ucTableModel.addTableModelListener( cTableListener );

	pc.heading( @AHLCG-Pref-EncounterSets );
	pc.join();
	pc.addTip( @AHLCG-PrefEncounterTip );
	pc.indent();
	
	pc.label( @AHLCG-Pref-StandardSets );
	
	pc.addUnmanagedControl( seScrollPane );

	pc.addButton( @AHLCG-Pref-CheckSets, function () {
		checkSets( seTable );
	});
	
	pc.join();
	pc.addButton( @AHLCG-Pref-UncheckSets, function () {
		uncheckSets( seTable );
	});

	pc.label( @AHLCG-Pref-UserSets );
	pc.addUnmanagedControl( ueScrollPane );

	pc.addButton( @AHLCG-Pref-CheckSets, function () {
		checkSets( ueTable );
	});
	
	pc.join();
	pc.addButton( @AHLCG-Pref-UncheckSets, function () {
		uncheckSets( ueTable );
	});
	
	pc.join();
	pc.addButton( @AHLCG-Pref-DeleteSets, function addToList( actionEvent ) {
		deleteSets( ueTable, @AHLCG-Pref-PermanentlyRemoveSets, @AHLCG-Pref-RemoveSets );
	});

	var ueNameLabel = new JLabel( @AHLCG-Pref-Name );
	ueNameLabel.setAlignmentX( JComponent.LEFT_ALIGNMENT );
	var ueName = new JTextField( 20 );
	var ueTagLabel = new JLabel( @AHLCG-Pref-Tag );
	var ueTag = new JTextField( 5 );
	var ueIconLabel = new JLabel( @AHLCG-Pref-Image );
	var ueIcon = new JTextField( 30 );
	
	var ueSelectButton = new JButton( @AHLCG-Pref-Select );
	ueSelectButton.addActionListener( function addToList( actionEvent ) {
		filename = ResourceKit.showImageFileDialog( null );
		if (filename != null) ueIcon.setText( filename );
	} );	

	var ueAddButton = new JButton( @AHLCG-Pref-AddSet );
	ueAddButton.addActionListener( function addToList( actionEvent ) {
		let nameStr = ueName.getText();
		let iconStr = ueIcon.getText();
		let tagStr = ueTag.getText();
		
		if ( verifyUserEncounter( nameStr, iconStr, tagStr, data ) ) {
			data.ueTableModel.addRow( [ true, nameStr, iconStr, tagStr ] );
			data.ueTableModel.fireTableDataChanged();
			
			ueName.setText( '' );
			ueIcon.setText( '' );
			ueTag.setText( '' );
		}
	} );	

	var ueOuterPanel = new JPanel();
	ueOuterPanel.setBorder( BorderFactory.createEmptyBorder( 5, 5, 5, 5 ) );
	ueOuterPanel.setLayout( new BoxLayout( ueOuterPanel, BoxLayout.PAGE_AXIS ) );
		
	var ueWhitePanel = new JPanel();
	ueWhitePanel.setLayout( new BoxLayout( ueWhitePanel, BoxLayout.PAGE_AXIS ) );
	ueWhitePanel.setBackground( Color.white );
		
	var ueNamePanel = new JPanel();
	ueNamePanel.setLayout( new BoxLayout( ueNamePanel, BoxLayout.LINE_AXIS ) );
	ueNamePanel.setBackground( Color.white );
	ueNamePanel.setBorder( BorderFactory.createEmptyBorder( 10, 10, 0, 10 ) );
	ueNamePanel.add(ueNameLabel);
	ueNamePanel.add( Box.createRigidArea( new Dimension( 5, 0 ) ) );
	ueNamePanel.add(ueName);
	ueNamePanel.add( Box.createRigidArea( new Dimension( 10, 0 ) ) );
	ueNamePanel.add(ueTagLabel);
	ueNamePanel.add( Box.createRigidArea( new Dimension( 5, 0 ) ) );
	ueNamePanel.add(ueTag);
	
	var ueIconPanel = new JPanel();
	ueIconPanel.setLayout( new BoxLayout( ueIconPanel, BoxLayout.LINE_AXIS ) );
	ueIconPanel.setBackground( Color.white );
	ueIconPanel.setBorder( BorderFactory.createEmptyBorder( 10, 10, 10, 10 ) );
	ueIconPanel.add(ueIconLabel);
	ueIconPanel.add( Box.createRigidArea( new Dimension( 5, 0 ) ) );
	ueIconPanel.add(ueIcon);
	ueIconPanel.add( Box.createRigidArea( new Dimension( 5, 0 ) ) );
	ueIconPanel.add(ueSelectButton);
	
	var ueButtonPanel = new JPanel();
	ueButtonPanel.setLayout( new BoxLayout( ueButtonPanel, BoxLayout.LINE_AXIS ) );
	ueButtonPanel.setBackground( Color.white );
	ueButtonPanel.setBorder( BorderFactory.createEmptyBorder( 0, 10, 10, 10 ) );
	ueButtonPanel.add( ueAddButton );

	ueWhitePanel.add( ueNamePanel );
	ueWhitePanel.add( ueIconPanel );
	ueWhitePanel.add( ueButtonPanel );
	
	ueOuterPanel.add( ueWhitePanel );

	pc.label( @AHLCG-Pref-AddCustomSet );
	pc.addUnmanagedControl( ueOuterPanel );

	pc.heading( @AHLCG-Pref-Collections );
	pc.join();
	pc.addTip( @AHLCG-PrefCollectionTip );
	pc.indent();

	pc.label( @AHLCG-Pref-StandardCollections );
	pc.addUnmanagedControl( scScrollPane );

	pc.addButton( @AHLCG-Pref-CheckCollections, function () {
		checkSets( scTable );
	});
	
	pc.join();
	pc.addButton( @AHLCG-Pref-UncheckCollections, function () {
		uncheckSets( scTable );
	});

	pc.label( @AHLCG-Pref-UserCollections );

	pc.addUnmanagedControl( ucScrollPane );

	pc.addButton( @AHLCG-Pref-CheckCollections, function () {
		checkSets( ucTable );
	});
	
	pc.join();
	pc.addButton( @AHLCG-Pref-UncheckCollections, function () {
		uncheckSets( ucTable );
	});
	
	pc.join();
	pc.addButton( @AHLCG-Pref-DeleteCollections, function addToList( actionEvent ) {
		deleteSets( ucTable, @AHLCG-Pref-PermanentlyRemoveCollections, @AHLCG-Pref-RemoveCollections );
	});

	var ucNameLabel = new JLabel( @AHLCG-Pref-Name );
	ucNameLabel.setAlignmentX( JComponent.LEFT_ALIGNMENT );
	var ucName = new JTextField( 20 );
	var ucTagLabel = new JLabel( @AHLCG-Pref-Tag );
	var ucTag = new JTextField( 5 );
	var ucIconLabel = new JLabel( @AHLCG-Pref-Image );
	var ucIcon = new JTextField( 30 );
	
	var ucSelectButton = new JButton( @AHLCG-Pref-Select );
	ucSelectButton.addActionListener( function addToList( actionEvent ) {
		filename = ResourceKit.showImageFileDialog( null );
		if (filename != null) ucIcon.setText( filename );
	} );	

	var ucAddButton = new JButton( @AHLCG-Pref-AddCollection );
	ucAddButton.addActionListener( function addToList( actionEvent ) {
		let nameStr = ucName.getText();
		let iconStr = ucIcon.getText();
		let tagStr = ucTag.getText();
		
		if ( verifyUserCollection( nameStr, iconStr, tagStr, data ) ) {
			data.ucTableModel.addRow( [ true, nameStr, iconStr, tagStr ] );
			data.ucTableModel.fireTableDataChanged();

			ucName.setText( '' );
			ucIcon.setText( '' );
			ucTag.setText( '' );
		}
	} );	

	var ucOuterPanel = new JPanel();
	ucOuterPanel.setBorder( BorderFactory.createEmptyBorder( 5, 5, 5, 5 ) );
	ucOuterPanel.setLayout( new BoxLayout( ucOuterPanel, BoxLayout.PAGE_AXIS ) );
		
	var ucWhitePanel = new JPanel();
	ucWhitePanel.setLayout( new BoxLayout( ucWhitePanel, BoxLayout.PAGE_AXIS ) );
	ucWhitePanel.setBackground( Color.white );
		
	var ucNamePanel = new JPanel();
	ucNamePanel.setLayout( new BoxLayout( ucNamePanel, BoxLayout.LINE_AXIS ) );
	ucNamePanel.setBackground( Color.white );
	ucNamePanel.setBorder( BorderFactory.createEmptyBorder( 10, 10, 0, 10 ) );
	ucNamePanel.add(ucNameLabel);
	ucNamePanel.add( Box.createRigidArea( new Dimension( 5, 0 ) ) );
	ucNamePanel.add(ucName);
	ucNamePanel.add( Box.createRigidArea( new Dimension( 10, 0 ) ) );
	ucNamePanel.add(ucTagLabel);
	ucNamePanel.add( Box.createRigidArea( new Dimension( 5, 0 ) ) );
	ucNamePanel.add(ucTag);
	
	var ucIconPanel = new JPanel();
	ucIconPanel.setLayout( new BoxLayout( ucIconPanel, BoxLayout.LINE_AXIS ) );
	ucIconPanel.setBackground( Color.white );
	ucIconPanel.setBorder( BorderFactory.createEmptyBorder( 10, 10, 10, 10 ) );
	ucIconPanel.add(ucIconLabel);
	ucIconPanel.add( Box.createRigidArea( new Dimension( 5, 0 ) ) );
	ucIconPanel.add(ucIcon);
	ucIconPanel.add( Box.createRigidArea( new Dimension( 5, 0 ) ) );
	ucIconPanel.add(ucSelectButton);
	
	var ucButtonPanel = new JPanel();
	ucButtonPanel.setLayout( new BoxLayout( ucButtonPanel, BoxLayout.LINE_AXIS ) );
	ucButtonPanel.setBackground( Color.white );
	ucButtonPanel.setBorder( BorderFactory.createEmptyBorder( 0, 10, 10, 10 ) );
	ucButtonPanel.add( ucAddButton );

	ucWhitePanel.add( ucNamePanel );
	ucWhitePanel.add( ucIconPanel );
	ucWhitePanel.add( ucButtonPanel );
	
	ucOuterPanel.add( ucWhitePanel );

	pc.label( @AHLCG-Pref-AddCustomCollection );
	pc.addUnmanagedControl( ucOuterPanel );

	pc.heading( @AHLCG-Pref-DefaultFonts );
	pc.join();
	pc.addTip( @AHLCG-PrefDefaultFontsTip );

	pc.label( @AHLCG-Pref-TitleFont );
	pc.indent();
	pc.addUnmanagedControl( data.fTitleComboBox );
	pc.join();
	pc.label( @AHLCG-Pref-Size );
	pc.join();
	pc.addUnmanagedControl( data.fTitleSize );
	pc.join();
	pc.label( @AHLCG-Pref-VerticalOffset );
	pc.join();
	pc.addUnmanagedControl( data.fTitleOffset );
	pc.unindent();

	pc.label( @AHLCG-Pref-SubtitleFont );
	pc.indent();
	pc.addUnmanagedControl( data.fSubtitleComboBox );
	pc.join();
	pc.label( @AHLCG-Pref-Size );
	pc.join();
	pc.addUnmanagedControl( data.fSubtitleSize );
	pc.join();
	pc.label( @AHLCG-Pref-VerticalOffset );
	pc.join();
	pc.addUnmanagedControl( data.fSubtitleOffset );
	pc.unindent();

	pc.label( @AHLCG-Pref-CardTypeFont );
	pc.indent();
	pc.addUnmanagedControl( data.fCardTypeComboBox );
	pc.join();
	pc.label( @AHLCG-Pref-Size );
	pc.join();
	pc.addUnmanagedControl( data.fCardTypeSize );
	pc.join();
	pc.label( @AHLCG-Pref-VerticalOffset );
	pc.join();
	pc.addUnmanagedControl( data.fCardTypeOffset );
	pc.unindent();
	
	pc.label( @AHLCG-Pref-BodyFont );
	pc.indent();
	pc.addUnmanagedControl( data.fBodyComboBox );
	pc.join();
	pc.label( @AHLCG-Pref-Size );
	pc.join();
	pc.addUnmanagedControl( data.fBodySize );
	pc.join();
	pc.label( @AHLCG-Pref-VerticalOffset );
	pc.join();
	pc.addUnmanagedControl( data.fBodyOffset );
	pc.unindent();
	
	pc.label( @AHLCG-Pref-TraitFont );
	pc.indent();
	pc.addUnmanagedControl( data.fTraitComboBox );
	pc.join();
	pc.label( @AHLCG-Pref-Size );
	pc.join();
	pc.addUnmanagedControl( data.fTraitSize );
	pc.join();
	pc.label( @AHLCG-Pref-VerticalOffset );
	pc.join();
	pc.addUnmanagedControl( data.fTraitOffset );
	pc.unindent();
	
	pc.label( @AHLCG-Pref-VictoryFont );
	pc.indent();
	pc.addUnmanagedControl( data.fVictoryComboBox );
	pc.join();
	pc.label( @AHLCG-Pref-Size );
	pc.join();
	pc.addUnmanagedControl( data.fVictorySize );
	pc.join();
	pc.label( @AHLCG-Pref-VerticalOffset );
	pc.join();
	pc.addUnmanagedControl( data.fVictoryOffset );
	pc.unindent();
	
	pc.label( @AHLCG-Pref-FlavorFont );
	pc.indent();
	pc.addUnmanagedControl( data.fFlavorComboBox );
	pc.join();
	pc.label( @AHLCG-Pref-Size );
	pc.join();
	pc.addUnmanagedControl( data.fFlavorSize );
	pc.join();
	pc.label( @AHLCG-Pref-VerticalOffset );
	pc.join();
	pc.addUnmanagedControl( data.fFlavorOffset );
	pc.unindent();
	
	pc.label( @AHLCG-Pref-StoryFont );
	pc.indent();
	pc.addUnmanagedControl( data.fStoryComboBox );
	pc.join();
	pc.label( @AHLCG-Pref-Size );
	pc.join();
	pc.addUnmanagedControl( data.fStorySize );
	pc.join();
	pc.label( @AHLCG-Pref-VerticalOffset );
	pc.join();
	pc.addUnmanagedControl( data.fStoryOffset );
	pc.unindent();
	
	pc.label( @AHLCG-Pref-CollectionFont );
	pc.indent();
	pc.addUnmanagedControl( data.fCollectionComboBox );
	pc.join();
	pc.label( @AHLCG-Pref-Size );
	pc.join();
	pc.addUnmanagedControl( data.fCollectionSize );
	pc.join();
	pc.label( @AHLCG-Pref-VerticalOffset );
	pc.join();
	pc.addUnmanagedControl( data.fCollectionOffset );
	pc.unindent();

	pc.heading( @AHLCG-Pref-LanguageOptions );
	pc.indent();
	pc.addUnmanagedControl( data.fRotateTitleCheckBox );
	pc.join();
	pc.unindent();
	
	pc.addResetKeys( 'AHLCG-FontsEdited' );

	Preferences.registerCategory( pc );
} catch ( ex ) {
	Error.handleUncaught (ex);
}
}

function loadAHLCGPreferences( data ) {
	var AHLCGObject = Eons.namedObjects.AHLCGObject;
	var settings = Settings.getUser();

	// defaults
	var defaultEncounter = settings.get( 'AHLCG-DefaultEncounterSet' );
	var defaultCollection = settings.get( 'AHLCG-DefaultCollection' );

	// user sets
	data.seTableModel.setRowCount( 0 );
	data.ueTableModel.setRowCount( 0 );
	data.scTableModel.setRowCount( 0 );
	data.ucTableModel.setRowCount( 0 );

	var usedIndex = 1;

	var index;
	var name;
	var icon;
	var tag;
	
	for( index = 0; index < AHLCGObject.standardEncounterList.length; index++ ) {
		let entry = AHLCGObject.standardEncounterList[index];
//		let collection = AHLCGObject.standardCollectionList[ entry[1] ];
		let collection = AHLCGObject.standardCollectionList[ getCollectionIndexForID( entry[1] )];
		
		let used = loadUsedValue( 'Encounter', entry[3] );

		data.seTableModel.addRow( [ used, @( 'AHLCG-' + entry[0] ), @( 'AHLCG-' + collection[0] ), entry[2] ] );	
	}	

	var userCount = settings.getInt( 'AHLCG-UserEncounterCount', 0 );

	for ( index = 0; index < userCount; index++) {
		name = settings.get( 'AHLCG-UserEncounterName' + (index+1), '' );
		icon = settings.get( 'AHLCG-UserEncounterIcon' + (index+1), '' );
		tag = settings.get( 'AHLCG-UserEncounterTag' + (index+1), '' );

		if (name != null && icon != null && tag != null) {
			data.ueTableModel.addRow( [ settings.getBoolean( 'AHLCG-UseUserEncounter' + (index+1), true ), name, icon, tag ] );
		}
	}

	usedIndex = 1;
	
	for( index = 0; index < AHLCGObject.standardCollectionList.length; index++ ) {
		let entry = AHLCGObject.standardCollectionList[index];

//		let used = loadUsedValue( 'Collection', index );
		let used = loadUsedValue( 'Collection', entry[2] );
		
		data.scTableModel.addRow( [ used, @( 'AHLCG-' + entry[0] ), entry[1] ] );						
	}	

	userCount = settings.getInt( 'AHLCG-UserCollectionCount', 0 );

	for ( index = 0; index < userCount; index++) {
		name = settings.get( 'AHLCG-UserCollectionName' + (index+1), '' );
		icon = settings.get( 'AHLCG-UserCollectionIcon' + (index+1), '' );
		tag = settings.get( 'AHLCG-UserCollectionTag' + (index+1), '' );
		
		if (name != null && icon != null && tag != null) {
			data.ucTableModel.addRow( [ settings.getBoolean( 'AHLCG-UseUserCollection' + (index+1), true ), name, icon, tag ] );
		}
	}	

	selectDefaultEncounter( data, defaultEncounter );
	selectDefaultCollection( data, defaultCollection );

	// default fonts
	updateDefaultFont( data.fTitleComboBox, settings.get( 'AHLCG-DefaultTitleFont', 'Default' ) );

	updateDefaultFont( data.fSubtitleComboBox, settings.get( 'AHLCG-DefaultSubtitleFont', 'Default' ) );
	updateDefaultFont( data.fCardTypeComboBox, settings.get( 'AHLCG-DefaultCardTypeFont', 'Default' ) );
	updateDefaultFont( data.fBodyComboBox, settings.get( 'AHLCG-DefaultBodyFont', 'Default' ) );
	updateDefaultFont( data.fTraitComboBox, settings.get( 'AHLCG-DefaultTraitFont', 'Default' ) );
	updateDefaultFont( data.fVictoryComboBox, settings.get( 'AHLCG-DefaultVictoryFont', 'Default' ) );
	updateDefaultFont( data.fFlavorComboBox, settings.get( 'AHLCG-DefaultFlavorFont', 'Default' ) );
	updateDefaultFont( data.fStoryComboBox, settings.get( 'AHLCG-DefaultStoryFont', 'Default' ) );
	updateDefaultFont( data.fCollectionComboBox, settings.get( 'AHLCG-DefaultCollectionFont', 'Default' ) );

	data.fTitleSize.setValue( parseInt( settings.get( 'AHLCG-DefaultTitleFontSize', 100 )));
	data.fSubtitleSize.setValue( parseInt( settings.get( 'AHLCG-DefaultSubtitleFontSize', 100 )));
	data.fCardTypeSize.setValue( parseInt( settings.get( 'AHLCG-DefaultCardTypeFontSize', 100 )));
	data.fBodySize.setValue( parseInt( settings.get( 'AHLCG-DefaultBodyFontSize', 100 )));
	data.fTraitSize.setValue( parseInt( settings.get( 'AHLCG-DefaultTraitFontSize', 100 )));
	data.fVictorySize.setValue( parseInt( settings.get( 'AHLCG-DefaultVictoryFontSize', 100 )));
	data.fFlavorSize.setValue( parseInt( settings.get( 'AHLCG-DefaultFlavorFontSize', 100 )));
	data.fStorySize.setValue( parseInt( settings.get( 'AHLCG-DefaultStoryFontSize', 100 )));
	data.fCollectionSize.setValue( parseInt( settings.get( 'AHLCG-DefaultCollectionFontSize', 100 )));

	data.fTitleOffset.setValue( parseInt( settings.get( 'AHLCG-DefaultTitleFontOffset', 0 )));
	data.fSubtitleOffset.setValue( parseInt( settings.get( 'AHLCG-DefaultSubtitleFontOffset', 0 )));
	data.fCardTypeOffset.setValue( parseInt( settings.get( 'AHLCG-DefaultCardTypeFontOffset', 0 )));
	data.fBodyOffset.setValue( parseInt( settings.get( 'AHLCG-DefaultBodyFontOffset', 0 )));
	data.fTraitOffset.setValue( parseInt( settings.get( 'AHLCG-DefaultTraitFontOffset', 0 )));
	data.fVictoryOffset.setValue( parseInt( settings.get( 'AHLCG-DefaultVictoryFontOffset', 0 )));
	data.fFlavorOffset.setValue( parseInt( settings.get( 'AHLCG-DefaultFlavorFontOffset', 0 )));
	data.fStoryOffset.setValue( parseInt( settings.get( 'AHLCG-DefaultStoryFontOffset', 0 )));
	data.fCollectionOffset.setValue( parseInt( settings.get( 'AHLCG-DefaultCollectionFontOffset', 0 )));
	
	data.fRotateTitleCheckBox.setSelected( settings.getBoolean( 'AHLCG-DefaultRotateTitle', true ));

	settings.reset( 'AHLCG-FontsEdited' );
	defaultFontSettingsChanged = false;
}

function storeAHLCGPreferences( data ) {
	var AHLCGObject = Eons.namedObjects.AHLCGObject;
	var settings = Settings.getUser();

	var index;
	var name;

	// defaults
	settings.set( 'AHLCG-DefaultEncounterSet', data.deComboBox.getSelectedItem().toString() );
	settings.set( 'AHLCG-DefaultCollection', data.dcComboBox.getSelectedItem().toString() );

	// user sets
	var usedString = '';
	var settingsIndex = 1;
	
	for( index = 0; index < AHLCGObject.standardEncounterList.length; index++ ) {
		// we need to convert this index into the used setting string index		
		let usedIndex = -1;

		for ( i = 0; i < AHLCGObject.standardEncounterList.length; i++) {
			let entry = AHLCGObject.standardEncounterList[i];
			
			if ( entry[3] == index ) {
				usedIndex = i;		
				break;
			}
		}

		if (usedIndex < 0) continue;
	
		let value = data.seTableModel.getValueAt( usedIndex, 0 );

		if ( value == java.lang.Boolean(false) ) usedString = usedString + '0';
		else usedString = usedString + '1';

		if (usedString.length >= 40) {
			settings.set( 'AHLCG-UseEncounter' + settingsIndex, usedString );

			settingsIndex++;
			usedString = '';
		}
	}

	if (usedString.length > 0) {
		settings.set( 'AHLCG-UseEncounter' + settingsIndex, usedString );		
	}

	var userCount = data.ueTableModel.getRowCount();

	settings.setInt( 'AHLCG-UserEncounterCount', userCount);

	for ( index = 0; index < userCount; index++) {
		settings.set( 'AHLCG-UserEncounterName' + (index+1), data.ueTableModel.getValueAt( index, 1 ) );
		settings.set( 'AHLCG-UserEncounterIcon' + (index+1), data.ueTableModel.getValueAt( index, 2 ) );
		settings.set( 'AHLCG-UserEncounterTag' + (index+1), data.ueTableModel.getValueAt( index, 3 ) );		

		let value = data.ueTableModel.getValueAt( index, 0 );

		let parameter = true;
		if ( value == java.lang.Boolean(false) ) parameter = false;

		settings.setBoolean( 'AHLCG-UseUserEncounter' + (index+1), parameter );
	}

	do {
		name = settings.get( 'AHLCG-UserEncounterName' + (index+1) );

		if (name != null) {
			settings.reset( 'AHLCG-UserEncounterName' + (index+1) );
			settings.reset( 'AHLCG-UserEncounterIcon' + (index+1) );
			settings.reset( 'AHLCG-UserEncounterTag' + (index+1) );
			settings.reset( 'AHLCG-UseUserEncounter' + (index+1) );
		}	
		
		index++;
	} while ( name != null );

	usedString = '';
	settingsIndex = 1;
	for( index = 0; index < AHLCGObject.standardCollectionList.length; index++ ) {		
		// we need to convert this index into the used setting string index		
		let usedIndex = -1;

		for ( i = 0; i < AHLCGObject.standardCollectionList.length; i++) {
			let entry = AHLCGObject.standardCollectionList[i];
			
			if ( entry[2] == index ) {
				usedIndex = i;		
				break;
			}
		}

		if (usedIndex < 0) continue;

//		let value = data.scTableModel.getValueAt( index, 0 );
		let value = data.scTableModel.getValueAt( usedIndex, 0 );

		if ( value == java.lang.Boolean(false) ) usedString = usedString + '0';
		else usedString = usedString + '1';

		if (usedString.length >= 40) {
			settings.set( 'AHLCG-UseCollection' + settingsIndex, usedString );
			settingsIndex++;
			usedString = '';
		}
	}		

	if (usedString.length > 0) {
		settings.set( 'AHLCG-UseCollection' + settingsIndex, usedString );		
	}

	userCount = data.ucTableModel.getRowCount();
	settings.setInt( 'AHLCG-UserCollectionCount', userCount);

	for ( index = 0; index < userCount; index++) {
		settings.set( 'AHLCG-UserCollectionName' + (index+1), data.ucTableModel.getValueAt( index, 1 ) );
		settings.set( 'AHLCG-UserCollectionIcon' + (index+1), data.ucTableModel.getValueAt( index, 2 ) );
		settings.set( 'AHLCG-UserCollectionTag' + (index+1), data.ucTableModel.getValueAt( index, 3 ) );		

		let value = data.ucTableModel.getValueAt( index, 0 );

		let parameter = true;
		if ( value == java.lang.Boolean(false) ) parameter = false;

		settings.setBoolean( 'AHLCG-UseUserCollection' + (index+1), parameter );
	}

	do {
		name = settings.get( 'AHLCG-UserCollectionName' + (index+1) );
		
		if (name != null) {
			settings.reset( 'AHLCG-UserCollectionName' + (index+1) );
			settings.reset( 'AHLCG-UserCollectionIcon' + (index+1) );
			settings.reset( 'AHLCG-UserCollectionTag' + (index+1) );
			settings.reset( 'AHLCG-UseUserCollection' + (index+1) );
		}	
		
		index++;
	} while ( name != null );

	updateUsedEncounterSets( AHLCGObject );
	updateUsedCollections( AHLCGObject );

	// default fonts
	if (defaultFontSettingsChanged) {
		settings.set( 'AHLCG-DefaultTitleFont', data.fTitleComboBox.getSelectedItem().toString() );
		settings.set( 'AHLCG-DefaultSubtitleFont', data.fSubtitleComboBox.getSelectedItem().toString() );
		settings.set( 'AHLCG-DefaultCardTypeFont', data.fCardTypeComboBox.getSelectedItem().toString() );
		settings.set( 'AHLCG-DefaultBodyFont', data.fBodyComboBox.getSelectedItem().toString() );
		settings.set( 'AHLCG-DefaultTraitFont', data.fTraitComboBox.getSelectedItem().toString() );
		settings.set( 'AHLCG-DefaultVictoryFont', data.fVictoryComboBox.getSelectedItem().toString() );
		settings.set( 'AHLCG-DefaultFlavorFont', data.fFlavorComboBox.getSelectedItem().toString() );
		settings.set( 'AHLCG-DefaultStoryFont', data.fStoryComboBox.getSelectedItem().toString() );
		settings.set( 'AHLCG-DefaultCollectionFont', data.fCollectionComboBox.getSelectedItem().toString() );

		settings.set( 'AHLCG-DefaultTitleFontSize', data.fTitleSize.getValue() );
		settings.set( 'AHLCG-DefaultSubtitleFontSize', data.fSubtitleSize.getValue() );
		settings.set( 'AHLCG-DefaultCardTypeFontSize', data.fCardTypeSize.getValue() );
		settings.set( 'AHLCG-DefaultBodyFontSize', data.fBodySize.getValue() );
		settings.set( 'AHLCG-DefaultTraitFontSize', data.fTraitSize.getValue() );
		settings.set( 'AHLCG-DefaultVictoryFontSize', data.fVictorySize.getValue() );
		settings.set( 'AHLCG-DefaultFlavorFontSize', data.fFlavorSize.getValue() );
		settings.set( 'AHLCG-DefaultStoryFontSize', data.fStorySize.getValue() );
		settings.set( 'AHLCG-DefaultCollectionFontSize', data.fCollectionSize.getValue() );

		settings.set( 'AHLCG-DefaultTitleFontOffset', data.fTitleOffset.getValue() );
		settings.set( 'AHLCG-DefaultSubtitleFontOffset', data.fSubtitleOffset.getValue() );
		settings.set( 'AHLCG-DefaultCardTypeFontOffset', data.fCardTypeOffset.getValue() );
		settings.set( 'AHLCG-DefaultBodyFontOffset', data.fBodyOffset.getValue() );
		settings.set( 'AHLCG-DefaultTraitFontOffset', data.fTraitOffset.getValue() );
		settings.set( 'AHLCG-DefaultVictoryFontOffset', data.fVictoryOffset.getValue() );
		settings.set( 'AHLCG-DefaultFlavorFontOffset', data.fFlavorOffset.getValue() );
		settings.set( 'AHLCG-DefaultStoryFontOffset', data.fStoryOffset.getValue() );
		settings.set( 'AHLCG-DefaultCollectionFontOffset', data.fCollectionOffset.getValue() );

		settings.setBoolean( 'AHLCG-DefaultRotateTitle', data.fRotateTitleCheckBox.isSelected() );

		// I don't know why this is necessary, but if I just addResetKeys one of the main ones, it always triggers, even if we don't write it here
		settings.setBoolean( 'AHLCG-FontsEdited', true );
	}
}

function verifyUserEncounter( name, icon, tag, data ) {
	if ( name.length() == 0) {
		alert( 'Please enter an encounter set name' );
		return false;
	}
	if ( icon.length() == 0) {
		alert( 'Please enter an encounter set icon filename' );
		return false;
	}
	if ( tag.length() == 0) {
		alert( 'Please enter an encounter set tag' );
		return false;
	}
	
	var f = new File( icon );
	if (!f.exists() || f.isDirectory()) { 
    	alert( 'Could not open icon image' );
    	return false;
	}
	
	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	var nameUsed = false;
	var tagUsed = false;

	var standardCount = data.seTableModel.getRowCount();
	
	for ( let index = 0; index < standardCount; index++) {
		if ( name == data.seTableModel.getValueAt( index, 1 ) ) nameUsed = true;
		if ( createUserSettingValue(name) == createUserSettingValue(data.seTableModel.getValueAt( index, 1 )) ) nameUsed = true;
		if ( tag == data.seTableModel.getValueAt( index, 3 ) ) tagUsed = true;
	}

	var userCount = data.ueTableModel.getRowCount();
	
	for ( let index = 0; index < userCount; index++) {
		if ( name == data.ueTableModel.getValueAt( index, 1 ) ) nameUsed = true;
		if ( createUserSettingValue(name) == createUserSettingValue(data.ueTableModel.getValueAt( index, 1 )) ) nameUsed = true;
		if ( tag == data.ueTableModel.getValueAt( index, 3 ) ) tagUsed = true;
	}

	if (nameUsed) {
		alert( 'Encounter set name is already being used.' );
		return false;
	}
	
	if (tagUsed) {
		alert( 'Encounter set tag is already being used.' );
		return false;
	}
	
	return true;
}

function verifyUserCollection( name, icon, tag, data ) {
	if ( name.length() == 0) {
		alert( 'Please enter a collection name' );
		return false;
	}
	if ( icon.length() == 0) {
		alert( 'Please enter a collection icon filename' );
		return false;
	}
	if ( tag.length() == 0) {
		alert( 'Please enter a collection tag' );
		return false;
	}
	
	var f = new File( icon );
	if (!f.exists() || f.isDirectory()) { 
    	alert( 'Could not open icon image' );
    	return false;
	}
	
	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	var nameUsed = false;
	var tagUsed = false;

	var standardCount = data.scTableModel.getRowCount();
	
	for ( let index = 0; index < standardCount; index++) {
		if ( name == data.scTableModel.getValueAt( index, 1 ) ) nameUsed = true;
		if ( createUserSettingValue(name) == createUserSettingValue(data.scTableModel.getValueAt( index, 1 )) ) nameUsed = true;
		if ( tag == data.scTableModel.getValueAt( index, 2 ) ) tagUsed = true;
	}

	var userCount = data.ucTableModel.getRowCount();
	
	for ( let index = 0; index < userCount; index++) {
		if ( name == data.ucTableModel.getValueAt( index, 1 ) ) nameUsed = true;
		if ( createUserSettingValue(name) == createUserSettingValue(data.ucTableModel.getValueAt( index, 1 )) ) nameUsed = true;
		if ( tag == data.ucTableModel.getValueAt( index, 3 ) ) tagUsed = true;
	}

	if (nameUsed) {
		alert( 'Collection name is already being used.' );
		return false;
	}
	
	if (tagUsed) {
		alert( 'Collection tag is already being used.' );
		return false;
	}
	
	return true;
}

function checkSets( table ) {
	var selectedRows = table.getSelectedRows();
	var model = table.getModel();
	
	if (selectedRows.length > 0)
	{
		for ( let i = 0; i < selectedRows.length; i++)
		{
			selectedRows[i] = table.convertRowIndexToModel( selectedRows[i] );
			model.setValueAt( true, selectedRows[i], 0 );
		}

		model.fireTableDataChanged();
	}
}

function uncheckSets( table ) {
	var selectedRows = table.getSelectedRows();
	var model = table.getModel();
		
	if (selectedRows.length > 0)
	{
		for ( let i = 0; i < selectedRows.length; i++)
		{
			selectedRows[i] = table.convertRowIndexToModel( selectedRows[i] );
			model.setValueAt( false, selectedRows[i], 0 );
		}

		model.fireTableDataChanged();
	}
}

function deleteSets( table, prompt, title ) {
	var selectedRows = table.getSelectedRows();
	var model = table.getModel();
	
	if (selectedRows.length > 0)
	{
		if ( confirm( prompt, title ) )
		{
			for ( let i = 0; i < selectedRows.length; i++)
			{
				selectedRows[i] = table.convertRowIndexToModel( selectedRows[i] );
			}

			selectedRows.sort();
	
			for ( let i = selectedRows.length - 1; i >= 0; i--)
			{
				model.removeRow( selectedRows[i] );
			}
		
			model.fireTableDataChanged();
		}
	}
}

function updateDefaultEncounterSet( data ) {
	var selectedItem = data.deComboBox.getSelectedItem();
	
	var basicCount = Eons.namedObjects.AHLCGObject.basicEncounterList.length;

	// remove everything other than the basic sets, we're going to refill with only the selected sets
	while ( data.deComboBox.getItemCount() > basicCount ) data.deComboBox.removeItemAt( basicCount );
	
	data.seTableModel.addToComboBox( data.deComboBox );
	data.ueTableModel.addToComboBox( data.deComboBox );
	
	selectDefaultEncounter( data, selectedItem.toString() );
}

function updateDefaultCollection( data ) {
	var selectedItem = data.dcComboBox.getSelectedItem();

	var basicCount = Eons.namedObjects.AHLCGObject.basicCollectionList.length;

	// remove everything other than the basic sets, we're going to refill with only the selected sets
	while ( data.dcComboBox.getItemCount() > basicCount ) data.dcComboBox.removeItemAt( basicCount );
	
	data.scTableModel.addToComboBox( data.dcComboBox );
	data.ucTableModel.addToComboBox( data.dcComboBox );
	
	selectDefaultCollection( data, selectedItem.toString() );
}

function selectDefaultEncounter( data, value ) {
	var selectedIndex = 1;	// Strange Eons
	
	for ( let i = 0; i < data.deComboBox.getItemCount(); i++) {
		let item = data.deComboBox.getItemAt(i).toString();

		if ( item == value ) {
			selectedIndex = i;
			break;
		}
	}
	
	data.deComboBox.setSelectedIndex(selectedIndex);
}

function selectDefaultCollection( data, value ) {
	var selectedIndex = 1;	// Strange Eons
	
	for ( let i = 0; i < data.dcComboBox.getItemCount(); i++) {
		let item = data.dcComboBox.getItemAt(i).toString();

		if ( item == value ) {
			selectedIndex = i;
			break;
		}
	}
		
	data.dcComboBox.setSelectedIndex(selectedIndex);
}

function getCollectionIndexForID(collectionID) {
	var AHLCGObject = Eons.namedObjects.AHLCGObject;

	for (i = 0; i < AHLCGObject.standardCollectionList.length; i++) {
		if ( AHLCGObject.standardCollectionList[i][2] == collectionID ) return i;
	}
}

function updateDefaultFont( combobox, value ) {
	var selectedItem = combobox.getSelectedItem();
	var selectedIndex = 0;	// Default

	for ( let i = 0; i < combobox.getItemCount(); i++) {
		let item = combobox.getItemAt(i).toString();

		if ( item == value ) {
			selectedIndex = i;
			break;
		}
	}

	combobox.setSelectedIndex(selectedIndex);
}