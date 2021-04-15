import React from "react";
import {Col, Card, Row, Button, InputGroup, FormControl, ListGroup} from "react-bootstrap";
import Utils from "../../utils/Utils";
import FileUploadModal from "../../components/file/FileUploadModal";
import FilePreviewModal from "../../components/file/FilePreviewModal";
import FileBox from "../../components/file/FileBox";
import TreeNavibar from "../../components/navbar/TreeNavibar";
import Paginator from "../../components/paginator/Paginator";
import './List.scss';
import {LinkContainer} from "react-router-bootstrap";

class List extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cancelTokenSource: null,
			preview: null,
			modal: false,
			isLoading: false,
			page: 0,
			limit: 8,
			count: 0,
			total: 0,
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

	handleModal = () => {
		this.setState({
			modal: !this.state.modal
		})
	}
	afterUpload = (uploadedFile) => {
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
		const cancelTokenSource = Utils.getFileList({page: page - 1, limit: this.state.limit}, (response) => {
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
		console.log(this.state.files[index]);
		const subWindow = window.open(this.state.files[index].path, this.state.files[index].name, 'width=' + (window.screen.availWidth - 10) + ',height=' + (window.screen.availHeight - 30) + ',top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no')
		subWindow.document.body.style.backgroundColor = "#00236099";
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

	changePage = (page) => {
		this.getFileList(page);
	}

	render() {
		let boxList = this.state.files.map((item, index) =>
			<FileBox thumb={item.thumb} name={item.name} description={item.description} key={index} preview={this.preview.bind(this, index)} source={this.source.bind(this, index)} delete={this.delete.bind(this, index)}></FileBox>
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
							<LinkContainer to="/file/list">
								<ListGroup.Item action active disabled>
									文件管理
								</ListGroup.Item>
							</LinkContainer>
							<LinkContainer to="/carousel">
								<ListGroup.Item action>
									轮播管理
								</ListGroup.Item>
							</LinkContainer>
							<LinkContainer to="/post/list">
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
						<Row>
							<Col xs={4} lg={4} className="file-table-search">
								<InputGroup>
									<FormControl placeholder="输入内容搜索"/>
									<InputGroup.Append>
										<Button className="btn-main-color">搜索</Button>
									</InputGroup.Append>
								</InputGroup>
							</Col>
							<Col sx={8} lg={8} className="file-table-buttons">
								<Button onClick={this.handleModal} className="btn-main-color">上传文件</Button>
							</Col>
						</Row>
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

export default List;