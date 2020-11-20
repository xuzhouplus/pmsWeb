import React from 'react';
import {Form, Button, Modal, Image} from 'react-bootstrap';
import './Login.scss';
import Utils from '../../utils/Utils';

class LoginModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            validated: false,
            status: 'inputting',
            account: Object.assign({}, {
                label: 'Account',
                placeholder: 'Please input account',
                text: 'Please input account',
                isValid: false,
                isInvalid: false,
                onChange: this.accountOnChange,
                value: ""
            }, props.account),
            password: Object.assign({}, {
                label: 'Password',
                placeholder: 'Please input password',
                text: 'Please input password',
                isValid: false,
                isInvalid: false,
                onChange: this.passwordOnChange,
                value: ""
            }, props.password),
        };
    }

    handleSubmit = () => {
        this.setState({
            status: 'logging'
        })
        let loginAccount = this.state.account;
        if (loginAccount.value == "") {
            loginAccount.text = "请输入登录账号";
            loginAccount.isInvalid = true;
            loginAccount.isValid = false;
            this.setState({
                account: loginAccount,
                status: 'inputting'
            });
            return
        }
        let loginPassword = this.state.password;
        if (loginPassword.value == "") {
            loginPassword.text = "请输入登录密码";
            loginPassword.isInvalid = true;
            loginPassword.isValid = false;
            this.setState({
                password: loginPassword,
                status: 'inputting'
            });
            return
        }
        const that = this;
        Utils.login(loginAccount.value, loginPassword.value, function (response) {
            console.log(response);
            that.props.afterLogged(response.data);
            that.setState({
                status: 'inputting'
            })
        }, function (error) {
            console.log(error);
            that.setState({
                status: 'inputting'
            })
        })

    }
    onBlur = (event) => {
        let inputValue = event.target.value ? event.target.value.trim() : "";
        switch (event.target.type) {
            case "text":
                let loginAccount = this.state.account;
                if (inputValue == "") {
                    loginAccount.text = "请输入登录账号";
                    loginAccount.isInvalid = true;
                    loginAccount.isValid = false;
                    loginAccount.value = inputValue;
                } else {
                    loginAccount.text = "请输入登录账号";
                    loginAccount.isInvalid = false;
                    loginAccount.isValid = true;
                    loginAccount.value = inputValue;
                }
                this.setState({
                    account: loginAccount
                });
                break;
            case "password":
                let loginPassword = this.state.password;
                if (inputValue == "") {
                    loginPassword.text = "请输入登录密码";
                    loginPassword.isInvalid = true;
                    loginPassword.isValid = false;
                    loginPassword.value = inputValue;
                    this.setState({
                        password: loginPassword
                    });
                } else {
                    loginPassword.text = "请输入登录密码";
                    loginPassword.isInvalid = false;
                    loginPassword.isValid = true;
                    loginPassword.value = inputValue;
                }
                this.setState({
                    password: loginPassword
                });
                break;
        }
    }
    connectToWechat = () => {
    }
    connectToQQ = () => {
    }
    connectToWeibo = () => {
    }

    render() {
        return (
            <Modal className="login-container" centered show={this.props.show} onHide={this.props.handleModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <Image src={this.props.appLogo}/>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="login-form" validated={this.state.validated} onSubmit={this.handleSubmit}>
                        <Form.Group className="position-relative">
                            <Form.Label htmlFor="input-account">{this.state.account.label}</Form.Label>
                            <Form.Control id="input-account" aria-describedby="account-text" type='text' placeholder={this.state.account.placeholder} isInvalid={this.state.account.isInvalid} isValid={this.state.account.isValid}
                                          onBlur={this.onBlur}/>
                            <Form.Control.Feedback type="invalid" tooltip>
                                {this.state.account.text}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="position-relative">
                            <Form.Label htmlFor="input-password">{this.state.password.label}</Form.Label>
                            <Form.Control id="input-password" aria-describedby="password-text" type='password' placeholder={this.state.password.placeholder} isInvalid={this.state.password.isInvalid} isValid={this.state.password.isValid}
                                          onBlur={this.onBlur}/>
                            <Form.Control.Feedback type="invalid" tooltip>
                                {this.state.password.text}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className="form-button">
                            <Button variant="primary" className={this.state.status == 'logging' ? 'logging' : ''} type="button" onClick={this.handleSubmit}>
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="connect" variant="light" size="sm" onClick={this.connectToWechat}>
                        <Image src={process.env.PUBLIC_URL + '/connects/wechat.png'}/>
                    </Button>
                    <Button className="connect" variant="light" size="sm" onClick={this.connectToQQ}>
                        <Image src={process.env.PUBLIC_URL + '/connects/qq.png'}/>
                    </Button>
                    <Button className="connect" variant="light" size="sm" onClick={this.connectToWeibo}>
                        <Image src={process.env.PUBLIC_URL + '/connects/weibo.png'}/>
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default LoginModal;