import React from "react";
import {Button, Form, Col, Card} from "react-bootstrap";
import Utils from "../../utils/Utils";
import {connect} from "react-redux";
import Swal from "sweetalert2";
import Loading from "../loading/Loading";
import "./Line.scss";

function mapStateToProps(state) {
	return {
		account: state.auth
	};
}

class Line extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			settings: {
				line_app_id: "",
				line_app_secret: ""
			},
			line_app_id: {},
			line_app_secret: {}
		}
	}

	componentDidMount() {
		this.getLineSettings();
	}

	getLineSettings = () => {
		Utils.lineSettings('get', {}, response => {
			console.log(response);
			if (response.data.line_app_secret) {
				response.data.line_app_secret = "";
			}
			this.setState({
				line_app_secret: {
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
		if (settings.line_app_id == '') {
			this.setState({
				line_app_id: {
					isInvalid: true,
					isValid: false,
					text: '请输入 Line Channel ID'
				}
			})
			return;
		}
		if (settings.line_app_secret == '' && (!this.state.line_app_secret.inputted)) {
			this.setState({
				line_app_secret: {
					isInvalid: true,
					isValid: false,
					text: '请输入 Line Channel Secret',
					inputted: false
				}
			})
			return;
		}
		Utils.lineSettings('post', Object.assign({}, settings), response => {
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
				<Card className="line-settings-container">
					<Card.Body className="line-settings-table">
						<Form.Row>
							<Form.Group as={Col} controlId="line_app_id" className="position-relative line_app_id">
								<Form.Label>Line Channel ID</Form.Label>
								<Form.Control onChange={this.handleChange} onBlur={this.handleChange} value={this.state.settings.line_app_id} isInvalid={this.state.line_app_id.isInvalid} isValid={this.state.line_app_id.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.line_app_id.text}
								</Form.Control.Feedback>
							</Form.Group>

							<Form.Group as={Col} controlId="line_app_secret" className="position-relative">
								<Form.Label>Line Channel Secret</Form.Label>
								<Form.Control onChange={this.handleChange} onBlur={this.handleChange} placeholder="为了安全，后台不返回已经输入的 Line Channel Secret" value={this.state.settings.line_app_secret} isInvalid={this.state.line_app_secret.isInvalid} isValid={this.state.line_app_secret.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.line_app_secret.text}
								</Form.Control.Feedback>
							</Form.Group>
						</Form.Row>
						<div className="line-settings-note">
							<p>配置 Line 对接配置后，可以在账号管理页面绑定 Line 账号，可以使用 Line 授权登录。</p>
							<p>Line 配置信息需要访问<a href="https://developers.line.biz/zh-hant/docs/line-login/overview/" target="_blank"> Line Developers </a>获取。</p>
						</div>
					</Card.Body>
					<Card.Footer className="line-settings-footer">
						<Button variant="primary" type="submit" onClick={this.formSubmit}>保存</Button>
					</Card.Footer>
				</Card>
			);
		}
	}
}

export default connect(mapStateToProps, null)(Line);
