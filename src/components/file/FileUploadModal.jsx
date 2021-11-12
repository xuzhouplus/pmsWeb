import React from "react";
import {Button, Form, Modal, ProgressBar} from "react-bootstrap";
import "./FileUploadModal.scss";
import Utils from "../../utils/Utils";

class FileUploadModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			upload: {
				max: 100,
				now: 0,
			},
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
			file: {
				input: null,
				type: '',
				url: '',
				width: 0,
				height: 0,
				error: ''
			}
		};
		this.fileRef = React.createRef()
	}

	componentWillUnmount() {
		this.setState({
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
			file: {
				status: 'loading',
				input: null,
				type: '',
				url: '',
				width: 0,
				height: 0
			}
		})
	}

	handleSubmit = () => {
		let file = this.state.file;
		if (!file.input) {
			file.error = "文件不能为空";
			this.setState({
				file: file
			})
			return;
		}
		let name = this.state.name;
		if (name.value === '') {
			name.text = "名称不能为空";
			this.setState({
				name: name
			})
			return;
		}
		Utils.uploadFile({
			file: this.state.file.input,
			type: this.state.file.type,
			name: this.state.name.value,
			description: this.state.description.value,
			width: this.state.file.width,
			height: this.state.file.height
		}, (total, loaded) => {
			this.setState({
				upload: {
					max: total,
					now: loaded
				}
			})
		}, (response) => {
			this.props.afterUpload(response.data);
		}, (error) => {
			console.log(error);
		})
	}
	onFileSelected = (event) => {
		const that = this;
		let file = this.fileRef.current.files[0];
		if (file) {
			let reader = new FileReader();
			//将文件以Data URL形式读入页面
			reader.readAsDataURL(file);
			reader.onload = function () {
				let image = document.createElement('img');
				image.src = this.result;
				image.onload = function () {
					that.setState({
						file: {
							input: file,
							type: file.type,
							url: image.src,
							width: this.width,
							height: this.height,
							error: ''
						},
						description: {
							label: '描述',
							isInvalid: false,
							isValid: false,
							value: file.name,
							text: ''
						}
					})
				};
			}
		} else {
			that.setState({
				file: {
					input: null,
					type: '',
					url: '',
					width: 0,
					height: 0,
					error: '请选择上传文件'
				},
				description: {
					label: '描述',
					isInvalid: false,
					isValid: false,
					value: '',
					text: ''
				}
			})
		}
	}

	onChange = (event) => {
		let inputValue = event.target.value ? event.target.value.trim() : "";
		switch (event.target.id) {
			case "input-name":
				let name = this.state.name;
				if (inputValue === "") {
					name.text = "请输入名称";
					name.isInvalid = true;
					name.isValid = false;
					name.value = inputValue;
				} else {
					name.text = "";
					name.isInvalid = false;
					name.isValid = true;
					name.value = inputValue;
				}
				this.setState({
					name: name
				});
				break;
			case "input-description":
				let description = this.state.description;
				description.text = "";
				description.isInvalid = false;
				description.isValid = true;
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

	render() {
		let previewBox = '';
		if (this.state.file.type) {
			switch (Utils.getFileType(this.state.file)) {
				case 'image':
					previewBox = <img src={this.state.file.url} alt="preview"/>;
					break;
				case 'video':
					previewBox = <video controls="controls">
						<source src={this.state.file.url} type="video/mp4"/>
					</video>;
					break;
				default:
					previewBox = <div>不支持的文件格式</div>
			}
		}
		return (
			<Modal className="file-upload-modal" centered show={this.props.show} onHide={this.props.handleModal}>
				<Modal.Body>
					<Form className="file-form" onSubmit={this.handleSubmit}>
						<Form.Group className="position-relative file-input-group mb-3">
							<label htmlFor="file-input"
								   className={["file-preview-box", "rounded", this.state.file.error ? "is-invalid" : ""].join(" ")}>
								{this.state.file.url ? previewBox : <div className="file-input-box">
									<div className="file-add-mark">+</div>
									<div className="file-add-note">选择PNG、JPG或JPEG文件</div>
								</div>}
							</label>
							<div className="invalid-tooltip">{this.state.file.error}</div>
							<input type="file" id="file-input" ref={this.fileRef} onChange={this.onFileSelected}
								   accept="image/png,image/jpg,image/jpeg"></input>
							<ProgressBar max={this.state.upload.max} now={this.state.upload.now}/>
						</Form.Group>
						<Form.Group className="position-relative mb-3">
							<Form.Label htmlFor="input-name">{this.state.name.label}</Form.Label>
							<Form.Control id="input-name" aria-describedby="name-text" type='text'
										  value={this.state.name.value} isInvalid={this.state.name.isInvalid}
										  isValid={this.state.name.isValid} onChange={this.onChange}
										  onBlur={this.onChange}/>
							<Form.Control.Feedback type="invalid" tooltip>
								{this.state.name.text}
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

export default FileUploadModal;