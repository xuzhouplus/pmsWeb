import React, {lazy, Suspense} from 'react'
import {Container} from 'react-bootstrap'
import Loading from './pages/mask/Loading';
import {connect} from "react-redux";
import Utils from "./utils/Utils";
import Maintain from "@pages/Maintain";
import {siteSlice} from "@redux/slices/SiteSlice";
import './App.scss'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

function mapStateToProps(state) {
	return {
		site: state.site,
	};
}

//home
const Main = lazy(() => import('./pages/Main'));
//home
const Home = lazy(() => import('./pages/home/Home'));
//carousel
const CarouselList = lazy(() => import('./pages/carousel/Index'));
//post
const PostIndex = lazy(() => import('./pages/post/Index'));
const PostList = lazy(() => import('./pages/post/List'));
const PostView = lazy(() => import('./pages/post/View'));
//files
const FileList = lazy(() => import('./pages/file/List'));
const FileView = lazy(() => import('./pages/file/View'));
const VideoPreview = lazy(() => import('./pages/file/Video'));
//about
const About = lazy(() => import('./pages/about/About'));
//settings
const Setting = lazy(() => import('./pages/system/Index'));
//profile
const ProfileIndex = lazy(() => import('./pages/profile/Index'));
const ProfileConnect = lazy(() => import('./pages/profile/Connect'));
const Authorize = lazy(() => import('./pages/profile/Authorize'));
//404
const NotFound = lazy(() => import('./pages/NotFound'));
//登录
const LoginForm = lazy(() => import('./pages/login/Login'));

function mapDispatchToProps(dispatch) {
	return {
		init: (site) => {
			dispatch(siteSlice.actions.init(site))
		},
	}
}

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			maintain: false,
		}
	}

	componentDidMount() {
		Utils.site((response) => {
			if (response.code === 1) {
				this.props.init(response.data);
			}
		}, (error) => {
			console.log(error);
			this.maintain()
		});
	}

	maintain = () => {
		this.setState({
			maintain: true
		})
	}

	render() {
		if (this.state.maintain) {
			return (
				<Maintain></Maintain>
			);
		}
		if (Utils.objectIsEmpty(this.props.site)) {
			return (
				<Container fluid className="app-container full-screen direct-center">
					<Loading></Loading>
				</Container>
			);
		}
		return (
			<Router>
				<Suspense fallback={<Loading/>}>
					<Routes>
						<Route path="/" element={<Main/>}>
							<Route index element={<Home/>}/>
							<Route path="/file/list/:page?" element={<FileList/>}></Route>
							<Route path="/file/:uuid" element={<FileView/>}></Route>
							<Route path="/carousel" element={<CarouselList/>}></Route>
							<Route path="/post" element={<PostIndex/>}></Route>
							<Route path="/post/list/:page?" element={<PostList/>}></Route>
							<Route path="/post/:uuid" element={<PostView/>}></Route>
							<Route path="/about" element={<About/>}></Route>
							<Route path="/system/:type?" element={<Setting/>}></Route>
							<Route path="/profile/authorize/:type?" element={<Authorize/>}></Route>
							<Route path="/profile/connect" element={<ProfileConnect/>}></Route>
							<Route path="/profile/index" element={<ProfileIndex/>}></Route>
							<Route path="/login" element={<LoginForm/>}></Route>
							<Route path="*" element={<NotFound/>}/>
						</Route>
						<Route path="/media/:uuid" element={<VideoPreview/>}></Route>
					</Routes>
				</Suspense>
			</Router>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
