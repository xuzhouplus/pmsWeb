import React from 'react';
import {Nav, Navbar} from "react-bootstrap";
import {withRouter} from "react-router";
import './Footer.scss'

class Footer extends React.PureComponent {
	render() {
		return (
			<Navbar className="main-color-navbar">
				<Nav className="footer-navbar justify-content-center">
					<Nav.Item>
						<Nav.Link href="http://beian.miit.gov.cn/" target="_blank" rel="noreferrer noopener">{this.props.site.icp}</Nav.Link>
					</Nav.Item>
				</Nav>
			</Navbar>
		);
	}
}

export default withRouter(Footer);