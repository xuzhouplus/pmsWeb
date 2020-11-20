import React, {lazy, Suspense} from "react";
import {Col, Container, Row} from "react-bootstrap";
import Navibar from "../components/navbar/Navibar";
import {HashRouter as Router, Route, Switch} from "react-router-dom";
import Loading from "./mask/Loading";
import Footer from "../components/footer/Footer";

class Main extends React.Component {
	render() {
		const Home = lazy(() => import('./home/Home'))
		const PostIndex = lazy(() => import('./post/Index'))
		const NotFound = lazy(() => import('./NotFound'))
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
									<Route path="/post" exact component={PostIndex}></Route>
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
		);
	}
}

export default Main;