import React from "react";
import {Button, Card, Image, Modal} from "react-bootstrap";
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
// import style manually
import 'react-markdown-editor-lite/lib/index.css';
import "./PostEditor.scss"
import FileListModal from "../file/FileListModal";
import FileUploadModal from "../file/FileUploadModal";
import PostProfile from "./PostProfile";

class PostEditor extends React.Component {
	selectedFile = {}
	mdParser = null

	constructor(props) {
		super(props);
		this.mdParser = new MarkdownIt({
			html: true,
			linkify: true,
			typographer: true,
			highlight(str, lang) {
				/*
				if (lang && hljs.getLanguage(lang)) {
				  try {
					return hljs.highlight(lang, str).value
				  } catch (__) {}
				}
				return '' // use external default escaping
				*/
			},
		});
		this.state = {
			mdeValue: 'd',
			showSelect: false,
			showUpload: false,
			showProfile: false
		}
	}

	handleChange = ({html, text}) => {
		console.log(html);
		console.log(text);
		this.setState({mdeValue: text});
	}
	savePost = () => {
		this.handleProfileModal()
	}
	selectFilePromise = () => {
		return new Promise((resolve, reject) => {
			this.setState({
				showSelect: true
			})
			this.selectedFile = {};
			let that = this;
			let interval = setInterval(function () {
				if (that.selectedFile.path) {
					console.log(that.selectedFile);
					clearInterval(interval)
					resolve({url: that.selectedFile.path, text: that.selectedFile.name});
				} else {
					if (!that.state.showSelect) {
						clearInterval(interval)
						resolve({url: '', text: ''});
					}
				}
			}, 1000)
		})
	}
	selectFile = (file) => {
		this.selectedFile = file;
		this.hideSelect()
	}
	hideSelect = () => {
		this.setState({
			showSelect: false
		})
	}

	handleProfileModal = () => {
		this.setState({
			showProfile: !this.state.showProfile
		})
	}

	afterSave = () => {
		this.handleProfileModal();
		this.props.afterSave();
	}

	render() {
		let selectFileModal
		if (this.state.showSelect) {
			selectFileModal = <FileListModal upload show={this.state.showSelect} hide={this.hideSelect} selectFile={this.selectFile}></FileListModal>;
		}
		let profileModal
		if (this.state.showProfile) {
			profileModal = <PostProfile content={this.state.mdeValue} show={this.state.showProfile} hide={this.handleProfileModal} afterSave={this.afterSave}></PostProfile>
		}
		return (
			<Modal className="post-editor-modal" centered show={this.props.show} onHide={this.props.hide} backdrop="static" keyboard={false}>
				{selectFileModal}
				{profileModal}
				<Modal.Header closeButton>
					<Modal.Title>
						<Image src={this.props.appLogo}/>
					</Modal.Title>
				</Modal.Header>
				<Modal.Body id="post-modal-container">
					<MdEditor id="post-editor"
							  style={{
								  height: "703px"
							  }
							  }
							  value={this.state.mdeValue}
							  renderHTML={(text) => this.mdParser.render(text)}
							  onChange={this.handleChange}
							  onCustomImageUpload={this.selectFilePromise}
					/>
				</Modal.Body>
				<Modal.Footer>
					<Button id="save-post-button" className="btn-main-color" onClick={this.savePost}>保存</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}

export default PostEditor;