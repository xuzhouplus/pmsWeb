import React from "react";
import {Card, Modal} from "react-bootstrap";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import './FilePreviewModal.scss';

class FilePreviewModal extends React.Component {
	player = null
	videoNode = null

	constructor(props) {
		super(props);
		this.state = {
			isVideo: this.props.type === 'video'
		}
	}


	componentDidMount() {
		if (this.state.isVideo) {
			const _this = this
			videojs.addLanguage("zh-CH", {
				Pause: "暂停",
				Play: "播放",
				Fullscreen: "全屏",
				"Non-Fullscreen": "退出全屏",
				Mute: "静音",
				Unmute: "取消静音",
				"Picture-in-Picture": "画中画",
				Capture: "截图"
			})
			this.player = videojs(this.videoNode, {
				language: "zh-CH",
				autoplay: true,
				controls: true,
				sources: [{
					src: this.props.preview,
					type: 'application/x-mpegURL'
				}]
			}, function onPlayerReady() {
				const player = this
				player.el_.querySelector(".vjs-picture-in-picture-control").style.display = "none"
				// "vjs-picture-in-picture-control"
				const captureButton = videojs.dom.createEl('div', {
					className: 'vjs-capture-button',
					title: "截图"
				});
				captureButton.removeEventListener("click", _this.capture.bind(_this, player))
				captureButton.addEventListener("click", _this.capture.bind(_this, player))
				videojs.dom.appendContent(this.el_, captureButton);
			});
		}
	}

	// destroy player on unmount
	componentWillUnmount() {
		if (this.state.isVideo && this.player) {
			this.player.el_.querySelector(".vjs-capture-button").removeEventListener("click", this.capture.bind(this, this.player))
			this.player.dispose()
		}
	}

	capture = (player) => {
		console.log(player.player_.currentTime())
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
								{this.props.name}（{this.props.width}/{this.props.height}）
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
