import React from 'react';
import {Nav, Navbar} from "react-bootstrap";
import {withRouter} from "react-router";
import PropTypes from "prop-types";
import './Footer.scss'

class Footer extends React.PureComponent {
	static propTypes = {
		match: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		history: PropTypes.object.isRequired
	}

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