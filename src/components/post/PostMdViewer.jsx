import React from "react";
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css';

class PostMdViewer extends React.Component {
	mdParser = null;

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
	}

	render() {
		return (
			<MdEditor id="post-md-viewer"
					  config={{
						  view: {
							  menu: false,
							  md: false,
							  html: true
						  }
					  }}
					  value={this.props.value}
					  renderHTML={(text) => this.mdParser.render(text)}
			/>
		);
	}
}

export default PostMdViewer;