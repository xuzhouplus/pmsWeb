import MediaEmbedEditing from "@ckeditor/ckeditor5-media-embed/src/mediaembedediting";
import AutoMediaEmbed from "@ckeditor/ckeditor5-media-embed/src/automediaembed";
import VideoInsertUI from "@utils/ckeditor/videoInsert/videoInsertUI";
import MediaEmbed from "@ckeditor/ckeditor5-media-embed/src/mediaembed";
import { Widget } from 'ckeditor5/src/widget';

export default class VideoInsert extends MediaEmbed {
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