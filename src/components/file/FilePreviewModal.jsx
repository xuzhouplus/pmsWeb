import React from "react";
import {Card, Modal} from "react-bootstrap";
import configs from "@/configs";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import './FilePreviewModal.scss';

class FilePreviewModal extends React.Component {
    player = null
    videoNode = null

    constructor(props) {
        super(props);
        this.state = {
            isVideo: configs.videoTypes.indexOf(this.props.type) !== -1
        }
    }


    componentDidMount() {
        if (this.state.isVideo) {
            this.player = videojs(this.videoNode, {
                autoplay: true,
                controls: true,
                sources: [{
                    src: this.props.preview,
                    type: 'application/x-mpegURL'
                }]
            }, function onPlayerReady() {
                console.log('onPlayerReady', this)
            });
        }
    }

    // destroy player on unmount
    componentWillUnmount() {
        if (this.state.isVideo && this.player) {
            this.player.dispose()
        }
    }

    render() {
        let preview
        if (this.state.isVideo) {
            preview = <video ref={node => this.videoNode = node} className="video-js"></video>
        } else {
            preview = <img src={this.props.preview} alt={this.props.name}/>
        }
        return (
            <Modal className="file-preview-modal" centered show size="lg" onHide={this.props.hide}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card className="file-preview-box">
                        <Card.Header className="file-image-box">
                            {preview}
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                {this.props.width}{'*'}{this.props.height}{' '}{this.props.type}
                            </Card.Text>
                            <Card.Text>
                                {this.props.description}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>
        );
    }
}

export default FilePreviewModal;