import React from "react";
import FileListModal from "@components/file/FileListModal";
import {CKEditor} from '@ckeditor/ckeditor5-react';
import "./PostCkEditor.scss";

class PostCkEditor extends React.Component {
	selectedFile = {}

	constructor(props) {
		super(props);
		this.state = {
			selectType: null,
			selectPromise: null,
			showSelect: false,
			showUpload: false
		}
	}

	selectFilePromise = (fileType) => {
		return new Promise((topResolve, topReject) => {
			this.selectedFile = {};
			new Promise((resolve, reject) => {
				this.setState({
					selectType: fileType,
					showSelect: true,
					selectPromise: resolve
				})
			}).then(result => {
				topResolve(result)
			})
		})
	}


	selectFile = (file) => {
		this.selectedFile = file;
		let selectPromise = this.state.selectPromise
		if (this.selectedFile.path) {
			selectPromise(this.selectedFile);
		} else {
			if (!this.state.showSelect) {
				selectPromise(null);
			}
		}
		this.hideSelect()
	}

	hideSelect = () => {
		this.setState({
			showSelect: false,
			selectPromise: null
		})
	}

	render() {
		let selectFileModal
		if (this.state.showSelect) {
			selectFileModal = <FileListModal fileType={this.state.selectType} upload show={this.state.showSelect}
											 hide={this.hideSelect} selectFile={this.selectFile}></FileListModal>;
		}
		return (
			<div className="post-ckeditor">
				{selectFileModal}
				<CKEditor
					editor={window.DecoupledDocumentEditor}
					config={{
						toolbar: {
							items: [
								'heading',
								'|',
								'fontSize',
								'fontFamily',
								'fontColor',
								'fontBackgroundColor',
								'|',
								'bold',
								'italic',
								'underline',
								'strikethrough',
								'|',
								'numberedList',
								'bulletedList',
								'|',
								'outdent',
								'indent',
								'alignment',
								'|',
								'todoList',
								'link',
								'blockQuote',
								'findAndReplace',
								'insertTable',
								'codeBlock',
								'insertImage',
								'insertVideo',
								'|',
								'undo',
								'redo',
								'fullScreen'
							]
						},
						language: 'zh-cn',
						video: {
							onFilePeek: this.selectFilePromise.bind(this, 'video'),
						},
						mediaEmbed: {
							previewsInData: true,
							providers: [
								{
									name: 'pms',
									// A URL regexp or an array of URL regexps:
									url: /^(\w+)/,

									// To be defined only if the media are previewable:
									html: match => {
										const id = match['input'].slice(-32);
										const host = window.location.origin
										const editorContent = document.querySelector('.ck-content')
										let height = Math.round(editorContent.clientWidth * 720 / 1280)
										// const innerSize = Utils.getElementInnerSize(editorContent)
										// let height = Math.round(innerSize.width * 720 / 1280)
										return (
											`<div class="ckeditor-video">` +
											`<iframe class="video-player" src="${host}/media/${id}" ` +
											`style="width: 100%;height: ${height}px;" ` +
											`allowtransparency="true" frameborder="0" allowfullscreen allow="autoplay">` +
											'</iframe>' +
											'</div>'
										);
									}
								}
							]
						},
						image: {
							toolbar: [
								'imageTextAlternative',
								'imageStyle:inline',
								'imageStyle:block',
								'imageStyle:side',
								'linkImage'
							],
							onFilePeek: this.selectFilePromise.bind(this, 'image'),
						},
						table: {
							contentToolbar: [
								'tableColumn',
								'tableRow',
								'mergeTableCells',
								'tableCellProperties',
								'tableProperties'
							]
						}
					}}
					data={this.props.value}
					onReady={editor => {
						editor.ui.getEditableElement().parentElement.insertBefore(
							editor.ui.view.toolbar.element,
							editor.ui.getEditableElement()
						);
					}}
					onChange={(event, editor) => {
						const data = editor.getData();
						this.props.onChange(data)
					}}
				/>
			</div>
		);
	}
}

export default PostCkEditor
