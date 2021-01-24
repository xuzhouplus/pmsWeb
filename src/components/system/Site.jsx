import React from "react";
import Utils from "../../utils/Utils";
import Swal from "sweetalert2";
import {Button, Card, Col, Form} from "react-bootstrap";
import "./Site.scss";
import Loading from "../loading/Loading";

class Site extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			settings: []
		}
	}

	componentDidMount() {
		this.getSiteSettings();
	}

	getSiteSettings = () => {
		Utils.siteSettings('get', {}, response => {
			console.log(response);
			this.setState({
				settings: response.data
			})
		}, error => {
			console.log(error);
		})
	}

	handleChange = (event) => {
		let state = this.state;
		let label = event.target.previousSibling.innerText
		state.settings[event.target.id].value = event.target.value ? event.target.value.trim() : "";
		let text = "";
		let isInvalid = false;
		let isValid = false;
		if (state.settings[event.target.id].value == '') {
			text = '请输入' + label;
			isInvalid = true;
		} else {
			isValid = true;
		}
		state[event.target.id] = {
			text: text,
			isInvalid: isInvalid,
			isValid: isValid,
		};
		this.setState(state)
	}

	formSubmit = () => {
		let settings = this.state.settings;
		let data = {};
		for (let key in settings) {
			let setting = settings[key];
			console.log(setting);
			if (setting.value == '') {
				let state = {
					key: {
						text: '请输入' + setting.name,
						isInvalid: true,
						isValid: false,
					}
				}
				this.setState(state);
				return;
			}
			data[key] = setting.value
		}
		Utils.siteSettings('post', data, response => {
			console.log(response);
			Swal.fire({icon: 'success', text: '保存成功', showConfirmButton: false, timer: 3000})
		}, error => {
			console.log(error);
			Swal.fire({icon: 'success', text: '保存失败，请稍后重试', showConfirmButton: false, timer: 3000})
		})
	}

	render() {
		if (Utils.objectIsEmpty(this.state.settings)) {
			return (<Loading/>);
		} else {
			let formContent = [];
			for (let key in this.state.settings) {
				let setting = this.state.settings[key];
				let control = null;
				let options;
				let items = [];
				switch (setting.type) {
					case 'input':
						control = <Form.Control onChange={this.handleChange} onBlur={this.handleChange} value={setting.value} isInvalid={this.state[setting.key] ? this.state[setting.key].isInvalid : false} isValid={this.state[setting.key] ? this.state[setting.key].isValid : false}/>
						break;
					case 'textarea':
						control = <Form.Control as="textarea" onChange={this.handleChange} onBlur={this.handleChange} value={setting.value} isInvalid={this.state[setting.key] ? this.state[setting.key].isInvalid : false} isValid={this.state[setting.key] ? this.state[setting.key].isValid : false}/>
						break;
					case 'select':
						options = JSON.parse(setting.options);
						for (let key in options) {
							items.push(<option key={key} selected={setting.value == key}>{options[key]}</option>);
						}
						control = <Form.Control as="select" onChange={this.handleChange} onBlur={this.handleChange} value={setting.value} isInvalid={this.state[setting.key] ? this.state[setting.key].isInvalid : false} isValid={this.state[setting.key] ? this.state[setting.key].isValid : false}>{items}</Form.Control>
						break;
					case 'multiSelect':
						options = JSON.parse(setting.options);
						for (let key in options) {
							items.push(<option key={key} selected={setting.value == key}>{options[key]}</option>);
						}
						control = <Form.Control as="select" multiple onChange={this.handleChange} onBlur={this.handleChange} value={setting.value} isInvalid={this.state[setting.key] ? this.state[setting.key].isInvalid : false} isValid={this.state[setting.key] ? this.state[setting.key].isValid : false}>{items}</Form.Control>
						break;
					case 'checkbox':
						options = JSON.parse(setting.options);
						for (let key in options) {
							items.push(<Form.Check inline key={key} label={options[key]} type="checkbox" id={key} checked={setting.value == key}/>);
						}
						control = <div>{items}</div>
						break;
					case 'radio':
						options = JSON.parse(setting.options);
						for (let key in options) {
							items.push(<Form.Check inline key={key} label={options[key]} type="radio" id={key} checked={setting.value == key}/>);
						}
						control = <div>{items}</div>
						break;
				}
				formContent.push(<Form.Group key={setting.key} controlId={setting.key} className="position-relative">
					<Form.Label>{setting.name}</Form.Label>
					{control}
					<Form.Control.Feedback type="invalid" tooltip>
						{this.state[setting.key] ? this.state[setting.key].text : ''}
					</Form.Control.Feedback>
				</Form.Group>);
			}

			return (
				<Card className="site-settings-container">
					<Card.Body className="site-settings-table">
						<Form noValidate >
							{formContent}
						</Form>
					</Card.Body>
					<Card.Footer className="site-settings-footer">
						<Button variant="primary" type="submit" onClick={this.formSubmit}>保存</Button>
					</Card.Footer>
				</Card>
			);
		}
	}
}

export default Site;