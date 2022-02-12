import {Plugin} from 'ckeditor5/src/core';
import fullScreenIcon from '@assets/icons/full_screen.svg';
import {ButtonView} from "@ckeditor/ckeditor5-ui";

export default class FullScreen extends Plugin {
    static get pluginName() {
        return 'FullScreen';
    }

    init() {
        const componentCreator = locale => {
            this.button = this.createButton(locale);
            return this.button;
        };

        this.editor.ui.componentFactory.add('fullScreen', componentCreator);
    }

    createButton(locale) {
        const t = locale.t;
        const buttonView = new ButtonView(locale);
        buttonView.set({
            label: t('Full Screen'),
            icon: fullScreenIcon,
            tooltip: true,
            isEnabled: true,
            fillColor: '#000000'
        });
        buttonView.on('execute', () => {
            this.execute()
        });
        return buttonView
    }

    execute() {
       console.log('full screen')
    }
}
