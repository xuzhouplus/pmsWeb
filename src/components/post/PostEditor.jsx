import React from "react";
import {Col, Image, Modal, Row} from "react-bootstrap";
import PostMdEditor from "./PostMdEditor";
import Utils from "../../utils/Utils";
import PostProfile from "./PostProfile";
import "./PostEditor.scss";
import PostCkEditor from "@components/post/PostCkEditor";

class PostEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mdeValue: 'd',
            showSelect: false,
            showUpload: false,
            cover: '',
            title: '',
            subTitle: '',
            type: 'richText'
        }
    }

    componentDidMount() {
        if (this.props.id) {
            Utils.getPostDetail(this.props.id, response => {
                if (response.code === 1) {
                    this.setState({
                        cover: response.data.cover,
                        title: response.data.title,
                        subTitle: response.data.sub_title,
                        mdeValue: response.data.content,
                        type: response.data.type
                    });
                }
            }, error => {
                console.log(error);
            })
        }
    }

    handleEditorChange = (text) => {
        this.setState({
            mdeValue: text
        })
    }

    onSubmit = (postData) => {
        Utils.savePost({
            id: this.props.id,
            cover: postData.cover,
            title: postData.title,
            sub_title: postData.subTitle,
            status: postData.status,
            content: this.state.mdeValue,
            type: this.state.type
        }, (response) => {
            console.log(response);
            this.props.afterSave();
        }, (error) => {
            console.log(error);
        })
    }

    render() {
        let editorComponent = null;
        if (this.state.type === 'md') {
            editorComponent = <PostMdEditor value={this.state.mdeValue} onChange={this.handleEditorChange}></PostMdEditor>
        } else {
            editorComponent = <PostCkEditor value={this.state.mdeValue} onChange={this.handleEditorChange}></PostCkEditor>
        }
        let profileComponent
        if (this.props.id) {
            if (this.state.cover) {
                profileComponent = <PostProfile cover={this.state.cover} title={this.state.title} subTitle={this.state.subTitle} status={this.state.status} onSubmit={this.onSubmit}></PostProfile>
            }
        } else {
            profileComponent = <PostProfile onSubmit={this.onSubmit}></PostProfile>
        }
        return (
            <Modal className="post-editor-modal full-screen" centered show={this.props.show} onHide={this.props.hide} backdrop="static" keyboard={false}>
                <Modal.Header closeButton className="post-editor-header">
                    <Modal.Title>
                        <Image src={this.props.appLogo}/>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="post-editor-content">
                    <Row>
                        <Col xs={9} lg={9} className="post-editor-body">
                            {editorComponent}
                        </Col>
                        <Col xs={3} lg={3} className="post-editor-title">
                            {profileComponent}
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        );
    }

}

export default PostEditor;