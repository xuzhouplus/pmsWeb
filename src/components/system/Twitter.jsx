import React from "react";
import {Button, Form, Col, Card, Row} from "react-bootstrap";
import Utils from "../../utils/Utils";
import {connect} from "react-redux";
import Loading from "../loading/Loading";
import Map from "@/redux/Map"
import Swal from "sweetalert2";
import "./Twitter.scss";

class Twitter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			settings: {
				twitter_app_id: "",
				twitter_app_secret: ""
			},
			twitter_app_id: {},
			twitter_app_secret: {}
		}
	}

	componentDidMount() {
		this.getTwitterSettings();
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		if (nextProps.account.uuid !== this.props.account.uuid) {
			this.getTwitterSettings();
		}
		return true;
	}

	getTwitterSettings = () => {
		Utils.twitterSettings('get', {}, response => {
			let inputted = false
			if (response.data.twitter_app_secret) {
				inputted = response.data.twitter_app_secret === "true"
				response.data.twitter_app_secret = "";
			}
			this.setState({
				twitter_app_secret: {
					inputted: inputted
				},
				settings: response.data
			})
		}, error => {
			console.log(error);
			this.setState({
				settings: {
					twitter_app_id: "",
					twitter_app_secret: ""
				},
				twitter_app_id: {},
				twitter_app_secret: {}
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
		if (settings.twitter_app_id === '') {
			this.setState({
				twitter_app_id: {
					isInvalid: true,
					isValid: false,
					text: '请输入Twitter App Key'
				}
			})
			return;
		}
		if (settings.twitter_app_secret === '' && (!this.state.twitter_app_secret.inputted)) {
			this.setState({
				twitter_app_secret: {
					isInvalid: true,
					isValid: false,
					text: '请输入 Twitter App Secret',
					inputted: false
				}
			})
			return;
		}
		Utils.twitterSettings('post', Object.assign({}, settings), response => {
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
				<Card className="twitter-settings-container">
					<Card.Body className="twitter-settings-table">
						<Form as={Row} className="mb-3">
							<Form.Group as={Col} controlId="twitter_app_id" className="position-relative twitter_app_id">
								<Form.Label>Twitter App Key</Form.Label>
								<Form.Control onChange={this.handleChange} onBlur={this.handleChange} value={this.state.settings.twitter_app_id} isInvalid={this.state.twitter_app_id.isInvalid} isValid={this.state.twitter_app_id.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.twitter_app_id.text}
								</Form.Control.Feedback>
							</Form.Group>

							<Form.Group as={Col} controlId="twitter_app_secret" className="position-relative">
								<Form.Label>Twitter App Key Secret</Form.Label>
								<Form.Control onChange={this.handleChange} onBlur={this.handleChange} placeholder="为了安全，后台不返回已经输入的 Twitter App Key Secret" value={this.state.settings.twitter_app_secret} isInvalid={this.state.twitter_app_secret.isInvalid} isValid={this.state.twitter_app_secret.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.twitter_app_secret.text}
								</Form.Control.Feedback>
							</Form.Group>
						</Form>
						<div className="twitter-settings-note">
							<p>配置 Twitter 对接配置后，可以在账号管理页面绑定 Twitter 账号，可以使用 Twitter 授权登录。</p>
							<p>Twitter 配置信息需要访问<a href="https://developer.twitter.com/en/docs/authentication" target="_blank" rel="noreferrer noopener"> Twitter Developers </a>获取。</p>
						</div>
					</Card.Body>
					<Card.Footer className="twitter-settings-footer">
						<Button variant="primary" type="submit" onClick={this.formSubmit}>保存</Button>
					</Card.Footer>
				</Card>
			);
		}
	}
}

export default connect(Map.mapAccountStateToProps, null)(Twitter);
