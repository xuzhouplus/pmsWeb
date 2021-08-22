import React from "react";
import {Button, Form, Col, Card, Row} from "react-bootstrap";
import Utils from "../../utils/Utils";
import {connect} from "react-redux";
import Swal from "sweetalert2";
import Loading from "../loading/Loading";
import "./Alipay.scss";

function mapStateToProps(state) {
	return {
		account: state.auth
	};
}

class Alipay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			settings: {
				alipay_app_id: "",
				alipay_app_primary_key: "",
				alipay_public_key: ""
			},
			alipay_app_id: {},
			alipay_app_primary_key: {},
			alipay_public_key: {},
		}
	}

	componentDidMount() {
		this.getAlipaySettings();
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		if (nextProps.account.uuid !== this.props.account.uuid) {
			this.getAlipaySettings();
		}
		return true;
	}

	getAlipaySettings = () => {
		Utils.alipaySettings('get', {}, response => {
			let inputted = false
			if (response.data.alipay_app_primary_key) {
				inputted = response.data.alipay_app_primary_key === "true"
				response.data.alipay_app_primary_key = "";
			}
			this.setState({
				alipay_app_primary_key: {
					inputted: inputted
				},
				settings: response.data
			})
		}, error => {
			console.log(error);
			this.setState({
				settings: {
					alipay_app_id: "",
					alipay_app_primary_key: "",
					alipay_public_key: ""
				},
				alipay_app_id: {},
				alipay_app_primary_key: {},
				alipay_public_key: {},
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
		if (settings.alipay_app_id === '') {
			this.setState({
				alipay_app_id: {
					isInvalid: true,
					isValid: false,
					text: '请输入支付宝应用APPID'
				}
			})
			return;
		}
		if (settings.alipay_app_primary_key === '' && (!this.state.alipay_app_primary_key.inputted)) {
			this.setState({
				alipay_app_primary_key: {
					isInvalid: true,
					isValid: false,
					text: '请输入支付宝应用私钥',
					inputted: false
				}
			})
			return;
		}
		if (settings.alipay_public_key === '') {
			this.setState({
				alipay_public_key: {
					isInvalid: true,
					isValid: false,
					text: '请输入支付宝公钥'
				}
			})
			return;
		}
		Utils.alipaySettings('post', Object.assign({}, settings), response => {
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
				<Card className="alipay-settings-container">
					<Card.Body className="alipay-settings-table">
						<Form as={Row} className="mb-3">
							<Form.Group as={Col} controlId="alipay_app_id" className="position-relative alipay_app_id mb-3">
								<Form.Label>支付宝应用APPID</Form.Label>
								<Form.Control onChange={this.handleChange} onBlur={this.handleChange} value={this.state.settings.alipay_app_id} isInvalid={this.state.alipay_app_id.isInvalid} isValid={this.state.alipay_app_id.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.alipay_app_id.text}
								</Form.Control.Feedback>
							</Form.Group>
							<Form.Group as={Col} controlId="alipay_app_primary_key" className="position-relative mb-3">
								<Form.Label>支付宝应用私钥</Form.Label>
								<Form.Control as="textarea" rows={12} onChange={this.handleChange} onBlur={this.handleChange} placeholder="为了安全，后台不返回已经输入的支付宝应用私钥" value={this.state.settings.alipay_app_primary_key} isInvalid={this.state.alipay_app_primary_key.isInvalid} isValid={this.state.alipay_app_primary_key.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.alipay_app_primary_key.text}
								</Form.Control.Feedback>
							</Form.Group>
							<Form.Group as={Col} controlId="alipay_public_key" className="position-relative mb-3">
								<Form.Label>支付宝公钥</Form.Label>
								<Form.Control as="textarea" rows={12} onChange={this.handleChange} onBlur={this.handleChange} value={this.state.settings.alipay_public_key} isInvalid={this.state.alipay_public_key.isInvalid} isValid={this.state.alipay_public_key.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.alipay_public_key.text}
								</Form.Control.Feedback>
							</Form.Group>
						</Form>
						<div className="alipay-settings-note">
							<p>配置支付宝对接配置后，可以在账号管理页面绑定支付宝账号，可以使用支付宝授权登录。</p>
							<p>支付宝配置信息需要访问<a href="https://open.alipay.com/" target="_blank" rel="noreferrer noopener">支付宝开放平台</a>获取。</p>
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

export default connect(mapStateToProps, null)(Alipay);
