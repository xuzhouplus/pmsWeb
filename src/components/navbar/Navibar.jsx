import React from 'react';
import {Navbar, Nav, NavDropdown, Image} from 'react-bootstrap';
import LoginModal from '../login/LoginModal'
import logo from '../../logo.svg'

class Navibar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true
        }
    }

    handleModal = e => (
        this.setState({
            show: this.state.show ? false : true
        })
    )

    render() {
        return (
            <Navbar>
                <LoginModal show={this.state.show} handleModal={this.handleModal} account={{}} password={{}}></LoginModal>
                <Navbar.Brand href="#home">
                    <Image src={logo} rounded className="brand-img" alt={'home'}/>
                    <div className="brand-text">React-Bootstrap</div>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav>
                        <Nav.Link href="#link">Link</Nav.Link>
                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider/>
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="#" onClick={this.handleModal}>Login</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Navibar;