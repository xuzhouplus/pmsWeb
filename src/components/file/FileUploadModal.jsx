import React from "react";
import {Button, Form, Modal, ProgressBar} from "react-bootstrap";
import Utils from "@utils/Utils";
import {File, Image, Video} from "@utils/File";
import Loading from "@components/loading/Loading";
import "./FileUploadModal.scss";

class FileUploadModal extends React.Component {
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
        this.fileRef = React.createRef()
    }

    componentWillUnmount() {
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
        Utils.uploadFile({
            file: this.state.file.input,
            type: this.state.file.type,
            name: this.state.name.value,
            description: this.state.description.value,
        }, (total, loaded) => {
            this.setState({
                upload: {
                    max: total,
                    now: loaded
                }
            })
        }, (response) => {
            this.props.afterUpload(response.data);
        }, (error) => {
            console.log(error);
        })
    }
    onFileSelected = (event) => {
        const that = this;
        let input = this.fileRef.current.files[0];
        if (input) {
            let fileName = File.getFileName(input.name)
            let states = {
                loading: true,
                upload: {
                    max: 100,
                    now: 0,
                },
                file: {
                    input: input,
                    type: input.type,
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
            if (input.type.match('image')) {
                Image.captureThumbnail(input, (message, src, loaded) => {
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
            } else if (input.type.match('video')) {
                Video.captureThumbnail(input, (message, src, loaded) => {
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

    render() {
        let previewBox = <div className="file-input-box">
            <div className="file-add-mark">+</div>
            <div className="file-add-note">选择PNG、JPG或JPEG文件</div>
        </div>;
        if (this.state.loading) {
            previewBox = <Loading>文件解析中</Loading>
        } else {
            if (this.state.file.type) {
                previewBox = <img src={this.state.file.url} alt="preview"/>;
            }
        }
        return (
            <Modal className="file-upload-modal" centered show={this.props.show} onHide={this.props.handleModal}>
                <Modal.Body>
                    <Form className="file-form" onSubmit={this.handleSubmit}>
                        <Form.Group className="position-relative file-input-group mb-3">
                            <label htmlFor="file-input"
                                   className={["file-preview-box", "rounded", this.state.file.error ? "is-invalid" : ""].join(" ")}>
                                {previewBox}
                            </label>
                            <div className="invalid-tooltip">{this.state.file.error}</div>
                            <input type="file" id="file-input" ref={this.fileRef} onChange={this.onFileSelected}
                                   accept="image/png,image/jpg,image/jpeg,video/mp4"></input>
                            <ProgressBar max={this.state.upload.max} now={this.state.upload.now}/>
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