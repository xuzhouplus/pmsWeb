import React from "react";
import Loading from "../loading/Loading";
import InfiniteScroll from "react-infinite-scroll-component";
import Utils from "../../utils/Utils";
import {Button, Card, Col, Modal, Row} from "react-bootstrap";
import FileBox from "./FileBox";
import FileUploadModal from "./FileUploadModal";
import './FileListModal.scss'

class FileListModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showUpload: false,
            cancelTokenSource: null,
            idLoading: true,
            page: 0,
            limit: 16,
            count: 0,
            total: 0,
            files: []
        };
    }

    getFileList = () => {
        if (this.state.isLoading) {
            return;
        }
        this.setState({
            idLoading: true
        })
        const cancelTokenSource = Utils.getFileList({
            page: this.state.page,
            limit: this.state.limit,
            type: this.props.fileType
        }, (response) => {
            if (this.state.cancelTokenSource) {
                this.setState({
                    files: this.state.files.concat(response.data.files),
                    page: response.data.page + 1,
                    limit: response.data.size,
                    count: response.data.count,
                    total: response.data.total,
                    cancelTokenSource: null,
                    isLoading: false
                })
            }
        }, function (error) {
            console.log(error);
        });
        this.setState({
            cancelTokenSource: cancelTokenSource
        })
    }

    componentDidMount() {
        this.getFileList();
    }

    componentWillUnmount() {
        if (this.state.cancelTokenSource) {
            this.state.cancelTokenSource.cancel('Operation canceled by the user.');
        }
    }

    // shouldComponentUpdate(nextProps, nextState, nextContext) {
    //     if (nextProps.show === this.props.show) {
    //         return false
    //     }
    //     return true
    // }

    handleUploadModal = () => {
        this.setState({
            showUpload: !this.state.showUpload
        })
    }
    select = (uuid, event) => {
        event.stopPropagation();
        Utils.getFileInfo(uuid, data => {
            this.props.selectFile(data.data)
        }, error => {
            console.log(error)
        })
    }
    afterUpload = (uploadedFile) => {
        this.handleUploadModal();
        this.props.selectFile(uploadedFile);
    }

    render() {
        let boxCount = 0;
        let boxList = [];
        let postBox = [];
        let lastCount = this.state.files.length % 4
        let rowCount = Math.ceil(this.state.files.length / 4)
        for (const file of this.state.files) {
            postBox.push(<Col xs={3} lg={3} className="file-list-box"><FileBox file={file} key={file.uuid} select={this.select.bind(this, file.uuid)}></FileBox></Col>)
            boxCount++;
            let columnCount = boxCount % 4
            let currentRow = Math.ceil(boxCount / 4)
            if (columnCount === 0) {
                boxList.push(<Row className="file-table-row">
                    {postBox}
                </Row>)
                postBox = []
            }
            if (columnCount === lastCount && rowCount === currentRow) {
                boxList.push(<Row className="file-table-row">
                    {postBox}
                </Row>)
                postBox = []
            }
        }
        let uploadComponent
        if (this.props.upload) {
            let uploadFileModal
            if (this.state.showUpload) {
                uploadFileModal = <FileUploadModal show={this.state.showUpload} handleModal={this.handleUploadModal}
                                                   afterUpload={this.afterUpload}/>
            }
            uploadComponent = <Card.Header className="file-header">
                {uploadFileModal}
                <Col xs={12} lg={12}>
                    <Button onClick={this.handleUploadModal} className="btn-main-color">上传文件</Button>
                </Col>
            </Card.Header>
        }
        return (
            <Modal className={this.state.count > 1 ? 'have-scrollbar file-list-modal' : 'no-scrollbar file-list-modal'}
                   centered show={this.props.show} onHide={this.props.hide}>
                {uploadComponent}
                <Modal.Body id="file-model-container">
                    <InfiniteScroll scrollableTarget='file-model-container' dataLength={this.state.count}
                                    next={this.getFileList} hasMore={this.state.page < this.state.count}
                                    loader={<Loading></Loading>}>
                        {boxList}
                    </InfiniteScroll>
                </Modal.Body>
            </Modal>
        );
    }
}

export default FileListModal;
