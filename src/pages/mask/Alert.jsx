import React from "react";
import {connect} from "react-redux";
import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";
import Map from "@redux/Map";
import "./Alert.scss";

class Alert extends React.Component {
    onClose = () => {
        this.props.hide(null)
        this.props.toast.onClose && this.props.toast.onClose()
    }

    render() {
        let show = false
        let delay = 3000
        let autoHide = false
        let header = ''
        let text = ''
        let position = null
        let type = 'info'
        if (this.props.toast) {
            if (this.props.toast.text) {
                show = true
            }
            autoHide = this.props.toast.autoHide
            if (autoHide && this.props.toast.delay) {
                delay = this.props.toast.delay
            }
            header = this.props.toast.header
            text = this.props.toast.text
            position = this.props.toast.position
            type = this.props.toast.type
        }
        return (
            <ToastContainer position={position} delay={delay} autohide={autoHide ? 'true' : 'false'}>
                <Toast className={type} show={show} onClose={this.onClose}>
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

export default connect(Map.mapToastStateToProps, Map.mapToastDispatchToProps)(Alert)
