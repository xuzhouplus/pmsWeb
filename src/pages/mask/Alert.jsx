import React from "react";
import {connect} from "react-redux";
import Map from "@redux/Map";
import SweetAlert from "@components/alert/SweetAlert";

class Alert extends React.Component {
	onClose = () => {
		this.props.hide(null)
		this.props.toast.onClose && this.props.toast.onClose()
	}

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
		return (
			<SweetAlert toast={{
				type: type,
				autoHide: autoHide,
				show: show,
				delay: delay,
				header: header,
				text: text,
				position: position,
				onClose: this.onClose
			}}></SweetAlert>
		)
	}
}

export default connect(Map.mapToastStateToProps, Map.mapToastDispatchToProps)(Alert)
