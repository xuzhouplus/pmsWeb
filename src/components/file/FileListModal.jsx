import React from "react";
import Loading from "../loading/Loading";
import InfiniteScroll from "react-infinite-scroll-component";
import Utils from "../../utils/Utils";
import {Button, Card, Col, Modal} from "react-bootstrap";
import FileBox from "./FileBox";
import FileUploadModal from "./FileUploadModal";
import './FileListModal.scss'

class FileListModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
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

	componentDidMount() {
		this.getFileList();
	}

	componentWillUnmount() {
		if (this.state.cancelTokenSource) {
			this.state.cancelTokenSource.cancel('Operation canceled by the user.');
		}
	}

	handleUploadModal = () => {
		this.setState({
			showUpload: !this.state.showUpload
		})
	}
	select = (index, event) => {
		event.stopPropagation();
		this.props.selectFile(this.state.files[index])
	}
	afterUpload = (uploadedFile) => {
		this.handleUploadModal();
		this.props.selectFile(uploadedFile);
	}

	render() {
		let boxList = this.state.files.map((item, index) =>
			<FileBox thumb={item.thumb} name={item.name} description={item.description} key={index} select={this.select.bind(this, index)}></FileBox>
		);
		let uploadComponent
		if (this.props.upload) {
			let uploadFileModal
			if (this.state.showUpload) {
				uploadFileModal = <FileUploadModal show={this.state.showUpload} handleModal={this.handleUploadModal} afterUpload={this.afterUpload}/>
			}
			uploadComponent = <Card.Header className="file-header">
				{uploadFileModal}
				<Col xs={12} lg={12}>
					<Button onClick={this.handleUploadModal} className="btn-main-color">上传文件</Button>
				</Col>
			</Card.Header>
		}
		return (
			<Modal className={this.state.count > 1 ? 'have-scrollbar file-list-modal' : 'no-scrollbar file-list-modal'} centered show={this.props.show} onHide={this.props.hide}>
				{uploadComponent}
				<Modal.Body id="file-model-container">
					<InfiniteScroll scrollableTarget='file-model-container' dataLength={this.state.count} next={this.getFileList} hasMore={this.state.page < this.state.count} loader={<Loading></Loading>}>
						{boxList}
					</InfiniteScroll>
				</Modal.Body>
			</Modal>
		);
	}
}

export default FileListModal;