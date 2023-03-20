import React from "react";
import {Button, Form, Col, Card, Row} from "react-bootstrap";
import Utils from "../../utils/Utils";
import {connect} from "react-redux";
import Loading from "../loading/Loading";
import Map from "@redux/Map";
import Swal from "sweetalert2";
import "./Google.scss";

class Google extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			settings: {
				google_app_id: "",
				google_app_secret: ""
			},
			google_app_id: {},
			google_app_secret: {}
		}
	}

	componentDidMount() {
		this.getGoogleSettings();
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		if (nextProps.account.uuid !== this.props.account.uuid) {
			this.getGoogleSettings();
		}
		return true;
	}

	getGoogleSettings = () => {
		Utils.googleSettings('get', {}, response => {
			let inputted = false
			if (response.data.google_app_secret) {
				inputted = response.data.google_app_secret === "true"
				response.data.google_app_secret = "";
			}
			this.setState({
				google_app_secret: {
					inputted: inputted
				},
				settings: response.data
			})
		}, error => {
			console.log(error);
			this.setState({
				settings: {
					google_app_id: "",
					google_app_secret: ""
				},
				google_app_id: {},
				google_app_secret: {}
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
		if (settings.google_app_id === '') {
			this.setState({
				google_app_id: {
					isInvalid: true,
					isValid: false,
					text: '请输入 Google Client ID'
				}
			})
			return;
		}
		if (settings.google_app_secret === '' && (!this.state.google_app_secret.inputted)) {
			this.setState({
				google_app_secret: {
					isInvalid: true,
					isValid: false,
					text: '请输入 Google Client Secret',
					inputted: false
				}
			})
			return;
		}
		Utils.googleSettings('post', Object.assign({}, settings), response => {
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
				<Card className="google-settings-container">
					<Card.Body className="google-settings-table">
						<Form as={Row} className="mb-3">
							<Form.Group as={Col} controlId="google_app_id" className="position-relative google_app_id">
								<Form.Label>Google Client ID</Form.Label>
								<Form.Control onChange={this.handleChange} onBlur={this.handleChange} value={this.state.settings.google_app_id} isInvalid={this.state.google_app_id.isInvalid} isValid={this.state.google_app_id.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.google_app_id.text}
								</Form.Control.Feedback>
							</Form.Group>

							<Form.Group as={Col} controlId="google_app_secret" className="position-relative">
								<Form.Label>Google Client Secret</Form.Label>
								<Form.Control onChange={this.handleChange} onBlur={this.handleChange} placeholder="为了安全，后台不返回已经输入的 Google Client Secret" value={this.state.settings.google_app_secret} isInvalid={this.state.google_app_secret.isInvalid} isValid={this.state.google_app_secret.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.google_app_secret.text}
								</Form.Control.Feedback>
							</Form.Group>
						</Form>
						<div className="google-settings-note">
							<p>配置 Google 对接配置后，可以在账号管理页面绑定 Google 账号，可以使用 Google 授权登录。</p>
							<p>Google 配置信息需要访问<a href="https://developers.google.com/identity/protocols/oauth2" target="_blank" rel="noreferrer noopener"> Google Developers </a>获取。</p>
						</div>
					</Card.Body>
					<Card.Footer className="google-settings-footer">
						<Button variant="primary" type="submit" onClick={this.formSubmit}>保存</Button>
					</Card.Footer>
				</Card>
			);
		}
	}
}

export default connect(Map.mapAccountStateToProps, null)(Google);
