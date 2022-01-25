import MediaFormView from '@ckeditor/ckeditor5-media-embed/src/ui/mediaformview';
import InsertMedia from './InsertMedia';
import { icons } from '@ckeditor/ckeditor5-core';
import {ImageUpload} from "@ckeditor/ckeditor5-image";

export default class InsertImage extends InsertMedia {
	static get pluginName() {
		return 'InsertImage';
	}

	splitButtonViewLabel = 'Insert image';
	splitButtonViewIcon = icons.image;

	getCommand() {
		return this.editor.commands.get( 'uploadImage' );
	}

	getFormView() {
		const registry = this.editor.plugins.get( ImageUpload ).registry;
		return new MediaFormView( this.getFormValidators( this.editor.t, registry ), this.editor.locale );
	}

	submit( form ) {
		const selectedElement = this.editor.model.document.selection.getSelectedElement();
		const imageUtils = this.editor.plugins.get( 'ImageUtils' );
		if (imageUtils.isImage( selectedElement )) {
			this.editor.model.change( writer => {
				writer.setAttribute( 'src', form.url, selectedElement );
				writer.removeAttribute( 'srcset', selectedElement );
				writer.removeAttribute( 'sizes', selectedElement );
			} );
		} else {
			this.editor.execute( 'insertImage', { source: form.url } );
		}
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
			this.dropdownView = this.createDropdownView( locale );
			this.formView = this.getFormView();
			this.command = this.getCommand();
			this.setUpDropdown( this.dropdownView, this.formView, this.command );
			this.setUpForm( this.dropdownView, this.formView, this.command );
			return this.dropdownView;
		};

		// Register `insertImage` dropdown and add `imageInsert` dropdown as an alias for backward compatibility.
		this.editor.ui.componentFactory.add( 'insertImage', componentCreator );
		this.editor.ui.componentFactory.add( 'imageInsert', componentCreator );
	}
}
