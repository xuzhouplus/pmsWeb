import React, {lazy, Suspense} from "react";
import {Col, Container, Row} from "react-bootstrap";
import Navibar from "../components/navbar/Navibar";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Loading from "./mask/Loading";
import Footer from "../components/footer/Footer";
import {connect} from "react-redux";
import AdminNavibar from "../components/navbar/AdminNavibar";
import {login, logout} from "../redux/Actions";
import Utils from "../utils/Utils";
import axios from "axios";

function mapStateToProps(state) {
	return {
		account: state.auth
	};
}

function mapDispatchToProps(dispatch) {
	return {
		login: (user) => {
			dispatch({
				type: login.type,
				payload: user
			})
		},
		logout: () => {
			dispatch({
				type: logout.type
			})
		}
	}
}

class Main extends React.Component {
	login = (loginUser) => {
		console.log(loginUser);
		axios.defaults.headers.common['Authorization'] = loginUser.token;
		this.setState({
			loginModal: false
		})
		this.props.login(loginUser)
	}

	logout = () => {
		const that = this;
		Utils.logout(function (response) {
			console.log(response);
			sessionStorage.removeItem('auth');
			that.props.logout()
		}, function (error) {
			console.log(error);
		})
	}

	componentDidMount() {
		const that = this;
		let authString = sessionStorage.getItem('auth');
		if (authString) {
			let auth = JSON.parse(authString);
			that.login(auth);
		} else {
			Utils.auth(function (response) {
				console.log(response);
				that.login(response.data);
				sessionStorage.setItem('auth', JSON.stringify(response.data));
			}, function (error) {
				console.log(error);
			});
		}
	}

	render() {
		//home
		const Home = lazy(() => import('./home/Home'));
		//carousel
		const CarouselList = lazy(() => import('./carousel/Index'));
		//post
		const PostIndex = lazy(() => import('./post/Index'));
		const PostList = lazy(() => import('./post/List'));
		const PostView = lazy(() => import('./post/View'));
		//files
		const FileList = lazy(() => import('./file/List'));
		const FileView = lazy(() => import('./file/View'));
		//about
		const About = lazy(() => import('./about/About'));
		//settings
		const Setting = lazy(() => import('./system/Index'));
		//profile
		const Profile = lazy(() => import('./profile/Index'));
		const Authorize = lazy(() => import('./profile/Authorize'));
		//404
		const NotFound = lazy(() => import('./NotFound'));
		let NavigateBar;
		if (this.props.account && this.props.account.uuid) {
			NavigateBar = <AdminNavibar account={this.props.account} logout={this.logout}></AdminNavibar>
		} else {
			NavigateBar = <Navibar login={this.login}/>
		}
		return (
			<Container fluid className="app-container">
				<Row className="app-header fixed-top">
					<Col xs={12} lg={12}>
						{NavigateBar}
					</Col>
				</Row>
				<Row className="app-body">
					<Col xs={12} lg={12}>
						<Router>
							<Suspense fallback={<Loading/>}>
								<Switch>
									<Route path="/" exact component={Home}/>
									<Route path="/file/list/:page?" component={FileList}></Route>
									<Route path="/file/:uuid" component={FileView}></Route>
									<Route path="/carousel" exact component={CarouselList}></Route>
									<Route path="/post" exact component={PostIndex}></Route>
									<Route path="/post/list/:page?" component={PostList}></Route>
									<Route path="/post/:uuid" component={PostView}></Route>
									<Route path="/about" exact component={About}></Route>
									<Route path="/system/:type?" component={Setting}></Route>
									<Route path="/profile/authorize" exact component={Authorize}></Route>
									<Route path="/profile/:type?" component={Profile}></Route>
									<Route path="*" component={NotFound}/>
								</Switch>
							</Suspense>
						</Router>
					</Col>
				</Row>
				<Row className="app-footer fixed-bottom">
					<Col xs={12} lg={12}>
						<Footer/>
					</Col>
				</Row>
			</Container>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);