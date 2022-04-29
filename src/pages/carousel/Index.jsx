import React from "react";
import {Button, Card, ListGroup, OverlayTrigger, Popover} from "react-bootstrap";
import TreeNavibar from "@components/navbar/TreeNavibar";
import Utils from "@utils/Utils";
import {connect} from "react-redux";
import CarouselCreateModal from "@components/carousel/CarouselCreateModal";
import {LinkContainer} from "react-router-bootstrap";
import Map from "@redux/Map";
import TweenMax from "@utils/tweenMax/tweenMax";
import './Index.scss'
import {ReactSortable} from "react-sortablejs";

class Index extends React.Component {
	loading = "/logo192.png"
	prepareTimeout = true
	effectPopoverContainerRef = null

	constructor(props) {
		super(props);
		this.state = {
			idLoading: false,
			carousels: [],
			cancelTokenSource: null,
			showModal: false,
			update: {},
			previewIndex: -1,
			tweenMax: null
		};
		this.effectPopoverContainerRef = React.createRef()
	}

	componentDidMount() {
		this.getCarouselList();
	}

	componentWillUnmount() {
		if (this.state.cancelTokenSource) {
			this.state.cancelTokenSource.cancel('Operation canceled by the user.');
		}
		this.prepareTimeout = false
		this.destroyTweenMax()
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		if (nextProps.account.uuid !== this.props.account.uuid) {
			this.getCarouselList();
		}
		return true;
	}

