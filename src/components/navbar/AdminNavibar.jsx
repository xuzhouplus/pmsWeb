import React from 'react';
import {Navbar, Nav, NavDropdown, Image} from 'react-bootstrap';
import './Navibar.scss'
import {LinkContainer} from "react-router-bootstrap";
import configs from "@/configs";

class AdminNavibar extends React.Component {
	render() {
		return (
			<Navbar className="main-color-navbar">
				<Navbar.Brand href="/">
					<Image src={this.props.logo ? this.props.logo : configs.defaultLogo} rounded className="brand-img" alt={this.props.title}/>
					<div className="brand-text">{this.props.title}</div>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav"/>
				<Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
					<Nav>
						<Nav.Item>
							<LinkContainer to="/" exact>
								<Nav.Link eventKey="admin-home">主页</Nav.Link>
							</LinkContainer>
						</Nav.Item>
						<Nav.Item>
							<LinkContainer to="/post/list">
								<Nav.Link eventKey="admin-post">稿件</Nav.Link>
							</LinkContainer>
						</Nav.Item>
						<Nav.Item>
							<LinkContainer to="/file/list">
								<Nav.Link eventKey="admin-file">文件</Nav.Link>
							</LinkContainer>
						</Nav.Item>
						<NavDropdown title={this.props.account} id="account-nav-dropdown">
							<LinkContainer to="/profile/index">
								<NavDropdown.Item eventKey="admin-profile">账号信息</NavDropdown.Item>
							</LinkContainer>
							<LinkContainer to="/system">
								<NavDropdown.Item eventKey="admin-system">系统配置</NavDropdown.Item>
							</LinkContainer>
							<NavDropdown.Divider/>
							<NavDropdown.Item eventKey="admin-logout" href="#" onClick={this.props.logout}>登出</NavDropdown.Item>
						</NavDropdown>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

export default AdminNavibar;