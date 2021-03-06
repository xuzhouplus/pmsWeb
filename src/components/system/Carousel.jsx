import React from "react";
import {Button, Card, Form} from "react-bootstrap";
import Utils from "../../utils/Utils";
import Loading from "../loading/Loading";
import Swal from "sweetalert2";
import "./Carousel.scss";
import {connect} from "react-redux";

function mapStateToProps(state) {
	return {
		account: state.auth
	};
}

class Carousel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cancelTokenSource: null,
			settings: {},
			carousel_type: {},
			carousel_limit: {},
			carousel_interval: {}
		}
	}

	componentDidMount() {
		this.getCarouselSettings();
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		if (nextProps.account.uuid !== this.props.account.uuid) {
			this.getCarouselSettings();
		}
		return true;
	}

	componentWillUnmount() {
		if (this.state.cancelTokenSource) {
			this.state.cancelTokenSource.cancel('Operation canceled by the user.');
		}
	}

	getCarouselSettings = () => {
		const cancelTokenSource = Utils.carouselSettings('get', {}, response => {
			if (this.state.cancelTokenSource) {
				this.setState({
					settings: response.data,
					cancelTokenSource: null
				})
			}
		}, error => {
			console.log(error);
			this.setState({
				cancelTokenSource: null,
				settings: {},
				carousel_type: {},
				carousel_limit: {},
				carousel_interval: {}
			})
		})
		this.setState({
			cancelTokenSource: cancelTokenSource
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
			carousel_limit: settings.carousel_limit.value,
			carousel_interval: settings.carousel_interval.value
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
			console.log(this.state);
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
								<Form.Text muted>{this.state.settings.carousel_type.description}</Form.Text>
							</Form.Group>
							<Form.Group controlId="carousel_interval" className="position-relative">
								<Form.Label>轮播间隔时间</Form.Label>
								<Form.Control onChange={this.handleChange} onBlur={this.handleChange} defaultValue={this.state.settings.carousel_interval.value} isInvalid={this.state.carousel_interval.isInvalid} isValid={this.state.carousel_interval.isValid}></Form.Control>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.carousel_interval.text}
								</Form.Control.Feedback>
								<Form.Text muted>{this.state.settings.carousel_interval.description}</Form.Text>
							</Form.Group>
							<Form.Group controlId="carousel_limit" className="position-relative">
								<Form.Label>轮播数量限制（{this.state.settings.carousel_limit.value}）</Form.Label>
								<Form.Control type="range" custom min="3" max="8" onChange={this.handleChange} value={this.state.settings.carousel_limit.value} isInvalid={this.state.carousel_limit.isInvalid} isValid={this.state.carousel_limit.isValid}/>
								<Form.Control.Feedback type="invalid" tooltip>
									{this.state.carousel_limit.text}
								</Form.Control.Feedback>
								<Form.Text muted>{this.state.settings.carousel_limit.description}</Form.Text>
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

export default connect(mapStateToProps, null)(Carousel);