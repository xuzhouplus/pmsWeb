import React from 'react';
import {Row, Col} from 'react-bootstrap';
import WebGlCarousel from "../../components/carousel/WebGLCarousel";
import BootstrapCarousel from "../../components/carousel/BootstrapCarousel";
import Utils from "../../utils/Utils";
import {connect} from "react-redux";
import './Home.scss';

function mapStateToProps(state) {
	return {
		site: state.site
	};
}

class Home extends React.PureComponent {
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
		let content;
		if (this.state.carousel.files.length === 0) {
			content = <div className="home-content h-100 d-flex justify-content-center align-items-center"><img src={process.env.PUBLIC_URL + '/logo192.png'} alt='Logo'/></div>
		}else {
			switch (this.props.site.carousel_type) {
				case 'webgl':
					content = <WebGlCarousel files={this.state.carousel.files} interval={this.props.site.carousel_interval}/>
					break;
				case 'bootstrap':
					content = <BootstrapCarousel files={this.state.carousel.files} interval={this.props.site.carousel_interval}/>
					break;
				default:
					content = <WebGlCarousel files={this.state.carousel.files} interval={this.props.site.carousel_interval}/>
			}
		}
		return (
			<Row className="home-container">
				<Col xs={12} lg={12}>
					<div className="home-content h-100 d-flex justify-content-center align-items-center">
						{content}
					</div>
				</Col>
			</Row>
		)
	}
}

export default connect(mapStateToProps, null)(Home);