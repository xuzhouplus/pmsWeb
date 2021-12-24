import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import View from '@ckeditor/ckeditor5-ui/src/view';

export default class ImageUploadButtonView extends View {
    constructor(locale) {
        super(locale);
        this.buttonView = new ButtonView(locale);
        this.setTemplate({
            tag: 'span',
            attributes: {
                class: 'ck-file-dialog-button'
            },
            children: [
                this.buttonView
            ]
        });
    }
}
