import React, {lazy, Suspense} from "react";
import {Col, Container, Row} from "react-bootstrap";
import Helmet from "react-helmet";
import Navibar from "@components/navbar/Navibar";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Loading from "./mask/Loading";
import Footer from "@components/footer/Footer";
import {connect} from "react-redux";
import AdminNavibar from "@components/navbar/AdminNavibar";
import {loginAction, logoutAction, programAction} from "../redux/Actions";
import Utils from "../utils/Utils";

function mapStateToProps(state) {
	return {
		program: state.program,
		account: state.auth,
		site: state.site
	};
}

function mapDispatchToProps(dispatch) {
	return {
		state: (program) => {
			dispatch({
				type: programAction.type,
				payload: program
			})
		},
		login: (user) => {
			dispatch({
				type: loginAction.type,
				payload: user
			})
		},
		logout: () => {
			dispatch({
				type: logoutAction.type
			})
		}
	}
}

class Main extends React.Component {
	login = (loginUser) => {
		this.handleLoginModal()
		this.props.login(loginUser)
	}

	logout = () => {
		const that = this;
		Utils.logout(function (response) {
			that.props.logout()
		}, function (error) {
			console.log(error);
		})
	}

	handleLoginModal = () => {
		this.props.state({showLogin: !this.props.program.showLogin})
	}

	componentDidMount() {
		// let authString = sessionStorage.getItem('auth');
		// if (authString) {
		// 	let auth = JSON.parse(authString);
		// 	this.login(auth);
		// } else {
		Utils.auth(response => {
			this.login(response.data);
		}, error => {
			console.log(error);
			// this.props.logout();
		});
		// }
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
		const ProfileIndex = lazy(() => import('./profile/Index'));
		const ProfileConnect = lazy(() => import('./profile/Connect'));
		const Authorize = lazy(() => import('./profile/Authorize'));
		//404
		const NotFound = lazy(() => import('./NotFound'));
		//登录
		const LoginForm = lazy(() => import('./login/Login'));
		let NavigateBar;
		if (this.props.account && this.props.account.uuid) {
			NavigateBar = <AdminNavibar site={this.props.site} account={this.props.account} logout={this.logout}></AdminNavibar>
		} else {
			NavigateBar = <Navibar site={this.props.site} showLogin={this.props.program.showLogin} handleModal={this.handleLoginModal} afterLogin={this.login}/>
		}
		const isHomePage = (document.location.pathname === '/' ? true : false)
		console.log(isHomePage)
		return (
			<Router>
				<Container fluid className="app-container">
					<Helmet title={this.props.site.title} link={[{rel: "shortcut icon", href: this.props.site.icon ? this.props.site.icon : '/favicon.ico'}]}></Helmet>
					<Row className={["app-header", "fixed-top", isHomePage ? "home-page" : ""]}>
						<Col xs={12} lg={12}>
							{NavigateBar}
						</Col>
					</Row>
					<Row className="app-body">
						<Col xs={12} lg={12}>
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
									<Route path="/profile/connect" exact component={ProfileConnect}></Route>
									<Route path="/profile/index" exact component={ProfileIndex}></Route>
									<Route path="/login" exact component={LoginForm}></Route>
									<Route path="*" component={NotFound}/>
								</Switch>
							</Suspense>
						</Col>
					</Row>
					<Row className={["app-footer", "fixed-bottom", isHomePage ? "home-page" : ""]}>
						<Col xs={12} lg={12}>
							<Footer site={this.props.site}/>
						</Col>
					</Row>
				</Container>
			</Router>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);