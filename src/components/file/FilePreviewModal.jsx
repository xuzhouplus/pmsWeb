import React from "react";
import {Card, Modal} from "react-bootstrap";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import './FilePreviewModal.scss';
import {CapturePoster} from "@utils/http/VideoCapture";
import Marquee from "@utils/marquee/Marquee";

class FilePreviewModal extends React.Component {
    player = null
    videoNode = null

    constructor(props) {
        super(props);
        this.state = {
            marquee: null,
            loading: false,
            file: {}
        }
    }

    componentDidMount() {
        this.initMarquee()
        this.initPlayer()
    }

    // destroy player on unmount
    componentWillUnmount() {
        if (this.player) {
            this.player.el_.querySelector(".vjs-capture-button").removeEventListener("click", this.capture.bind(this, this.player))
            this.player.dispose()
        }
        if (this.state.marquee) {
            this.state.marquee.destroy()
        }
    }

    initMarquee() {
        const marquee = new Marquee({
            selector: '.modal-title',
            seamless: false
        })
        this.setState({
            marquee: marquee
        })
    }

    initPlayer() {
        const _this = this
        if (this.props.file.type !== 'video') {
            return
        }
        videojs.addLanguage("zh-CH", {
            Pause: "暂停",
            Play: "播放",
            Fullscreen: "全屏",
            "Non-Fullscreen": "退出全屏",
            Mute: "静音",
            Unmute: "取消静音",
            "Picture-in-Picture": "画中画",
            Capture: "截图",
            "Play Video": "播放"
        })
        this.player = videojs(this.videoNode, {
            language: "zh-CH",
            autoplay: false,
            controls: true,
            poster: this.props.file.poster,
            sources: [{
                src: this.props.file.preview,
                type: 'application/x-mpegURL'
            },
                {
                    src: this.props.file.path,
                    type: 'video/mp4'
                }
            ]
        }, function onPlayerReady() {
            const player = this
            player.el_.querySelector(".vjs-picture-in-picture-control").style.display = "none"
            // "vjs-picture-in-picture-control"
            const captureButton = videojs.dom.createEl('div', {
                className: 'vjs-capture-button',
                title: "截作封面"
            });
            captureButton.removeEventListener("click", _this.capture.bind(_this, player))
            captureButton.addEventListener("click", _this.capture.bind(_this, player))
            videojs.dom.appendContent(player.el_, captureButton);
        });
    }

    capture = (player) => {
        this.player.pause()
        this.setState({
            loading: true
        })
        CapturePoster({
            'file_id': this.props.file.uuid,
            'seek': player.player_.currentTime()
        }, data => {
            console.log(data)
        }, error => {
            console.log(error)
        })
    }

    render() {
        let sourcePreview
        if (this.props.file.type === 'video') {
            sourcePreview = <video ref={node => this.videoNode = node} className="video-js"></video>
        } else {
            sourcePreview = <img className="img-previewer" src={this.props.file.preview} alt={this.props.file.name}/>
        }
        return (
            <Modal className="file-preview-modal" centered show size="lg" onHide={this.props.hide}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.file.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card className="file-preview-box">
                        <Card.Header className="file-image-box">
                            {sourcePreview}
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>{this.props.file.name}</Card.Text>
                            <Card.Text>{this.props.file.description}</Card.Text>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>
        );
    }
}

export default FilePreviewModal;
