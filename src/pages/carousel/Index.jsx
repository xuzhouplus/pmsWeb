import React from "react";
import {Button, Card} from "react-bootstrap";
import TreeNavibar from "../../components/navbar/TreeNavibar";
import Utils from "../../utils/Utils";
import {connect} from "react-redux";
import CarouselCreateModal from "../../components/carousel/CarouselCreateModal";
import './Index.scss'

function mapStateToProps(state) {
	return {
		site: state.site
	};
}

class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			idLoading: false,
			page: 0,
			limit: 20,
			count: 0,
			like: null,
			enable: null,
			carousels: [],
			cancelTokenSource: null,
			showModal: false,
			preview: {}
		};
	}

	componentDidMount() {
		this.getCarouselList();
	}

	componentWillUnmount() {
		if (this.state.cancelTokenSource) {
			this.state.cancelTokenSource.cancel('Operation canceled by the user.');
		}
	}

	getCarouselList = () => {
		const that = this;
		if (this.state.isLoading) {
			return;
		}
		this.setState({
			idLoading: true
		})
		const cancelTokenSource = Utils.getCarouselList({}, function (response) {
			if (that.state.cancelTokenSource) {
				that.setState({
					carousels: response.data,
					cancelTokenSource: null,
					isLoading: false,
					preview: response.data[0]
				})
			}
		}, function (error) {

		})
		that.setState({
			cancelTokenSource: cancelTokenSource
		})
	}

	handleModal = () => {
		this.setState({
			showModal: !this.state.showModal
		})
	}
	afterSubmit = (carousel) => {
		this.handleModal();
		let carousels = this.state.carousels;
		carousels.splice(carousel.order, 0, carousel)
		this.setState({
			carousels: carousels,
			preview: carousel
		})
	}

	preview = (index, event) => {
		event.stopPropagation();
		this.setState({
			preview: this.state.carousels[index]
		})
	}
	delete = (deleteCarousel, event) => {
		event.stopPropagation();
		console.log(deleteCarousel);
		console.log(event);
		Utils.deleteCarousel(deleteCarousel.id, (response) => {
			this.getCarouselList();
		}, (error) => {
			console.log(error);
		})
	}

	render() {
		console.log(this.state.carousels);
		console.log(this.props.site);
		let boxList = this.state.carousels.map((item, index) =>
			<div key={index} className="carousel-button file-box">
				<img key={index} src={item.thumb} alt={item.title} onClick={this.preview.bind(this, index)}></img>
			</div>
		);
		let uploadModal = '';
		if (this.state.showModal) {
			uploadModal = <CarouselCreateModal show={this.state.showModal} handleModal={this.handleModal} afterSubmit={this.afterSubmit}/>
		}
		let previewBox = '';
		if (this.state.preview) {
			previewBox = <div className="carousel-preview" style={{backgroundImage: "url(" + this.state.preview.url + ")"}}>
				<div className="carousel-info-box">
					<div className="carousel-preview-title">{this.state.preview.title}</div>
					<div className="carousel-preview-description">{this.state.preview.description}</div>
					<Button variant="primary" className="btn-main-color carousel-delete-button" onClick={this.delete.bind(this, this.state.preview)}>删除</Button>
				</div>
			</div>
		}
		return (
			<TreeNavibar active="carousel">
				<Card className="carousel-list-container">
					{uploadModal}
					<Card.Body id="file-table" className="file-table">
						{previewBox}
					</Card.Body>
					<Card.Footer className="carousel-preview-list">
						{boxList}
						<Card className="carousel-button file-box" onClick={this.handleModal}>
							+
						</Card>
					</Card.Footer>
				</Card>
			</TreeNavibar>
		);
	}
}

export default connect(mapStateToProps, null)(Index);