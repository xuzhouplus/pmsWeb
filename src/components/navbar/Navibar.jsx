import React from 'react';
import {Navbar, Nav, NavDropdown, Image} from 'react-bootstrap';
import LoginModal from '../login/LoginModal'
import logo from '../../logo.svg'

class Navibar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			show: true,
			account: {
				label: 'Account',
				placeholder: 'Please input account',
				text: 'Please input account',
				isValid: false,
				isInvalid: false,
				onChange: this.accountOnChange
			},
			password: {
				label: 'Password',
				placeholder: 'Please input password',
				text: 'Please input password',
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
			show: !this.state.show
		})
	}

	afterLoggedIn = (loginUser) => {
		console.log(loginUser);
	}

	render() {
		return (
			<Navbar>
				<LoginModal show={this.state.show} handleModal={this.handleModal} afterLoggedIn={this.afterLoggedIn} appLogo={logo} account={this.state.account} password={this.state.password}/>
				<Navbar.Brand href="#home">
					<Image src={logo} rounded className="brand-img" alt={'home'}/>
					<div className="brand-text">React-Bootstrap</div>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav"/>
				<Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
					<Nav>
						<Nav.Link href="#link">Link</Nav.Link>
						<NavDropdown title="Dropdown" id="basic-nav-dropdown">
							<NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
							<NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
							<NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
							<NavDropdown.Divider/>
							<NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
						</NavDropdown>
						<Nav.Link href="#" onClick={this.handleModal}>Login</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

export default Navibar;