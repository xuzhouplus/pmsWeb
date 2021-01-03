import React from "react";
import {Button, Form, Modal} from "react-bootstrap";
import Utils from "../../utils/Utils";
import FileListModal from "../file/FileListModal";
import "./PostProfile.scss";

class PostProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cover: {
				label: '封面'
			},
			title: {
				label: '标题',
				value: ''
			},
			subTitle: {
				label: '二级标题',
				value: ''
			},
			type: {
				value: 'md'
			},
			status: {
				label: '状态',
				value: false
			}
		};
	}

	selectFile = (file) => {
		console.log(file);
		this.setState({
			cover: file
		})
		this.handleSelectModal()
	}
	handleSelectModal = () => {
		this.setState({
			showSelect: !this.state.showSelect
		})
	}
	onChange = (event) => {
		let inputValue = event.target.value ? event.target.value.trim() : "";
		switch (event.target.id) {
			case "input-title":
				let title = this.state.title;
				if (inputValue == "") {
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
			case "input-sub-title":
				let subTitle = this.state.subTitle;
				if (inputValue == "") {
					subTitle['text'] = "请输入" + subTitle.label;
					subTitle['isInvalid'] = true;
					subTitle['isValid'] = false;
					subTitle['value'] = inputValue;
				} else {
					subTitle['text'] = "";
					subTitle['isInvalid'] = false;
					subTitle['isValid'] = true;
					subTitle['value'] = inputValue;
				}
				this.setState({
					subTitle: subTitle
				});
				break;
			case "input-status":
				let status = this.state.status;
				status['text'] = "";
				status['isInvalid'] = false;
				status['isValid'] = true;
				status['value'] = !status.value;
				this.setState({
					status: status
				});
				break;
		}
	}
	handleSubmit = () => {
		let cover = this.state.cover;
		if (!cover.thumb) {
			this.setState({
				cover: {
					error: '请添加封面'
				}
			});
			return;
		}
		let title = this.state.title;
		if (!title.value) {
			title['text'] = "请输入" + title.label;
			title['isInvalid'] = true;
			title['isValid'] = false;
			title['value'] = '';
			this.setState({
				title: title
			});
			return;
		}
		let subTitle = this.state.subTitle;
		if (!subTitle.value) {
			subTitle['text'] = "请输入" + subTitle.label;
			subTitle['isInvalid'] = true;
			subTitle['isValid'] = false;
			subTitle['value'] = '';
			this.setState({
				subTitle: subTitle
			});
			return;
		}
		console.log(cover);
		let post = {
			type: this.state.type.value,
			title: title.value,
			sub_title: subTitle.value,
			cover: cover.thumb,
			content: this.props.content,
			status: this.state.status.value ? 1 : 2
		};
		console.log(post);
		Utils.savePost(post, (response) => {
			console.log(response);
			this.props.afterSave();
		}, (error) => {
			console.log(error);
		})
	}

	render() {
		let previewBox = '';
		if (this.state.cover.type) {
			switch (Utils.getFileType(this.state.cover)) {
				case 'image':
					previewBox = <img src={this.state.cover.thumb}/>;
					break;
				case 'video':
					previewBox = <video controls="controls">
						<source src={this.state.cover.path} type="video/mp4"/>
					</video>;
					break;
				default:
					previewBox = <div>不支持的文件格式</div>
			}
		}
		let selectFileModal
		if (this.state.showSelect) {
			selectFileModal = <FileListModal show={this.state.showSelect} hide={this.handleSelectModal} selectFile={this.selectFile} upload></FileListModal>;
		}
		return (
			<Modal className="post-profile-modal" centered show={this.props.show} onHide={this.props.hide}>
				{selectFileModal}
				<Modal.Body>
					<Form className="post-profile-form" onSubmit={this.handleSubmit}>
						<Form.Group className="position-relative cover-input-group">
							<label className={["cover-preview-box", "rounded", this.state.cover.error ? "is-invalid" : ""].join(" ")} onClick={this.handleSelectModal}>
								{this.state.cover.path ? previewBox : <div className="cover-input-box">
									<div className="cover-add-mark">+</div>
									<div className="cover-add-note">添加封面</div>
								</div>}
							</label>
							<div className="invalid-tooltip">{this.state.cover.error}</div>
						</Form.Group>
						<Form.Group className="position-relative">
							<Form.Label htmlFor="input-title">{this.state.title.label}</Form.Label>
							<Form.Control id="input-title" aria-describedby="title-text" type='text' value={this.state.title.value} isInvalid={this.state.title.isInvalid} isValid={this.state.title.isValid} onChange={this.onChange} onBlur={this.onChange}/>
							<Form.Control.Feedback type="invalid" tooltip>
								{this.state.title.text}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="position-relative">
							<Form.Label htmlFor="input-sub-title">{this.state.subTitle.label}</Form.Label>
							<Form.Control id="input-sub-title" aria-describedby="sub-title-text" type='text' value={this.state.subTitle.value} isInvalid={this.state.subTitle.isInvalid} isValid={this.state.subTitle.isValid} onChange={this.onChange} onBlur={this.onChange}/>
							<Form.Control.Feedback type="invalid" tooltip>
								{this.state.subTitle.text}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="position-relative">
							<Form.Label htmlFor="input-status">{this.state.status.label}</Form.Label>
							<Form.Check type="switch" id="input-status" value={this.state.status.value} label={this.state.status.value ? '上架' : '下架'} onChange={this.onChange}/>
						</Form.Group>
						<div className="form-button">
							<Button variant="primary" type="button" onClick={this.handleSubmit}>
								保存
							</Button>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		);
	}
}

export default PostProfile;