import React from 'react';
import {Row, Col} from 'react-bootstrap';
import WebGlCarousel from "../../components/carousel/WebGLCarousel";
import Utils from "../../utils/Utils";
import './Home.scss';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cancelTokenSource: null,
			carousel: {
				type: 'webgl',
				files: []
			}
		}
	}

	componentDidMount() {
		if (this.state.carousel.files.length === 0) {
			let cancelTokenSource = Utils.getCarouselIndex(response => {
				if (this.state.cancelTokenSource) {
					this.setState({
						carousel: {
							files: response.data
						}
					})
				}
			}, (error) => {
				console.log(error);
			});
			this.setState({
				cancelTokenSource: cancelTokenSource
			})
		}
	}

	componentWillUnmount() {
		if (this.state.cancelTokenSource) {
			this.state.cancelTokenSource.cancel('Operation canceled by the user.');
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
						<WebGlCarousel files={this.state.carousel.files}></WebGlCarousel>
					</div>
				</Col>
			</Row>
		);
	}
}

export default Home;