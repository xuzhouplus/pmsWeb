import React from "react";
import {connect} from "react-redux";
import Utils from "../../utils/Utils";
import Loading from "../loading/Loading";
import {Button, Card, Form} from "react-bootstrap";
import {authSlice} from "@redux/slices/AuthSlice";
import {File} from "@utils/File";
import Swal from "sweetalert2";
import "./Admin.scss";

function mapStateToProps(state) {
	return {
		account: state.auth
	};
}

function mapDispatchToProps(dispatch) {
	return {
		login: (user) => {
			dispatch(authSlice.actions.login(user))
		}
	}
}

class Admin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			profile: {},
			password: {
				value: ''
			},
			repeat_password: {
				value: ''
			},
			file: {},
			status: {}
		}
		this.fileRef = React.createRef()
	}

	componentDidMount() {
		this.getAdminProfile();
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		if (nextProps.account.uuid !== this.props.account.uuid) {
			this.getAdminProfile();
		}
		return true;
	}

	getAdminProfile = () => {
		Utils.adminProfile('get', {}, response => {
			this.setState({
				profile: response.data,
				status: {
					value: response.data.status === 1
				},
				file: {
					type: response.data.avatar ? 'image/png' : '',
					url: response.data.avatar
				}
			})
		}, error => {
			console.log(error);
			this.setState({
				profile: {},
				password: {
					value: ''
				},
				repeat_password: {
					value: ''
				},
				file: {},
				status: {}
			})
		})
	}

	onFileSelected = (event) => {
		const that = this;
		let file = this.fileRef.current.files[0];
		if (file) {
			that.setState({
				file: {
					input: file,
					type: file.type,
					url: File.getObjectURL(file),
					error: ''
				}
			})
		} else {
			that.setState({
				file: {
					input: null,
					type: '',
					url: '',
					error: '请选择上传文件'
				}
			})
		}
	}
	handleChange = (event) => {
		let state = this.state;
		let key = event.target.id;
		let inputValue;
		if (key === 'status') {
			inputValue = state.status.value ? false : true;
			state.profile.status = inputValue ? 1 : 2;
		} else {
			inputValue = event.target.value ? event.target.value.trim() : "";
			if (key === 'password') {
				if (inputValue !== state.repeat_password.value && state.repeat_password.value !== '') {
					state.repeat_password.text = "重复密码不匹配";
					state.repeat_password.isInvalid = true;
					state.repeat_password.isValid = false;
				}
			}

			if (key === 'repeat_password') {
				if (inputValue !== state.password.value) {
					state.repeat_password.text = "重复密码不匹配";
					state.repeat_password.isInvalid = true;
					state.repeat_password.isValid = false;
				} else {
					state.repeat_password.isInvalid = false;
					state.repeat_password.isValid = true;
				}
			}
		}
		state[key]['value'] = inputValue;
		this.setState(state)
	}

	handleSubmit = () => {
		let password = this.state.password;
		if (password.value !== '') {
			let repeatPassword = this.state.repeat_password
			if (repeatPassword.value !== password.value) {
				repeatPassword.text = "重复密码不匹配";
				this.setState({
					repeat_password: repeatPassword
				})
				return;
			}
		}
		let profile = {
			uuid: this.props.account.uuid,
			status: this.state.profile.status
		}
		if (this.state.file.input) {
			profile['avatar'] = this.state.file.url
		}
		if (this.state.password.value) {
			profile['password'] = this.state.password.value
		}
		Utils.adminProfile('post', profile, (response) => {
			let loginUser = Object.assign({}, this.props.account);
			loginUser.avatar = response.data.avatar;
			this.props.login(loginUser)
			Swal.fire({icon: 'success', text: '保存成功', showConfirmButton: false, timer: 3000}).then()
		}, (error) => {
			console.log(error);
			Swal.fire({icon: 'error', text: '保存失败，请稍后重试', showConfirmButton: false, timer: 3000}).then()
		})
	}

	render() {
		if (Utils.objectIsEmpty(this.state.profile)) {
			return (<Loading/>);
		} else {
			let previewBox = '';
			if (this.state.file.url) {
				if (Utils.getFileType(this.state.file) !== 'image') {
					previewBox = <div>不支持的文件格式</div>
				} else {
					previewBox = <img src={this.state.file.url} alt="Avatar"/>;
				}
			}
			return (
				<Card className="admin-profile-container">
					<Card.Body className="admin-profile-table">
						<Form className="admin-profile-form">
							<Form.Group className="position-relative mb-3 file-input-group">
								<label htmlFor="file-input" className={["file-preview-box", this.state.file.error ? "is-invalid" : ""].join(" ")}>
									{this.state.file.url ? previewBox : <div className="file-input-box">
										<div className="file-add-mark">+</div>
										<div className="file-add-note">选择PNG、JPG或JPEG文件</div>
									</div>}
								</label>
								<div className="invalid-tooltip">{this.state.file.error}</div>
								<input type="file" id="file-input" ref={this.fileRef} onChange={this.onFileSelected} accept="image/png,image/jpg,image/jpeg"></input>
							</Form.Group>
							<Form.Group controlId="account" className="position-relative mb-3 account">
								<Form.Label>账号</Form.Label>
								<Form.Control value={this.state.profile.account} readOnly disabled/>
							</Form.Group>

							<Form.Group controlId="password" className="position-relative mb-3">
								<Form.Label>密码</Form.Label>
								<Form.Control type="password" onChange={this.handleChange} onBlur={this.handleChange} value={this.state.password.value} isInvalid={this.state.password.isInvalid} isValid={this.state.password.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.password.text}
								</Form.Control.Feedback>
							</Form.Group>

							<Form.Group controlId="repeat_password" className="position-relative mb-3">
								<Form.Label>重复密码</Form.Label>
								<Form.Control type="password" onChange={this.handleChange} onBlur={this.handleChange} value={this.state.repeat_password.value} isInvalid={this.state.repeat_password.isInvalid} isValid={this.state.repeat_password.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.repeat_password.text}
								</Form.Control.Feedback>
							</Form.Group>
							<Form.Group controlId="status" className="position-relative mb-3">
								<Form.Label>状态</Form.Label>
								<Form.Check type="switch" id="status" checked={this.state.status.value} onChange={this.handleChange} label={this.state.status.value ? '启用' : '禁用'}/>
							</Form.Group>
						</Form>
					</Card.Body>
					<Card.Footer className="admin-profile-footer">
						<Button variant="primary" type="submit" onClick={this.handleSubmit}>保存</Button>
					</Card.Footer>
				</Card>
			);
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
