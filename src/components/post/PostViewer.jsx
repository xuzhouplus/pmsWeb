import React from "react";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import "./PostViewer.scss";

class PostViewer extends React.Component {
	render() {
		return (
			<div className="post-viewer">
				<CKEditor
					editor={window.DecoupledDocumentEditor}
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
