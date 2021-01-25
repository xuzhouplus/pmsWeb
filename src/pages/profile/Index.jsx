import React, {lazy, Suspense} from "react";
import Loading from "../mask/Loading";
import {Card, Col, ListGroup, Row} from "react-bootstrap";
import "./Index.scss";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

class Index extends React.Component {
	render() {
		const Admin = lazy(() => import('../../components/profile/Admin'));
		const Connect = lazy(() => import('../../components/profile/Connect'));
		return (
			<Row className="tree-navibar-container full_container profile-settings">
				<Col xs={3} lg={3} className="tree-navibar">
					<Card>
						<Card.Body>
							<ListGroup as="ul">
								<ListGroup.Item action active={this.props.match.params.type === ""} disabled={this.props.match.params.type === ""} href="/profile">
									基础配置
								</ListGroup.Item>
								<ListGroup.Item action active={this.props.match.params.type === "connect"} disabled={this.props.match.params.type === "connect"} href="/profile/connect">
									第三方互联
								</ListGroup.Item>
							</ListGroup>
						</Card.Body>
					</Card>
				</Col>
				<Col xs={9} lg={9} className="body-container">
					<Router>
						<Suspense fallback={<Loading/>}>
							<Switch>
								<Route path="/profile/connect" component={Connect}/>
								<Route path="*" component={Admin}/>
							</Switch>
						</Suspense>
					</Router>
				</Col>
			</Row>
		);
	}

}

export default Index;