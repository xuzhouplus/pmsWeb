import React from "react";
import {Button, Form, Col, Card} from "react-bootstrap";
import Utils from "../../utils/Utils";
import {connect} from "react-redux";
import Swal from "sweetalert2";
import Loading from "../loading/Loading";
import "./Wechat.scss";

function mapStateToProps(state) {
	return {
		account: state.auth
	};
}

class Wechat extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			settings: {
				wechat_app_id: "",
				wechat_app_secret: "",
			},
			wechat_app_id: {},
			wechat_app_secret: {}
		}
	}

	componentDidMount() {
		this.getWechatSettings();
	}

	getWechatSettings = () => {
		Utils.wechatSettings('get', {}, response => {
			console.log(response);
			if (response.data.wechat_app_secret) {
				response.data.wechat_app_secret = "";
			}
			this.setState({
				wechat_app_secret: {
					inputted: true
				},
				settings: response.data
			})
		}, error => {
			console.log(error);
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
		if (settings.wechat_app_id === '') {
			this.setState({
				wechat_app_id: {
					isInvalid: true,
					isValid: false,
					text: '请输入微信AppID'
				}
			})
			return;
		}
		if (settings.wechat_app_secret === '' && (!this.state.wechat_app_secret.inputted)) {
			this.setState({
				wechat_app_secret: {
					isInvalid: true,
					isValid: false,
					text: '请输入微信AppSecret',
					inputted: false
				}
			})
			return;
		}
		Utils.wechatSettings('post', Object.assign({}, settings), response => {
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
				<Card className="wechat-settings-container">
					<Card.Body className="wechat-settings-table">
						<Form.Row>
							<Form.Group as={Col} controlId="wechat_app_id" className="position-relative wechat_app_id">
								<Form.Label>微信AppID</Form.Label>
								<Form.Control onChange={this.handleChange} onBlur={this.handleChange} value={this.state.settings.wechat_app_id} isInvalid={this.state.wechat_app_id.isInvalid} isValid={this.state.wechat_app_id.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.wechat_app_id.text}
								</Form.Control.Feedback>
							</Form.Group>

							<Form.Group as={Col} controlId="wechat_app_secret" className="position-relative">
								<Form.Label>微信AppSecret</Form.Label>
								<Form.Control onChange={this.handleChange} onBlur={this.handleChange} placeholder="为了安全，后台不返回已经输入的微信AppSecret" value={this.state.settings.wechat_app_secret} isInvalid={this.state.wechat_app_secret.isInvalid} isValid={this.state.wechat_app_secret.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.wechat_app_secret.text}
								</Form.Control.Feedback>
							</Form.Group>
						</Form.Row>
						<div className="wechat-settings-note">
							<p>配置微信对接配置后，可以在账号管理页面绑定微信账号，可以使用微信授权登录。</p>
							<p>微信配置信息需要访问<a href="https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html" target="_blank" rel="noreferrer noopener">微信开放平台</a>获取。</p>
						</div>
					</Card.Body>
					<Card.Footer className="wechat-settings-footer">
						<Button variant="primary" type="submit" onClick={this.formSubmit}>保存</Button>
					</Card.Footer>
				</Card>
			);
		}
	}
}

export default connect(mapStateToProps, null)(Wechat);
