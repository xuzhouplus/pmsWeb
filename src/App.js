import React, {lazy, Suspense} from 'react'
import './App.scss'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {Container, Row, Col} from 'react-bootstrap'
import Loading from './pages/mask/Loading';
import Navibar from "./components/navbar/Navibar";
import Footer from "./components/footer/Footer";
import {init} from "./redux/Actions";
import {connect} from "react-redux";
import Utils from "./utils/Utils";
import Message from "./pages/mask/Message"

function mapStateToProps(state) {
	return {
		site: state.site
	};
}

function mapDispatchToProps(dispatch) {
	return {
		init: (site) => {
			dispatch({
				type: init.type,
				payload: site
			})
		},
	}
}

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: ''
		}
	}

	componentDidMount() {
		const that = this;
		Utils.site(function (response) {
			console.log(response);
			if (response.code === 1) {
				that.props.init(response.data);
			}
		}, function (error) {
			that.setState({
				error: error
			})
		});
	}

	render() {
		if (this.state.error) {
			return (
				<Container fluid className="app-container full_screen direct-center">
					<Message message={this.state.error}></Message>
				</Container>
			);
		}
		if (Utils.objectIsEmpty(this.props.site)) {
			return (
				<Container fluid className="app-container full_screen direct-center">
					<Loading></Loading>
				</Container>
			);
		}
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
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
