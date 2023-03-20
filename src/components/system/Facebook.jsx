import React from "react";
import {Button, Form, Col, Card, Row} from "react-bootstrap";
import Utils from "../../utils/Utils";
import {connect} from "react-redux";
import Map from "@/redux/Map"
import Loading from "../loading/Loading";
import Swal from "sweetalert2";
import "./Facebook.scss";

class Facebook extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			settings: {
				facebook_app_id: "",
				facebook_app_secret: ""
			},
			facebook_app_id: {},
			facebook_app_secret: {}
		}
	}

	componentDidMount() {
		this.getFacebookSettings();
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		if (nextProps.account.uuid !== this.props.account.uuid) {
			this.getFacebookSettings();
		}
		return true;
	}

	getFacebookSettings = () => {
		Utils.facebookSettings('get', {}, response => {
			let inputted = false
			if (response.data.facebook_app_secret) {
				inputted = response.data.facebook_app_secret === "true"
				response.data.facebook_app_secret = "";
			}
			this.setState({
				facebook_app_secret: {
					inputted: inputted
				},
				settings: response.data
			})
		}, error => {
			console.log(error);
			this.setState({
				settings: {
					facebook_app_id: "",
					facebook_app_secret: ""
				},
				facebook_app_id: {},
				facebook_app_secret: {}
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
			if (state[event.target.id].inputted) {
				isValid = true;
			} else {
				text = '请输入' + label;
				isInvalid = true;
			}
		} else {
			isValid = true;
		}
		state[event.target.id] = {
			inputted: state[event.target.id].inputted,
			text: text,
			isInvalid: isInvalid,
			isValid: isValid,
		};
		this.setState(state)
	}

	formSubmit = () => {
		let settings = this.state.settings;
		if (settings.facebook_app_id === '') {
			this.setState({
				facebook_app_id: {
					isInvalid: true,
					isValid: false,
					text: '请输入 Facebook Client ID'
				}
			})
			return;
		}
		if (settings.facebook_app_secret === '' && (!this.state.facebook_app_secret.inputted)) {
			this.setState({
				facebook_app_secret: {
					isInvalid: true,
					isValid: false,
					text: '请输入 Facebook Client Secret',
					inputted: false
				}
			})
			return;
		}
		Utils.facebookSettings('post', Object.assign({}, settings), response => {
			console.log(response);
			Swal.fire({icon: 'success', text: '保存成功', showConfirmButton: false, timer: 3000}).then()
		}, error => {
			console.log(error);
			Swal.fire({icon: 'success', text: '保存失败，请稍后重试', showConfirmButton: false, timer: 3000}).then()
		})
	}

	render() {
		if (Utils.objectIsEmpty(this.state.settings)) {
			return (<Loading/>);
		} else {
			return (
				<Card className="facebook-settings-container">
					<Card.Body className="facebook-settings-table">
						<Form as={Row} className="mb-3">
							<Form.Group as={Col} controlId="facebook_app_id" className="position-relative facebook_app_id">
								<Form.Label>Facebook Client ID</Form.Label>
								<Form.Control onChange={this.handleChange} onBlur={this.handleChange} value={this.state.settings.facebook_app_id} isInvalid={this.state.facebook_app_id.isInvalid} isValid={this.state.facebook_app_id.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.facebook_app_id.text}
								</Form.Control.Feedback>
							</Form.Group>

							<Form.Group as={Col} controlId="facebook_app_secret" className="position-relative">
								<Form.Label>Facebook Client Secret</Form.Label>
								<Form.Control onChange={this.handleChange} onBlur={this.handleChange} placeholder="为了安全，后台不返回已经输入的 Facebook Client Secret" value={this.state.settings.facebook_app_secret} isInvalid={this.state.facebook_app_secret.isInvalid} isValid={this.state.facebook_app_secret.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.facebook_app_secret.text}
								</Form.Control.Feedback>
							</Form.Group>
						</Form>
						<div className="facebook-settings-note">
							<p>配置 Facebook 对接配置后，可以在账号管理页面绑定 Facebook 账号，可以使用 Facebook 授权登录。</p>
							<p>Facebook 配置信息需要访问<a href="https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow#login" target="_blank" rel="noreferrer noopener"> Facebook for Developers </a>获取。</p>
						</div>
					</Card.Body>
					<Card.Footer className="facebook-settings-footer">
						<Button variant="primary" type="submit" onClick={this.formSubmit}>保存</Button>
					</Card.Footer>
				</Card>
			);
		}
	}
}

export default connect(Map.mapAccountStateToProps, null)(Facebook);
