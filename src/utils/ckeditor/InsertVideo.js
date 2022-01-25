import mediaIcon from '@ckeditor/ckeditor5-media-embed/theme/icons/media.svg';
import { MediaEmbedEditing } from '@ckeditor/ckeditor5-media-embed';
import MediaFormView from '@ckeditor/ckeditor5-media-embed/src/ui/mediaformview';
import InsertMedia from './InsertMedia';

export default class InsertVideo extends InsertMedia {
	static get pluginName() {
		return 'InsertVideo';
	}

	splitButtonViewLabel = 'Insert media';
	splitButtonViewIcon = mediaIcon;

	init() {
		const componentCreator = locale => {
			this.dropdownView = this.createDropdownView( locale );
			this.formView = this.getFormView();
			this.command = this.getCommand();
			this.setUpDropdown( this.dropdownView, this.formView, this.command );
			this.setUpForm( this.dropdownView, this.formView, this.command );
			return this.dropdownView;
		};

		this.editor.ui.componentFactory.add( 'insertVideo', componentCreator );
		this.editor.ui.componentFactory.add( 'videoInsert', componentCreator );
	}

	getCommand() {
		return this.editor.commands.get( 'mediaEmbed' );
	}

	getFormView() {
		const registry = this.editor.plugins.get( MediaEmbedEditing ).registry;
		return new MediaFormView( this.getFormValidators( this.editor.t, registry ), this.editor.locale );
	}

	submit( form ) {
		this.editor.execute( 'mediaEmbed', form.url );
	}

	execute() {
		let onFilePeek = this.editor.config._config.video.onFilePeek;
		if (typeof onFilePeek === 'function') {
			const promise = onFilePeek();
			promise.then( result => {
				console.log( result );
				this.editor.execute( 'mediaEmbed', result.path );
			} );
		}
	}

	getFormValidators( t, registry ) {
		return [
			form => {
				if (!form.url.length) {
					return t( 'The URL must not be empty.' );
				}
			},
			form => {
				if (!registry.hasMedia( form.url )) {
					return t( 'This media URL is not supported.' );
				}
			}
		];
	}
}
