import ImageInsert from "@ckeditor/ckeditor5-image/src/imageinsert.js";
import ImageUpload from "@utils/ckeditor/imageInsert/imageUpload";
import FileInsertUI from "@utils/ckeditor/imageInsert/imageInsertUI";

export default class imageInsert extends ImageInsert {
    static get pluginName() {
        return 'ImageInsert';
    }

    static get requires() {
        return [ImageUpload, FileInsertUI];
    }
}