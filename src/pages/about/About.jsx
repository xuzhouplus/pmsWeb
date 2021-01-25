import React from 'react';
import Message from '../../components/about/Message';
import Dependence from '../../components/about/Dependence';
import {Col, Row} from "react-bootstrap";
import RunningMan from "../../components/about/RunningMan";
import './About.scss'

class About extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fullPageInstance: null
		};
	}

	componentDidMount() {
		let startText = document.getElementById('start-text');
		let middleSchool = document.getElementById('middle-school');
		let collegeSchool = document.getElementById('college-school');
		let sobeyCompany = document.getElementById('sobey-company');
		let cmcCompany = document.getElementById('cmc-company');
		let personalIntroduction = document.getElementById('personal-introduction');
		showStartText();

		function showStartText() {
			setTimeout(function () {
				startText.style.left = "0px";
				showMiddleSchool();
			}, 2000);
		}

		function showMiddleSchool() {
			setTimeout(function () {
				startText.style.left = "-2000px";
				middleSchool.style.left = "0px";
				showCollegeSchool();
			}, 5000);
		}

		function showCollegeSchool() {
			setTimeout(function () {
				middleSchool.style.left = "-2000px";
				collegeSchool.style.left = "0px";
				showSobeyCompany();
			}, 5000);
		}

		function showSobeyCompany() {
			setTimeout(function () {
				collegeSchool.style.left = "-2000px";
				sobeyCompany.style.left = "0px";
				showCmcCompany();
			}, 5000);
		}

		function showCmcCompany() {
			setTimeout(function () {
				sobeyCompany.style.left = "-2000px";
				cmcCompany.style.left = "0px";
				showPersonalIntroduction();
			}, 5000);
		}

		function showPersonalIntroduction() {
			setTimeout(function () {
				cmcCompany.style.left = "-2000px";
				personalIntroduction.style.left = "0px";
			}, 5000);
		}

	}

	componentWillUnmount() {
	}

	render() {
		return (
			<Row className="about-container">
				<Col xs={12} lg={12} className="about-content">
					<div className="message-dependence-box">
						<Message/>
					</div>
					<div className="running-man-box">
						<RunningMan></RunningMan>
					</div>
					<div className="dependence-box fixed-bottom">
						<Dependence/>
					</div>
				</Col>
			</Row>
		);
	}
}

export default About;