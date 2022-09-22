import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import React from "react";

const Alert = (props) => {
    let delay = props.delay
    if (props.autoHide && !delay) {
        delay = 3000
    }
    return (
        <ToastContainer position={props.position} delay={delay} autohide={props.autoHide}>
            <Toast show onClose={props.onClose}>
                <Toast.Header>
                    <img src={process.env.PUBLIC_URL + '/logo.gif'} alt="Logo"/>
                    {props.header}
                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </Toast.Header>
                <Toast.Body> {props.text}</Toast.Body>
            </Toast>
        </ToastContainer>
    )
}

export default Alert
