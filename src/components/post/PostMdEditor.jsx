import React from "react";
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css';
import FileListModal from "../file/FileListModal";
import "./PostMdEditor.scss"

class PostMdEditor extends React.Component {
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
			mdeValue: '',
			showSelect: false,
			showUpload: false
		}
	}

	handleChange = ({html, text}) => {
		this.props.onChange(text);
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

	render() {
		let selectFileModal
		if (this.state.showSelect) {
			selectFileModal = <FileListModal upload show={this.state.showSelect} hide={this.hideSelect} selectFile={this.selectFile}></FileListModal>;
		}
		return (
			<div>
				{selectFileModal}
				<MdEditor id="post-editor"
						  style={{
							  height: "48rem"
						  }
						  }
						  value={this.props.value}
						  renderHTML={(text) => this.mdParser.render(text)}
						  onChange={this.handleChange}
						  onCustomImageUpload={this.selectFilePromise}
				/>
			</div>
		);
	}
}

export default PostMdEditor;