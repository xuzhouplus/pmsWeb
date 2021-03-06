import React, {lazy, Suspense} from "react";
import Loading from "../mask/Loading";
import {Card, ListGroup} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import TreeNavibar from "@components/navbar/TreeNavibar";
import Utils from "@utils/Utils";
import "./Index.scss";

class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			types: []
		}
	}

	componentDidMount() {
		this.getConnectTypes()
	}

	getConnectTypes = () => {
		Utils.connects(response => {
			this.setState({
				types: response.data
			})
		}, error => {
			console.log(error);
		})
	}

	render() {
		let type = this.props.match.params.type ? this.props.match.params.type : 'carousel';
		const navList = [];
		const components = {};
		const Carousel = lazy(() => import('../../components/system/Carousel'));
		navList.push(<LinkContainer to="/system/carousel"><ListGroup.Item action active={type === "carousel"} disabled={type === "carousel"}>首页配置</ListGroup.Item></LinkContainer>)
		components['carousel'] = Carousel;
		const Site = lazy(() => import('../../components/system/Site'));
		navList.push(<LinkContainer to="/system/site"><ListGroup.Item action active={type === "site"} disabled={type === "site"}>站点配置</ListGroup.Item></LinkContainer>)
		components['site'] = Site;
		if (this.state.types.indexOf('alipay') > -1) {
			const Alipay = lazy(() => import('../../components/system/Alipay'));
			navList.push(<LinkContainer to="/system/alipay"><ListGroup.Item action active={type === "alipay"} disabled={type === "alipay"}>支付宝配置</ListGroup.Item></LinkContainer>)
			components['alipay'] = Alipay;
		}
		if (this.state.types.indexOf('wechat') > -1) {
			const Wechat = lazy(() => import('../../components/system/Wechat'));
			navList.push(<LinkContainer to="/system/wechat"><ListGroup.Item action active={type === "wechat"} disabled={type === "wechat"}>微信配置</ListGroup.Item></LinkContainer>)
			components['wechat'] = Wechat;
		}
		if (this.state.types.indexOf('qq') > -1) {
			const QQ = lazy(() => import('../../components/system/QQ'));
			navList.push(<LinkContainer to="/system/qq"><ListGroup.Item action active={type === "qq"} disabled={type === "qq"}>QQ 配置</ListGroup.Item></LinkContainer>)
			components['qq'] = QQ;
		}
		if (this.state.types.indexOf('weibo') > -1) {
			const Weibo = lazy(() => import('../../components/system/Weibo'));
			navList.push(<LinkContainer to="/system/weibo"><ListGroup.Item action active={type === "weibo"} disabled={type === "weibo"}>微博配置</ListGroup.Item></LinkContainer>)
			components['weibo'] = Weibo;
		}
		if (this.state.types.indexOf('baidu') > -1) {
			const Baidu = lazy(() => import('../../components/system/Baidu'));
			navList.push(<LinkContainer to="/system/baidu"><ListGroup.Item action active={type === "baidu"} disabled={type === "baidu"}>百度配置</ListGroup.Item></LinkContainer>)
			components['baidu'] = Baidu;
		}
		if (this.state.types.indexOf('github') > -1) {
			const GitHub = lazy(() => import('../../components/system/GitHub'));
			navList.push(<LinkContainer to="/system/github"><ListGroup.Item action active={type === "github"} disabled={type === "github"}>GitHub 配置</ListGroup.Item></LinkContainer>)
			components['github'] = GitHub;
		}
		if (this.state.types.indexOf('gitee') > -1) {
			const Gitee = lazy(() => import('../../components/system/Gitee'));
			navList.push(<LinkContainer to="/system/gitee"><ListGroup.Item action active={type === "gitee"} disabled={type === "gitee"}>码云配置</ListGroup.Item></LinkContainer>)
			components['gitee'] = Gitee;
		}
		if (this.state.types.indexOf('google') > -1) {
			const Google = lazy(() => import('../../components/system/Google'));
			navList.push(<LinkContainer to="/system/google"><ListGroup.Item action active={type === "google"} disabled={type === "google"}>Google 配置</ListGroup.Item></LinkContainer>)
			components['google'] = Google;
		}
		if (this.state.types.indexOf('facebook') > -1) {
			const Facebook = lazy(() => import('../../components/system/Facebook'));
			navList.push(<LinkContainer to="/system/facebook"><ListGroup.Item action active={type === "facebook"} disabled={type === "facebook"}>Facebook 配置</ListGroup.Item></LinkContainer>)
			components['facebook'] = Facebook;
		}
		if (this.state.types.indexOf('twitter') > -1) {
			const Twitter = lazy(() => import('../../components/system/Twitter'));
			navList.push(<LinkContainer to="/system/twitter"><ListGroup.Item action active={type === "twitter"} disabled={type === "twitter"}>Twitter 配置</ListGroup.Item></LinkContainer>)
			components['twitter'] = Twitter;
		}
		if (this.state.types.indexOf('line') > -1) {
			const Line = lazy(() => import('../../components/system/Line'));
			navList.push(<LinkContainer to="/system/line"><ListGroup.Item action active={type === "line"} disabled={type === "line"}>Line 配置</ListGroup.Item></LinkContainer>)
			components['line'] = Line;
		}
		let Component = components[type];
		return (
			<TreeNavibar>
				<Card>
					<Card.Body>
						<ListGroup as="ul">
							{navList}
						</ListGroup>
					</Card.Body>
				</Card>
				<Suspense fallback={<Loading/>}>
					<Component/>
				</Suspense>
			</TreeNavibar>
		);
	}
}

export default Index;