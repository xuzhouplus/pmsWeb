import React from 'react';
import {Form, Button, Modal, Image} from 'react-bootstrap';
import Utils from '../../utils/Utils';
import {connect} from "react-redux";
import './LoginModal.scss';

function mapStateToProps(state) {
	return {
		site: state.site
	};
}

class LoginModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			validated: false,
			status: 'inputting',
			cancelTokenSource: null,
			account: Object.assign({}, {
				label: 'Account',
				placeholder: 'Please input account',
				text: 'Please input account',
				isValid: false,
				isInvalid: false,
				value: ""
			}, props.account),
			password: Object.assign({}, {
				label: 'Password',
				placeholder: 'Please input password',
				text: 'Please input password',
				isValid: false,
				isInvalid: false,
				value: ""
			}, props.password),
		};
	}

	handleSubmit = (event) => {
		event.stopPropagation();
		event.preventDefault();
		this.setState({
			status: 'logging'
		})
		let loginAccount = this.state.account;
		if (loginAccount.value === "") {
			loginAccount.text = "请输入登录账号";
			loginAccount.isInvalid = true;
			loginAccount.isValid = false;
			this.setState({
				account: loginAccount,
				status: 'inputting'
			});
			return
		}
		let loginPassword = this.state.password;
		if (loginPassword.value === "") {
			loginPassword.text = "请输入登录密码";
			loginPassword.isInvalid = true;
			loginPassword.isValid = false;
			this.setState({
				password: loginPassword,
				status: 'inputting'
			});
			return
		}
		const cancelTokenSource = Utils.login(loginAccount.value, loginPassword.value, response => {
			this.props.afterLogged(response.data);
		}, error => {
			console.log(error);
			loginAccount.text = error;
			loginAccount.isInvalid = true;
			loginAccount.isValid = false;
			this.setState({
				status: 'inputting',
				account: loginAccount,
				cancelTokenSource: null
			})
		});
		this.setState({
			cancelTokenSource: cancelTokenSource
		})
	}
	onBlur = (event) => {
		let inputValue = event.target.value ? event.target.value.trim() : "";
		switch (event.target.type) {
			case "text":
				let loginAccount = this.state.account;
				if (inputValue === "") {
					loginAccount.text = "请输入登录账号";
					loginAccount.isInvalid = true;
					loginAccount.isValid = false;
					loginAccount.value = inputValue;
				} else {
					loginAccount.text = "请输入登录账号";
					loginAccount.isInvalid = false;
					loginAccount.isValid = true;
					loginAccount.value = inputValue;
				}
				this.setState({
					account: loginAccount
				});
				break;
			case "password":
				let loginPassword = this.state.password;
				if (inputValue === "") {
					loginPassword.text = "请输入登录密码";
					loginPassword.isInvalid = true;
					loginPassword.isValid = false;
					loginPassword.value = inputValue;
				} else {
					loginPassword.text = "请输入登录密码";
					loginPassword.isInvalid = false;
					loginPassword.isValid = true;
					loginPassword.value = inputValue;
				}
				this.setState({
					password: loginPassword
				});
				break;
			default:
			//@todo nothing
		}
	}
	connect = (type) => {
		Utils.adminAuthorize({
			type: type,
			scope: 'auth_user',
			to: 'login'
		}, response => {
			console.log(response);
			window.location.href = response.data;
		}, error => {
			console.log(error);
		});
	}

	componentWillUnmount() {
		if (this.state.cancelTokenSource) {
			this.state.cancelTokenSource.cancel('Operation canceled by the user.');
		}
	}

	render() {
		console.log(this.props);
		const connectBox = this.props.site.connects.map(connect =>
			<Image key={connect} className="connect-button" alt="connect-alipay" src={process.env.PUBLIC_URL + '/connects/' + connect + '.png'} onClick={this.connect.bind(this, connect)}></Image>
		)
		return (
			<Modal className="login-container" centered show={this.props.show} onHide={this.props.handleModal}>
				<Modal.Header closeButton>
					<Image className="logo" alt="Logo" src={this.props.appLogo ? this.props.appLogo : '/logo192.png'}/>
				</Modal.Header>
				<Modal.Body>
					<Form className="login-form" id="login-modal-form" validated={this.state.validated} onSubmit={this.handleSubmit}>
						<Form.Group className="position-relative">
							<Form.Label htmlFor="input-account">{this.state.account.label}</Form.Label>
							<Form.Control id="input-account" aria-describedby="account-text" type='text' placeholder={this.state.account.placeholder} value={this.state.account.value} isInvalid={this.state.account.isInvalid} isValid={this.state.account.isValid} onChange={this.onBlur} onBlur={this.onBlur}/>
							<Form.Control.Feedback type="invalid" tooltip>
								{this.state.account.text}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="position-relative">
							<Form.Label htmlFor="input-password">{this.state.password.label}</Form.Label>
							<Form.Control id="input-password" aria-describedby="password-text" type='password' placeholder={this.state.password.placeholder} value={this.state.password.value} isInvalid={this.state.password.isInvalid} isValid={this.state.password.isValid} onChange={this.onBlur} onBlur={this.onBlur}/>
							<Form.Control.Feedback type="invalid" tooltip>
								{this.state.password.text}
							</Form.Control.Feedback>
						</Form.Group>
						<div className="form-button">
							<Button variant="primary" className={this.state.status === 'logging' ? 'logging' : ''} type="submit" onClick={this.handleSubmit}>
							</Button>
						</div>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					{connectBox}
				</Modal.Footer>
			</Modal>
		);
	}
}

export default connect(mapStateToProps, null)(LoginModal);