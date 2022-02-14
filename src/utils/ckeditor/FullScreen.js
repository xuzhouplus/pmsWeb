import {Plugin} from 'ckeditor5/src/core.js';
import enterFullScreenIcon from '@assets/icons/enter-fullscreen.svg';
import exitFullScreenIcon from '@assets/icons/exit-fullscreen.svg';
import {ButtonView} from "@ckeditor/ckeditor5-ui/src/index.js";

export default class FullScreen extends Plugin {

    constructor(props) {
        super(props);
        this.fullScreen = false
        this.buttonView = null
    }

    static get pluginName() {
        return 'FullScreen';
    }

    init() {
        const componentCreator = locale => {
            this.buttonView = this.createButton(locale);
            return this.buttonView;
        };

        this.editor.ui.componentFactory.add('fullScreen', componentCreator);
    }

    createButton(locale) {
        const t = locale.t;
        const buttonView = new ButtonView(locale);
        buttonView.set({
            label: t('Enter Full Screen'),
            icon: enterFullScreenIcon,
            tooltip: true,
            isEnabled: true,
            fillColor: '#000000',
            isToggleable: true
        });
        buttonView.on('execute', () => {
            if (this.fullScreen) {
                this.exitFullscreen()
            } else {
                this.launchIntoFullscreen()
            }
        }, {priority: 'low'});
        window.onresize = () => {
            setTimeout(() => {
                if (this.getFullscreenElement()) {
                    this.fullScreen = true
                    buttonView.set({
                        label: t('Exit Full Screen'),
                        icon: exitFullScreenIcon
                    });
                } else {
                    this.fullScreen = false
                    buttonView.set({
                        label: t('Enter Full Screen'),
                        icon: enterFullScreenIcon
                    });
                }
            }, 300)
        }
        document.onkeydown = (event) => {
            let key = this.checkKeyEscOrF11(event)
            if (key === 'Esc' || key === 'F11') {
                this.exitFullscreen();
            }
        }
        this.editor.sourceElement.parentElement.onkeydown = (event) => {
            let key = this.checkKeyEscOrF11(event)
            if (key === 'F11') {
                if (this.fullScreen) {
                    this.exitFullscreen();
                } else {
                    this.launchIntoFullscreen();
                }
                event.stopPropagation();
                event.preventDefault();
            }
        }
        return buttonView
    }

    checkKeyEscOrF11(event) {
        if (event.code) {
            if (event.code === 'Escape') {
                return 'Esc';
            } else if (event.code === 'F11') {
                return 'F11';
            } else {
                return 'unknown'
            }
        } else {
            if (event.keyCode === 122) {
                return 'F11'
            } else if (event.keyCode === 27) {
                return 'Esc'
            } else {
                return 'unknown'
            }
        }
    }

    isFullscreenEnabled() {
        return (
            document.fullscreenEnabled ||
            document.mozFullScreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.msFullscreenEnabled
        );
    }

    isFullScreen() {
        return !!(
            document.fullscreen ||
            document.mozFullScreen ||
            document.webkitIsFullScreen ||
            document.webkitFullScreen ||
            document.msFullScreen
        );
    }

    launchIntoFullscreen() {
        let element = this.editor.sourceElement.parentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    exitFullscreen() {
        if (this.getFullscreenElement()) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }

    getFullscreenElement() {
        return (
            document.fullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullScreenElement ||
            document.webkitFullscreenElement || null
        );
    }
}
