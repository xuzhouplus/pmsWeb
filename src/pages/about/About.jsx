import React from 'react';
import Message from "@components/about/Message";
import Dependence from "@components/about/Dependence";
import './About.scss'

class About extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fullPageInstance: null,
		};
	}

	componentDidMount() {
		// const fullPageInstance = new fullpage('#fullpage', {
		// 	licenseKey: Configs.fullpageLicenseKey,
		// 	navigation: true,
		// });
		// this.setState({
		// 	'fullPageInstance': fullPageInstance
		// });
	}

	componentWillUnmount() {
		if (this.state.fullPageInstance) {
			this.state.fullPageInstance.destroy(true);
		}
	}

	render() {
		return (
			<div className="about-container container-fluid justify-content-center about">
				<Message/>
				<Dependence/>
			</div>
		);
	}
}

export default About;
