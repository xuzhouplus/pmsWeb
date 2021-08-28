import ImageUpload from "@ckeditor/ckeditor5-image/src/imageupload";
import FileUploadUI from "@utils/ckeditor/fileUploadUI";

export default class FileUpload extends ImageUpload {
    static get pluginName() {
        return 'FileUpload';
    }

    static get requires() {
        return [FileUploadUI];
    }
}