import React from "react";
import {Image, Navbar} from "react-bootstrap";
import configs from "@/configs";

class MaintainNavbar extends React.PureComponent {
	render() {
		let logo = this.props.logo ? this.props.logo : configs.defaultLogo
		let title = this.props.title ? this.props.title : configs.defaultTitle
		return (
			<Navbar className="main-color-navbar home-page">
				<Navbar.Brand href="/">
					<Image src={logo} rounded className="brand-img" alt={title}/>
					<div className="brand-text">{title}</div>
				</Navbar.Brand>
			</Navbar>
		);
	}
}

export default MaintainNavbar;