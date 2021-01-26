import React from 'react';
import {Row, Col} from 'react-bootstrap';
import WebGlCarousel from "../../components/carousel/WebGLCarousel";
import Utils from "../../utils/Utils";
import './Home.scss';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			carousel: {
				type: 'webgl',
				files: []
			}
		}
	}

	componentDidMount() {
		if (this.state.carousel.files.length === 0) {
			Utils.carousel(function (response) {
				console.log(response);
			});
		}
	}


	render() {
		if (this.state.carousel.files.length === 0) {
			return (
				<Row className="home-container">
					<Col xs={12} lg={12}>
						<div className="home-content h-100 d-flex justify-content-center align-items-center">
							<img src={process.env.PUBLIC_URL + '/logo192.png'} alt='Logo'/>
						</div>
					</Col>
				</Row>
			);
		}
		return (
			<Row className="home-container">
				<Col xs={12} lg={12}>
					<div className="home-content h-100 d-flex justify-content-center align-items-center">
						<WebGlCarousel></WebGlCarousel>
					</div>
				</Col>
			</Row>
		);
	}
}

export default Home;