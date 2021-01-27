import React from 'react';
import {Navbar, Nav, Image} from 'react-bootstrap';
import LoginModal from '../login/LoginModal'
import './Navibar.scss'

class Navibar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loginModal: false,
			account: {
				label: '账号',
				placeholder: '请输入账号',
				text: '请输入账号',
				isValid: false,
				isInvalid: false,
				value: 'admin'
			},
			password: {
				label: '密码',
				placeholder: '请输入密码',
				text: '请输入密码',
				isValid: false,
				isInvalid: false,
				value: '123456'
			},
		}
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		let thisLoginModal = this.state.loginModal;
		if (thisLoginModal !== nextProps.showLogin) {
			this.setState({
				loginModal: nextProps.showLogin
			})
			return true;
		}
		if (thisLoginModal !== nextState.loginModal) {
			return true;
		}
		return false;
	}

	handleModal = () => {
		this.setState({
			loginModal: !this.state.loginModal
		})
	}

	render() {
		console.log(this.state);
		let logo = process.env.PUBLIC_URL + '/logo192.png';
		let loginModal = '';
		if (this.state.loginModal) {
			loginModal = <LoginModal show={this.state.loginModal} handleModal={this.handleModal} afterLogged={this.props.afterLogin}
									 appLogo={logo} account={this.state.account} password={this.state.password}/>
		}
		return (
			<Navbar>
				{loginModal}
				<Navbar.Brand href="/">
					<Image src={logo} rounded className="brand-img" alt="Home"/>
					<div className="brand-text">React-Bootstrap</div>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav"/>
				<Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
					<Nav>
						<Nav.Item>
							<Nav.Link href="/">主页</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link href="/post">稿件</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link href="/about">关于</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link onClick={this.handleModal}>登录</Nav.Link>
						</Nav.Item>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

export default Navibar;