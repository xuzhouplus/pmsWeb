import React from "react"
import Draggable from "react-draggable";
import {Button, Dropdown} from "react-bootstrap";
import Utils from "@utils/Utils";
import CarouselCaptionModal from "@components/carousel/CarouselCaptionModal";
import "./CarouselPreviewer.scss";
import configs from "@/configs";

class CarouselPreviewer extends React.Component {
    loading = "/logo192.png"
    defaultTitleStyle = {
        top: 10,
        left: 10,
        font_family: '',
        font_size: '4',
        font_color: '#F8F8F8',
        font_align: 'left',
        font_shadow: '0px 0px 8px var(--main-color-transparent)',
        font_spacing: '-1px'
    }

    defaultDescriptionStyle = {
        top: 12,
        left: 10,
        font_family: '',
        font_size: '2',
        font_color: '#F8F8F8',
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
            previewerHeight: 0,
            carousel: {
                id: 0,
                title: '',
                description: '',
                link: '',
                title_style: configs.defaultTitleStyle,
                description_style: configs.defaultDescriptionStyle
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

    setEffect = (effect, event) => {
        event.stopPropagation();
        console.log(effect)
        this.props.onSwitch(effect)
    }

    calculateFontScale = () => {
        let carouselPreview = document.getElementById('carousel-preview')
        let carouselCaptionStyle = document.querySelector('.carousel-caption-style')
        let scalePercent = (carouselPreview.clientWidth / document.body.clientWidth).toFixed(2)
        this.setState({
            fontScale: scalePercent,
            previewerWidth: carouselPreview.clientWidth,
            previewerHeight: carouselPreview.clientHeight,
            captionWidth: carouselCaptionStyle.clientWidth
        })
    }

    calculateCaptionPositionLeft = (offset) => {
        if (!offset) {
            return 0;
        }
        let num = parseFloat(offset);
        return parseFloat((num * this.state.previewerWidth / 100).toFixed(2));
    }

    calculateCaptionPositionTop = (offset) => {
        if (!offset) {
            return 0;
        }
        let num = parseFloat(offset);
        return parseFloat((num * this.state.previewerHeight / 100).toFixed(2));
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

    handleCarouselDrag = (field, event, data) => {
        let carousel = this.props.carousel
        if (field === 'title') {
            let style = Object.assign({}, configs.defaultTitleStyle, carousel.title_style)
            style['top'] = (data.y / this.state.previewerHeight * 100).toFixed(2)
            style['left'] = (data.x / this.state.previewerWidth * 100).toFixed(2)
            carousel.title_style = style
        } else {
            let style = Object.assign({}, configs.defaultDescriptionStyle, carousel.description_style)
            style['top'] = (data.y / this.state.previewerHeight * 100).toFixed(2)
            style['left'] = (data.x / this.state.previewerWidth * 100).toFixed(2)
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
        if (offset > 50) {
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
            switch (this.state.styleField) {
                case "title":
                    captionStyle = Object.assign({}, titleStyle);
                    captionText = this.props.carousel.title;
                    captionLink = this.props.carousel.link;
                    captionShow = true;
                    captionLeft = this.captionStyleLeft(captionStyle.left);
                    break;
                case "description":
                    captionStyle = Object.assign({}, descriptionStyle);
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
            captionStyle = Object.assign({}, titleStyle);
        }
        const titleStyleFontSize = this.calculateCaptionFontSize(titleStyle.font_size)
        const titleStyleLeft = this.calculateCaptionPositionLeft(titleStyle.left)
        const titleStyleTop = this.calculateCaptionPositionTop(titleStyle.top)
        titleStyle.font_color = this.filterCaptionFontColor(titleStyle.font_color)
        const descriptionStyleFontSize = this.calculateCaptionFontSize(descriptionStyle.font_size)
        const descriptionStyleTop = this.calculateCaptionPositionTop(descriptionStyle.top)
        const descriptionStyleLeft = this.calculateCaptionPositionLeft(descriptionStyle.left)
        descriptionStyle.font_color = this.filterCaptionFontColor(descriptionStyle.font_color)
        return (
            <div id="carousel-preview" className="carousel-preview">
                <div className="carousel-captions">
                    <Draggable
                        key="carousel-caption-description"
                        defaultClassName="carousel-caption-draggable carousel-description"
                        // defaultPosition={{x: 0, y: 0}}
                        position={{x: descriptionStyleLeft, y: descriptionStyleTop}}
                        scale={1}
                        bounds="parent"
                        // onDrag={this.handleCarouselDrag.bind(this, 'description')}
                        onStop={this.handleCarouselDrag.bind(this, 'description')}
                    >
                        <div onClick={this.captionClick.bind(this, "description")}
                             style={{
                                 fontFamily: descriptionStyle.font_family,
                                 color: descriptionStyle.font_color,
                                 fontSize: descriptionStyleFontSize,
                                 textAlign: descriptionStyle.font_align,
                                 textShadow: descriptionStyle.font_shadow,
                                 letterSpacing: descriptionStyle.font_spacing
                             }}>
                        </div>
                    </Draggable>
                    <Draggable
                        key="carousel-caption-title"
                        defaultClassName="carousel-caption-draggable carousel-title"
                        // defaultPosition={{x: 0, y: 0}}
                        position={{x: titleStyleLeft, y: titleStyleTop}}
                        scale={1}
                        bounds="parent"
                        onStop={this.handleCarouselDrag.bind(this, 'title')}
                    >
                        <div onClick={this.captionClick.bind(this, "title")}
                             style={{
                                 fontFamily: titleStyle.font_family,
                                 color: titleStyle.font_color,
                                 fontSize: titleStyleFontSize,
                                 textAlign: titleStyle.font_align,
                                 textShadow: titleStyle.font_shadow,
                                 letterSpacing: titleStyle.font_spacing
                             }}>
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
                        <div className="carousel-actions carousel-action-button">
                            <Button variant="primary"
                                    className="btn-main-color carousel-update-button"
                                    onClick={this.updateCaptionStyle}>保存</Button>
                            <Button variant="primary"
                                    className="btn-main-color carousel-delete-button"
                                    onClick={this.props.onDelete}>删除</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CarouselPreviewer
