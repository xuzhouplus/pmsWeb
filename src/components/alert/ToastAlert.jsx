import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import React from "react";
import "./ToastAlert.scss";

class ToastAlert extends React.Component {
	render() {
		let show = false
		let delay = 0
		let autoHide = false
		let header = ''
		let text = ''
		let position = null
		let type = 'info'
		if (this.props.toast) {
			if (this.props.toast.text) {
				show = true
			}
			delay = this.props.toast.delay
			if (delay > 0) {
				autoHide = true
			} else {
				autoHide = this.props.toast.autoHide
				if (autoHide) {
					delay = 3000
				}
			}
			header = this.props.toast.header
			text = this.props.toast.text
			position = this.props.toast.position
			type = this.props.toast.type
		}
		//'success','danger','warning','info','light' => warning, error, success, info, question
		switch (type) {
			case 'error':
				type = 'danger'
				break
			case 'info':
				type = 'light'
				break
			case 'question':
				type = 'Secondary'
				break
			case 'success':
				type = 'success'
				break
			case 'warning':
				type = 'warning'
				break
			default:
				type = 'light'
		}
		return (
			<ToastContainer position={position}>
				<Toast className={type} show={show} delay={delay} autohide={autoHide ? 'true' : 'false'} onClose={this.props.toast.onClose}>
					<Toast.Header>
						<img src={process.env.PUBLIC_URL + '/logo.svg'} alt="Logo"/>
						{header}
					</Toast.Header>
					<Toast.Body>{text}</Toast.Body>
				</Toast>
			</ToastContainer>
		)
	}
}

export default ToastAlert
