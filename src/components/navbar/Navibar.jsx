import React from 'react';
import {Navbar, Nav, NavDropdown, Image} from 'react-bootstrap';
import LoginModal from '../login/LoginModal'
import logo from '../../logo.svg'
import {login, logout} from "../../redux/Actions";
import {connect} from "react-redux";
import './Navibar.scss'
import Utils from "../../utils/Utils";
import axios from "axios";

function mapStateToProps(state) {
	return {
		account: state.auth
	};
}

function mapDispatchToProps(dispatch) {
	return {
		login: (user) => {
			dispatch({
				type: login.type,
				payload: user
			})
		},
		logout: () => {
			dispatch({
				type: logout.type
			})
		}
	}
}

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
				onChange: this.accountOnChange
			},
			password: {
				label: '密码',
				placeholder: '请输入密码',
				text: '请输入密码',
				isValid: false,
				isInvalid: false,
				onChange: this.passwordOnChange
			},
		}
	}

	accountOnChange = (event) => {
		console.log(event);
	}

	passwordOnChange = (event) => {
		console.log(event);
	}

	handleModal = () => {
		console.log(this.state);
		this.setState({
			loginModal: !this.state.loginModal
		})
	}

	afterLogged = (loginUser) => {
		console.log(loginUser);
		axios.defaults.headers.common['Authorization'] = loginUser.token;
		this.setState({
			loginModal: false
		})
		this.props.login(loginUser)
	}
	logout = () => {
		const that = this;
		Utils.logout(function (response) {
			console.log(response);
			that.props.logout()
		}, function (error) {
			console.log(error);
		})
	}

	componentDidMount() {
		const that = this;
		Utils.auth(function (response) {
			console.log(response);
			that.afterLogged(response);
		}, function (error) {
			console.log(error);
		});
	}

	render() {
		console.log(this.props.account);
		let accountLink = '';
		if (this.props.account && this.props.account.uuid) {
			accountLink = <NavDropdown title={this.props.account.account} id="account-nav-dropdown">
				<NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
				<NavDropdown.Item href="#action/3.3">System</NavDropdown.Item>
				<NavDropdown.Divider/>
				<NavDropdown.Item href="#" onClick={this.logout}>登出</NavDropdown.Item>
			</NavDropdown>
		} else {
			accountLink = <Nav.Item><Nav.Link onClick={this.handleModal}>登录</Nav.Link></Nav.Item>
		}
		return (
			<Navbar>
				<LoginModal show={this.state.loginModal} handleModal={this.handleModal} afterLogged={this.afterLogged} appLogo={logo} account={this.state.account} password={this.state.password}/>
				<Navbar.Brand href="/">
					<Image src={logo} rounded className="brand-img" alt={'home'}/>
					<div className="brand-text">React-Bootstrap</div>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav"/>
				<Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
					<Nav>
						<Nav.Item>
							<Nav.Link href="#/post">稿件</Nav.Link>
						</Nav.Item>
						{accountLink}
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Navibar);