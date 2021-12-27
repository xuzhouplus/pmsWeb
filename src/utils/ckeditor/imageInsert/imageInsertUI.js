import CkeditorImageInsertUI from "@ckeditor/ckeditor5-image/src/imageinsert/imageinsertui";
import ImageInsertPanelView from "@ckeditor/ckeditor5-image/src/imageinsert/ui/imageinsertpanelview";
import {createLabeledInputText, LabeledFieldView} from "@ckeditor/ckeditor5-ui";

export default class ImageInsertUI extends CkeditorImageInsertUI {
    static get pluginName() {
        return 'ImageInsertUI';
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
        editor.ui.componentFactory.add('insertImage', componentCreator);
        editor.ui.componentFactory.add('imageInsert', componentCreator);
    }

    _createDropdownView(locale) {
        const editor = this.editor;
        const imageInsertView = new ImageInsertPanelView(locale, this.prepareIntegrations(editor));

        const dropdownView = imageInsertView.dropdownView;
        const splitButtonView = dropdownView.buttonView;

        splitButtonView.actionView = editor.ui.componentFactory.create('imageUpload');
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
            let onFilePeek = editor.config._config.image.onFilePeek
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

    _setUpDropdown(dropdownView, imageInsertView, command) {
        const editor = this.editor;
        const t = editor.t;
        const insertButtonView = imageInsertView.insertButtonView;
        const insertImageViaUrlForm = imageInsertView.getIntegration('insertImageViaUrl');
        const panelView = dropdownView.panelView;
        const imageUtils = this.editor.plugins.get('ImageUtils');

        // Defer the children injection to improve initial performance.
        // See https://github.com/ckeditor/ckeditor5/pull/8019#discussion_r484069652.
        dropdownView.buttonView.once('open', () => {
            panelView.children.add(imageInsertView);
        });

        dropdownView.on('change:isOpen', () => {
            const selectedElement = editor.model.document.selection.getSelectedElement();

            if (dropdownView.isOpen) {
                imageInsertView.focus();

                if (imageUtils.isImage(selectedElement)) {
                    imageInsertView.imageURLInputValue = selectedElement.getAttribute('src');
                    insertButtonView.label = t('Update');
                    insertImageViaUrlForm.label = t('Update image URL');
                } else {
                    imageInsertView.imageURLInputValue = '';
                    insertButtonView.label = t('Insert');
                    insertImageViaUrlForm.label = t('Insert image via URL');
                }
            }
            // Note: Use the low priority to make sure the following listener starts working after the
            // default action of the drop-down is executed (i.e. the panel showed up). Otherwise, the
            // invisible form/input cannot be focused/selected.
        }, {priority: 'low'});

        imageInsertView.delegate('submit', 'cancel').to(dropdownView);
        this.delegate('cancel').to(dropdownView);

        dropdownView.on('submit', () => {
            closePanel();
            onSubmit();
        });

        dropdownView.on('cancel', () => {
            closePanel();
        });

        function onSubmit() {
            const selectedElement = editor.model.document.selection.getSelectedElement();

            if (imageUtils.isImage(selectedElement)) {
                editor.model.change(writer => {
                    writer.setAttribute('src', imageInsertView.imageURLInputValue, selectedElement);
                    writer.removeAttribute('srcset', selectedElement);
                    writer.removeAttribute('sizes', selectedElement);
                });
            } else {
                editor.execute('insertImage', {source: imageInsertView.imageURLInputValue});
            }
        }

        function closePanel() {
            editor.editing.view.focus();
            dropdownView.isOpen = false;
        }

        return dropdownView;
    }

    prepareIntegrations() {
        const panelItems = this.editor.config.get('image.insert.integrations');
        const imageInsertUIPlugin = this.editor.plugins.get('ImageInsertUI');

        const PREDEFINED_INTEGRATIONS = {
            'insertImageViaUrl': this.createLabeledInputView()
        };

        if (!panelItems) {
            return PREDEFINED_INTEGRATIONS;
        }

        // Prepares ckfinder component for the `openCKFinder` integration token.
        if (panelItems.find(item => item === 'openCKFinder') && this.editor.ui.componentFactory.has('ckfinder')) {
            const ckFinderButton = this.editor.ui.componentFactory.create('ckfinder');
            ckFinderButton.set({
                withText: true,
                class: 'ck-image-insert__ck-finder-button'
            });

            // We want to close the dropdown panel view when user clicks the ckFinderButton.
            ckFinderButton.delegate('execute').to(imageInsertUIPlugin, 'cancel');

            PREDEFINED_INTEGRATIONS.openCKFinder = ckFinderButton;
        }

        // Creates integrations object of valid views to pass it to the ImageInsertPanelView.
        return panelItems.reduce((object, key) => {
            if (PREDEFINED_INTEGRATIONS[key]) {
                object[key] = PREDEFINED_INTEGRATIONS[key];
            } else if (this.editor.ui.componentFactory.has(key)) {
                object[key] = this.editor.ui.componentFactory.create(key);
            }

            return object;
        }, {});
    }

    createLabeledInputView() {
        const t = this.editor.locale.t;
        const labeledInputView = new LabeledFieldView(this.editor.locale, createLabeledInputText);

        labeledInputView.set({
            label: t('Insert image via URL')
        });
        labeledInputView.fieldView.placeholder = 'https://example.com/image.png';

        return labeledInputView;
    }
}