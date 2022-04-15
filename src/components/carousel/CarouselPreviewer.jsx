import React from "react"
import Draggable from "react-draggable";
import {Button, Dropdown} from "react-bootstrap";
import Utils from "@utils/Utils";
import "./CarouselCaptionModal.scss";

class CarouselPreviewer extends React.Component {
	loading = "/logo192.png"

	constructor(props) {
		super(props);
		let defaultStyle = {
			top: 0,
			left: 0,
			fontFamily: '',
			fontSize: '4rem',
			fontColor: '#F8F8F8DD',
			fontAlign: 'left',
			fontShadow: '0px 0px 8px var(--main-color-transparent)',
			fontSpacing: '-1px'
		}
		let state = Object.assign({}, {
			tweenMax: null,
			isLoading: true,
			scalePercent: 1,
		}, this.props.carousel)
		state.title_style = state.title_style ? JSON.parse(state.title_style) : defaultStyle;
		state.description_style = state.description_style ? JSON.parse(state.description_style) : defaultStyle;
		this.state = state
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		return this.props.carousel == null || nextProps.carousel.uuid !== this.props.carousel.uuid;
	}

	componentDidMount() {
		this.calculateCaptionFontSize()
	}

	componentWillUnmount() {
	}

	update = (event) => {
		event.stopPropagation();
		Utils.getCarousel(this.props.carousel.id, (response) => {
			this.setState({
				update: response.data,
				showModal: true
			})
		}, (error) => {
			console.log(error)
		})
	}

	delete = (event) => {
		event.stopPropagation();
		Utils.deleteCarousel(this.props.carousel.id, (response) => {
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

	calculateCaptionFontSize = () => {
		let carouselPreview = document.getElementById('carousel-preview')
		let scalePercent = (carouselPreview.clientWidth / document.body.clientWidth).toFixed(2)
		let titleFontSize = scalePercent * 4
		let descriptionFontSize = scalePercent * 2
		let titleStyle = Object.assign({}, this.state.title_style)
		titleStyle['fontSize'] = titleFontSize + 'rem'
		let descriptionStyle = Object.assign({}, this.state.description_style)
		descriptionStyle['fontSize'] = descriptionFontSize + 'rem'
		this.setState({
			title_style: titleStyle,
			description_style: descriptionStyle
		})
	}

	handleCarouselDrag = (field, event, data) => {
		let style
		if (field === 'title') {
			style = Object.assign({}, this.state.title_style)
			style['top'] = data.y
			style['left'] = data.x
			console.log(style)
			this.setState({
				title_style: style
			})
		} else {
			style = Object.assign({}, this.state.description_style)
			style['top'] = data.y
			style['left'] = data.x
			this.setState({
				description_style: style
			})
		}
	}

	handleCarouselChange = (field, event) => {
		if (!event.target.value) {

		}
		let carousel = this.state.previewCarousel
		carousel[field] = event.target.value
		this.setState({
			previewCarousel: carousel
		})
	}

	render() {
		let effects = Utils.getCarouselEffects()
		const dropdownItems = []
		for (const effectsKey in effects) {
			dropdownItems.push(<Dropdown.Item key={effectsKey}
											  onClick={this.setEffect.bind(this, effectsKey)}>{effects[effectsKey]}</Dropdown.Item>)
		}
		let dropdownTitle = '特效'
		if (this.state.switch_type) {
			dropdownTitle = Utils.getCarouselEffects(this.state.switch_type)
		}
		return (
			<div id="carousel-preview" className="carousel-preview">
				<div className="carousel-captions">
					<Draggable
						key="carousel-caption-description"
						defaultClassName="carousel-caption-draggable"
						defaultPosition={{x: 0, y: 0}}
						position={{x: this.state.description_style.left, y: this.state.description_style.top}}
						scale={1}
						bounds="parent"
						onDrag={this.handleCarouselDrag.bind(this, 'description')}
					>
						<div>
							<div className="carousel-description"
								 style={{
									 fontFamily: this.state.description_style.fontFamily,
									 color: this.state.description_style.fontColor,
									 fontSize: this.state.description_style.fontSize,
									 textAlign: this.state.description_style.fontAlign,
									 textShadow: this.state.description_style.fontShadow,
									 letterSpacing: this.state.description_style.fontSpacing
								 }}>{this.state.description}</div>
						</div>
					</Draggable>
					<Draggable
						key="carousel-caption-title"
						defaultClassName="carousel-caption-draggable"
						defaultPosition={{x: 0, y: 0}}
						position={{x: this.state.description_style.left, y: this.state.description_style.top}}
						scale={1}
						bounds="parent"
						onDrag={this.handleCarouselDrag.bind(this, 'title')}
					>
						<div>
							<div className="carousel-title"
								 style={{
									 fontFamily: this.state.title_style.fontFamily,
									 color: this.state.title_style.fontColor,
									 fontSize: this.state.title_style.fontSize,
									 textAlign: this.state.title_style.fontAlign,
									 textShadow: this.state.title_style.fontShadow,
									 letterSpacing: this.state.title_style.fontSpacing
								 }}>{this.state.title}</div>
						</div>
					</Draggable>
				</div>
				<div key="carousel-info-box" className="carousel-info-box">
					<div className="carousel-preview-action">
						<Dropdown className="carousel-effects">
							<Dropdown.Toggle variant="primary" as={Button}
											 className="btn-main-color carousel-action-button">
								{dropdownTitle}
							</Dropdown.Toggle>
							<Dropdown.Menu>
								{dropdownItems}
							</Dropdown.Menu>
						</Dropdown>
						<Button variant="primary"
								className="btn-main-color carousel-action-button carousel-update-button"
								onClick={this.update}>编辑</Button>
						<Button variant="primary"
								className="btn-main-color carousel-action-button carousel-delete-button"
								onClick={this.delete}>删除</Button>
					</div>
				</div>
			</div>
		);
	}
}

export default CarouselPreviewer
