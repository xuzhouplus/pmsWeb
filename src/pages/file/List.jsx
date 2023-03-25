import React from "react";
import {Col, Card, Row, Button, InputGroup, FormControl, ListGroup, Form, ProgressBar, Modal} from "react-bootstrap";
import Utils from "../../utils/Utils";
import FilePreviewModal from "../../components/file/FilePreviewModal";
import FileBox from "../../components/file/FileBox";
import TreeNavibar from "../../components/navbar/TreeNavibar";
import Paginator from "../../components/paginator/Paginator";
import {LinkContainer} from "react-router-bootstrap";
import {connect} from "react-redux";
import Map from "@/redux/Map"
import {FileDetail} from "@utils/http/File";
import Resumablejs from "resumablejs";
import configs from "@/configs";
import {File} from "@utils/File";
import Swal from "sweetalert2";
import './List.scss';
import {withRouter} from "@components/router/Router";

class List extends React.Component {

	/**
	 * @type Resumablejs
	 */
	resumable = null

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
			upload: {
				max: 100,
				now: 0,
			},
			file: '',
			files: []
		};
	}

	componentDidMount() {
		this.getFileList(this.props.router.params.page);
		this.initResumableJs();
	}

	componentWillUnmount() {
		if (this.state.cancelTokenSource) {
			this.state.cancelTokenSource.cancel('Operation canceled by the user.');
		}
		this.resumable.cancel()
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		if (nextProps.account.uuid !== this.props.account.uuid) {
			this.getFileList(this.props.router.params.page);
		}
		return true;
	}

	initResumableJs = () => {
		this.resumable = new Resumablejs({
			target: configs.proxyBackendHost + configs.uploadFileUrl,
			fileType: configs.imageTypes.concat(configs.videoTypes),
			chunkSize: configs.uploadChunkSize,
			chunkNumberParameterName: 'index',
			totalChunksParameterName: 'count',
			chunkSizeParameterName: 'chunk',
			totalSizeParameterName: 'total',
			identifierParameterName: 'id',
			fileNameParameterName: 'file',
			relativePathParameterName: 'path',
			currentChunkSizeParameterName: 'size',
			typeParameterName: 'type',
			fileParameterName: 'binary',
			generateUniqueIdentifier: function () {
				return Utils.generateUUID(false);
			}
		});
		this.resumable.assignBrowse(document.getElementById('upload-button'))
		this.resumable.assignDrop(document.getElementById('upload-drag'))
		this.resumable.on('fileAdded', (file, event) => {
			this.onFileSelected(file)
		});
		this.resumable.on('fileProgress', file => {
			this.setState({
				upload: {
					now: file.progress(false),
					max: 1
				}
			})
		})
		this.resumable.on('fileSuccess', (file, message) => {
			console.log(file)
			console.log(message)
			this.afterUpload(file)
		});
		this.resumable.on('fileError', (file, message) => {
			console.log(file)
			console.log(message)
		});
	}

	onFileSelected = (resumableFile) => {
		const that = this;
		if (resumableFile.file) {
			let fileName = File.getFileName(resumableFile.file.name)
			let states = {
				file: fileName,
				upload: {
					max: 100,
					now: 0,
				}
			}
			that.setState(states)
			this.resumable.opts.query = {
				name: fileName,
				description: fileName,
			}
			this.resumable.upload()
		} else {
			that.setState({
				upload: {
					max: 100,
					now: 0,
				},
				file: '',
			})
			Swal.fire({icon: 'error', text: '请选择上传文件', showConfirmButton: false, timer: 3000}).then()
		}
	}

	afterUpload = (uploadedFile) => {
		console.log(uploadedFile)
		this.setState({
			file: ''
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
			this.props.error(error)
		});
		this.setState({
			cancelTokenSource: cancelTokenSource
		})
	}
	preview = (uuid, event) => {
		event.stopPropagation();
		FileDetail(uuid, response => {
			console.log(response)
			this.setState({
				preview: response.data
			});
		}, error => {
			console.log(error)
			this.props.error(error)
		})
	}
	hidePreview = () => {
		this.getFileList(this.state.page);
		this.setState({
			preview: null
		})
	}

	delete = (uuid, event) => {
		event.stopPropagation();
		Utils.deleteFile({
			uuid: uuid
		}, (response) => {
			this.getFileList(this.state.page);
		}, (error) => {
			console.log(error);
			this.props.error(error)
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
		let boxList = [];
		let rowItems = [];
		let rowCount = 0;
		for (const file of this.state.files) {
			rowItems.push(<Col key={file.uuid} className="card-body-box w-25"><FileBox file={file} key={file.uuid} preview={this.preview.bind(this, file.uuid)} delete={this.delete.bind(this, file.uuid)}></FileBox></Col>)
			if (rowItems.length === 4) {
				rowCount++;
				boxList.push(<Row key={rowCount} className="card-body-row">
					{rowItems}
				</Row>)
				rowItems = [];
			}
		}
		if (rowItems) {
			rowCount++;
			while (rowItems.length < 4) {
				rowItems.push(<Col key={rowCount + "" + rowItems.length} className="card-body-box w-25"></Col>)
			}
			boxList.push(<Row key={rowCount} className="card-body-row">
				{rowItems}
			</Row>)
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
				<Card className="file-list-container card-panel">
					<FilePreviewModal onHide={this.hidePreview} file={this.state.preview}/>
					<Modal show={this.state.file} backdrop="static">
						<Modal.Header>{this.state.file}</Modal.Header>
						<Modal.Body>
							<ProgressBar max={this.state.upload.max} now={this.state.upload.now}/>
						</Modal.Body>
					</Modal>
					<Card.Header className="card-panel-header">
						<Form inline="true" onSubmit={this.handleSearch}>
							<Row>
								<Col xs={4} lg={4} className="card-header-search">
									<InputGroup>
										<FormControl placeholder="输入内容搜索" onChange={this.searchChange}/>
										<Button className="btn-main-color" type="submit">搜索</Button>
									</InputGroup>
								</Col>
								<Col xs={4} lg={4}></Col>
								<Col sx={4} lg={4} className="card-header-buttons">
									<Button id="upload-button" className="btn-main-color">上传文件</Button>
								</Col>
							</Row>
						</Form>
					</Card.Header>
					<Card.Body id="upload-drag" className="card-panel-body">
						{boxList}
					</Card.Body>
					<Card.Footer className="card-panel-footer">
						<Paginator page={this.state.page} count={this.state.count} onClick={this.changePage}></Paginator>
					</Card.Footer>
				</Card>
			</TreeNavibar>
		);
	}

}

export default connect(Map.mapAccountStateToProps, Map.mapToastDispatchToProps)(withRouter(List));
