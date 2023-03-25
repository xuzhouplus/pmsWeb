import React from "react";
import {Button, Form, InputGroup, Modal} from "react-bootstrap";
import FileListModal from "../file/FileListModal";
import Utils from "@utils/Utils";
import {Image} from "@utils/File";
import PostListModal from "@components/post/PostListModal";
import "./CarouselCreateModal.scss";

class CarouselCreateModal extends React.Component {
	switchTypes = {
		parallax: '失真',
		slide: '推入',
		separate: '切换',
		split: '扭转',
		fade: '淡入淡出',
		blinds: '百叶窗',
		clamp: '擦除',
	}

	constructor(props) {
		super(props);
		let state = {
			cancelTokenSource: null,
			showSelect: false,
			postModal: false,
			file: {},
			post: {},
			title: {
				label: '标题',
				value: ''
			},
			description: {
				label: '描述',
				value: ''
			},
			link: {
				label: '链接',
				value: ''
			},
			switchType: {
				label: '特效',
				value: 'parallax'
			},
			timeout: {
				label: '时长',
				value: 5
			},
			order: {
				label: '排序',
				value: 99
			},
			canvas: {}
		}
		if (!Utils.objectIsEmpty(this.props.carousel)) {
			state.file = {
				id: this.props.carousel.file_id,
				canvas: this.props.carousel.url
			}
			state.title.value = this.props.carousel.title
			state.description.value = this.props.carousel.description
			state.link.value = this.props.carousel.link
			state.switchType.value = this.props.carousel.switch_type
			state.timeout.value = this.props.carousel.timeout
			state.order.value = this.props.carousel.order
		}
		this.state = state
		this.switchTypes = Utils.getCarouselEffects()
	}

	componentDidMount() {
		if (this.props.show) {
			this.initCanvasBreadth()
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.show !== prevProps.show && this.props.show) {
			this.initCanvasBreadth()
		}
	}

	componentWillUnmount() {
		if (this.state.cancelTokenSource) {
			this.state.cancelTokenSource.cancel('Operation canceled by the user.');
		}
	}

	initCanvasBreadth = () => {
		let filePreview = document.getElementById('file-preview-box');
		this.setState({
			file: {},
			post: {},
			title: {
				label: '标题',
				value: ''
			},
			description: {
				label: '描述',
				value: ''
			},
			link: {
				label: '链接',
				value: ''
			},
			switchType: {
				label: '特效',
				value: 'parallax'
			},
			timeout: {
				label: '时长',
				value: 5
			},
			order: {
				label: '排序',
				value: 99
			},
			canvas: {
				width: filePreview.clientWidth,
				height: filePreview.clientHeight
			}
		})
	}

	handleSubmit = () => {
		let title = this.state.title;
		if (title.value === "") {
			title['text'] = "请输入" + title.label;
			title['isInvalid'] = true;
			title['isValid'] = false;
			this.setState({
				title: title
			});
			return;
		}
		let description = this.state.description;
		if (description.value === "") {
			description['text'] = "请输入" + description.label;
			description['isInvalid'] = true;
			description['isValid'] = false;
			this.setState({
				description: description
			});
			return;
		}
		let link = this.state.link;
		if (link.value === "") {
			link['text'] = "请输入" + link.label;
			link['isInvalid'] = true;
			link['isValid'] = false;
			this.setState({
				link: link
			});
			return;
		}
		const that = this;
		let data = {
			file_id: this.state.file.id,
			title: this.state.title.value,
			description: this.state.description.value,
			width: this.state.file.width,
			height: this.state.file.height,
			link: this.state.link.value,
			order: this.state.order.value,
			switch_type: this.state.switchType.value,
			timeout: this.state.timeout.value,
		}
		if (Utils.objectIsEmpty(this.props.carousel)) {
			const cancelTokenSource = Utils.createCarousel(data, function (response) {
				if (that.state.cancelTokenSource) {
					if (response.code === 1) {
						that.props.afterSubmit(response.data);
					} else {

					}
				}
			}, function (error) {
				console.log(error);
			})
			that.setState({
				cancelTokenSource: cancelTokenSource
			})
		} else {
			data['id'] = this.props.carousel.id
			const cancelTokenSource = Utils.updateCarousel(data, function (response) {
				if (that.state.cancelTokenSource) {
					if (response.code === 1) {
						that.props.afterSubmit(response.data);
					} else {

					}
				}
			}, function (error) {
				console.log(error);
			})
			that.setState({
				cancelTokenSource: cancelTokenSource
			})
		}
	}

