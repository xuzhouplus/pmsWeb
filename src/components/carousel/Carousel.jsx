import React from 'react'
import Loading from "@components/loading/Loading";
import TweenMax from "@utils/tweenMax/tweenMax";
import "./Carousel.scss";
import configs from "@/configs";

class Carousel extends React.Component {
	paginatorElement = null

	containerElement = null

	timeout = null

	tweenMax = null

	carouselIndex = 0

	isAnimating = false

	constructor(props) {
		super(props);
		this.state = {
			previewerWidth: 0,
			previewerHeight: 0,
			isLoading: true
		}
	}

	componentDidMount() {
		this.calculateFontScale();
		this.init()
	}

	componentWillUnmount() {
		this.destroy()
	}

	init = () => {
		this.containerElement = document.getElementById('carousel-container')
		this.tweenMax = new TweenMax(this.containerElement, {
			files: this.props.carousels,
			afterLoaded: () => {
				this.setState({
					isLoading: false
				})
			}
		})
		let currentCarousel = this.props.carousels[this.carouselIndex]
		this.createPaginator();
		this.tweenMax.switchFile(currentCarousel, null, false, () => {
			this.updateCaptionStyle('title', currentCarousel.title_style)
			this.updateCaptionStyle('description', currentCarousel.description_style)
			this.updatePagination(this.carouselIndex)
		}, () => {
			this.bindEvent()
			this.setTimeout()
		})
	}

	calculateFontScale = () => {
		let carouselPreview = document.getElementById('carousel-container')
		let scalePercent = (carouselPreview.clientWidth / document.body.clientWidth).toFixed(2)
		this.setState({
			fontScale: scalePercent,
			previewerWidth: carouselPreview.clientWidth,
			previewerHeight: carouselPreview.clientHeight
		})
	}

	calculateCaptionPositionLeft = (offset) => {
		if (!offset) {
			return 0;
		}
		let num = parseFloat(offset);
		let result = parseFloat((num * this.state.previewerWidth / 100).toFixed(2));
		return result + "px"
	}

	calculateCaptionPositionTop = (offset) => {
		if (!offset) {
			return 0;
		}
		let num = parseFloat(offset);
		let result = parseFloat((num * this.state.previewerHeight / 100).toFixed(2));
		return result + "px"
	}

	calculateCaptionFontSize = (fontSize) => {
		if (!fontSize) {
			return 0;
		}
		let result
		let num = parseFloat(fontSize)
		result = (num * this.state.previewerWidth / 100).toFixed(2) + "px";
		return result;
	}

	filterCaptionFontColor = (fontColor) => {
		return fontColor ? fontColor.slice(0, 7) : '';
	}

	mergeCaptionStyle = (styles, defaultStyles) => {
		let merged = {}
		for (let defaultStylesKey in defaultStyles) {
			if (styles[defaultStylesKey]) {
				merged[defaultStylesKey] = styles[defaultStylesKey]
			} else {
				merged[defaultStylesKey] = defaultStyles[defaultStylesKey]
			}
		}
		return merged;
	}

	updateCaptionStyle = (type, style) => {
		let caption
		if (type === 'title') {
			caption = this.tweenMax.captionElement.querySelector('.carousel-title');
			style = this.mergeCaptionStyle(style, configs.defaultTitleStyle);
		} else {
			caption = this.tweenMax.captionElement.querySelector('.carousel-description');
			style = this.mergeCaptionStyle(style, configs.defaultDescriptionStyle);
		}
		const titleStyleFontSize = this.calculateCaptionFontSize(style.font_size)
		const titleStyleLeft = this.calculateCaptionPositionLeft(style.left)
		const titleStyleTop = this.calculateCaptionPositionTop(style.top)
		style.font_color = this.filterCaptionFontColor(style.font_color)
		console.log(titleStyleTop)
		console.log(titleStyleLeft)
		caption.style.fontFamily = style['font_family']
		caption.style.color = style['font_color']
		caption.style.fontSize = titleStyleFontSize
		caption.style.textAlign = style['font_align']
		caption.style.textShadow = style['font_shadow']
		caption.style.letterSpacing = style['font_spacing']
		caption.style.top = titleStyleTop
		caption.style.left = titleStyleLeft
	}

