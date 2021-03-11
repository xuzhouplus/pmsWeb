import React, {lazy, Suspense} from "react";
import Loading from "../mask/Loading";
import {Card, Col, ListGroup, Row} from "react-bootstrap";
import "./Index.scss";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

class Index extends React.Component {
	render() {
		const Alipay = lazy(() => import('../../components/system/Alipay'));
		const Wechat = lazy(() => import('../../components/system/Wechat'));
		const Weibo = lazy(() => import('../../components/system/Weibo'));
		const QQ = lazy(() => import('../../components/system/QQ'));
		const Facebook = lazy(() => import('../../components/system/Facebook'));
		const GitHub = lazy(() => import('../../components/system/GitHub'));
		const Google = lazy(() => import('../../components/system/Google'));
		const Twitter = lazy(() => import('../../components/system/Twitter'));
		const Line = lazy(() => import('../../components/system/Line'));
		const Baidu = lazy(() => import('../../components/system/Baidu'));
		const Carousel = lazy(() => import('../../components/system/Carousel'));
		const Site = lazy(() => import('../../components/system/Site'));

		let type = this.props.match.params.type ? this.props.match.params.type : 'carousel';

		return (
			<Row className="tree-navibar-container full_container system-settings">
				<Col xs={3} lg={3} className="tree-navibar">
					<Card>
						<Card.Body>
							<ListGroup as="ul">
								<ListGroup.Item action active={type === "carousel"} disabled={type === "carousel"} href="/system/carousel">
									首页配置
								</ListGroup.Item>
								<ListGroup.Item action active={type === "site"} disabled={type === "site"} href="/system/site">
									站点配置
								</ListGroup.Item>
								<ListGroup.Item action active={type === "alipay"} disabled={type === "alipay"} href="/system/alipay">
									支付宝配置
								</ListGroup.Item>
								<ListGroup.Item action active={type === "wechat"} disabled={type === "wechat"} href="/system/wechat">
									微信配置
								</ListGroup.Item>
								<ListGroup.Item action active={type === "qq"} disabled={type === "qq"} href="/system/qq">
									QQ 配置
								</ListGroup.Item>
								<ListGroup.Item action active={type === "weibo"} disabled={type === "weibo"} href="/system/weibo">
									微博配置
								</ListGroup.Item>
								<ListGroup.Item action active={type === "baidu"} disabled={type === "baidu"} href="/system/baidu">
									百度配置
								</ListGroup.Item>
								<ListGroup.Item action active={type === "github"} disabled={type === "github"} href="/system/github">
									GitHub 配置
								</ListGroup.Item>
								<ListGroup.Item action active={type === "google"} disabled={type === "google"} href="/system/google">
									Google 配置
								</ListGroup.Item>
								<ListGroup.Item action active={type === "facebook"} disabled={type === "facebook"} href="/system/facebook">
									Facebook 配置
								</ListGroup.Item>
								<ListGroup.Item action active={type === "twitter"} disabled={type === "twitter"} href="/system/twitter">
									Twitter 配置
								</ListGroup.Item>
								<ListGroup.Item action active={type === "line"} disabled={type === "line"} href="/system/line">
									Line 配置
								</ListGroup.Item>
							</ListGroup>
						</Card.Body>
					</Card>
				</Col>
				<Col xs={9} lg={9} className="body-container">
					<Router>
						<Suspense fallback={<Loading/>}>
							<Switch>
								<Route path="/system/baidu" component={Baidu}></Route>
								<Route path="/system/carousel" component={Carousel}></Route>
								<Route path="/system/alipay" component={Alipay}></Route>
								<Route path="/system/wechat" component={Wechat}></Route>
								<Route path="/system/weibo" component={Weibo}></Route>
								<Route path="/system/qq" component={QQ}></Route>
								<Route path="/system/github" component={GitHub}></Route>
								<Route path="/system/google" component={Google}></Route>
								<Route path="/system/facebook" component={Facebook}></Route>
								<Route path="/system/twitter" component={Twitter}></Route>
								<Route path="/system/line" component={Line}></Route>
								<Route path="/system/site" component={Site}></Route>
								<Route path="*" component={Carousel}/>
							</Switch>
						</Suspense>
					</Router>
				</Col>
			</Row>
		);
	}

}

export default Index;