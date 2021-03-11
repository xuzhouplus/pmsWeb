import React from 'react';
import {Navbar, Nav, NavDropdown, Image} from 'react-bootstrap';
import './Navibar.scss'

class AdminNavibar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			account: {}
		}
	}

	logout = () => {
		this.props.logout();
	}

	render() {
		return (
			<Navbar className="main-color-navbar">
				<Navbar.Brand href="/">
					<Image src={this.props.site.logo} rounded className="brand-img" alt="Home"/>
					<div className="brand-text">{this.props.site.title}</div>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav"/>
				<Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
					<Nav>
						<Nav.Item>
							<Nav.Link href="/">主页</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link href="/post/list">稿件</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link href="/file/list">文件</Nav.Link>
						</Nav.Item>
						<NavDropdown title={this.props.account.account} id="account-nav-dropdown">
							<NavDropdown.Item href="/profile">账号信息</NavDropdown.Item>
							<NavDropdown.Item href="/system">系统配置</NavDropdown.Item>
							<NavDropdown.Divider/>
							<NavDropdown.Item href="#" onClick={this.logout}>登出</NavDropdown.Item>
						</NavDropdown>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

export default AdminNavibar;