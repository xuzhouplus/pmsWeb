import React from "react";
import {Button, Form, Col, Card} from "react-bootstrap";
import Utils from "../../utils/Utils";
import {connect} from "react-redux";
import Swal from "sweetalert2";
import Loading from "../loading/Loading";
import "./GitHub.scss";

function mapStateToProps(state) {
	return {
		account: state.auth
	};
}

class GitHub extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			settings: {
				github_app_name: "",
				github_app_id: "",
				github_app_secret: ""
			},
			github_app_id: {},
			github_app_secret: {},
			github_app_name: {},
		}
	}

	componentDidMount() {
		this.getGitHubSettings();
	}

	getGitHubSettings = () => {
		Utils.githubSettings('get', {}, response => {
			console.log(response);
			if (response.data.github_app_secret) {
				response.data.github_app_secret = "";
			}
			this.setState({
				github_app_secret: {
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
		if (settings.github_app_name == '') {
			this.setState({
				github_public_key: {
					isInvalid: true,
					isValid: false,
					text: '请输入 GitHub 公钥'
				}
			})
			return;
		}
		if (settings.github_app_id == '') {
			this.setState({
				github_app_id: {
					isInvalid: true,
					isValid: false,
					text: '请输入 GitHub Client ID'
				}
			})
			return;
		}
		if (settings.github_app_secret == '' && (!this.state.github_app_secret.inputted)) {
			this.setState({
				github_app_secret: {
					isInvalid: true,
					isValid: false,
					text: '请输入 GitHub Client Secret',
					inputted: false
				}
			})
			return;
		}
		Utils.githubSettings('post', Object.assign({}, settings), response => {
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
				<Card className="github-settings-container">
					<Card.Body className="github-settings-table">
						<Form.Row>
							<Form.Group as={Col} controlId="github_app_name" className="position-relative github_app_id">
								<Form.Label> GitHub Client ID</Form.Label>
								<Form.Control onChange={this.handleChange} onBlur={this.handleChange} value={this.state.settings.github_app_name} isInvalid={this.state.github_app_name.isInvalid} isValid={this.state.github_app_name.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.github_app_name.text}
								</Form.Control.Feedback>
							</Form.Group>

							<Form.Group as={Col} controlId="github_app_id" className="position-relative github_app_id">
								<Form.Label>GitHub App Name</Form.Label>
								<Form.Control onChange={this.handleChange} onBlur={this.handleChange} value={this.state.settings.github_app_id} isInvalid={this.state.github_app_id.isInvalid} isValid={this.state.github_app_id.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.github_app_id.text}
								</Form.Control.Feedback>
							</Form.Group>

							<Form.Group as={Col} controlId="github_app_secret" className="position-relative">
								<Form.Label>GitHub Client Secret</Form.Label>
								<Form.Control onChange={this.handleChange} onBlur={this.handleChange} placeholder="为了安全，后台不返回已经输入的 GitHub Client Secret" value={this.state.settings.github_app_secret} isInvalid={this.state.github_app_secret.isInvalid} isValid={this.state.github_app_secret.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.github_app_secret.text}
								</Form.Control.Feedback>
							</Form.Group>
						</Form.Row>
						<div className="github-settings-note">
							<p>配置 GitHub 对接配置后，可以在账号管理页面绑定 GitHub 账号，可以使用 GitHub 授权登录。</p>
							<p>GitHub 配置信息需要访问<a href="https://docs.github.com/en/developers/apps/authorizing-oauth-apps" target="_blank"> GitHub Docs </a>获取。</p>
						</div>
					</Card.Body>
					<Card.Footer className="github-settings-footer">
						<Button variant="primary" type="submit" onClick={this.formSubmit}>保存</Button>
					</Card.Footer>
				</Card>
			);
		}
	}
}

export default connect(mapStateToProps, null)(GitHub);
