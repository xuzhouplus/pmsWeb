import React from "react";
import {Col, Card, Row, Button, InputGroup, FormControl} from "react-bootstrap";
import Utils from "../../utils/Utils";
import FileUploadModal from "../../components/file/FileUploadModal";
import FilePreviewModal from "../../components/file/FilePreviewModal";
import FileBox from "../../components/file/FileBox";
import TreeNavibar from "../../components/navbar/TreeNavibar";
import Paginator from "../../components/paginator/Paginator";
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
			limit: 20,
			count: 0,
			total: 0,
			files: []
		};
	}

	componentDidMount() {
		this.getFileList(this.props.match.params.page);
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
		if (page - 1 < 0) {
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
		const subWindow = window.open(this.state.files[index].path, this.state.files[index].name, "channelmode=yes,fullscreen=yes,menubar=no,toolbar=no,status=no,location=no")
		subWindow.document.body.style.backgroundColor = "#00236099";
	}
	delete = (index, event) => {
		event.stopPropagation();
		console.log(this.state.files[index]);
		Utils.deleteFile({
			id: this.state.files[index].id
		}, (response) => {
			this.getFileList();
		}, (error) => {
			console.log(error);
		});
	}

	changePage = (page) => {
		console.log(page);
		this.getFileList(page);
	}

	componentWillUnmount() {
		if (this.state.cancelTokenSource) {
			this.state.cancelTokenSource.cancel('Operation canceled by the user.');
		}
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
			<TreeNavibar active="file">
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