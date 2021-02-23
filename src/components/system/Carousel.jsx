import React from "react";
import {Button, Card, Form} from "react-bootstrap";
import Utils from "../../utils/Utils";
import Loading from "../loading/Loading";
import Swal from "sweetalert2";
import "./Carousel.scss";

class Carousel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			settings: {},
			carousel_type: {},
			carousel_limit: {}
		}
	}

	componentDidMount() {
		this.getCarouselSettings();
	}

	getCarouselSettings = () => {
		Utils.carouselSettings('get', {}, response => {
			console.log(response);
			this.setState({
				settings: response.data
			})
		}, error => {
			console.log(error);
		})
	}
	handleChange = (event) => {
		let settings = this.state.settings;
		settings[event.target.id].value = event.target.value;
		this.setState({
			settings: settings
		})
	}

	formSubmit = () => {
		let settings = this.state.settings;
		Utils.carouselSettings('post', {
			carousel_type: settings.carousel_type.value,
			carousel_limit: settings.carousel_limit.value
		}, response => {
			console.log(response);
			Swal.fire({icon: 'success', text: '保存成功', showConfirmButton: false, timer: 3000})
		}, error => {
			console.log(error);
			Swal.fire({icon: 'error', text: '保存失败，请稍后重试', showConfirmButton: false, timer: 3000})
		})
	}

	render() {
		if (Utils.objectIsEmpty(this.state.settings)) {
			return (<Loading/>);
		} else {
			let options = JSON.parse(this.state.settings.carousel_type.options);
			let items = [];
			for (let key in options) {
				items.push(<option key={key} value={key}>{options[key]}</option>);
			}
			return (
				<Card className="carousel-settings-container">
					<Card.Body className="carousel-settings-table">
						<Form>
							<Form.Group controlId="carousel_type" className="position-relative">
								<Form.Label>轮播类型</Form.Label>
								<Form.Control as="select" onChange={this.handleChange} onBlur={this.handleChange} defaultValue={this.state.settings.carousel_type.value} isInvalid={this.state.carousel_type.isInvalid} isValid={this.state.carousel_type.isValid}>{items}</Form.Control>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.carousel_type.text}
								</Form.Control.Feedback>
							</Form.Group>
							<Form.Group controlId="carousel_limit" className="position-relative">
								<Form.Label>轮播数量限制（{this.state.settings.carousel_limit.value}）</Form.Label>
								<Form.Control type="range" custom min="1" max="8" onChange={this.handleChange} value={this.state.settings.carousel_limit.value} isInvalid={this.state.carousel_limit.isInvalid} isValid={this.state.carousel_limit.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.carousel_limit.text}
								</Form.Control.Feedback>
							</Form.Group>
						</Form>
					</Card.Body>
					<Card.Footer className="carousel-settings-footer">
						<Button variant="primary" type="submit" onClick={this.formSubmit}>保存</Button>
					</Card.Footer>
				</Card>
			);
		}
	}


}

export default Carousel;