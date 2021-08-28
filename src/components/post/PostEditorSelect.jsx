import React from "react";
import "./PostEditorSelect.scss";
import {Modal} from "react-bootstrap";
import markdown from "@assets/icons/markdown.svg"
import ckeditor5 from "@assets/icons/ckeditor5.svg"

class PostEditorSelect extends React.Component {
    render() {
        return (
            <Modal className="post-editor-select full-screen" centered show={this.props.show} onHide={this.props.hide}>
                <Modal.Body>
                    <div className="post-editor-md" onClick={this.props.onChange.bind(this, 'md')}>
                        <img src={markdown} alt="Markdown编辑器"/>
                        Markdown编辑器
                    </div>
                    <div className="post-editor-rt" onClick={this.props.onChange.bind(this, 'rt')}>
                        <img src={ckeditor5} alt="富文本编辑器"/>
                        富文本编辑器
                    </div>
                </Modal.Body>
            </Modal>
        )
    }
}

export default PostEditorSelect