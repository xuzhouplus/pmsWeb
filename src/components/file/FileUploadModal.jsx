import React from "react";
import {Button, Form, Modal, ProgressBar} from "react-bootstrap";
import Utils from "@utils/Utils";
import {File, Image, Video} from "@utils/File";
import Loading from "@components/loading/Loading";
import "./FileUploadModal.scss";
import configs from "@/configs";
import Resumablejs from "resumablejs";

class FileUploadModal extends React.Component {
    /**
     * @type Resumablejs
     */
    resumable = null

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            upload: {
                max: 100,
                now: 0,
            },
            preview: {
                url: '',
                error: ''
            },
            name: {
                label: '名称',
                isInvalid: false,
                isValid: false,
                value: '',
                text: ''
            },
            description: {
                label: '描述',
                isInvalid: false,
                isValid: false,
                value: '',
                text: ''
            },
            file: {
                input: null,
                type: '',
                error: ''
            }
        };
        this.fileBrowserButton = React.createRef()
        this.fileDragTarget = React.createRef()
    }

    componentDidMount() {
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
        this.resumable.assignBrowse(this.fileBrowserButton)
        this.resumable.assignDrop(this.fileDragTarget)
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
            this.props.afterUpload(file)
        });
        this.resumable.on('fileError', (file, message) => {
            console.log(file)
            console.log(message)
        });
    }

    componentWillUnmount() {
        this.resumable.cancel()
        this.setState({
            loading: false,
            preview: {
                url: '',
                error: ''
            },
            name: {
                label: '名称',
                isInvalid: false,
                isValid: false,
                value: '',
                text: ''
            },
            description: {
                label: '描述',
                isInvalid: false,
                isValid: false,
                value: '',
                text: ''
            },
            file: {
                input: null,
                type: '',
                error: ''
            }
        })
    }

    handleSubmit = () => {
        let file = this.state.file;
        if (!file.input) {
            file.error = "文件不能为空";
            this.setState({
                file: file
            })
            return;
        }
        let name = this.state.name;
        if (name.value === '') {
            name.text = "名称不能为空";
            this.setState({
                name: name
            })
            return;
        }
        this.resumable.opts.query = {
            name: this.state.name.value,
            description: this.state.description.value,
        }
        this.resumable.upload()
        // Utils.uploadFile({
        //     file: this.state.file.input,
        //     type: this.state.file.type,
        //     name: this.state.name.value,
        //     description: this.state.description.value,
        // }, (total, loaded) => {
        //     this.setState({
        //         upload: {
        //             max: total,
        //             now: loaded
        //         }
        //     })
        // }, (response) => {
        //     this.props.afterUpload(response.data);
        // }, (error) => {
        //     console.log(error);
        // })
    }

    onFileSelected = (resumableFile) => {
        const that = this;
        if (resumableFile.file) {
            let fileName = File.getFileName(resumableFile.file.name)
            let states = {
                loading: true,
                upload: {
                    max: 100,
                    now: 0,
                },
                file: {
                    input: resumableFile,
                    type: resumableFile.file.type,
                    error: ''
                },
                name: {
                    label: '名称',
                    isInvalid: false,
                    isValid: false,
                    value: fileName,
                    text: ''
                },
                description: {
                    label: '描述',
                    isInvalid: false,
                    isValid: false,
                    value: fileName,
                    text: ''
                }
            }
            if (resumableFile.file.type.match('image')) {
                Image.captureThumbnail(resumableFile.file, (message, src, loaded) => {
                    if (message !== '') {
                        this.setState({
                            loading: false,
                            preview: {
                                url: '',
                                error: message
                            }
                        })
                        return
                    }
                    this.setState({
                        loading: false,
                        preview: {
                            url: src,
                            error: ''
                        }
                    })
                })
            } else if (resumableFile.file.type.match('video')) {
                Video.captureThumbnail(resumableFile.file, (message, src, loaded) => {
                    if (message !== '') {
                        this.setState({
                            loading: false,
                            preview: {
                                url: '',
                                error: message
                            }
                        })
                        return
                    }
                    this.setState({
                        loading: false,
                        preview: {
                            url: src,
                            error: ''
                        }
                    })
                })
            } else {
                states['loading'] = false
                states['preview'] = {
                    url: '',
                    error: ''
                }
                states['file'] = {
                    input: null,
                    type: '',
                    error: '不支持的文件类型'
                }
            }
            that.setState(states)
        } else {
            that.setState({
                loading: false,
                preview: {
                    url: '',
                    error: ''
                },
                file: {
                    input: null,
                    type: '',
                    error: '请选择上传文件'
                },
                name: {
                    label: '名称',
                    isInvalid: false,
                    isValid: false,
                    value: '',
                    text: ''
                },
                description: {
                    label: '描述',
                    isInvalid: false,
                    isValid: false,
                    value: '',
                    text: ''
                }
            })
        }
    }

    onChange = (event) => {
        let inputValue = event.target.value ? event.target.value.trim() : "";
        switch (event.target.id) {
            case "input-name":
                let name = this.state.name;
                if (inputValue === "") {
                    name.text = "请输入名称";
                    name.isInvalid = true;
                    name.isValid = false;
                    name.value = inputValue;
                } else {
                    name.text = "";
                    name.isInvalid = false;
                    name.isValid = true;
                    name.value = inputValue;
                }
                this.setState({
                    name: name
                });
                break;
            case "input-description":
                let description = this.state.description;
                description.text = "";
                description.isInvalid = false;
                description.isValid = true;
                description.value = inputValue;
                this.setState({
                    description: description
                });
                break;
            default:
                //@todo nothing
                break;
        }
    }

    onHide = () => {
        if (this.state.upload.now > 0) {
            return;
        }
        this.props.handleModal()
    }

    render() {
        let previewBox = <div className="file-input-box" ref={node => this.fileBrowserButton = node}>
            <div className="file-add-mark">+</div>
            <div className="file-add-note">选择PNG、JPG或MP4文件</div>
        </div>;
        if (this.state.loading) {
            previewBox = <Loading>文件解析中</Loading>
        } else {
            if (this.state.preview.url) {
                previewBox = <img src={this.state.preview.url} alt="preview"/>;
            }
        }
        let uploadProgress = null
        if (this.state.upload.now > 0) {
            uploadProgress = <ProgressBar max={this.state.upload.max} now={this.state.upload.now}/>
        }
        return (
            <Modal className="file-upload-modal" centered show={this.props.show} onHide={this.onHide}>
                <Modal.Body>
                    <Form className="file-form" onSubmit={this.handleSubmit}>
                        <Form.Group className="position-relative file-input-group mb-3">
                            <span ref={node => this.fileDragTarget = node}
                                  className={["file-preview-box", "rounded", this.state.file.error ? "is-invalid" : ""].join(" ")}>
                                {previewBox}
                            </span>
                            <div className="invalid-tooltip">{this.state.file.error}</div>
                            {uploadProgress}
                        </Form.Group>
                        <Form.Group className="position-relative mb-3">
                            <Form.Label htmlFor="input-name">{this.state.name.label}</Form.Label>
                            <Form.Control id="input-name" aria-describedby="name-text" type='text'
                                          value={this.state.name.value} isInvalid={this.state.name.isInvalid}
                                          isValid={this.state.name.isValid} onChange={this.onChange}
                                          onBlur={this.onChange}/>
                            <Form.Control.Feedback type="invalid" tooltip>
                                {this.state.name.text}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="position-relative mb-3">
                            <Form.Label htmlFor="input-description">{this.state.description.label}</Form.Label>
                            <Form.Control id="input-description" aria-describedby="description-text" type='text'
                                          value={this.state.description.value}
                                          isInvalid={this.state.description.isInvalid}
                                          isValid={this.state.description.isValid} onChange={this.onChange}
                                          onBlur={this.onChange}/>
                            <Form.Control.Feedback type="invalid" tooltip>
                                {this.state.description.text}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className="form-button mb-3">
                            <Button variant="primary" className={this.state.status === 'uploading' ? 'uploading' : ''}
                                    type="button" onClick={this.handleSubmit}>
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        );
    }

}

export default FileUploadModal;
