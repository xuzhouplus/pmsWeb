import {Plugin} from 'ckeditor5/src/core';
import {ButtonView} from '@ckeditor/ckeditor5-ui';

export default class InsertMedia extends Plugin {
    splitButtonViewLabel = 'Insert media';
    splitButtonViewIcon = null;
    view = null;

    getCommand() {

    }

    createView(locale, command) {
        const t = locale.t;
        const buttonView = new ButtonView(locale);
        buttonView.set({
            label: t(this.splitButtonViewLabel),
            icon: this.splitButtonViewIcon,
            tooltip: true
        });

        buttonView.bind('isEnabled').to(command);

        buttonView.set({
            label: t(this.splitButtonViewLabel),
            icon: this.splitButtonViewIcon,
            tooltip: true
        });

        buttonView.on('execute', () => {
            this.execute()
        });

        return buttonView;
    }
}
