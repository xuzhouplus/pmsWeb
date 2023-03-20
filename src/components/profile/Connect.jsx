import React from "react";
import {connect} from "react-redux";
import Utils from "../../utils/Utils";
import Loading from "../loading/Loading";
import {Card} from "react-bootstrap";
import Empty from "@components/logo/Empty";
import Swal from "sweetalert2";
import "./Connect.scss";

function mapStateToProps(state) {
	return {
		account: state.auth,
		site: state.site
	};
}

class Connect extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			providers: [
				[
					{
						id: 'alipay',
						name: '支付宝',
						logo: '/connects/alipay.png'
					},
					{
						id: 'wechat',
						name: '微信',
						logo: '/connects/wechat.png'
					},
					{
						id: 'qq',
						name: 'QQ',
						logo: '/connects/qq.png'
					},
					{
						id: 'weibo',
						name: '微博',
						logo: '/connects/weibo.png'
					},
					{
						id: 'baidu',
						name: '百度',
						logo: '/connects/baidu.png'
					},
					{
						id: 'gitee',
						name: '码云',
						logo: '/connects/gitee.png'
					}
				],
				[
					{
						id: 'github',
						name: 'GitHub',
						logo: '/connects/github.png'
					},
					{
						id: 'google',
						name: 'Google',
						logo: '/connects/google.png'
					},
					{
						id: 'facebook',
						name: 'Facebook',
						logo: '/connects/facebook.png'
					},
					{
						id: 'twitter',
						name: 'Twitter',
						logo: '/connects/twitter.png'
					},
					{
						id: 'line',
						name: 'Line',
						logo: '/connects/line.png'
					},
				]
			],
			types: [],
			connects: {}
		}
	}

	componentDidMount() {
		this.getAdminConnect();
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		if (nextProps.account.uuid !== this.props.account.uuid) {
			this.getAdminConnect();
		}
		return true;
	}

	getAdminConnect = () => {
		Utils.adminConnects({}, response => {
			this.setState({
				loading: false,
				types: response.data.types,
				connects: response.data.connects
			})
		}, error => {
			console.log(error);
			Swal.fire({
				icon: 'warning',
				text: error,
				confirmButtonText: "确定"
			}).then()
			this.setState({
				loading: false,
				connects: {}
			})
		})
	}

	handleBind = (provider) => {
		Swal.fire({
			icon: 'info',
			html: '<div>确定绑定此第三方账号？<br/>绑定后将可以使用此第三方授权登录。</div>',
			confirmButtonText: "确定",
			showCancelButton: true,
			cancelButtonText: "取消",
			backdrop: true,
			allowOutsideClick: false
		}).then((result) => {
			if (result.isConfirmed) {
				Utils.authorizeUrl({
					type: provider.id,
					scope: 'auth_user',
					action: 'bind'
				}, response => {
					let authWindow = window.open(response.data, provider.name, 'width=' + (window.screen.availWidth - 10) + ',height=' + (window.screen.availHeight - 30) + ',top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
					let timeCount = 0;
					let interval = setInterval(() => {
						if (authWindow.closed) {
							console.log("auth window closed");
							clearInterval(interval);
							this.getAdminConnect();
						} else {
							timeCount++;
							if (timeCount === 1200) {
								clearInterval(interval);
								this.getAdminConnect();
							}
						}
					}, 3000)
				}, error => {
					console.log(error);
					Swal.fire({
						icon: 'error',
						text: error,
						confirmButtonText: "确定",
						backdrop: true,
						allowOutsideClick: false
					})
				});
			}
		})
	}
	handleUnbind = (connect) => {
		Swal.fire({
			icon: 'warning',
			html: '<div>确定解绑此第三方账号？<br/>解绑后将不能使用此第三方授权登录。</div>',
			confirmButtonText: "确定",
			confirmButtonColor: "#dc3545",
			showCancelButton: true,
			cancelButtonText: "取消",
			backdrop: true,
			allowOutsideClick: false
		}).then((result) => {
			if (result.isConfirmed) {
				Utils.unbindConnect({
					id: connect.id,
				}, response => {
					console.log(response);
					this.getAdminConnect();
				}, error => {
					console.log(error);
					Swal.fire({
						icon: 'error',
						text: error,
						confirmButtonText: "确定",
						backdrop: true,
						allowOutsideClick: false
					})
				});
			}
		})
	}

	render() {
		if (this.state.loading) {
			return (<Loading/>);
		} else {
			let connect
			if (this.state.types.length > 0) {
				connect = this.state.providers.map((providers, index) => {
					let rowBox = providers.map(provider => {
						if (this.state.types.indexOf(provider.id) !== -1) {
							let connect = this.state.connects[provider.id];
							if (typeof connect !== 'undefined') {
								return <Card key={provider.id} onClick={this.handleUnbind.bind(this, connect)}>
									<Card.Body style={{'backgroundImage': 'url("' + connect.avatar + '")'}}>
										<Card.Title>{connect.account.replace('\\', '')}</Card.Title>
										<Card.Img className="connect-logo"
												  src={process.env.PUBLIC_URL + provider.logo}></Card.Img>
									</Card.Body>
								</Card>;
							} else {
								return <Card key={provider.id} onClick={this.handleBind.bind(this, provider)}>
									<Card.Body className="connect-link"
											   style={{'backgroundImage': 'url("' + process.env.PUBLIC_URL + '/connects/link.png")'}}>
										<Card.Title>{provider.name}</Card.Title>
										<Card.Img className="connect-logo"
												  src={process.env.PUBLIC_URL + provider.logo}></Card.Img>
									</Card.Body>
								</Card>;
							}
						} else {
							return '';
						}
					})
					return <div key={'connect-row-' + index} className="admin-connect-row">
						{rowBox}
					</div>
				})
			} else {
				connect = <Empty/>
			}
			return (
				<Card className="admin-connect-container">
					<Card.Body className="admin-connect-table">
						<div className="admin-connect-list">
							{connect}
						</div>
						<div className="admin-connect-note">
							<span>图标来源：</span>
							<a href="https://www.iconfont.cn/" target="_blank" rel="noreferrer noopener">iconfont - 阿里巴巴矢量图标库</a>
						</div>
					</Card.Body>
				</Card>
			);
		}
	}
}

export default connect(mapStateToProps, null)(Connect);
