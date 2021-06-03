import LoginModal from "@components/login/LoginModal";
import {Image, Nav, Navbar} from "react-bootstrap";
import React from "react";
import {LinkContainer} from 'react-router-bootstrap'
import configs from "@/configs";
import PropTypes from "prop-types";
import {withRouter} from "react-router";

class BaseNavibar extends React.Component {
	static propTypes = {
		match: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		history: PropTypes.object.isRequired
	}

	render() {
		let loginModal = '';
		if (this.props.showLogin) {
			loginModal = <LoginModal show={this.props.showLogin} handleModal={this.props.handleModal} afterLogged={this.props.afterLogin}
									 appLogo={this.props.logo} account={this.props.account} password={this.props.password}/>
		}
		const isHomePage = (document.location.pathname === '/' ? true : false)
		return (
			<Navbar className={["main-color-navbar", isHomePage ? "home-page" : ""]}>
				{loginModal}
				<Navbar.Brand href="/">
					<Image src={this.props.logo ? this.props.logo : configs.defaultLogo} rounded className="brand-img" alt={this.props.title}/>
					<div className="brand-text">{this.props.title}</div>
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
							<Nav.Link eventKey="login" onClick={this.props.handleModal}>登录</Nav.Link>
						</Nav.Item>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

export default withRouter(BaseNavibar);