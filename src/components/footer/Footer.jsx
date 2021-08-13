import React from 'react';
import {Nav, Navbar} from "react-bootstrap";
import {withRouter} from "react-router";
import './Footer.scss'

class Footer extends React.PureComponent {
	render() {
		const isHomePage = (document.location.pathname === '/' ? true : false)
		return (
			<Navbar className={["main-color-navbar", isHomePage ? "home-page" : ""]}>
				<Nav className="footer-navbar justify-content-center">
					<Nav.Item>
						<Nav.Link href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer noopener">{this.props.site.icp}</Nav.Link>
					</Nav.Item>
				</Nav>
			</Navbar>
		);
	}
}

export default withRouter(Footer);