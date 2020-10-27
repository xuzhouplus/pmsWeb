import React from 'react';
import {Form, Button, Modal, Image} from 'react-bootstrap';
import './Login.scss'
import appLogo from '../../logo.svg';

class LoginModal extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Modal className="login-container" centered show={this.props.show} onHide={this.props.handleModal}>
				<Modal.Header>
					<Modal.Title closeButton>
						<Image src={process.env.PUBLIC_URL + '/logo192.png'}></Image>
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form className="login-form">
						<Form.Group className="error">
							<Form.Label htmlFor="input-account">Account</Form.Label>
							<Form.Control id="input-account" aria-describedby="account-text" type='text' placeholder={this.props.account.placeholder} isInvalid={this.props.account.isInvalid} isValid={this.props.account.isValid}></Form.Control>
							<Form.Text id="account-text" muted>{this.props.account.text}</Form.Text>
						</Form.Group>
						<Form.Group>
							<Form.Label htmlFor="input-password">Password</Form.Label>
							<Form.Control id="input-password" aria-describedby="password-text" type='password' placeholder={this.props.password.placeholder} isInvalid={this.props.password.isInvalid} isValid={this.props.password.isValid}></Form.Control>
							<Form.Text id="password-text" muted>{this.props.password.text}</Form.Text>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={this.props.handleModal}>
						Wechat
					</Button>
					<Button variant="secondary" onClick={this.props.handleModal}>
						QQ
					</Button>
					<Button varigant="secondary">
						Weibo
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}

export default LoginModal;