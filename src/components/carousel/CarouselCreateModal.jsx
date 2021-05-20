import React from "react";
import {Button, Form, Modal} from "react-bootstrap";
import "./CarouselCreateModal.scss";
import FileListModal from "../file/FileListModal";
import Utils from "../../utils/Utils";
import Image from "../../utils/Image";

class CarouselCreateModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cancelTokenSource: null,
			showSelect: false,
			file: {},
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
			order: {
				label: '排序',
				value: 99
			},
			canvas: {}
		}
	}

	componentDidMount() {
		let filePreview = document.getElementById('file-preview-box');
		this.setState({
			canvas: {
				width: filePreview.clientWidth,
				height: filePreview.clientHeight
			}
		})
	}

	componentWillUnmount() {
		if (this.state.cancelTokenSource) {
			this.state.cancelTokenSource.cancel('Operation canceled by the user.');
		}
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
		const cancelTokenSource = Utils.createCarousel({
			file_id: this.state.file.id,
			title: this.state.title.value,
			description: this.state.description.value,
			width: this.state.file.width,
			height: this.state.file.height,
			link: this.state.link.value,
			order: this.state.order.value,
		}, function (response) {
			console.log(response);
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
		console.log(file);
		if (file.id == this.state.file.id) {
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

	render() {
		let addPlaceholder = <div className="file-input-box">
			<div className="file-add-mark">+</div>
			<div className="file-add-note">选择已上传的文件</div>
		</div>;
		if (this.state.file.id) {
			addPlaceholder = <img src={this.state.file.canvas} alt="preview"/>
		}
		return (
			<Modal className="carousel-create-modal" centered show={this.props.show} onHide={this.props.handleModal}>
				<Modal.Body>
					<FileListModal show={this.state.showSelect} hide={this.hideSelect} selectFile={this.selectFile}></FileListModal>
					<Form className="file-form" onSubmit={this.handleSubmit}>
						<Form.Group className="position-relative file-input-group">
							<div id="file-preview-box" className={["file-preview-box", "rounded", this.state.file.error ? "is-invalid" : ""].join(" ")} onClick={this.handleSelectModal}>
								{addPlaceholder}
							</div>
							<div className="invalid-tooltip">{this.state.file.error}</div>
						</Form.Group>
						<Form.Group className="position-relative">
							<Form.Label htmlFor="input-title">{this.state.title.label}</Form.Label>
							<Form.Control id="input-title" aria-describedby="title-text" type='text' value={this.state.title.value} isInvalid={this.state.title.isInvalid} isValid={this.state.title.isValid} onChange={this.onChange} onBlur={this.onChange}/>
							<Form.Control.Feedback type="invalid" tooltip>
								{this.state.title.text}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="position-relative">
							<Form.Label htmlFor="input-description">{this.state.description.label}</Form.Label>
							<Form.Control id="input-description" aria-describedby="description-text" type='text' value={this.state.description.value} isInvalid={this.state.description.isInvalid} isValid={this.state.description.isValid} onChange={this.onChange} onBlur={this.onChange}/>
							<Form.Control.Feedback type="invalid" tooltip>
								{this.state.description.text}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="position-relative">
							<Form.Label htmlFor="input-link">{this.state.link.label}</Form.Label>
							<Form.Control id="input-link" aria-describedby="link-text" type='text' value={this.state.link.value} isInvalid={this.state.link.isInvalid} isValid={this.state.link.isValid} onChange={this.onChange} onBlur={this.onChange}/>
							<Form.Control.Feedback type="invalid" tooltip>
								{this.state.link.text}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="position-relative">
							<Form.Label htmlFor="input-order">{this.state.order.label}</Form.Label>
							<Form.Control id="input-order" aria-describedby="order-text" type='number' value={this.state.order.value} isInvalid={this.state.order.isInvalid} isValid={this.state.order.isValid} onChange={this.onChange} onBlur={this.onChange}/>
							<Form.Control.Feedback type="invalid" tooltip>
								{this.state.order.text}
							</Form.Control.Feedback>
						</Form.Group>
						<div className="form-button">
							<Button variant="primary" className={this.state.status === 'uploading' ? 'uploading' : ''} type="button" onClick={this.handleSubmit}>
							</Button>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		);
	}
}

export default CarouselCreateModal;