import React from 'react';
import {Nav, Navbar} from "react-bootstrap";
import configs from "@/configs";
import './Footer.scss'

class Footer extends React.PureComponent {
	render() {
		const isHomePage = (document.location.pathname === '/' ? true : false)
		return (
			<Navbar className={["main-color-navbar", isHomePage ? "home-page" : ""].join(' ')}>
				<Nav className="footer-navbar justify-content-center">
					<Nav.Item>
						<Nav.Link href="https://beian.miit.gov.cn/" target="_blank"
								  rel="noreferrer noopener">{this.props.site.icp ? this.props.site.icp : configs.defaultICP}</Nav.Link>
					</Nav.Item>
				</Nav>
			</Navbar>
		);
	}
}

export default Footer;
