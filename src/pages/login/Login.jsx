import React from 'react';
import {Row, Col, Card, Form, Button} from 'react-bootstrap';
import './Login.scss'

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <Col xs={12} lg={12} className='login-container d-flex justify-content-center align-items-center'>
                <Card className={['login-box']}>
                    <Card.Body>
                        <Form className={['login-form']}>
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
                            <Form.Group className={['d-flex', 'justify-content-center']}>
                                <Button as="input" type="submit" value="Submit"/>
                            </Form.Group>
                        </Form>
                        <Row className={['justify-content-center']}>
                            <Col xs={2} lg={2}></Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        );
    }
}

export default Login;