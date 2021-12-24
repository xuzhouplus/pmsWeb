import MediaEmbedEditing from "@ckeditor/ckeditor5-media-embed/src/mediaembedediting";
import MediaEmbedUI from "@ckeditor/ckeditor5-media-embed/src/mediaembedui";
import AutoMediaEmbed from "@ckeditor/ckeditor5-media-embed/src/automediaembed";
import VideoInsertUI from "@utils/ckeditor/videoInsert/videoInsertUI";

export default class VideoInsert extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires() {
        return [ MediaEmbedEditing, VideoInsertUI, AutoMediaEmbed, Widget ];
    }

    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'VideoInsert';
    }
}