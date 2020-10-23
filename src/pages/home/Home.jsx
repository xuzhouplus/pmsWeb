import React from 'react';
import {Row, Col, Image} from 'react-bootstrap';
import './Home.scss';
import logo from '../../logo.svg'

class Home extends React.Component {
    render() {
        return (
            <Row className="home-container">
                <Col xs={12} lg={12}>
                    <div className="home-content h-100 d-flex justify-content-center align-items-center">
                        <Image alt="" src={logo}/>
                    </div>
                </Col>
            </Row>
        );
    }
}

export default Home;