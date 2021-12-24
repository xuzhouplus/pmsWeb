import ImageUploadUI from "@ckeditor/ckeditor5-image/src/imageupload/imageuploadui";
import ImageUploadButtonView from "@utils/ckeditor/imageInsert/imageUploadButtonView";
import {icons} from '@ckeditor/ckeditor5-core';

export default class VideoUploadUI extends ImageUploadUI {
    static get pluginName() {
        return 'FileUploadUI';
    }

    init() {
        const editor = this.editor;
        const t = editor.t;
        const componentCreator = locale => {
            const view = new ImageUploadButtonView(locale);
            view.buttonView.set({
                label: t('Insert image'),
                icon: icons.image,
                tooltip: true
            });
            return view;
        };

        // Setup `uploadImage` button and add `imageUpload` button as an alias for backward compatibility.
        editor.ui.componentFactory.add('fileUpload', componentCreator);
    }
}