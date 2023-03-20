import React from "react";
import Utils from "../../utils/Utils";
import {Button, Card, Col, Form, FormControl, InputGroup, Modal, Row} from "react-bootstrap";
import FileBox from "./FileBox";
import Resumablejs from "resumablejs";
import configs from "@/configs";
import {File} from "@utils/File";
import Swal from "sweetalert2";
import Paginator from "@components/paginator/Paginator";
import './FileListModal.scss'

class FileListModal extends React.Component {
	resumable = null

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
			search: null,
			files: [],
			upload: {
				max: 100,
				now: 0,
			},
			file: '',
		};
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
		const cancelTokenSource = Utils.getFileList({
			page: page - 1,
			limit: this.state.limit,
			name: this.state.search,
			type: this.props.fileType
		}, (response) => {
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
		}, function (error) {
			console.log(error);
		});
		this.setState({
			cancelTokenSource: cancelTokenSource
		})
	}

	componentDidMount() {
		this.getFileList()
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.fileType !== this.props.fileType) {
			this.getFileList()
		}
		if (this.props.upload && this.props.show) {
			this.initResumableJs()
		} else {
			this.cancelResumableJs()
		}
	}

	componentWillUnmount() {
		if (this.state.cancelTokenSource) {
			this.state.cancelTokenSource.cancel('Operation canceled by the user.');
		}
		this.cancelResumableJs()
	}

	initResumableJs = () => {
		let fileType
		if (this.props.fileType === 'image') {
			fileType = configs.imageTypes
		} else if (this.props.fileType === 'video') {
			fileType = configs.videoTypes
		} else {
			fileType = configs.imageTypes.concat(configs.videoTypes)
		}
		this.resumable = new Resumablejs({
			target: configs.proxyBackendHost + configs.uploadFileUrl,
			fileType: fileType,
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

	cancelResumableJs = () => {
		if (this.resumable) {
			this.resumable.cancel()
		}
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

	select = (uuid, event) => {
		event.stopPropagation();
		Utils.getFileInfo(uuid, data => {
			this.props.selectFile(data.data)
		}, error => {
			console.log(error)
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
		let postBox = [];
		let rowCount = 0
		for (const file of this.state.files) {
			postBox.push(<Col key={file.uuid} xs={3} lg={3} className="card-body-box"><FileBox file={file} key={file.uuid} select={this.select.bind(this, file.uuid)}></FileBox></Col>)
			if (postBox.length === 4) {
				boxList.push(<Row key={rowCount} className="card-body-row">
					{postBox}
				</Row>)
				postBox = []
				rowCount++
			}
		}
		if (postBox) {
			boxList.push(<Row key={rowCount} className="card-body-row">
				{postBox}
			</Row>)
		}
		return (
			<Modal className="file-list-modal" centered show={this.props.show} onHide={this.props.hide}>
				<Modal.Body>
					<Card className="card-panel">
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
				</Modal.Body>
			</Modal>
		);
	}
}

export default FileListModal;
