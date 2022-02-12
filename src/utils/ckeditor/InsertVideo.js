import mediaIcon from '@ckeditor/ckeditor5-media-embed/theme/icons/media.svg';
import InsertMedia from './InsertMedia';

export default class InsertVideo extends InsertMedia {
    static get pluginName() {
        return 'InsertVideo';
    }

    splitButtonViewLabel = 'Insert media';
    splitButtonViewIcon = mediaIcon;

    init() {
        const componentCreator = locale => {
            this.command = this.getCommand();
            this.view = this.createView(locale, this.command);
            return this.view;
        };

        this.editor.ui.componentFactory.add('insertVideo', componentCreator);
        this.editor.ui.componentFactory.add('videoInsert', componentCreator);
    }

    getCommand() {
        return this.editor.commands.get('mediaEmbed');
    }

    execute() {
        let onFilePeek = this.editor.config._config.video.onFilePeek;
        if (typeof onFilePeek === 'function') {
            const promise = onFilePeek();
            promise.then(result => {
                console.log(result);
                this.editor.execute('mediaEmbed', 'http://web.pms.test/media/'+result.uuid);
            });
        }
    }
}
