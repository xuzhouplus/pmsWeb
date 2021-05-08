import React from "react";
import {Image, Navbar} from "react-bootstrap";
import configs from "@/configs";

class MaintainNavbar extends React.PureComponent{
	render() {
		return (
			<Navbar className="main-color-navbar">
				<Navbar.Brand href="/">
					<Image src={configs.defaultLogo} rounded className="brand-img" alt={configs.defaultTitle}/>
					<div className="brand-text">{configs.defaultTitle}</div>
				</Navbar.Brand>
			</Navbar>
		);
	}
}

export default MaintainNavbar;