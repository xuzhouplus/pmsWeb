import React from "react";
import {Button, Form, Col, Card} from "react-bootstrap";
import Utils from "../../utils/Utils";
import {connect} from "react-redux";
import Swal from "sweetalert2";
import Loading from "../loading/Loading";
import "./Weibo.scss";

function mapStateToProps(state) {
	return {
		account: state.auth
	};
}

class Weibo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			settings: {
				weibo_app_id: "",
				weibo_app_secret: ""
			},
			weibo_app_id: {},
			weibo_app_secret: {}
		}
	}

	componentDidMount() {
		this.getWeiboSettings();
	}

	getWeiboSettings = () => {
		Utils.weiboSettings('get', {}, response => {
			console.log(response);
			if (response.data.weibo_app_secret) {
				response.data.weibo_app_secret = "";
			}
			this.setState({
				weibo_app_secret: {
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
		if (state.settings[event.target.id] == '') {
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
		if (settings.weibo_app_id == '') {
			this.setState({
				weibo_app_id: {
					isInvalid: true,
					isValid: false,
					text: '请输入微博应用AppKey'
				}
			})
			return;
		}
		if (settings.weibo_app_secret == '' && (!this.state.weibo_app_secret.inputted)) {
			this.setState({
				weibo_app_secret: {
					isInvalid: true,
					isValid: false,
					text: '请输入微博应用AppSecret',
					inputted: false
				}
			})
			return;
		}
		Utils.weiboSettings('post', Object.assign({}, settings), response => {
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
				<Card className="weibo-settings-container">
					<Card.Body className="weibo-settings-table">
						<Form.Row>
							<Form.Group as={Col} controlId="weibo_app_id" className="position-relative weibo_app_id">
								<Form.Label>微博应用AppKey</Form.Label>
								<Form.Control onChange={this.handleChange} onBlur={this.handleChange} value={this.state.settings.weibo_app_id} isInvalid={this.state.weibo_app_id.isInvalid} isValid={this.state.weibo_app_id.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.weibo_app_id.text}
								</Form.Control.Feedback>
							</Form.Group>

							<Form.Group as={Col} controlId="weibo_app_secret" className="position-relative">
								<Form.Label>微博应用AppSecret</Form.Label>
								<Form.Control onChange={this.handleChange} onBlur={this.handleChange} placeholder="为了安全，后台不返回已经输入的微博应用AppSecret" value={this.state.settings.weibo_app_secret} isInvalid={this.state.weibo_app_secret.isInvalid} isValid={this.state.weibo_app_secret.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.weibo_app_secret.text}
								</Form.Control.Feedback>
							</Form.Group>
						</Form.Row>
						<div className="weibo-settings-note">
							<p>配置微博对接配置后，可以在账号管理页面绑定微博账号，可以使用微博授权登录。</p>
							<p>微博配置信息需要访问<a href="https://open.weibo.com/authentication/" target="_blank">微博开放平台</a>获取。</p>
						</div>
					</Card.Body>
					<Card.Footer className="weibo-settings-footer">
						<Button variant="primary" type="submit" onClick={this.formSubmit}>保存</Button>
					</Card.Footer>
				</Card>
			);
		}
	}
}

export default connect(mapStateToProps, null)(Weibo);
