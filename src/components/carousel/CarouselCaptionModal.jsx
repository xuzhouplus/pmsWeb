import React from "react";
import {Card, Col, Form, InputGroup, Row} from "react-bootstrap";
import "./CarouselCaptionModal.scss";

class CarouselCaptionModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            //显示文本
            displayValue: "",
            displayText: "",
            displayInvalid: false,
            displayValid: false,
            //链接地址，主文本才有
            linkValue: "",
            linkText: "",
            linkInvalid: false,
            linkValid: false,
            //x轴偏移
            leftValue: "",
            leftText: "",
            leftInvalid: false,
            leftValid: false,
            //y轴偏移
            topValue: "",
            topText: "",
            topInvalid: false,
            topValid: false,
            //字体
            fontFamilyValue: "",
            fontFamilyText: "",
            fontFamilyInvalid: false,
            fontFamilyValid: false,
            //大小
            fontSizeValue: "",
            fontSizeText: "",
            fontSizeInvalid: false,
            fontSizeValid: false,
            //颜色
            fontColorValue: "",
            fontColorText: "",
            fontColorInvalid: false,
            fontColorValid: false,
            //对齐
            fontAlignValue: "",
            fontAlignText: "",
            fontAlignInvalid: false,
            fontAlignValid: false,
            //阴影
            fontShadowValue: "",
            fontShadowText: "",
            fontShadowInvalid: false,
            fontShadowValid: false,
            //间距
            fontSpacingValue: "",
            fontSpacingText: "",
            fontSpacingInvalid: false,
            fontSpacingValid: false,
        }
    }

    onChange = (event) => {
        let field = event.target.id
        field = field.replace("input-", "")
        field = field.replace("-", "_")
        this.props.onChange(field, event.target.value)
    }

    render() {
        let cardClassName = "carousel-caption-modal"
        if (!this.props.show) {
            cardClassName += " d-none"
        }
        let cardTitle
        let linkField
        if (this.props.field === "title") {
            cardTitle = "标题样式"
            linkField = <Form.Group className="position-relative">
                <Row>
                    <Form.Label className="input-label" htmlFor="input-link" column sm={2}>链接</Form.Label>
                    <Col sm={10} className="input-field">
                        <Form.Control id="input-link" aria-describedby="description-text" type='text' size="sm"
                                      value={this.props.link}
                                      isInvalid={this.state.linkInvalid}
                                      isValid={this.state.linkValid} onChange={this.onChange}
                                      onBlur={this.onChange}/>
                    </Col>
                </Row>
                <Form.Control.Feedback type="invalid" tooltip>
                    {this.state.linkText}
                </Form.Control.Feedback>
            </Form.Group>
        } else {
            cardTitle = "描述样式"
            linkField = ""
        }
        return (
            <Card className={cardClassName}>
                <Card.Header>{cardTitle}</Card.Header>
                <Card.Body>
                    <Form className="carousel-caption-form" onSubmit={this.handleSubmit}>
                        <Form.Group className="position-relative">
                            <Row>
                                <Form.Label className="input-label" htmlFor="input-text" column sm={2}>文字</Form.Label>
                                <Col sm={10} className="input-field">
                                    <Form.Control id="input-text" aria-describedby="title-text" type='text' size="sm"
                                                  value={this.props.text} isInvalid={this.state.displayInvalid}
                                                  isValid={this.state.displayValid} onChange={this.onChange}
                                                  onBlur={this.onChange}/>
                                </Col>
                            </Row>
                            <Form.Control.Feedback type="invalid" tooltip>
                                {this.state.displayText}
                            </Form.Control.Feedback>
                        </Form.Group>
                        {linkField}
                        <Form.Group className="position-relative">
                            <Row>
                                <Form.Label className="input-label" htmlFor="input-left" column sm={2}>X</Form.Label>
                                <InputGroup as={Col} sm={10} className="input-field" size="sm">
                                    <Form.Control id="input-left" type='text'
                                                  value={this.props.style.left} isInvalid={this.state.leftInvalid}
                                                  isValid={this.state.leftValid} onChange={this.onChange}
                                                  onBlur={this.onChange}/>
                                    <InputGroup.Text>%</InputGroup.Text>
                                </InputGroup>
                            </Row>
                            <Form.Control.Feedback type="invalid" tooltip>
                                {this.state.leftText}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="position-relative">
                            <Row>
                                <Form.Label className="input-label" htmlFor="input-top" column sm={2}>Y</Form.Label>
                                <InputGroup as={Col} sm={10} className="input-field" size="sm">
                                    <Form.Control id="input-top" type='text'
                                                  value={this.props.style.top} isInvalid={this.state.topInvalid}
                                                  isValid={this.state.topValid} onChange={this.onChange}
                                                  onBlur={this.onChange}/>
                                    <InputGroup.Text>%</InputGroup.Text>
                                </InputGroup>
                            </Row>
                            <Form.Control.Feedback type="invalid" tooltip>
                                {this.state.topText}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="position-relative">
                            <Row>
                                <Form.Label className="input-label" htmlFor="input-font-family" column sm={2}>字体</Form.Label>
                                <Col sm={10} className="input-field">
                                    <Form.Control id="input-font-family" type='text' size="sm"
                                                  value={this.props.style.font_family} isInvalid={this.state.fontFamilyInvalid}
                                                  isValid={this.state.fontFamilyValid} onChange={this.onChange}
                                                  onBlur={this.onChange}/>
                                </Col>
                            </Row>
                            <Form.Control.Feedback type="invalid" tooltip>
                                {this.state.fontFamilyText}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="position-relative">
                            <Row>
                                <Form.Label className="input-label" htmlFor="input-font-size" column sm={2}>大小</Form.Label>
                                <Col sm={10} className="input-field">
                                    <Form.Control id="input-font-size" type='text' size="sm"
                                                  value={this.props.style.font_size} isInvalid={this.state.fontSizeInvalid}
                                                  isValid={this.state.fontSizeValid} onChange={this.onChange}
                                                  onBlur={this.onChange}/>
                                </Col>
                            </Row>
                            <Form.Control.Feedback type="invalid" tooltip>
                                {this.state.fontSizeText}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="position-relative">
                            <Row>
                                <Form.Label className="input-label" htmlFor="input-font-color" column sm={2}>颜色</Form.Label>
                                <Col sm={10} className="input-field">
                                    <Form.Control id="input-font-color" type="color" size="sm" value={this.props.style.font_color} isInvalid={this.state.fontColorInvalid} isValid={this.state.fontColorValid} onChange={this.onChange} onBlur={this.onChange}/>
                                </Col>
                            </Row>
                            <Form.Control.Feedback type="invalid" tooltip>
                                {this.state.fontColorText}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="position-relative">
                            <Row>
                                <Form.Label className="input-label" htmlFor="input-font-align" column sm={2}>对齐</Form.Label>
                                <Col sm={10} className="input-field">
                                    <Form.Control id="input-font-align" type='text' size="sm"
                                                  value={this.props.style.font_align} isInvalid={this.state.fontAlignInvalid}
                                                  isValid={this.state.fontAlignValid} onChange={this.onChange}
                                                  onBlur={this.onChange}/>
                                </Col>
                            </Row>
                            <Form.Control.Feedback type="invalid" tooltip>
                                {this.state.fontAlignText}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="position-relative">
                            <Row>
                                <Form.Label className="input-label" htmlFor="input-font-shadow" column sm={2}>阴影</Form.Label>
                                <Col sm={10} className="input-field">
                                    <Form.Control id="input-font-shadow" type='text' size="sm"
                                                  value={this.props.style.font_shadow} isInvalid={this.state.fontShadowInvalid}
                                                  isValid={this.state.fontShadowValid} onChange={this.onChange}
                                                  onBlur={this.onChange}/>
                                </Col>
                            </Row>
                            <Form.Control.Feedback type="invalid" tooltip>
                                {this.state.fontShadowText}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="position-relative">
                            <Row>
                                <Form.Label className="input-label" htmlFor="input-font-spacing" column sm={2}>间距</Form.Label>
                                <Col sm={10} className="input-field">
                                    <Form.Control id="input-font-spacing" type='text' size="sm"
                                                  value={this.props.style.font_spacing} isInvalid={this.state.fontSpacingInvalid}
                                                  isValid={this.state.fontSpacingValid} onChange={this.onChange}
                                                  onBlur={this.onChange}/>
                                </Col>
                            </Row>
                            <Form.Control.Feedback type="invalid" tooltip>
                                {this.state.fontSpacingText}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
        );
    }
}

export default CarouselCaptionModal;
