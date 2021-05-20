import React from 'react';
import fullpage from 'fullpage.js';
import {Col, Row} from "react-bootstrap";
import Configs from "@/configs";
import Message from "@components/about/Message";
import Dependence from "@components/about/Dependence";
import './About.scss'

class About extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fullPageInstance: null,
			wallpaper: ''
		};
	}

	componentDidMount() {
		const fullPageInstance = new fullpage('#fullpage', {
			licenseKey: Configs.fullpageLicenseKey,
			navigation: true,
		});
		this.setState({
			'fullPageInstance': fullPageInstance
		});
	}

	componentWillUnmount() {
		if (this.state.fullPageInstance) {
			this.state.fullPageInstance.destroy(true);
		}
	}

	render() {
		let style = {};
		if (this.state.wallpaper) {
			style = {
				'backgroundImg': 'url("' + this.state.wallpaper + '")'
			}
		}
		return (
			<Row className="about-container" style={style}>
				<Col xs={12} lg={12} className="about-content">
					<div className="container-fluid justify-content-center about" id="fullpage">
						<div className="section message-dependence">
							<Message/>
							<Dependence/>
						</div>
					</div>
				</Col>
			</Row>
		);
	}
}

export default About;