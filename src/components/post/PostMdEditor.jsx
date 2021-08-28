import React from "react";
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css';
import FileListModal from "../file/FileListModal";
import "./PostMdEditor.scss"

class PostMdEditor extends React.Component {
    selectedFile = {}
    selectFileInterval = null
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
            this.selectFileInterval = setInterval(() => {
                if (this.selectedFile.path) {
                    console.log(this.selectedFile);
                    clearInterval(this.selectFileInterval)
                    resolve({url: this.selectedFile.path, text: this.selectedFile.name});
                } else {
                    if (!this.state.showSelect) {
                        clearInterval(this.selectFileInterval)
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

    componentWillUnmount() {
        if (this.selectFileInterval) {
            clearInterval(this.selectFileInterval)
        }
    }

    render() {
        return (
            <div className="post-md-editor">
                <FileListModal upload show={this.state.showSelect} hide={this.hideSelect} selectFile={this.selectFile}></FileListModal>
                <MdEditor id="post-editor" value={this.props.value} renderHTML={(text) => this.mdParser.render(text)} onChange={this.handleChange} onCustomImageUpload={this.selectFilePromise}/>
            </div>
        );
    }
}

export default PostMdEditor;