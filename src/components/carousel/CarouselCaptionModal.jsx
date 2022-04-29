import React from "react";
import {Button, Form, InputGroup, Modal} from "react-bootstrap";

class CarouselCaptionModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			//显示文本
			displayText: "",
			displayInvalid: false,
			displayValid: false,
			//链接地址，主文本才有
			linkText: "",
			linkInvalid: false,
			linkValid: false,
			//字体
			fontFamilyText: "",
			fontFamilyInvalid: false,
			fontFamilyValid: false,
			//大小
			fontSizeText: "4rem",
			fontSizeInvalid: false,
			fontSizeValid: false,
			//颜色
			fontColorText: "#F8F8F8DD",
			fontColorInvalid: false,
			fontColorValid: false,
			//对齐
			fontAlignText: "left",
			fontAlignInvalid: false,
			fontAlignValid: false,
			//阴影
			fontShadowText: "0px 0px 8px var(--main-color-transparent)",
			fontShadowInvalid: false,
			fontShadowValid: false,
			//间距
			fontSpacingText: "-1px",
			fontSpacingInvalid: false,
			fontSpacingValid: false,
		}
	}

	handleSubmit = () => {
	}

	render() {
		return (
			<Modal className="carousel-caption-modal" centered show={this.props.show} onHide={this.props.handleModal}>
				<Modal.Body>
					<Form className="carousel-caption-form" onSubmit={this.handleSubmit}>
						<Form.Group className="position-relative mb-3">
							<Form.Label htmlFor="input-title">文字</Form.Label>
							<Form.Control id="input-title" aria-describedby="title-text" type='text'
										  value={this.state.title.value} isInvalid={this.state.title.isInvalid}
										  isValid={this.state.title.isValid} onChange={this.onChange}
										  onBlur={this.onChange}/>
							<Form.Control.Feedback type="invalid" tooltip>
								{this.state.title.text}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="position-relative mb-3">
							<Form.Label htmlFor="input-description">链接</Form.Label>
							<Form.Control id="input-description" aria-describedby="description-text" type='text'
										  value={this.state.description.value}
										  isInvalid={this.state.description.isInvalid}
										  isValid={this.state.description.isValid} onChange={this.onChange}
										  onBlur={this.onChange}/>
							<Form.Control.Feedback type="invalid" tooltip>
								{this.state.description.text}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="position-relative mb-3">
							<Form.Label htmlFor="input-link">字体</Form.Label>
							<InputGroup className="mb-3">
								<Form.Control id="input-link" aria-describedby="link-text" type='text'
											  value={this.state.link.value} isInvalid={this.state.link.isInvalid}
											  isValid={this.state.link.isValid} onChange={this.onChange}
											  onBlur={this.onChange}/>
								<Button id="link-button" variant="outline-secondary"
										onClick={this.handlePostModal}></Button>
							</InputGroup>
							<Form.Control.Feedback type="invalid" tooltip>
								{this.state.link.text}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="position-relative mb-3">
							<Form.Label htmlFor="input-timeout">大小</Form.Label>
							<InputGroup className="mb-3">
								<Form.Control id="input-timeout" aria-describedby="timeout-text" type='number'
											  aria-valuemin="3" min='3' aria-valuemax="10" max="10"
											  value={this.state.timeout.value} isInvalid={this.state.timeout.isInvalid}
											  isValid={this.state.timeout.isValid} onChange={this.onChange}
											  onBlur={this.onChange}/>
								<InputGroup.Text id="input-timeout-addon">秒</InputGroup.Text>
							</InputGroup>
							<Form.Control.Feedback type="invalid" tooltip>
								{this.state.timeout.text}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="position-relative mb-3">
							<Form.Label htmlFor="input-switch-type">颜色</Form.Label>
							<Form.Select id="input-switch-type" aria-label="switch-type-text"
										 value={this.state.switchType.value} isInvalid={this.state.switchType.isInvalid}
										 isValid={this.state.switchType.isValid} onChange={this.onChange}
										 onBlur={this.onChange}>
							</Form.Select>
							<Form.Control.Feedback type="invalid" tooltip>
								{this.state.switchType.text}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="position-relative mb-3">
							<Form.Label htmlFor="input-order">对齐</Form.Label>
							<Form.Control id="input-order" aria-describedby="order-text" type='number'
										  value={this.state.order.value} isInvalid={this.state.order.isInvalid}
										  isValid={this.state.order.isValid} onChange={this.onChange}
										  onBlur={this.onChange}/>
							<Form.Control.Feedback type="invalid" tooltip>
								{this.state.order.text}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="position-relative mb-3">
							<Form.Label htmlFor="input-order">阴影</Form.Label>
							<Form.Control id="input-order" aria-describedby="order-text" type='number'
										  value={this.state.order.value} isInvalid={this.state.order.isInvalid}
										  isValid={this.state.order.isValid} onChange={this.onChange}
										  onBlur={this.onChange}/>
							<Form.Control.Feedback type="invalid" tooltip>
								{this.state.order.text}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="position-relative mb-3">
							<Form.Label htmlFor="input-order">间距</Form.Label>
							<Form.Control id="input-order" aria-describedby="order-text" type='number'
										  value={this.state.order.value} isInvalid={this.state.order.isInvalid}
										  isValid={this.state.order.isValid} onChange={this.onChange}
										  onBlur={this.onChange}/>
							<Form.Control.Feedback type="invalid" tooltip>
								{this.state.order.text}
							</Form.Control.Feedback>
						</Form.Group>
						<div className="form-button mb-3">
							<Button variant="primary" className={this.state.status === 'uploading' ? 'uploading' : ''}
									type="button" onClick={this.handleSubmit}>
							</Button>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
		);
	}
}

export default CarouselCaptionModal;
