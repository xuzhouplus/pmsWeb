import ImageUpload from "@ckeditor/ckeditor5-image/src/imageupload";
import ImageUploadUI from "@utils/ckeditor/imageInsert/imageUploadUI";

export default class VideoUpload extends ImageUpload {
    static get pluginName() {
        return 'FileUpload';
    }

    static get requires() {
        return [ImageUploadUI];
    }
}