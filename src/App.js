import React, {lazy, Suspense} from 'react'
import './App.scss'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {Container, Row, Col} from 'react-bootstrap'
import Loading from './components/loading/Loading';
import Navibar from "./components/navbar/Navibar";
import Footer from "./components/footer/Footer";

function App() {
    const Home = lazy(() => import('./pages/home/Home'))
    const NotFound = lazy(() => import('./pages/NotFound'))
    return (
        <Container fluid className="app-container">
            <Row className="app-header">
                <Col xs={12} lg={12}>
                    <Navibar/>
                </Col>
            </Row>
            <Row className="app-body">
                <Col xs={12} lg={12}>
                    <Router>
                        <Suspense fallback={<Loading/>}>
                            <Switch>
                                <Route path="/" exact component={Home}/>
                                <Route path="*" component={NotFound}/>
                            </Switch>
                        </Suspense>
                    </Router>
                </Col>
            </Row>
            <Row className="app-footer">
                <Col xs={12} lg={12}>
                    <Footer/>
                </Col>
            </Row>
        </Container>
    )
}

export default App
