import React from "react";
import {Button, Form, Col, Card, Row} from "react-bootstrap";
import Utils from "../../utils/Utils";
import {connect} from "react-redux";
import Swal from "sweetalert2";
import Loading from "../loading/Loading";
import "./Baidu.scss";

function mapStateToProps(state) {
	return {
		account: state.auth
	};
}

class Baidu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			settings: {
				baidu_app_name: "",
				baidu_api_key: "",
				baidu_secret_key: "",
				baidu_pan_availability: "",
			},
			baidu_app_name: {},
			baidu_api_key: {},
			baidu_secret_key: {},
		}
	}

	componentDidMount() {
		this.getBaiduSettings();
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		if (nextProps.account.uuid !== this.props.account.uuid) {
			this.getBaiduSettings();
		}
		return true;
	}

	getBaiduSettings = () => {
		Utils.baiduSettings('get', {}, response => {
			let inputted = false
			if (response.data.baidu_secret_key) {
				inputted = response.data.baidu_secret_key === "true"
				response.data.baidu_secret_key = "";
			}
			this.setState({
				baidu_secret_key: {
					inputted: inputted
				},
				settings: response.data
			})
		}, error => {
			console.log(error);
			this.setState({
				settings: {
					baidu_app_name: "",
					baidu_api_key: "",
					baidu_secret_key: "",
					baidu_pan_availability: "",
				},
				baidu_app_name: {},
				baidu_api_key: {},
				baidu_secret_key: {}
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

	toggleNetdisk = (event) => {
		let state = this.state;
		console.log(event.target.value)
		state.settings['baidu_pan_availability'] = event.target.value
		this.setState(state)
	}

	formSubmit = () => {
		let settings = this.state.settings;
		if (settings.baidu_app_name === '') {
			this.setState({
				baidu_app_name: {
					isInvalid: true,
					isValid: false,
					text: '请输入百度应用名称'
				}
			})
			return;
		}
		if (settings.baidu_api_key === '') {
			this.setState({
				baidu_api_key: {
					isInvalid: true,
					isValid: false,
					text: '请输入百度APP_KEY'
				}
			})
			return;
		}
		if (settings.baidu_secret_key === '' && (!this.state.baidu_secret_key.inputted)) {
			this.setState({
				baidu_secret_key: {
					isInvalid: true,
					isValid: false,
					text: '请输入百度APP_SECRET',
					inputted: false
				}
			})
			return;
		}
		Utils.baiduSettings('post', Object.assign({}, settings), response => {
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
				<Card className="baidu-pan-settings-container">
					<Card.Body className="baidu-pan-settings-table">
						<Form as={Row} className="mb-3">
							<Form.Group as={Col} controlId="baidu_app_name"
										className="position-relative baidu_app_name">
								<Form.Label>百度应用名称</Form.Label>
								<Form.Control onChange={this.handleChange} onBlur={this.handleChange}
											  value={this.state.settings.baidu_app_name}
											  isInvalid={this.state.baidu_app_name.isInvalid}
											  isValid={this.state.baidu_app_name.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.baidu_app_name.text}
								</Form.Control.Feedback>
							</Form.Group>
							<Form.Group as={Col} controlId="baidu_api_key"
										className="position-relative baidu_pan_app_key">
								<Form.Label>百度 Api Key</Form.Label>
								<Form.Control onChange={this.handleChange} onBlur={this.handleChange}
											  value={this.state.settings.baidu_api_key}
											  isInvalid={this.state.baidu_api_key.isInvalid}
											  isValid={this.state.baidu_api_key.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.baidu_api_key.text}
								</Form.Control.Feedback>
							</Form.Group>
							<Form.Group as={Col} controlId="baidu_secret_key" className="position-relative">
								<Form.Label>百度 Secret Key</Form.Label>
								<Form.Control onChange={this.handleChange} onBlur={this.handleChange}
											  placeholder="为了安全，后台不返回已经输入的百度 Secret Key"
											  value={this.state.settings.baidu_secret_key}
											  isInvalid={this.state.baidu_secret_key.isInvalid}
											  isValid={this.state.baidu_secret_key.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.baidu_secret_key.text}
								</Form.Control.Feedback>
							</Form.Group>
						</Form>
						<div className="baidu-pan-settings-note">
							<p>配置百度对接配置后，可以在账号管理页面绑定百度账号，可以使用百度授权登录，还可以使用百度网盘保存上传文件。</p>
							<p>百度配置信息需要访问<a href="https://developer.baidu.com/" target="_blank"
											rel="noreferrer noopener">百度开放者中心</a>获取。</p>
							<Form.Group controlId="baidu_pan_availability" className="position-relative">
								<Form.Label style={{marginRight: "0.5rem"}}>使用百度网盘</Form.Label>
								<Form.Check inline onChange={this.toggleNetdisk} type="switch"
											value={this.state.settings.baidu_pan_availability}/>
							</Form.Group>
						</div>
					</Card.Body>
					<Card.Footer className="baidu-pan-settings-footer">
						<Button variant="primary" type="submit" onClick={this.formSubmit}>保存</Button>
					</Card.Footer>
				</Card>
			);
		}
	}
}

export default connect(mapStateToProps, null)(Baidu);
