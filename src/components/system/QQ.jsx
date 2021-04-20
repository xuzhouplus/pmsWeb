import React from "react";
import {Button, Form, Col, Card} from "react-bootstrap";
import Utils from "../../utils/Utils";
import {connect} from "react-redux";
import Swal from "sweetalert2";
import Loading from "../loading/Loading";
import "./QQ.scss";

function mapStateToProps(state) {
	return {
		account: state.auth
	};
}

class QQ extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			settings: {
				qq_app_id: "",
				qq_app_secret: ""
			},
			qq_app_id: {},
			qq_app_secret: {}
		}
	}

	componentDidMount() {
		this.getQQSettings();
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		if (nextProps.account.uuid !== this.props.account.uuid) {
			this.getQQSettings();
		}
		return true;
	}

	getQQSettings = () => {
		Utils.qqSettings('get', {}, response => {
			console.log(response);
			if (response.data.qq_app_secret) {
				response.data.qq_app_secret = "";
			}
			this.setState({
				qq_app_secret: {
					inputted: true
				},
				settings: response.data
			})
		}, error => {
			console.log(error);
			this.setState({
				settings: {
					qq_app_id: "",
					qq_app_secret: ""
				},
				qq_app_id: {},
				qq_app_secret: {}
			})
		})
	}

	handleChange = (event) => {
		let state = this.state;
		let label = event.target.previousSibling.innerText
		state.settings[event.target.id] = event.target.value ? event.target.value.trim() : "";
		let text = "";
		let isInvalid = false;
		let isValid = false;
		if (state.settings[event.target.id] === '') {
			text = '请输入' + label;
			isInvalid = true;
		} else {
			isValid = true;
		}
		state[event.target.id] = {
			text: text,
			isInvalid: isInvalid,
			isValid: isValid,
		};
		this.setState(state)
	}

	formSubmit = () => {
		let settings = this.state.settings;
		if (settings.qq_app_id === '') {
			this.setState({
				qq_app_id: {
					isInvalid: true,
					isValid: false,
					text: '请输入 QQ AppID'
				}
			})
			return;
		}
		if (settings.qq_app_secret === '' && (!this.state.qq_app_secret.inputted)) {
			this.setState({
				qq_app_secret: {
					isInvalid: true,
					isValid: false,
					text: '请输入 QQ AppKey',
					inputted: false
				}
			})
			return;
		}
		Utils.qqSettings('post', Object.assign({}, settings), response => {
			console.log(response);
			Swal.fire({icon: 'success', text: '保存成功', showConfirmButton: false, timer: 3000})
		}, error => {
			console.log(error);
			Swal.fire({icon: 'success', text: '保存失败，请稍后重试', showConfirmButton: false, timer: 3000})
		})
	}

	render() {
		if (Utils.objectIsEmpty(this.state.settings)) {
			return (<Loading/>);
		} else {
			return (
				<Card className="qq-settings-container">
					<Card.Body className="qq-settings-table">
						<Form.Row>
							<Form.Group as={Col} controlId="qq_app_id" className="position-relative qq_app_id">
								<Form.Label>QQ AppID</Form.Label>
								<Form.Control onChange={this.handleChange} onBlur={this.handleChange} value={this.state.settings.qq_app_id} isInvalid={this.state.qq_app_id.isInvalid} isValid={this.state.qq_app_id.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.qq_app_id.text}
								</Form.Control.Feedback>
							</Form.Group>

							<Form.Group as={Col} controlId="qq_app_secret" className="position-relative">
								<Form.Label>QQ AppKey</Form.Label>
								<Form.Control onChange={this.handleChange} onBlur={this.handleChange} placeholder="为了安全，后台不返回已经输入的QQ AppKey" value={this.state.settings.qq_app_secret} isInvalid={this.state.qq_app_secret.isInvalid} isValid={this.state.qq_app_secret.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.qq_app_secret.text}
								</Form.Control.Feedback>
							</Form.Group>
						</Form.Row>
						<div className="qq-settings-note">
							<p>配置 QQ 对接配置后，可以在账号管理页面绑定 QQ 账号，可以使用 QQ 授权登录。</p>
							<p> QQ 配置信息需要访问<a href="https://wiki.connect.qq.com/" target="_blank" rel="noreferrer noopener"> QQ 互联</a>获取。</p>
						</div>
					</Card.Body>
					<Card.Footer className="qq-settings-footer">
						<Button variant="primary" type="submit" onClick={this.formSubmit}>保存</Button>
					</Card.Footer>
				</Card>
			);
		}
	}
}

export default connect(mapStateToProps, null)(QQ);
