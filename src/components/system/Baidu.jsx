import React from "react";
import {Button, Form, Col, Card} from "react-bootstrap";
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
				baidu_api_key: "",
				baidu_secret_key: "",
			},
			baidu_api_key: {},
			baidu_secret_key: {}
		}
	}

	componentDidMount() {
		this.getBaiduSettings();
	}

	getBaiduSettings = () => {
		Utils.baiduSettings('get', {}, response => {
			console.log(response);
			if (response.data.baidu_secret_key) {
				response.data.baidu_secret_key = "";
			}
			this.setState({
				baidu_secret_key: {
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
		if (settings.baidu_api_key === '') {
			this.setState({
				baidu_api_key: {
					isInvalid: true,
					isValid: false,
					text: '请输入百度网盘APP_KEY'
				}
			})
			return;
		}
		if (settings.baidu_secret_key === '' && (!this.state.baidu_secret_key.inputted)) {
			this.setState({
				baidu_secret_key: {
					isInvalid: true,
					isValid: false,
					text: '请输入百度网盘APP_SECRET',
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
						<Form.Row>
							<Form.Group as={Col} controlId="baidu_api_key" className="position-relative baidu_pan_app_key">
								<Form.Label>百度 Api Key</Form.Label>
								<Form.Control onChange={this.handleChange} onBlur={this.handleChange} value={this.state.settings.baidu_api_key} isInvalid={this.state.baidu_api_key.isInvalid} isValid={this.state.baidu_api_key.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.baidu_api_key.text}
								</Form.Control.Feedback>
							</Form.Group>

							<Form.Group as={Col} controlId="baidu_secret_key" className="position-relative">
								<Form.Label>百度 Secret Key</Form.Label>
								<Form.Control onChange={this.handleChange} onBlur={this.handleChange} placeholder="为了安全，后台不返回已经输入的百度网盘 Secret Key" value={this.state.settings.baidu_secret_key} isInvalid={this.state.baidu_secret_key.isInvalid} isValid={this.state.baidu_secret_key.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.baidu_secret_key.text}
								</Form.Control.Feedback>
							</Form.Group>
						</Form.Row>
						<div className="baidu-pan-settings-note">
							<p>配置百度对接配置后，可以在账号管理页面绑定百度账号，可以使用百度授权登录。。</p>
							<p>百度配置信息需要访问<a href="https://developer.baidu.com/" target="_blank" rel="noreferrer noopener">百度开放者中心</a>获取。</p>
						</div>
					</Card.Body>
					<Card.Footer className="alipay-settings-footer">
						<Button variant="primary" type="submit" onClick={this.formSubmit}>保存</Button>
					</Card.Footer>
				</Card>
			);
		}
	}
}

export default connect(mapStateToProps, null)(Baidu);
