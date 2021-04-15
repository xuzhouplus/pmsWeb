import React from 'react';
import {Navbar, Nav, Image} from 'react-bootstrap';
import LoginModal from '../login/LoginModal'
import {LinkContainer} from 'react-router-bootstrap'
import './Navibar.scss'

class Navibar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			account: {
				label: '账号',
				placeholder: '请输入账号',
				text: '请输入账号',
				isValid: false,
				isInvalid: false,
				value: ''
			},
			password: {
				label: '密码',
				placeholder: '请输入密码',
				text: '请输入密码',
				isValid: false,
				isInvalid: false,
				value: ''
			},
		}
	}

	render() {
		let loginModal = '';
		if (this.props.showLogin) {
			loginModal = <LoginModal show={this.props.showLogin} handleModal={this.props.handleModal} afterLogged={this.props.afterLogin}
									 appLogo={this.props.site.logo} account={this.state.account} password={this.state.password}/>
		}
		return (
			<Navbar className="main-color-navbar">
				{loginModal}
				<Navbar.Brand href="/">
					<Image src={this.props.site.logo ? this.props.site.logo : '/logo192.png'} rounded className="brand-img" alt={this.props.site.title}/>
					<div className="brand-text">{this.props.site.title}</div>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav"/>
				<Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
					<Nav>
						<Nav.Item>
							<LinkContainer to="/" exact>
								<Nav.Link eventKey="home">主页</Nav.Link>
							</LinkContainer>
						</Nav.Item>
						<Nav.Item>
							<LinkContainer to="/post">
								<Nav.Link eventKey="post">稿件</Nav.Link>
							</LinkContainer>
						</Nav.Item>
						<Nav.Item>
							<LinkContainer to="/about">
								<Nav.Link eventKey="about">关于</Nav.Link>
							</LinkContainer>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link eventKey="login" onClick={this.handleModal}>登录</Nav.Link>
						</Nav.Item>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

export default Navibar;