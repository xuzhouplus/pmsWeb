import React from "react";
import {Button, Card, Form, Modal} from "react-bootstrap";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import './FilePreviewModal.scss';
import {CapturePoster} from "@utils/http/VideoCapture";
import Marquee from "@utils/marquee/Marquee";
import Utils from "@utils/Utils";
import Swal from "sweetalert2";
import {connect} from "react-redux";
import Map from "@redux/Map";

class FilePreviewModal extends React.Component {
	player = null
	videoNode = null

	marquee = null

	constructor(props) {
		super(props);
		this.state = {
			marquee: null,
			loading: false,
			poster: null,
			title: null,
			name: {
				label: '名称',
				isInvalid: false,
				isValid: false,
				value: '',
				text: ''
			},
			description: {
				label: '描述',
				isInvalid: false,
				isValid: false,
				value: '',
				text: ''
			},
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.file) {
			if ((!prevProps.file) || this.props.file.uuid !== prevProps.file.uuid) {
				this.initMarquee()
				this.initPlayer()
				this.setState({
					poster: this.props.file.poster,
					title: this.props.file.name,
					name: {
						label: '名称',
						isInvalid: false,
						isValid: false,
						value: this.props.file.name,
						text: ''
					},
					description: {
						label: '描述',
						isInvalid: false,
						isValid: false,
						value: this.props.file.description,
						text: ''
					},
				})
			}
		}
	}

	// destroy player on unmount
	componentWillUnmount() {
		this.destroyPlayer()
		this.destroyMarquee()
	}

	destroyMarquee = () => {
		if (this.marquee) {
			this.marquee.destroy()
			this.marquee = null
		}
	}

	initMarquee() {
		this.marquee = new Marquee({
			selector: '.modal-title',
			seamless: false
		})
	}

	destroyPlayer = () => {
		try {
			if (this.player) {
				if (this.player.el_) {
					this.player.el_.querySelector(".vjs-capture-button").removeEventListener("click", this.capture.bind(this, this.player))
				}
				this.player.dispose()
				this.player = null
			}
		} catch (error) {
			console.log(error)
		}
	}