	onChange = (event) => {
		let inputValue = event.target.value ? event.target.value.trim() : "";
		switch (event.target.id) {
			case "input-title":
				let title = this.state.title;
				if (inputValue === "") {
					title['text'] = "请输入" + title.label;
					title['isInvalid'] = true;
					title['isValid'] = false;
					title['value'] = inputValue;
				} else {
					title['text'] = "";
					title['isInvalid'] = false;
					title['isValid'] = true;
					title['value'] = inputValue;
				}
				this.setState({
					title: title
				});
				break;
			case "input-description":
				let description = this.state.description;
				if (inputValue === "") {
					description['text'] = "请输入" + description.label;
					description['isInvalid'] = true;
					description['isValid'] = false;
					description['value'] = inputValue;
				} else {
					description['text'] = "";
					description['isInvalid'] = false;
					description['isValid'] = true;
					description['value'] = inputValue;
				}
				this.setState({
					description: description
				});
				break;
			case "input-link":
				let link = this.state.link;
				if (inputValue === "") {
					link['text'] = "请输入" + link.label;
					link['isInvalid'] = true;
					link['isValid'] = false;
					link['value'] = inputValue;
				} else {
					link['text'] = "";
					link['isInvalid'] = false;
					link['isValid'] = true;
					link['value'] = inputValue;
				}
				this.setState({
					link: link
				});
				break;
			case "input-switch-type":
				let switchType = this.state.switchType;
				if (!Utils.getCarouselEffects(inputValue)) {
					inputValue = 'parallax'
					switchType['text'] = "特效类型错误";
					switchType['isInvalid'] = true;
					switchType['isValid'] = false;
				} else {
					switchType['text'] = "";
					switchType['isInvalid'] = false;
					switchType['isValid'] = true;
				}
				switchType['value'] = inputValue;
				this.setState({
					switchType: switchType
				});
				break;
			case "input-timeout":
				let timeout = this.state.timeout;
				if (inputValue < 3) {
					inputValue = 3
					timeout['text'] = "图片展示时长不能少于 3 秒";
					timeout['isInvalid'] = true;
					timeout['isValid'] = false;
				} else {
					if (inputValue > 10) {
						inputValue = 10
						timeout['text'] = "图片展示时长不能多于 10 秒";
						timeout['isInvalid'] = true;
						timeout['isValid'] = false;
					} else {
						timeout['text'] = "";
						timeout['isInvalid'] = false;
						timeout['isValid'] = true;
					}
				}
				timeout['value'] = inputValue;
				this.setState({
					timeout: timeout
				});
				break;
			case "input-order":
				if (inputValue === '') {
					inputValue = 99;
				} else {
					inputValue = parseInt(inputValue);
					if (inputValue < 0) {
						inputValue = 0;
					}
				}
				let order = this.state.order;
				order['text'] = "";
				order['isInvalid'] = false;
				order['isValid'] = true;
				order['value'] = inputValue;
				this.setState({
					order: order
				});
				break;
			default:
				//@todo nothing
				break;
		}
	}

	selectFile = (file) => {
		if (file.id === this.state.file.id) {
			this.setState({
				showSelect: false
			})
			return
		}
		Image.gaussianBlur(file.preview, this.state.canvas.width, this.state.canvas.height, (result) => {
			file['canvas'] = result
			this.setState({
				file: file,
				title: Object.assign({}, this.state.title, {value: file.name}),
				description: Object.assign({}, this.state.description, {value: file.description ? file.description : ''}),
				showSelect: false
			})
		})
	}

	handleSelectModal = () => {
		this.setState({
			showSelect: !this.state.showSelect
		})
	}

	hideSelect = () => {
		this.setState({
			showSelect: false
		})
	}

	handlePostModal = () => {
		this.setState({
			postModal: this.state.postModal ? false : true
		})
	}

	selectPost = (post) => {
		if (post.id === this.state.post.id) {
			this.setState({
				postModal: false
			})
			return
		}
		const linkValue = this.state.link
		linkValue['value'] = Utils.getRequestHost() + '/post/' + post.uuid
		this.setState({
			postModal: false,
			link: linkValue
		})
	}

