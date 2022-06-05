import React from 'react'
import Loading from "@components/loading/Loading";
import TweenMax from "@utils/tweenMax/tweenMax";
import "./Carousel.scss";

class Carousel extends React.Component {
    defaultTitleStyle = {
        top: 0,
        left: 0,
        font_family: '',
        font_size: '4rem',
        font_color: '#F8F8F8DD',
        font_align: 'left',
        font_shadow: '0px 0px 8px var(--main-color-transparent)',
        font_spacing: '-1px'
    }

    defaultDescriptionStyle = {
        top: 0,
        left: 0,
        font_family: '',
        font_size: '2rem',
        font_color: '#F8F8F8DD',
        font_align: 'left',
        font_shadow: '0px 0px 0.2rem var(--main-color-transparent)',
        font_spacing: '-1px'
    }

    paginatorElement = null

    containerElement = null

    timeout = null

    tweenMax = null

    carouselIndex = 0

    isAnimating = false

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        }
    }

    componentDidMount() {
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

    updateCaptionStyle = (type, style) => {
        let caption
        let defaultStyle
        if (type === 'title') {
            caption = this.tweenMax.captionElement.querySelector('.carousel-title');
            defaultStyle = this.defaultTitleStyle
        } else {
            caption = this.tweenMax.captionElement.querySelector('.carousel-description');
            defaultStyle = this.defaultDescriptionStyle
        }
        caption.style.fontFamily = style['font_family'] ? style['font_family'] : defaultStyle['font_family']
        caption.style.color = style['font_color'] ? style['font_color'] : defaultStyle['font_color']
        caption.style.fontSize = style['font_size'] ? style['font_size'] : defaultStyle['font_size']
        caption.style.textAlign = style['font_align'] ? style['font_align'] : defaultStyle['font_align']
        caption.style.textShadow = style['font_shadow'] ? style['font_shadow'] : defaultStyle['font_shadow']
        caption.style.letterSpacing = style['font_spacing'] ? style['font_spacing'] : defaultStyle['font_spacing']
        caption.style.top = (style['top'] ? style['top'] : defaultStyle['top']) + 'px'
        caption.style.left = (style['left'] ? style['left'] : defaultStyle['left']) + 'px'
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
