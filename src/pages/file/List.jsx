import React from "react";
import {Col, Card, Row, Button, InputGroup, FormControl, ListGroup, Form} from "react-bootstrap";
import Utils from "../../utils/Utils";
import FileUploadModal from "../../components/file/FileUploadModal";
import FilePreviewModal from "../../components/file/FilePreviewModal";
import FileBox from "../../components/file/FileBox";
import TreeNavibar from "../../components/navbar/TreeNavibar";
import Paginator from "../../components/paginator/Paginator";
import {LinkContainer} from "react-router-bootstrap";
import {connect} from "react-redux";
import Map from "@/redux/Map"
import './List.scss';

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cancelTokenSource: null,
            preview: null,
            modal: false,
            isLoading: false,
            page: 0,
            limit: 16,
            count: 0,
            total: 0,
            search: null,
            fileServer: 'server',
            files: []
        };
    }

    componentDidMount() {
        this.getFileList(this.props.match.params.page);
    }

    componentWillUnmount() {
        if (this.state.cancelTokenSource) {
            this.state.cancelTokenSource.cancel('Operation canceled by the user.');
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextProps.account.uuid !== this.props.account.uuid) {
            this.getFileList(this.props.match.params.page);
        }
        return true;
    }

    handleModal = () => {
        this.setState({
            modal: !this.state.modal
        })
    }
    afterUpload = (uploadedFile) => {
        console.log(uploadedFile)
        this.setState({
            modal: false
        })
        this.getFileList(0);
    }
    getFileList = (page) => {
        if (this.state.isLoading) {
            return;
        }
        this.setState({
            idLoading: true
        })
        if ((typeof page == 'undefined') || (page - 1) < 0) {
            page = 1
        }
        const cancelTokenSource = Utils.getFileList({page: page - 1, limit: this.state.limit, name: this.state.search, server: this.state.fileServer}, (response) => {
            if (this.state.cancelTokenSource) {
                this.setState({
                    files: response.data.files,
                    page: response.data.page + 1,
                    limit: response.data.size,
                    count: response.data.count,
                    total: response.data.total,
                    cancelTokenSource: null,
                    isLoading: false
                })
            }
        }, (error) => {
            this.setState({
                files: [],
                cancelTokenSource: null,
                isLoading: false
            })
            console.log(error);
        });
        this.setState({
            cancelTokenSource: cancelTokenSource
        })
    }
    preview = (index, event) => {
        event.stopPropagation();
        console.log(this.state.files[index]);
        this.setState({
            preview: this.state.files[index]
        });
    }
    hidePreview = () => {
        this.setState({
            preview: null
        })
    }
    source = (index, event) => {
        event.stopPropagation();
        const subWindow = window.open(this.state.files[index].path, this.state.files[index].name, 'width=' + (window.screen.availWidth - 10) + ',height=' + (window.screen.availHeight - 30) + ',top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no')
        subWindow.document.body.style.backgroundColor = "#00236099";
        subWindow.document.title = this.state.files[index].name;
    }
    delete = (index, event) => {
        event.stopPropagation();
        console.log(this.state.files[index]);
        Utils.deleteFile({
            id: this.state.files[index].id
        }, (response) => {
            this.getFileList(this.state.page);
        }, (error) => {
            console.log(error);
        });
    }

    changeFileServer = (server) => {
        this.setState({
            fileServer: server
        })
    }

    changePage = (page) => {
        this.getFileList(page);
    }
    searchChange = (event) => {
        this.setState({
            search: event.target.value ? event.target.value.trim() : null
        })
    }
    handleSearch = (event) => {
        event.stopPropagation();
        event.preventDefault();
        this.getFileList(0)
    }

    render() {
        let boxList = this.state.files.map((item, index) =>
            <FileBox file={item} key={index} preview={this.preview.bind(this, index)} source={this.source.bind(this, index)} delete={this.delete.bind(this, index)}></FileBox>
        );
        let uploadModal = '';
        if (this.state.modal) {
            uploadModal = <FileUploadModal show={this.state.modal} handleModal={this.handleModal} afterUpload={this.afterUpload}/>
        }
        return (
            <TreeNavibar>
                <Card>
                    <Card.Body>
                        <ListGroup as="ul">
                            <LinkContainer key="file" to="/file/list">
                                <ListGroup.Item action active disabled>
                                    文件管理
                                </ListGroup.Item>
                            </LinkContainer>
                            <LinkContainer key="carousel" to="/carousel">
                                <ListGroup.Item action>
                                    轮播管理
                                </ListGroup.Item>
                            </LinkContainer>
                            <LinkContainer key="post" to="/post/list">
                                <ListGroup.Item action>
                                    稿件管理
                                </ListGroup.Item>
                            </LinkContainer>
                        </ListGroup>
                    </Card.Body>
                </Card>
                <Card className="file-list-container">
                    {this.state.preview ? <FilePreviewModal hide={this.hidePreview} {...this.state.preview}/> : ''}
                    {uploadModal}
                    <Card.Header className="file-header">
                        <Form inline="true" onSubmit={this.handleSearch}>
                            <Row>
                                <Col xs={4} lg={4} className="file-table-search">
                                    <InputGroup>
                                        <FormControl placeholder="输入内容搜索" onChange={this.searchChange}/>
                                        <Button className="btn-main-color" type="submit">搜索</Button>
                                    </InputGroup>
                                </Col>
                                <Col xs={4} lg={4}></Col>
                                <Col sx={4} lg={4} className="file-table-buttons">
                                    <Button onClick={this.handleModal} className="btn-main-color">上传文件</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card.Header>
                    <Card.Body id="file-table" className="file-table">
                        <Row className="file-table-list">
                            <Col xs={12} lg={12} className="file-list-box">
                                {boxList}
                            </Col>
                        </Row>
                    </Card.Body>
                    <Card.Footer>
                        <Paginator page={this.state.page} count={this.state.count} onClick={this.changePage}></Paginator>
                    </Card.Footer>
                </Card>
            </TreeNavibar>
        );
    }

}

export default connect(Map.mapAccountStateToProps, null)(List);
