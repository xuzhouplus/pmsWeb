import MediaEmbedEditing from './mediaembedediting';
import mediaIcon from '../theme/icons/media.svg';
import MediaEmbedUI from "@ckeditor/ckeditor5-media-embed/src/mediaembedui";
import ImageInsertPanelView from "@ckeditor/ckeditor5-image/src/imageinsert/ui/imageinsertpanelview";
import MediaFormView from "@ckeditor/ckeditor5-media-embed/src/ui/mediaformview";

export default class VideoInsertUI extends MediaEmbedUI {
    /**
     * @inheritDoc
     */
    static get requires() {
        return [ MediaEmbedEditing ];
    }

    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'VideoInsertUI';
    }

    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        const componentCreator = locale => {
            return this._createDropdownView(locale);
        };

        editor.ui.componentFactory.add('insertVideo', componentCreator);
        editor.ui.componentFactory.add('videoInsert', componentCreator);
    }

    _createDropdownView(locale) {
        const editor = this.editor;
        const command = editor.commands.get( 'mediaEmbed' );
        const registry = editor.plugins.get( MediaEmbedEditing ).registry;
        const mediaForm = new MediaFormView( getFormValidators( editor.t, registry ), editor.locale );

        const dropdownView = imageInsertView.dropdownView;
        const splitButtonView = dropdownView.buttonView;

        splitButtonView.actionView = editor.ui.componentFactory.create('fileUpload');
        // After we replaced action button with `uploadImage` component,
        // we have lost a proper styling and some minor visual quirks have appeared.
        // Brining back original split button classes helps fix the button styling
        // See https://github.com/ckeditor/ckeditor5/issues/7986.
        splitButtonView.actionView.extendTemplate({
            attributes: {
                class: 'ck ck-button ck-splitbutton__action'
            }
        });

        splitButtonView.actionView.buttonView.on('execute', (evt) => {
            let onFilePeek = editor.config._config.video.onFilePeek
            if (typeof onFilePeek === 'function') {
                const promise = onFilePeek()
                promise.then(result => {
                    console.log(result)
                    editor.execute('insertImage', {source: result.path});
                })
            }
        });

        return this._setUpDropdown(dropdownView, imageInsertView);
    }

    /**
     * @private
     * @param {module:ui/dropdown/dropdownview~DropdownView} dropdown
     * @param {module:ui/view~View} form
     * @param {module:media-embed/mediaembedcommand~MediaEmbedCommand} command
     */
    _setUpDropdown( dropdown, form, command ) {
        const editor = this.editor;
        const t = editor.t;
        const button = dropdown.buttonView;

        dropdown.bind( 'isEnabled' ).to( command );
        dropdown.panelView.children.add( form );

        button.set( {
            label: t( 'Insert media' ),
            icon: mediaIcon,
            tooltip: true
        } );

        // Note: Use the low priority to make sure the following listener starts working after the
        // default action of the drop-down is executed (i.e. the panel showed up). Otherwise, the
        // invisible form/input cannot be focused/selected.
        button.on( 'open', () => {
            form.disableCssTransitions();

            // Make sure that each time the panel shows up, the URL field remains in sync with the value of
            // the command. If the user typed in the input, then canceled (`urlInputView#fieldView#value` stays
            // unaltered) and re-opened it without changing the value of the media command (e.g. because they
            // didn't change the selection), they would see the old value instead of the actual value of the
            // command.
            form.url = command.value || '';
            form.urlInputView.fieldView.select();
            form.focus();
            form.enableCssTransitions();
        }, { priority: 'low' } );

        dropdown.on( 'submit', () => {
            if ( form.isValid() ) {
                editor.execute( 'mediaEmbed', form.url );
                closeUI();
            }
        } );

        dropdown.on( 'change:isOpen', () => form.resetFormStatus() );
        dropdown.on( 'cancel', () => closeUI() );

        function closeUI() {
            editor.editing.view.focus();
            dropdown.isOpen = false;
        }
    }

    /**
     * @private
     * @param {module:ui/dropdown/dropdownview~DropdownView} dropdown
     * @param {module:ui/view~View} form
     * @param {module:media-embed/mediaembedcommand~MediaEmbedCommand} command
     */
    _setUpForm( dropdown, form, command ) {
        form.delegate( 'submit', 'cancel' ).to( dropdown );
        form.urlInputView.bind( 'value' ).to( command, 'value' );

        // Form elements should be read-only when corresponding commands are disabled.
        form.urlInputView.bind( 'isReadOnly' ).to( command, 'isEnabled', value => !value );
    }
}

function getFormValidators( t, registry ) {
    return [
        form => {
            if ( !form.url.length ) {
                return t( 'The URL must not be empty.' );
            }
        },
        form => {
            if ( !registry.hasMedia( form.url ) ) {
                return t( 'This media URL is not supported.' );
            }
        }
    ];
}