	initPlayer() {
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
			sources: [
				{
					src: this.props.file.preview,
					type: 'application/x-mpegURL'
				},
				{
					src: this.props.file.path,
					type: 'video/mp4'
				}
			]
		}, () => {
			this.player.el_.querySelector(".vjs-picture-in-picture-control").style.display = "none"
			// "vjs-picture-in-picture-control"
			const captureButton = videojs.dom.createEl('div', {
				className: 'vjs-capture-button',
				title: "截作封面"
			});
			captureButton.removeEventListener("click", this.capture.bind(this, this.player))
			captureButton.addEventListener("click", this.capture.bind(this, this.player))
			videojs.dom.appendContent(this.player.el_, captureButton);
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
			Swal.fire({icon: 'success', text: '操作成功', showConfirmButton: false, timer: 3000, toast: true}).then()
			this.setState({
				loading: false,
				poster: data.data.poster
			})
		}, error => {
			console.log(error)
			Swal.fire({icon: 'error', text: '截图操作失败', showConfirmButton: false, timer: 3000}).then()
		})
	}

	onChange = (event) => {
		let inputValue = event.target.value ? event.target.value.trim() : "";
		switch (event.target.id) {
			case "file-name":
				let name = this.state.name;
				if (inputValue === "") {
					name.text = "请输入名称";
					name.isInvalid = true;
					name.isValid = false;
					name.value = inputValue;
				} else {
					//以汉字、字母和数字开始和结束，特殊符号和空格只能出现在中间，且不能连续出现
					let reg = /^[a-zA-Z0-9\u4e00-\u9fa5]+([-_. ]?[a-zA-Z0-9\u4e00-\u9fa5]+)*$/;
					if (!reg.test(inputValue)) {
						name.text = "只能输入中文、字母和数字";
						name.isInvalid = true;
						name.isValid = false;
					} else {
						if (inputValue.length < 3 || inputValue.length > 32) {
							name.text = "只能输入3~32个字符";
							name.isInvalid = true;
							name.isValid = false;
						} else {
							name.text = "";
							name.isInvalid = false;
							name.isValid = true;
						}
					}
					name.value = inputValue;
				}
				this.setState({
					name: name
				});
				break;
			case "file-description":
				let description = this.state.description;
				if (inputValue.length > 255) {
					description.text = "不能超过255个字符";
					description.isInvalid = true;
					description.isValid = false;
				} else {
					description.text = "";
					description.isInvalid = false;
					description.isValid = true;
				}
				description.value = inputValue;
				this.setState({
					description: description
				});
				break;
			default:
				//@todo nothing
				break;
		}
	}

	handleSubmit = () => {
		let name = this.state.name;
		if (name.value === '') {
			name.text = "请输入名称";
			name.isInvalid = true;
			name.isValid = false;
			this.setState({
				name: name
			});
			return
		}
		if (name.isInvalid) {
			return
		}

		Utils.updateFileInfo({
			uuid: this.props.file.uuid,
			name: this.state.name.value,
			description: this.state.description.value
		}, (response) => {
			this.setState({
				title: this.state.name.value
			})
			this.props.success('保存成功')
			// Swal.fire({
			// 	text: '保存成功', showConfirmButton: false, timer: 3000, toast: true, showClass: {
			// 		popup: 'animate__animated animate__fadeInDown'
			// 	},
			// 	hideClass: {
			// 		popup: 'animate__animated animate__fadeOutUp'
			// 	}
			// }).then()
		}, (error) => {
			console.log(error);
			Swal.fire({icon: 'error', text: '保存失败，请稍后重试', showConfirmButton: false, timer: 3000}).then()
		})
	}

	onModalHide = () => {
		this.props.onHide()
		this.destroyPlayer()
		this.destroyMarquee()
	}

	render() {
		let show = false
		let filePoster
		let previewerStyle
		let previewerClass = []
		if (this.props.file) {
			show = true
			if (this.props.file.type === 'video') {
				filePoster = <Form.Group controlId="file-name" className="position-relative mb-3">
					<Form.Label>封面</Form.Label>
					<div className="file-poster" style={{backgroundImage: "url(\"" + this.state.poster + "\")"}}/>
				</Form.Group>
				previewerClass.push('file-video')
			} else {
				previewerClass.push('file-image')
			}
			previewerStyle = {backgroundImage: "url(\"" + this.props.file.preview + "\")"}
		}

		return (
			<Modal className="file-preview-modal" centered show={show} size="lg" onHide={this.onModalHide}>
				<Modal.Header closeButton>
					<Modal.Title as="h5">{this.state.title}</Modal.Title>
				</Modal.Header>
				<Modal.Body className="file-preview-box">
					<Card className="file-image-box">
						<Card.Body className={previewerClass.join(' ')}>
							<div className="img-previewer" style={previewerStyle}/>
							<video ref={node => this.videoNode = node} className="video-js"></video>
						</Card.Body>
					</Card>
					<Card className="file-form-box">
						<Card.Body>
							<Form>
								{filePoster}
								<Form.Group controlId="file-name" className="position-relative mb-3">
									<Form.Label>名称</Form.Label>
									<Form.Control type="text" onChange={this.onChange} onBlur={this.onChange} value={this.state.name.value} isInvalid={this.state.name.isInvalid} isValid={this.state.name.isValid}/>
									<Form.Control.Feedback type="invalid" tooltip>
										{this.state.name.text}
									</Form.Control.Feedback>
								</Form.Group>
								<Form.Group controlId="file-description" className="position-relative mb-3">
									<Form.Label>描述</Form.Label>
									<Form.Control as="textarea" onChange={this.onChange} onBlur={this.onChange} value={this.state.description.value} isInvalid={this.state.description.isInvalid} isValid={this.state.description.isValid}/>
									<Form.Control.Feedback type="invalid" tooltip>
										{this.state.description.text}
									</Form.Control.Feedback>
								</Form.Group>
								<Form.Group className="position-relative direct-center">
									<Button variant="primary" onClick={this.handleSubmit}>保存</Button>
								</Form.Group>
							</Form>
						</Card.Body>
					</Card>
				</Modal.Body>
			</Modal>
		);
	}
}

export default connect(null, Map.mapToastDispatchToProps)(FilePreviewModal);
