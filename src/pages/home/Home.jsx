import React from 'react';
import {Row, Col} from 'react-bootstrap';
import WebGlCarousel from "../../components/carousel/WebGLCarousel";
import BootstrapCarousel from "../../components/carousel/BootstrapCarousel";
import Utils from "../../utils/Utils";
import Loading from "@components/loading/Loading";
import {connect} from "react-redux";
import Map from "@redux/Map"
import './Home.scss';

class Home extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			cancelTokenSource: null,
			isLoading: false,
			carousel: {
				type: 'webgl',
				files: []
			}
		}
	}

	componentDidMount() {
		if (this.state.carousel.files.length === 0) {
			this.setState({
				isLoading: true
			})
			let cancelTokenSource = Utils.getCarouselIndex(response => {
				if (this.state.cancelTokenSource) {
					this.setState({
						isLoading: false,
						carousel: {
							files: response.data
						}
					})
				}
			}, (error) => {
				this.setState({
					isLoading: false
				})
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
		if (this.state.isLoading) {
			content = <Loading/>
		} else {
			if (this.state.carousel.files.length === 0) {
				content = <div className="home-content h-100 d-flex justify-content-center align-items-center"><img src={process.env.PUBLIC_URL + '/logo192.png'} alt='Logo'/></div>
			} else {
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

export default connect(Map.mapSiteStateToProps)(Home);