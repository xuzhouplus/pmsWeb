import ImageInsert from "@ckeditor/ckeditor5-image/src/imageinsert.js";
import FileUpload from "@utils/ckeditor/fileUpload";
import FileInsertUI from "@utils/ckeditor/fileInsertUI";

export default class fileInsert extends ImageInsert {
    static get pluginName() {
        return 'FilePeek';
    }

    static get requires() {
        return [FileUpload, FileInsertUI];
    }
}