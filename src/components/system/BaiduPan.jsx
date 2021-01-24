import React from "react";
import {Button, Form, Col, Card} from "react-bootstrap";
import Utils from "../../utils/Utils";
import {connect} from "react-redux";
import Swal from "sweetalert2";
import Loading from "../loading/Loading";
import "./BaiduPan.scss";

function mapStateToProps(state) {
	return {
		account: state.auth
	};
}

class BaiduPan extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			settings: {
				baidu_pan_app_key: "",
				baidu_pan_app_secret: "",
			},
			baidu_pan_app_key: {},
			baidu_pan_app_secret: {}
		}
	}

	componentDidMount() {
		this.getBaiduPanSettings();
	}

	getBaiduPanSettings = () => {
		Utils.baiduPanSettings('get', {}, response => {
			console.log(response);
			if (response.data.baidu_pan_app_secret) {
				response.data.baidu_pan_app_secret = "";
			}
			this.setState({
				baidu_pan_app_secret: {
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
		if (settings.baidu_pan_app_key == '') {
			this.setState({
				baidu_pan_app_key: {
					isInvalid: true,
					isValid: false,
					text: '请输入百度网盘APP_KEY'
				}
			})
			return;
		}
		if (settings.baidu_pan_app_secret == '' && (!this.state.baidu_pan_app_secret.inputted)) {
			this.setState({
				baidu_pan_app_secret: {
					isInvalid: true,
					isValid: false,
					text: '请输入百度网盘APP_SECRET',
					inputted: false
				}
			})
			return;
		}
		Utils.baiduPanSettings('post', Object.assign({}, settings), response => {
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
							<Form.Group as={Col} controlId="baidu_pan_app_key" className="position-relative baidu_pan_app_key">
								<Form.Label>百度网盘APP_KEY</Form.Label>
								<Form.Control onChange={this.handleChange} onBlur={this.handleChange} value={this.state.settings.baidu_pan_app_key} isInvalid={this.state.baidu_pan_app_key.isInvalid} isValid={this.state.baidu_pan_app_key.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.baidu_pan_app_key.text}
								</Form.Control.Feedback>
							</Form.Group>

							<Form.Group as={Col} controlId="baidu_pan_app_secret" className="position-relative">
								<Form.Label>百度网盘APP_SECRET</Form.Label>
								<Form.Control onChange={this.handleChange} onBlur={this.handleChange} placeholder="为了安全，后台不返回已经输入的百度网盘APP_SECRET" value={this.state.settings.baidu_pan_app_secret} isInvalid={this.state.baidu_pan_app_secret.isInvalid} isValid={this.state.baidu_pan_app_secret.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.baidu_pan_app_secret.text}
								</Form.Control.Feedback>
							</Form.Group>
						</Form.Row>
						<div className="baidu-pan-settings-note">
							<p>配置百度网盘对接配置后，可以上传文件到百度网盘。</p>
							<p>百度网盘配置信息需要访问<a href="https://pan.baidu.com/union" target="_blank">百度网盘开放平台</a>获取。</p>
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

export default connect(mapStateToProps, null)(BaiduPan);
