import React, {lazy, Suspense} from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Loading from "./mask/Loading";
import {connect} from "react-redux";
import Helmet from "react-helmet";
import configs from "@/configs";
import {Col, Container, Row} from "react-bootstrap";
import Navibar from "@components/navbar/Navibar";
import Footer from "@components/footer/Footer";

function mapStateToProps(state) {
    return {
        site: state.site
    };
}

class Main extends React.Component {
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
        const VideoPreview = lazy(() => import('./file/Video'));
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
        return (
            <Router>
                <Suspense fallback={<Loading/>}>
                    <Switch>
                        <Route path="/media/:uuid" exact component={VideoPreview}></Route>
                        <Container fluid className="app-container">
                            <Helmet title={this.props.site.title} link={[{rel: "shortcut icon", href: this.props.site.icon ? this.props.site.icon : configs.defaultFavicon}]}></Helmet>
                            <Row className={["app-header", "fixed-top"]}>
                                <Col xs={12} lg={12}>
                                    <Navibar/>
                                </Col>
                            </Row>
                            <Row className="app-body">
                                <Col xs={12} lg={12}>
                                    <Switch>
                                        <Route path="/" exact component={Home}/>
                                        <Route path="/file/list/:page?" component={FileList}></Route>
                                        <Route path="/file/:uuid" exact component={FileView}></Route>
                                        <Route path="/carousel" exact component={CarouselList}></Route>
                                        <Route path="/post" exact component={PostIndex}></Route>
                                        <Route path="/post/list/:page?" component={PostList}></Route>
                                        <Route path="/post/:uuid" exact component={PostView}></Route>
                                        <Route path="/about" exact component={About}></Route>
                                        <Route path="/system/:type?" component={Setting}></Route>
                                        <Route path="/profile/authorize/:type?" exact component={Authorize}></Route>
                                        <Route path="/profile/connect" exact component={ProfileConnect}></Route>
                                        <Route path="/profile/index" exact component={ProfileIndex}></Route>
                                        <Route path="/login" exact component={LoginForm}></Route>
                                        <Route path="*" component={NotFound}/>
                                    </Switch>
                                </Col>
                            </Row>
                            <Row className={["app-footer", "fixed-bottom"]}>
                                <Col xs={12} lg={12}>
                                    <Footer site={this.props.site}/>
                                </Col>
                            </Row>
                        </Container>
                    </Switch>
                </Suspense>
            </Router>
        );
    }
}

export default connect(mapStateToProps, null)(Main);