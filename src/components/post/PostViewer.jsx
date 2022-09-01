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
										console.log(match)
										const id = match['input'].slice(-32);
										const host = window.location.origin
										return (
											'<div class="ckeditor-video">' +
											`<iframe src="${host}/media/${id}" ` +
											'style="width: 100%;height: 720px" ' +
											'allowtransparency="true" frameborder="0" width="1280" height="720" allowfullscreen allow="autoplay">' +
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
