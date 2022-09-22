import react from "react"
import {connect} from "react-redux";
import {toastSlice} from "@redux/slices/ToastSlice";
import ToastContainer from "react-bootstrap/ToastContainer";
import React from "react";
import BootstrapToast from "react-bootstrap/Toast";

function mapStateToProps(state) {
    return {
        toast: state.toast,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        hide: (toast) => {
            dispatch(toastSlice.actions.hide(toast))
        },
    }
}

class Toast extends react.Component {
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
        }

        return (
            <ToastContainer position={position} delay={delay} autohide={autoHide}>
                <BootstrapToast show={show} onClose={this.onClose}>
                    <BootstrapToast.Header>
                        <img src={process.env.PUBLIC_URL + '/logo.gif'} alt="Logo"/>
                        {header}
                        <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </BootstrapToast.Header>
                    <BootstrapToast.Body>{text}</BootstrapToast.Body>
                </BootstrapToast>
            </ToastContainer>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Toast)