	render() {
		let addPlaceholder = <div className="file-input-box">
			<div className="file-add-mark">+</div>
			<div className="file-add-note">选择已上传的文件</div>
		</div>;
		if (this.state.file.id) {
			addPlaceholder = <img src={this.state.file.canvas} alt="preview"/>
		}
		let switchTypeOptions = []
		for (const switchTypesKey in Utils.getCarouselEffects()) {
			switchTypeOptions.push(<option key={switchTypesKey} value={switchTypesKey}>{this.switchTypes[switchTypesKey]}</option>)
		}
		return (
			<Modal className="carousel-create-modal" centered show={this.props.show} onHide={this.props.handleModal}>
				<Modal.Body>
					<FileListModal fileType="image" upload show={this.state.showSelect} hide={this.hideSelect} selectFile={this.selectFile}></FileListModal>
					<PostListModal show={this.state.postModal} hide={this.handlePostModal}
								   selectPost={this.selectPost}></PostListModal>
					<Form className="file-form" onSubmit={this.handleSubmit}>
						<Form.Group className="position-relative file-input-group mb-3">
							<div id="file-preview-box"
								 className={["file-preview-box", "rounded", this.state.file.error ? "is-invalid" : ""].join(" ")}
								 onClick={this.handleSelectModal}>
								{addPlaceholder}
							</div>
							<div className="invalid-tooltip">{this.state.file.error}</div>
						</Form.Group>
						<Form.Group className="position-relative mb-3">
							<Form.Label htmlFor="input-title">{this.state.title.label}</Form.Label>
							<Form.Control id="input-title" aria-describedby="title-text" type='text'
										  value={this.state.title.value} isInvalid={this.state.title.isInvalid}
										  isValid={this.state.title.isValid} onChange={this.onChange}
										  onBlur={this.onChange}/>
							<Form.Control.Feedback type="invalid" tooltip>
								{this.state.title.text}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="position-relative mb-3">
							<Form.Label htmlFor="input-description">{this.state.description.label}</Form.Label>
							<Form.Control id="input-description" aria-describedby="description-text" type='text'
										  value={this.state.description.value}
										  isInvalid={this.state.description.isInvalid}
										  isValid={this.state.description.isValid} onChange={this.onChange}
										  onBlur={this.onChange}/>
							<Form.Control.Feedback type="invalid" tooltip>
								{this.state.description.text}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="position-relative mb-3">
							<Form.Label htmlFor="input-link">{this.state.link.label}</Form.Label>
							<InputGroup className="mb-3">
								<Form.Control id="input-link" aria-describedby="link-text" type='text'
											  value={this.state.link.value} isInvalid={this.state.link.isInvalid}
											  isValid={this.state.link.isValid} onChange={this.onChange}
											  onBlur={this.onChange}/>
								<Button id="link-button" variant="outline-secondary"
										onClick={this.handlePostModal}>+</Button>
							</InputGroup>
							<Form.Control.Feedback type="invalid" tooltip>
								{this.state.link.text}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="position-relative mb-3">
							<Form.Label htmlFor="input-switch-type">{this.state.switchType.label}</Form.Label>
							<Form.Select id="input-switch-type" aria-label="switch-type-text"
										 value={this.state.switchType.value} isInvalid={this.state.switchType.isInvalid}
										 isValid={this.state.switchType.isValid} onChange={this.onChange}
										 onBlur={this.onChange}>
								{switchTypeOptions}
							</Form.Select>
							<Form.Control.Feedback type="invalid" tooltip>
								{this.state.switchType.text}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="position-relative mb-3">
							<Form.Label htmlFor="input-timeout">{this.state.timeout.label}</Form.Label>
							<InputGroup className="mb-3">
								<Form.Control id="input-timeout" aria-describedby="timeout-text" type='number'
											  aria-valuemin="3" min='3' aria-valuemax="10" max="10"
											  value={this.state.timeout.value} isInvalid={this.state.timeout.isInvalid}
											  isValid={this.state.timeout.isValid} onChange={this.onChange}
											  onBlur={this.onChange}/>
								<InputGroup.Text id="input-timeout-addon">秒</InputGroup.Text>
							</InputGroup>
							<Form.Control.Feedback type="invalid" tooltip>
								{this.state.timeout.text}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="position-relative mb-3">
							<Form.Label htmlFor="input-order">{this.state.order.label}</Form.Label>
							<Form.Control id="input-order" aria-describedby="order-text" type='number'
										  value={this.state.order.value} isInvalid={this.state.order.isInvalid}
										  isValid={this.state.order.isValid} onChange={this.onChange}
										  onBlur={this.onChange}/>
							<Form.Control.Feedback type="invalid" tooltip>
								{this.state.order.text}
							</Form.Control.Feedback>
						</Form.Group>
						<div className="form-button mb-3">
							<Button variant="primary" className={this.state.status === 'uploading' ? 'uploading' : ''}
									type="button" onClick={this.handleSubmit}>
							</Button>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		);
	}
}

export default CarouselCreateModal;
