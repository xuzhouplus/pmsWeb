import React from "react";
import Loading from "@components/loading/Loading";
import {Button} from "react-bootstrap";
import Utils from "@utils/Utils";
import NotFound from "@components/error/NotFound";
import "./Authorize.scss"

class Authorize extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			error: null,
			connect: {}
		}
	}

	componentDidMount() {
		this.getAdminConnect();
	}

	getAdminConnect = () => {
		Utils.adminCallback(Utils.getQueryVariable(), response => {
			this.setState({
				isLoading: false,
				connect: response.data
			})
		}, error => {
			console.log(error);
			this.setState({
				isLoading: false,
				error: error
			})
		})
	}
	redirect = () => {
		window.close()
	}

	render() {
		let type = this.props.match.params.type;
		if (!type) {
			return (<NotFound/>)
		}
		if (this.state.isLoading) {
			return (
				<div className="connect-loading absolute-center">
					<Loading/>
					<div className="loading-note">认证中，请稍候</div>
				</div>
			);
		} else {
			if (!Utils.objectIsEmpty(this.state.connect)) {
				return (
					<div className="full_container profile-authorize">
						<div className="absolute-center">
							<div className="connect-avatar" style={{'backgroundImage': 'url("' + this.state.connect.avatar + '")'}}></div>
							<div className="connect-account">{this.state.connect.account.replace('\\', '')}</div>
							<div className="connect-redirect">
								<Button onClick={this.redirect}>操作成功</Button>
							</div>
						</div>
						<div className="connect-note">
							<span>图标来源：</span> <a href="https://www.iconfont.cn/" target="_blank" rel="noreferrer noopener">iconfont - 阿里巴巴矢量图标库</a>
						</div>
					</div>
				);
			} else {
				return (
					<div className="connect-error full_container">
						<div className="absolute-center">
							<img alt="logo" src="/logo192.png"/>
							<div className="error-text text-center">
								{this.state.error}
							</div>
							<div className="error-redirect">
								<Button type="sec" onClick={this.redirect}>操作失败</Button>
							</div>
						</div>
					</div>
				);
			}
		}
	}
}

export default Authorize;