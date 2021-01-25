import React from "react";
import {connect} from "react-redux";
import Utils from "../../utils/Utils";
import Loading from "../loading/Loading";
import {Card} from "react-bootstrap";
import "./Connect.scss";

function mapStateToProps(state) {
	return {
		account: state.auth
	};
}

class Connect extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			connects: []
		}
	}

	componentDidMount() {
		this.getAdminConnect();
	}

	getAdminConnect = () => {
		Utils.adminConnects({id: this.props.account.uuid}, response => {
			console.log(response);
			this.setState({
				connects: response.data
			})
		}, error => {
			console.log(error);
		})
	}

	handleClick = (connectType) => {
		console.log(connectType);
		Utils.adminAuthorize({
			type: connectType,
			scope: 'auth_user'
		}, response => {
			console.log(response);
			window.location.href = response.data;
		}, error => {
			console.log(error);
		});
	}

	render() {
		if (this.state.connects.length > 0) {
			return (<Loading/>);
		} else {
			return (
				<Card className="admin-connect-container">
					<Card.Body className="admin-connect-table">
						<div className="admin-connect-list">
							<div className="admin-connect-row">
								<Card onClick={this.handleClick.bind(this, 'alipay')}>
									<Card.Body>
										<Card.Img src={process.env.PUBLIC_URL + '/connects/alipay.png'}></Card.Img>
									</Card.Body>
									<Card.Footer>
										支付宝
									</Card.Footer>
								</Card>
								<Card onClick={this.handleClick.bind(this, 'wechat')}>
									<Card.Body>
										<Card.Img src={process.env.PUBLIC_URL + '/connects/wechat.png'}></Card.Img>
									</Card.Body>
									<Card.Footer>
										微信
									</Card.Footer>
								</Card>
								<Card onClick={this.handleClick.bind(this, 'qq')}>
									<Card.Body>
										<Card.Img src={process.env.PUBLIC_URL + '/connects/qq.png'}></Card.Img>
									</Card.Body>
									<Card.Footer>
										QQ
									</Card.Footer>
								</Card>
								<Card onClick={this.handleClick.bind(this, 'weibo')}>
									<Card.Body>
										<Card.Img src={process.env.PUBLIC_URL + '/connects/weibo.png'}></Card.Img>
									</Card.Body>
									<Card.Footer>
										微博
									</Card.Footer>
								</Card>
								<Card onClick={this.handleClick.bind(this, 'baidu')}>
									<Card.Body>
										<Card.Img src={process.env.PUBLIC_URL + '/connects/baidu.png'}></Card.Img>
									</Card.Body>
									<Card.Footer>
										百度
									</Card.Footer>
								</Card>
								<Card onClick={this.handleClick.bind(this, 'github')}>
									<Card.Body>
										<Card.Img src={process.env.PUBLIC_URL + '/connects/github.png'}></Card.Img>
									</Card.Body>
									<Card.Footer>
										GitHub
									</Card.Footer>
								</Card>
								<Card onClick={this.handleClick.bind(this, 'google')}>
									<Card.Body>
										<Card.Img src={process.env.PUBLIC_URL + '/connects/google.png'}></Card.Img>
									</Card.Body>
									<Card.Footer>
										Google
									</Card.Footer>
								</Card>
								<Card onClick={this.handleClick.bind(this, 'facebook')}>
									<Card.Body>
										<Card.Img src={process.env.PUBLIC_URL + '/connects/facebook.png'}></Card.Img>
									</Card.Body>
									<Card.Footer>
										Facebook
									</Card.Footer>
								</Card>
								<Card onClick={this.handleClick.bind(this, 'twitter')}>
									<Card.Body>
										<Card.Img src={process.env.PUBLIC_URL + '/connects/twitter.png'}></Card.Img>
									</Card.Body>
									<Card.Footer>
										Twitter
									</Card.Footer>
								</Card>
								<Card onClick={this.handleClick.bind(this, 'line')}>
									<Card.Body>
										<Card.Img src={process.env.PUBLIC_URL + '/connects/line.png'}></Card.Img>
									</Card.Body>
									<Card.Footer>
										Line
									</Card.Footer>
								</Card>
							</div>
						</div>
						<div className="admin-connect-note">
							<span>图标来源：</span> <a href="https://www.iconfont.cn/" target="_blank" rel="noreferrer noopener">iconfont - 阿里巴巴矢量图标库</a>
						</div>
					</Card.Body>
				</Card>
			);
		}
	}
}

export default connect(mapStateToProps, null)(Connect);