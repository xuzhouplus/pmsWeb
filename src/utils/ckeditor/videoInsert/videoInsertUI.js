import MediaEmbedEditing from '@ckeditor/ckeditor5-media-embed/src/mediaembedediting';
import MediaEmbedUI from "@ckeditor/ckeditor5-media-embed/src/mediaembedui";
import {createLabeledInputText, LabeledFieldView} from "@ckeditor/ckeditor5-ui";
import {createDropdown, SplitButtonView} from "ckeditor5/src/ui";
import MediaFormView from "@ckeditor/ckeditor5-media-embed/src/ui/mediaformview";
import mediaIcon from "@ckeditor/ckeditor5-media-embed/theme/icons/media.svg";

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

        // Register `insertImage` dropdown and add `imageInsert` dropdown as an alias for backward compatibility.
        editor.ui.componentFactory.add('insertVideo', componentCreator);
        editor.ui.componentFactory.add('videoInsert', componentCreator);
    }

    _createDropdownView(locale) {
        const t = locale.t;
        const dropdownView = createDropdown( locale, SplitButtonView );
        const splitButtonView = dropdownView.buttonView;
        const panelView = dropdownView.panelView;

        splitButtonView.set( {
            label: t( 'Insert media' ),
            icon: mediaIcon,
            tooltip: true
        } );

        panelView.extendTemplate( {
            attributes: {
                class: 'ck-image-insert__panel'
            }
        } );
        const command = this.editor.commands.get( 'mediaEmbed' );
        this._setUpDropdown(dropdownView,panelView,command)
        return dropdownView
    }

    _setUpDropdown(dropdownView, videoInsertView, command) {
        const editor = this.editor;
        const registry = editor.plugins.get( MediaEmbedEditing ).registry;
        const mediaForm = new MediaFormView( getFormValidators( editor.t, registry ), editor.locale );
        videoInsertView.children.add( mediaForm );
        const button = dropdownView.buttonView;

        dropdownView.bind( 'isEnabled' ).to( command );
        button.on( 'open', () => {
            mediaForm.disableCssTransitions();

            // Make sure that each time the panel shows up, the URL field remains in sync with the value of
            // the command. If the user typed in the input, then canceled (`urlInputView#fieldView#value` stays
            // unaltered) and re-opened it without changing the value of the media command (e.g. because they
            // didn't change the selection), they would see the old value instead of the actual value of the
            // command.
            mediaForm.url = command.value || '';
            mediaForm.urlInputView.fieldView.select();
            mediaForm.focus();
            mediaForm.enableCssTransitions();
        }, { priority: 'low' } );

        dropdownView.on( 'submit', () => {
            if ( mediaForm.isValid() ) {
                console.log(mediaForm.url)
                editor.execute( 'mediaEmbed', mediaForm.url );
                closeUI();
            }
        } );

        dropdownView.on( 'change:isOpen', () => mediaForm.resetFormStatus() );
        dropdownView.on( 'cancel', () => closeUI() );

        dropdownView.buttonView.on('execute', (evt) => {
            let onFilePeek = editor.config._config.video.onFilePeek
            if (typeof onFilePeek === 'function') {
                const promise = onFilePeek()
                promise.then(result => {
                    console.log(result)
                    editor.execute('mediaEmbed', result.path);
                })
            }
        });

        function closeUI() {
            editor.editing.view.focus();
            dropdownView.isOpen = false;
        }

        return dropdownView;
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
