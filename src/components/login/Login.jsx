import React from 'react';
import {Form, Button, Modal} from 'react-bootstrap';
import './Login.scss'

class Login extends React.Component {
    render() {
        return (
            <Modal className="login-container" centered show={this.props.show} onHide={this.props.handleModal}>
                <Modal.Header>
                    <Modal.Title>Login modal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="login-form">
                        <Form.Group controlId={'account'}>
                            <Form.Label>Account</Form.Label>
                            <Form.Control type='text' placeholder='Please type in account'></Form.Control>
                            <Form.Text>Please type in account</Form.Text>
                        </Form.Group>
                        <Form.Group controlId={'password'}>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' placeholder='Please type in account'></Form.Control>
                            <Form.Text>Please type in password</Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.props.handleModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.props.handleModal}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default Login;