import React from "react"
import Draggable from "react-draggable";
import {Button, Dropdown} from "react-bootstrap";
import Utils from "@utils/Utils";
import CarouselCaptionModal from "@components/carousel/CarouselCaptionModal";
import "./CarouselPreviewer.scss";

class CarouselPreviewer extends React.Component {
    loading = "/logo192.png"
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

    constructor(props) {
        super(props);
        this.state = {
            tweenMax: null,
            isLoading: true,
            fontScale: 1,
            styleField: 'title',
            captionWidth: 0,
            previewerWidth: 0,
            carousel: {
                id: 0,
                title: '',
                description: '',
                link: '',
                title_style: this.defaultTitleStyle,
                description_style: this.defaultDescriptionStyle
            }
        }
    }

    // shouldComponentUpdate(nextProps, nextState, nextContext) {
    //     return JSON.stringify(this.state.carousel) !== JSON.stringify(nextProps.carousel);
    // }

    componentDidMount() {
        this.calculateFontScale()
    }

    componentWillUnmount() {
    }

    update = (event) => {
        event.stopPropagation();
        this.props.update();
    }

    delete = (event) => {
        event.stopPropagation();
        this.props.delete();
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

    calculateFontScale = () => {
        let carouselPreview = document.getElementById('carousel-preview')
        let carouselCaptionStyle = document.querySelector('.carousel-caption-style')
        let scalePercent = (carouselPreview.clientWidth / document.body.clientWidth).toFixed(2)
        this.setState({
            fontScale: scalePercent,
            previewerWidth: carouselPreview.clientWidth,
            captionWidth: carouselCaptionStyle.clientWidth
        })
    }

    calculateCaptionFontSize = (fontSize) => {
        if (!fontSize) {
            return 0;
        }
        if (isNaN(fontSize)) {
            let num = parseFloat(fontSize)
            let suffix = fontSize.replace(num.toString(), "")
            return (num * this.state.fontScale).toFixed(2) + suffix;
        }
        return (fontSize * this.state.fontScale).toFixed(2)
    }

    filterCaptionFontColor = (fontColor) => {
        return fontColor ? fontColor.slice(0, 7) : '';
    }

    handleCarouselDrag = (field, event, data) => {
        let carousel = this.props.carousel
        if (field === 'title') {
            let style = Object.assign({}, this.defaultTitleStyle, carousel.title_style)
            style['top'] = (data.y / this.state.fontScale).toFixed(2)
            style['left'] = (data.x / this.state.fontScale).toFixed(2)
            carousel.title_style = style
        } else {
            let style = Object.assign({}, this.defaultDescriptionStyle, carousel.description_style)
            style['top'] = (data.y / this.state.fontScale).toFixed(2)
            style['left'] = (data.x / this.state.fontScale).toFixed(2)
            carousel.description_style = style
        }
        this.props.onChange(carousel)
    }

    captionClick = (field, event) => {
        this.setState({
            styleField: field
        })
    }

    captionStyleLeft = (offset) => {
        if (offset > (this.state.previewerWidth / 2)) {
            return 0
        }
        return this.state.previewerWidth - this.state.captionWidth
    }

    changeCaptionStyle = (field, value) => {
        let carousel = this.props.carousel
        if (this.state.styleField === "title") {
            switch (field) {
                case "text":
                    carousel['title'] = value
                    break;
                case "link":
                    carousel['link'] = value
                    break;
                default:
                    let titleStyle = carousel.title_style
                    titleStyle[field] = value
                    carousel['title_style'] = titleStyle
            }
        } else {
            switch (field) {
                case "title":
                    carousel['title'] = value
                    break;
                default:
                    let descriptionStyle = carousel.description_style
                    descriptionStyle[field] = value
                    carousel['description_style'] = descriptionStyle
            }
        }
        this.props.onChange(carousel)
    }

    updateCaptionStyle = () => {
        this.props.onSubmit()
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

    render() {
        console.log(this.props.carousel)
        let effects = Utils.getCarouselEffects()
        const dropdownItems = []
        for (const effectsKey in effects) {
            dropdownItems.push(<Dropdown.Item key={effectsKey}
                                              onClick={this.setEffect.bind(this, effectsKey)}>{effects[effectsKey]}</Dropdown.Item>)
        }
        let dropdownTitle = '特效'
        let captionStyle;
        let captionText;
        let captionLink;
        let captionShow;
        let captionLeft;
        let titleStyle;
        let descriptionStyle;
        if (this.props.carousel) {
            if (this.props.carousel.switch_type) {
                dropdownTitle = Utils.getCarouselEffects(this.props.carousel.switch_type)
            }
            titleStyle = this.mergeCaptionStyle(this.props.carousel.title_style, this.defaultTitleStyle);
            descriptionStyle = this.mergeCaptionStyle(this.props.carousel.description_style, this.defaultDescriptionStyle);
            titleStyle.font_size = this.calculateCaptionFontSize(titleStyle.font_size)
            titleStyle.top = this.calculateCaptionFontSize(titleStyle.top)
            titleStyle.left = this.calculateCaptionFontSize(titleStyle.left)
            titleStyle.font_color = this.filterCaptionFontColor(titleStyle.font_color)
            descriptionStyle.font_size = this.calculateCaptionFontSize(descriptionStyle.font_size)
            descriptionStyle.top = this.calculateCaptionFontSize(descriptionStyle.top)
            descriptionStyle.left = this.calculateCaptionFontSize(descriptionStyle.left)
            descriptionStyle.font_color = this.filterCaptionFontColor(descriptionStyle.font_color)
            switch (this.state.styleField) {
                case "title":
                    captionStyle = titleStyle;
                    captionText = this.props.carousel.title;
                    captionLink = this.props.carousel.link;
                    captionShow = true;
                    captionLeft = this.captionStyleLeft(captionStyle.left);
                    break;
                case "description":
                    captionStyle = descriptionStyle;
                    captionText = this.props.carousel.description;
                    captionLink = ""
                    captionShow = true;
                    captionLeft = this.captionStyleLeft(captionStyle.left);
                    break;
                default:
                    captionStyle = this.defaultTitleStyle;
                    captionLink = ""
                    captionText = "";
                    captionShow = false;
                    captionLeft = 0;
            }
        } else {
            captionLink = ""
            captionText = "";
            captionShow = false;
            captionLeft = 0;
            titleStyle = this.defaultTitleStyle
            descriptionStyle = this.defaultDescriptionStyle
            titleStyle.font_size = this.calculateCaptionFontSize(titleStyle.font_size)
            titleStyle.top = this.calculateCaptionFontSize(titleStyle.top)
            titleStyle.left = this.calculateCaptionFontSize(titleStyle.left)
            titleStyle.font_color = this.filterCaptionFontColor(titleStyle.font_color)
            descriptionStyle.font_size = this.calculateCaptionFontSize(descriptionStyle.font_size)
            descriptionStyle.top = this.calculateCaptionFontSize(descriptionStyle.top)
            descriptionStyle.left = this.calculateCaptionFontSize(descriptionStyle.left)
            descriptionStyle.font_color = this.filterCaptionFontColor(descriptionStyle.font_color)
            captionStyle = titleStyle;
        }

        return (
            <div id="carousel-preview" className="carousel-preview">
                <div className="carousel-captions">
                    <Draggable
                        key="carousel-caption-description"
                        defaultClassName="carousel-caption-draggable"
                        // defaultPosition={{x: 0, y: 0}}
                        position={{x: descriptionStyle.left, y: descriptionStyle.top}}
                        scale={1}
                        bounds="parent"
                        // onDrag={this.handleCarouselDrag.bind(this, 'description')}
                        onStop={this.handleCarouselDrag.bind(this, 'description')}
                    >
                        <div>
                            <div className="carousel-description" onClick={this.captionClick.bind(this, "description")}
                                 style={{
                                     fontFamily: descriptionStyle.font_family,
                                     color: descriptionStyle.font_color,
                                     fontSize: descriptionStyle.font_size,
                                     textAlign: descriptionStyle.font_align,
                                     textShadow: descriptionStyle.font_shadow,
                                     letterSpacing: descriptionStyle.font_spacing
                                 }}></div>
                        </div>
                    </Draggable>
                    <Draggable
                        key="carousel-caption-title"
                        defaultClassName="carousel-caption-draggable"
                        // defaultPosition={{x: 0, y: 0}}
                        position={{x: titleStyle.left, y: titleStyle.top}}
                        scale={1}
                        bounds="parent"
                        onStop={this.handleCarouselDrag.bind(this, 'title')}
                    >
                        <div>
                            <div className="carousel-title" onClick={this.captionClick.bind(this, "title")}
                                 style={{
                                     fontFamily: titleStyle.font_family,
                                     color: titleStyle.font_color,
                                     fontSize: titleStyle.font_size,
                                     textAlign: titleStyle.font_align,
                                     textShadow: titleStyle.font_shadow,
                                     letterSpacing: titleStyle.font_spacing
                                 }}></div>
                        </div>
                    </Draggable>
                </div>
                <Draggable
                    key="carousel-caption-style"
                    defaultClassName="carousel-caption-draggable carousel-caption-style"
                    position={{x: captionLeft, y: 0}}
                    scale={1}
                    bounds="parent"
                    handle=".card-header"
                >
                    <div>
                        <CarouselCaptionModal field={this.state.styleField} show={captionShow} text={captionText} link={captionLink} style={captionStyle} onChange={this.changeCaptionStyle}></CarouselCaptionModal>
                    </div>
                </Draggable>
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
                                onClick={this.updateCaptionStyle}>保存</Button>
                        {/*<Button variant="primary"*/}
                        {/*        className="btn-main-color carousel-action-button carousel-update-button"*/}
                        {/*         onClick={this.update}>编辑</Button>*/}
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
