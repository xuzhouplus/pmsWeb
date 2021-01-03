import React from 'react';
import {Nav, Navbar, NavDropdown} from "react-bootstrap";
import './Footer.scss'

class Footer extends React.Component {
	render() {
		return (
			<Navbar className="footer-navbar">
				<Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="mr-auto">
						<Nav.Link href="#home">Home</Nav.Link>
						<Nav.Link href="#link">Link</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

export default Footer;