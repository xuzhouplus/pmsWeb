import React from "react";
import {Button, Card, Form} from "react-bootstrap";
import FileListModal from "../file/FileListModal";
import "./PostProfile.scss";

class PostProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cover: {
				label: '封面',
				thumb: this.props.cover
			},
			title: {
				label: '标题',
				value: this.props.title
			},
			subTitle: {
				label: '二级标题',
				value: this.props.subTitle
			}
		};
	}

	selectFile = (file) => {
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
			case "input-sub-title":
				let subTitle = this.state.subTitle;
				if (inputValue === "") {
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
			default:
				//@todo nothing
		}
	}
	handleSubmit = (status, event) => {
		event.stopPropagation();
		event.preventDefault();
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
		let post = {
			title: title.value,
			subTitle: subTitle.value,
			cover: cover.thumb,
			status: status
		};
		this.props.onSubmit(post);
	}

	render() {
		let previewBox = '';
		console.log(this.state.cover.thumb);
		if (this.state.cover.thumb || this.state.cover.path) {
			previewBox = <img src={this.state.cover.thumb ? this.state.cover.thumb : this.state.cover.path} alt="Cover"/>;
		}
		let selectFileModal
		if (this.state.showSelect) {
			selectFileModal = <FileListModal show={this.state.showSelect} hide={this.handleSelectModal} selectFile={this.selectFile} upload></FileListModal>;
		}
		return (
			<Card className="post-profile-modal">
				{selectFileModal}
				<Card.Body>
					<Form className="post-profile-form" onSubmit={this.handleSubmit}>
						<Form.Group className="position-relative cover-input-group">
							<label className={["cover-preview-box", "rounded", this.state.cover.error ? "is-invalid" : ""].join(" ")} onClick={this.handleSelectModal}>
								{previewBox ? previewBox : <div className="cover-input-box">
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
						<div className="form-button">
							<Button variant="secondary" className="draft" onClick={this.handleSubmit.bind(this, 2)}></Button>
							<Button variant="primary" className="save" onClick={this.handleSubmit.bind(this, 1)}></Button>
						</div>
					</Form>
				</Card.Body>
			</Card>
		);
	}
}

export default PostProfile;