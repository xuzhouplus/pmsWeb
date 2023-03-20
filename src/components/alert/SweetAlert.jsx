import React from "react";
import Swal from "sweetalert2";

class SweetAlert extends React.Component {
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.toast && this.props.toast.text) {
			console.log(this.props)
			let delay = this.props.toast.delay
			let autoHide = this.props.toast.autoHide
			if (autoHide && !delay) {
				delay = 3000
			}
			let position = this.props.toast.position
			//'middle-start','middle-center','middle-end' => 'center', 'center-start', 'center-end'
			switch (position) {
				case 'middle-start':
					position = 'center-start'
					break
				case 'middle-center':
					position = 'center'
					break
				case 'middle-end':
					position = 'center-end'
					break
				default:
					position = 'top-center'
			}
			console.log(position)
			Swal.fire({template: '#sweet-alert-template', type: this.props.toast.type, text: this.props.toast.text, showConfirmButton: this.props.toast.showConfirm, timer: delay, position: position, didClose: this.props.toast.onClose}).then()
		}
	}

	render() {
		return (
			<template id="sweet-alert-template">
				<div className="sweet-alert-content">
					<swal-icon></swal-icon>
					<swal-html></swal-html>
				</div>
				<swal-button type="confirm">确认</swal-button>
			</template>
		)
	}
}

export default SweetAlert
