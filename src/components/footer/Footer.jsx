import React from 'react';
import {Nav, Navbar} from "react-bootstrap";
import './Footer.scss'

class Footer extends React.Component {
	render() {
		return (
			<Navbar>
				<Nav className="footer-navbar bg-main-color justify-content-center">
					<Nav.Item>
						<Nav.Link href="http://www.miit.gov.cn/" target="_blank" rel="noreferrer noopener">{this.props.site.icp}</Nav.Link>
					</Nav.Item>
				</Nav>
			</Navbar>
		);
	}
}

export default Footer;