	getCarouselList = () => {
		if (this.state.isLoading) {
			return;
		}
		this.setState({
			idLoading: true
		})
		const cancelTokenSource = Utils.getCarouselList({}, (response) => {
			if (this.state.cancelTokenSource) {
				let previewIndex = -1
				if (response.data.list.length > 0) {
					previewIndex = 0
				}
				this.setState({
					carousels: response.data.list,
					limit: response.data.limit,
					cancelTokenSource: null,
					isLoading: false,
					previewIndex: previewIndex
				})
				this.initTweenMax()
			}
		}, error => {
			console.log(error);
			this.setState({
				carousels: [], cancelTokenSource: null, isLoading: false, preview: {}
			})
		})
		this.setState({
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
		this.getCarouselList()
		this.setState({
			update: {}
		})
	}

	preview = (index, event) => {
		event.stopPropagation();
		let carousel = this.state.carousels[index]
		if (carousel && carousel.status === 1) {
			this.refresh(carousel.id, (response) => {
				let carousels = this.state.carousels
				carousels[index] = response
				this.setState({
					carousels: carousels,
					previewIndex: index
				})
			})
		}
		let tweenMax = this.state.tweenMax
		tweenMax.switchFile(index, carousel.switch_type)
		this.setState({
			previewIndex: index
		})
	}

	refresh = (id, callback) => {
		Utils.getCarousel(id, (response) => {
			if (response.data.status === 1) {
				this.refresh(id)
			} else {
				callback(response.data)
			}
		}, (error) => {
			console.log(error)
		})
	}

	update = (index, event) => {
		event.stopPropagation();
		let carousel = this.state.carousels[index]
		Utils.getCarousel(carousel.id, (response) => {
			this.setState({
				update: response.data,
				showModal: true
			})
		}, (error) => {
			console.log(error)
		})
	}

	delete = (index, event) => {
		event.stopPropagation();
		let carousel = this.state.carousels[index]
		Utils.deleteCarousel(carousel.id, (response) => {
			this.getCarouselList();
		}, (error) => {
			console.log(error);
		})
	}

	setEffect = (effect, event) => {
		event.stopPropagation();
		let index = this.state.previewIndex
		let tweenMax = this.state.tweenMax
		tweenMax.switchFile(index, effect)
		let carousel = this.state.carousels[index]
		carousel.switch_type = effect
		Utils.updateCarousel(carousel, (response) => {
			let carousels = this.state.carousels
			carousels[index] = response.data
			this.setState({
				carousels: carousels
			})
		}, (error) => {
			console.log(error)
		})
	}

	initTweenMax = () => {
		let carouselPreview = document.getElementById('carousel-preview')
		let tweenMax = new TweenMax(carouselPreview, {
			files: this.state.carousels,
			effects: Utils.getCarouselEffectTypes(),
			paginator: false,
			events: false,
			autoPlay: false,
			width: carouselPreview.clientWidth,
			height: carouselPreview.clientHeight,
			afterLoaded: () => {
				this.setState({
					isLoading: false
				})
			}
		})
		this.setState({
			tweenMax: tweenMax
		})
	}

	destroyTweenMax = () => {
		if (this.state.tweenMax) {
			this.state.tweenMax.destroy()
		}
		this.setState({
			tweenMax: null
		})
	}

	render() {
		let boxList = this.state.carousels.map((item, index) => {
			let thumbUrl = item.thumb
			if (item.status === 1) {
				thumbUrl = this.loading
			}
			return <div key={index} className="carousel-button file-box">
				<img key={index} src={thumbUrl} alt={item.title} onClick={this.preview.bind(this, index)}></img>
			</div>
		});
		let uploadModal = '';
		if (this.state.showModal) {
			uploadModal = <CarouselCreateModal show={this.state.showModal} handleModal={this.handleModal}
											   afterSubmit={this.afterSubmit} carousel={this.state.update}/>
		}
		let addBox = '';
		if (this.state.limit > this.state.carousels.length) {
			addBox = <Card className="carousel-button file-box" onClick={this.handleModal}>+</Card>
		}
		let previewActions = ''
		if (this.state.previewIndex > -1) {
			let effects = Utils.getCarouselEffects()
			const popoverActions = []
			for (const effectsKey in effects) {
				popoverActions.push(<Button key={effectsKey} variant="light" size="sm"
											className="carousel-effect-button"
											onClick={this.setEffect.bind(this, effectsKey)}>{effects[effectsKey]}</Button>)
			}
			const popover = (<Popover id="popover-basic">
				<Popover.Body>
					{popoverActions}
				</Popover.Body>
			</Popover>)
			let preview = this.state.carousels[this.state.previewIndex]
			previewActions = <div className="carousel-info-box">
				<div className="carousel-preview-action" ref={this.effectPopoverContainerRef}>
					<OverlayTrigger container={this.effectPopoverContainerRef} placement="top" trigger={['click', 'focus']} overlay={popover}>
						<Button variant="primary"
								className="btn-main-color carousel-action-button">{Utils.getCarouselEffects(preview.switch_type)}</Button>
					</OverlayTrigger>
					<Button variant="primary" className="btn-main-color carousel-action-button carousel-update-button"
							onClick={this.update.bind(this, this.state.previewIndex)}>编辑</Button>
					<Button variant="primary" className="btn-main-color carousel-action-button carousel-delete-button"
							onClick={this.delete.bind(this, this.state.previewIndex)}>删除</Button>
				</div>
			</div>
		}
		return (<TreeNavibar>
			<Card>
				<Card.Body>
					<ListGroup as="ul">
						<LinkContainer to="/file/list">
							<ListGroup.Item action>
								文件管理
							</ListGroup.Item>
						</LinkContainer>
						<LinkContainer to="/carousel">
							<ListGroup.Item action active disabled>
								轮播管理
							</ListGroup.Item>
						</LinkContainer>
						<LinkContainer to="/post/list">
							<ListGroup.Item action>
								稿件管理
							</ListGroup.Item>
						</LinkContainer>
					</ListGroup>
				</Card.Body>
			</Card>
			<Card className="carousel-list-container">
				{uploadModal}
				<Card.Body id="file-table" className="file-table">
					<div id="carousel-preview" className="carousel-preview">
						{previewActions}
					</div>
				</Card.Body>
				<Card.Footer className="carousel-preview-list">
					<ReactSortable>{boxList}</ReactSortable>
					{addBox}
				</Card.Footer>
			</Card>
		</TreeNavibar>);
	}
}

export default connect(Map.mapStatesToProps, null)(Index);
