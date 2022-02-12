import InsertMedia from './InsertMedia';
import { icons } from '@ckeditor/ckeditor5-core';

export default class InsertImage extends InsertMedia {
	static get pluginName() {
		return 'InsertImage';
	}

	splitButtonViewLabel = 'Insert image';
	splitButtonViewIcon = icons.image;

	getCommand() {
		return this.editor.commands.get( 'uploadImage' );
	}

	execute() {
		let onFilePeek = this.editor.config._config.image.onFilePeek;
		if (typeof onFilePeek === 'function') {
			const promise = onFilePeek();
			promise.then( result => {
				console.log( result );
				this.editor.execute( 'insertImage', { source: result.path } );
			} );
		}
	}

	init() {
		const componentCreator = locale => {
			this.command = this.getCommand();
			this.view = this.createView( locale ,this.command );
			return this.view;
		};

		// Register `insertImage` dropdown and add `imageInsert` dropdown as an alias for backward compatibility.
		this.editor.ui.componentFactory.add( 'insertImage', componentCreator );
		this.editor.ui.componentFactory.add( 'imageInsert', componentCreator );
	}
}
