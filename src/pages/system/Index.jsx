import React, {lazy, Suspense} from "react";
import Loading from "../mask/Loading";
import {Card, ListGroup} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import TreeNavibar from "@components/navbar/TreeNavibar";
import Utils from "@utils/Utils";
import "./Index.scss";
import {withRouter} from "@components/router/Router";

class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			types: []
		}
	}

	componentDidMount() {
		this.getConnectTypes()
	}

	getConnectTypes = () => {
		Utils.connects(response => {
			this.setState({
				loading: false,
				types: response.data
			})
		}, error => {
			console.log(error);
			this.setState({
				loading: false
			})
		})
	}

	getNavList=(type)=>{
		const navList = [];
		navList.push(<LinkContainer key="site" to="/system/site">
			<ListGroup.Item action active={type === "site"} disabled={type === "site"}>站点配置</ListGroup.Item>
		</LinkContainer>)
		if (this.state.types.indexOf('alipay') > -1) {
			navList.push(<LinkContainer key="alipay" to="/system/alipay">
				<ListGroup.Item action active={type === "alipay"} disabled={type === "alipay"}>支付宝配置</ListGroup.Item>
			</LinkContainer>)
		}
		if (this.state.types.indexOf('wechat') > -1) {
			navList.push(<LinkContainer key="wechat" to="/system/wechat">
				<ListGroup.Item action active={type === "wechat"} disabled={type === "wechat"}>微信配置</ListGroup.Item>
			</LinkContainer>)
		}
		if (this.state.types.indexOf('qq') > -1) {
			navList.push(<LinkContainer key="qq" to="/system/qq">
				<ListGroup.Item action active={type === "qq"} disabled={type === "qq"}>QQ 配置</ListGroup.Item>
			</LinkContainer>)
		}
		if (this.state.types.indexOf('weibo') > -1) {
			navList.push(<LinkContainer key="weibo" to="/system/weibo">
				<ListGroup.Item action active={type === "weibo"} disabled={type === "weibo"}>微博配置</ListGroup.Item>
			</LinkContainer>)
		}
		if (this.state.types.indexOf('baidu') > -1) {
			navList.push(<LinkContainer key="baidu" to="/system/baidu">
				<ListGroup.Item action active={type === "baidu"} disabled={type === "baidu"}>百度配置</ListGroup.Item>
			</LinkContainer>)
		}
		if (this.state.types.indexOf('github') > -1) {
			navList.push(<LinkContainer key="github" to="/system/github">
				<ListGroup.Item action active={type === "github"} disabled={type === "github"}>GitHub 配置</ListGroup.Item>
			</LinkContainer>)
		}
		if (this.state.types.indexOf('gitee') > -1) {
			navList.push(<LinkContainer key="gitee" to="/system/gitee">
				<ListGroup.Item action active={type === "gitee"} disabled={type === "gitee"}>码云配置</ListGroup.Item>
			</LinkContainer>)
		}
		if (this.state.types.indexOf('google') > -1) {
			navList.push(<LinkContainer key="google" to="/system/google">
				<ListGroup.Item action active={type === "google"} disabled={type === "google"}>Google 配置</ListGroup.Item>
			</LinkContainer>)
		}
		if (this.state.types.indexOf('facebook') > -1) {
			navList.push(<LinkContainer key="facebook" to="/system/facebook">
				<ListGroup.Item action active={type === "facebook"} disabled={type === "facebook"}>Facebook 配置</ListGroup.Item>
			</LinkContainer>)
		}
		if (this.state.types.indexOf('twitter') > -1) {
			navList.push(<LinkContainer key="twitter" to="/system/twitter">
				<ListGroup.Item action active={type === "twitter"} disabled={type === "twitter"}>Twitter 配置</ListGroup.Item>
			</LinkContainer>)
		}
		if (this.state.types.indexOf('line') > -1) {
			navList.push(<LinkContainer key="line" to="/system/line">
				<ListGroup.Item action active={type === "line"} disabled={type === "line"}>Line 配置</ListGroup.Item>
			</LinkContainer>)
		}
		return navList;
	}

	getComponent=(type)=>{
		let Component
		switch (type){
			case 'alipay':
				Component = lazy(() => import('@components/system/Alipay'));
				break;
			case 'wechat':
				Component = lazy(() => import('@components/system/Wechat'));
				break;
			case 'qq':
				Component = lazy(() => import('@components/system/QQ'));
				break;
			case 'weibo':
				Component = lazy(() => import('@components/system/Weibo'));
				break;
			case 'baidu':
				Component = lazy(() => import('@components/system/Baidu'));
				break;
			case 'github':
				Component = lazy(() => import('@components/system/GitHub'));
				break;
			case 'gitee':
				Component = lazy(() => import('@components/system/Gitee'));
				break;
			case 'google':
				Component = lazy(() => import('@components/system/Google'));
				break;
			case 'facebook':
				Component = lazy(() => import('@components/system/Facebook'));
				break;
			case 'twitter':
				Component = lazy(() => import('@components/system/Twitter'));
				break;
			case 'line':
				Component = lazy(() => import('@components/system/Line'));
				break;
			case 'site':
			default:
				Component = lazy(() => import('@components/system/Site'));
		}
		return Component;
	}

	render() {
		if (this.state.loading) {
			return (<Loading/>);
		} else {
			let type = this.props.router.params.type ? this.props.router.params.type : 'site';
			let navList = this.getNavList(type)
			let Component = this.getComponent(type)
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
}

export default withRouter(Index);
