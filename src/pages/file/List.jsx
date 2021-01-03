import React from "react";
import {Col, Container, Card, Row, Button, Table, Image} from "react-bootstrap";
import Utils from "../../utils/Utils";
import './List.scss'
import FileUploadModal from "../../components/file/FileUploadModal";
import FilePreviewModal from "../../components/file/FilePreviewModal";
import FileBox from "../../components/file/FileBox";
import TreeNavibar from "../../components/navbar/TreeNavibar";
import Loading from "../../components/loading/Loading";
import InfiniteScroll from "react-infinite-scroll-component";

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
		this.getFileList();
	}

	handleModal = () => {
		this.setState({
			modal: !this.state.modal
		})
	}
	afterUpload = (uploadedFile) => {
		this.setState({
			modal: false,
			page: 0,
			files: []
		})
		this.getFileList();
	}
	getFileList = () => {
		const that = this;
		if (this.state.isLoading) {
			return;
		}
		this.setState({
			idLoading: true
		})
		const cancelTokenSource = Utils.getFileList({page: this.state.page, limit: this.state.limit}, function (response) {
			if (that.state.cancelTokenSource) {
				that.setState({
					files: that.state.files.concat(response.data.files),
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
		that.setState({
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
						<Col xs={12} lg={12}>
							<Button onClick={this.handleModal} className="btn-main-color">上传文件</Button>
						</Col>
					</Card.Header>
					<Card.Body id="file-table" className="file-table">
						<Col xs={12} lg={12} className="file-list-box">
							<InfiniteScroll
								scrollableTarget="file-table"
								dataLength={this.state.count}
								next={this.getFileList}
								hasMore={this.state.page < this.state.count}
								loader={<Loading></Loading>}
							>
								{boxList}
							</InfiniteScroll>
						</Col>
					</Card.Body>
				</Card>
			</TreeNavibar>
		);
	}

}

export default List;