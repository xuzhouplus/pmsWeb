import React from 'react';
import {Nav, Navbar} from "react-bootstrap";
import './Footer.scss'

class MaintainFooter extends React.PureComponent {
	render() {
		return (
			<Navbar className="main-color-navbar home-page">
				<Nav className="footer-navbar justify-content-center">
					<Nav.Item>
						<Nav.Link href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer noopener">{this.props.site.icp}</Nav.Link>
					</Nav.Item>
				</Nav>
			</Navbar>
		);
	}
}

export default MaintainFooter;