import React from "react";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import "./PostViewer.scss";

class PostViewer extends React.Component {
	render() {
		return (
			<div className="post-viewer">
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
										return (
											'<div class="ckeditor-video">' +
											`<iframe class="video-player" src="${host}/media/${id}" ` +
											`style="width: 100%;height: ${height}px;" ` +
											'allowtransparency="true" frameborder="0" allowfullscreen allow="autoplay">' +
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
							]
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
					disabled
					data={this.props.value}
					onReady={editor => {
						editor.ui.view.toolbar.element.style.display = 'none';
					}}
				/>
			</div>
		);
	}
}

export default PostViewer;
