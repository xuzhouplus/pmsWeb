import React from "react";
import {Button, Form, Col, Card, Row} from "react-bootstrap";
import Utils from "../../utils/Utils";
import {connect} from "react-redux";
import Loading from "../loading/Loading";
import Map from "@redux/Map";
import Swal from "sweetalert2";
import "./Gitee.scss";

class Gitee extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			settings: {
				gitee_application_name: "",
				gitee_app_id: "",
				gitee_app_secret: ""
			},
			gitee_app_id: {},
			gitee_app_secret: {},
			gitee_application_name: {},
		}
	}

	componentDidMount() {
		this.getGiteeSettings();
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		if (nextProps.account.uuid !== this.props.account.uuid) {
			this.getGiteeSettings();
		}
		return true;
	}

	getGiteeSettings = () => {
		Utils.giteeSettings('get', {}, response => {
			let inputted = false
			if (response.data.gitee_app_secret) {
				inputted = response.data.gitee_app_secret === "true"
				response.data.gitee_app_secret = "";
			}
			this.setState({
				gitee_app_secret: {
					inputted: inputted
				},
				settings: response.data
			})
		}, error => {
			console.log(error);
			this.setState({
				settings: {
					gitee_application_name: "",
					gitee_app_id: "",
					gitee_app_secret: ""
				},
				gitee_app_id: {},
				gitee_app_secret: {},
				gitee_application_name: {},
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
		if (settings.gitee_application_name === '') {
			this.setState({
				gitee_application_name: {
					isInvalid: true,
					isValid: false,
					text: '请输入 Gitee Application Name'
				}
			})
			return;
		}
		if (settings.gitee_app_id === '') {
			this.setState({
				gitee_app_id: {
					isInvalid: true,
					isValid: false,
					text: '请输入 Gitee Client ID'
				}
			})
			return;
		}
		if (settings.gitee_app_secret === '' && (!this.state.gitee_app_secret.inputted)) {
			this.setState({
				gitee_app_secret: {
					isInvalid: true,
					isValid: false,
					text: '请输入 Gitee Client Secret',
					inputted: false
				}
			})
			return;
		}
		Utils.giteeSettings('post', Object.assign({}, settings), response => {
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
				<Card className="gitee-settings-container">
					<Card.Body className="gitee-settings-table">
						<Form as={Row} className="mb-3">
							<Form.Group as={Col} controlId="gitee_application_name" className="position-relative gitee_application_name">
								<Form.Label>码云应用名称</Form.Label>
								<Form.Control onChange={this.handleChange} onBlur={this.handleChange} value={this.state.settings.gitee_application_name} isInvalid={this.state.gitee_application_name.isInvalid} isValid={this.state.gitee_application_name.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.gitee_application_name.text}
								</Form.Control.Feedback>
							</Form.Group>

							<Form.Group as={Col} controlId="gitee_app_id" className="position-relative gitee_app_id">
								<Form.Label>码云 Client ID</Form.Label>
								<Form.Control onChange={this.handleChange} onBlur={this.handleChange} value={this.state.settings.gitee_app_id} isInvalid={this.state.gitee_app_id.isInvalid} isValid={this.state.gitee_app_id.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.gitee_app_id.text}
								</Form.Control.Feedback>
							</Form.Group>

							<Form.Group as={Col} controlId="gitee_app_secret" className="position-relative">
								<Form.Label>码云 Client Secret</Form.Label>
								<Form.Control onChange={this.handleChange} onBlur={this.handleChange} placeholder="为了安全，后台不返回已经输入的码云 Client Secret" value={this.state.settings.gitee_app_secret} isInvalid={this.state.gitee_app_secret.isInvalid} isValid={this.state.gitee_app_secret.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.gitee_app_secret.text}
								</Form.Control.Feedback>
							</Form.Group>
						</Form>
						<div className="gitee-settings-note">
							<p>配置码云对接配置后，可以在账号管理页面绑定码云账号，可以使用码云授权登录。</p>
							<p>码云配置信息需要访问<a href="https://gitee.com/api/v5/oauth_doc" target="_blank" rel="noreferrer noopener"> Gitee OAuth 文档 </a>获取。</p>
						</div>
					</Card.Body>
					<Card.Footer className="gitee-settings-footer">
						<Button variant="primary" type="submit" onClick={this.formSubmit}>保存</Button>
					</Card.Footer>
				</Card>
			);
		}
	}
}

export default connect(Map.mapAccountStateToProps, null)(Gitee);