	createPaginator = () => {
		let paginator = document.createElement('div')
		paginator.className = 'carousel-paginator'
		for (const index in this.props.carousels) {
			let file = this.props.carousels[index]
			let buttonElement = document.createElement('button');
			buttonElement.setAttribute('data-index', index.toString());
			buttonElement.setAttribute('data-title', file.title);
			buttonElement.setAttribute('data-url', file.url);
			buttonElement.setAttribute('data-link', file.link);
			paginator.appendChild(buttonElement);
		}
		this.paginatorElement = paginator
		this.containerElement.appendChild(paginator)
	}

	updatePagination = (index) => {
		let active = this.paginatorElement.querySelector('.active')
		if (active) {
			active.className = ''
		}
		this.paginatorElement.querySelectorAll('button')[index].className = 'active';
	}

	paginate(nextIndex) {
		if (this.carouselIndex === nextIndex) {
			return
		}
		if (this.isAnimating) {
			return
		}
		this.isAnimating = true
		this.clearTimeout()
		let reverse = this.carouselIndex > nextIndex
		this.carouselIndex = nextIndex
		let nextCarousel = this.props.carousels[nextIndex]
		this.updatePagination(nextIndex)
		this.tweenMax.switchFile(nextCarousel, null, reverse, () => {
			this.updateCaptionStyle('title', nextCarousel.title_style)
			this.updateCaptionStyle('description', nextCarousel.description_style)
		}, () => {
			this.setTimeout()
			this.isAnimating = false
		})
	}

	bindEvent = () => {
		if (this.paginatorElement) {
			let paginateButtons = Array.from(this.paginatorElement.querySelectorAll('button'));
			paginateButtons.forEach((paginateButton, index) => {
				paginateButton.addEventListener('click', this.paginate.bind(this, index));
			});
		}
	}

	unbindEvent = () => {
		if (this.paginatorElement) {
			let paginateButtons = Array.from(this.paginatorElement.querySelectorAll('button'));
			paginateButtons.forEach((paginateButton, index) => {
				paginateButton.removeEventListener('click', this.paginate.bind(this, index));
			});
		}
	}

	setTimeout() {
		this.clearTimeout()
		let currentCarousel = this.props.carousels[this.carouselIndex]
		this.timeout = setTimeout(() => {
			let nextIndex = this.carouselIndex + 1;
			if (nextIndex === this.props.carousels.length) {
				nextIndex = 0
			}
			this.carouselIndex = nextIndex
			let nextCarousel = this.props.carousels[nextIndex]
			this.updatePagination(nextIndex)
			this.tweenMax.switchFile(nextCarousel, null, false, () => {
				this.updateCaptionStyle('title', nextCarousel.title_style)
				this.updateCaptionStyle('description', nextCarousel.description_style)
			}, () => {
				this.setTimeout()
			})
		}, currentCarousel.timeout * 1000);
	}

	clearTimeout() {
		if (this.timeout) {
			clearTimeout(this.timeout)
		}
	}

	focus() {
		this.clearTimeout()
	}

	blur() {
		this.setTimeout()
	}

	destroy = () => {
		if (this.tweenMax) {
			this.tweenMax.destroy()
		}
		this.clearTimeout()
		this.unbindEvent()
		this.tweenMax = null
		this.carouselIndex = 0
		this.isAnimating = false
	}

	render() {
		let content
		if (this.state.isLoading) {
			content = <Loading/>
		} else {
			content = []
			// for (const file of this.props.carousels) {
			// 	content.push(<img key={file.uuid} className="carousel-item" src={file.url} alt={file.title}
			// 					  title={file.title}
			// 					  data-link={file.link}/>)
			// }
		}
		return (
			<div id="carousel-container" className="carousel-list">
				{content}
			</div>
		)
	}
}

export default Carousel;
