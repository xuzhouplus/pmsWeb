import React from "react";
import Loading from "@components/loading/Loading";
import {Card} from "react-bootstrap";
import Utils from "@utils/Utils";
import {Link} from "react-router-dom";
import "./Authorize.scss"
import NotFound from "@components/error/NotFound";

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

	render() {
		let type = this.props.match.params.type;
		if (!type) {
			return (<NotFound/>)
		}
		if (this.state.isLoading) {
			return (<Loading/>);
		} else {
			if (!Utils.objectIsEmpty(this.state.connect)) {
				return (
					<Card className="profile-authorize absolute-center">
						<Card.Body className="admin-connect-table">
							<Card>
								<Card.Body className="connect-link" style={{'backgroundImage': 'url("' + this.state.connect.avatar + '")'}}>
									<Card.Title>{this.state.connect.account.replace('\\', '')}</Card.Title>
									<Card.Img className="connect-logo" src={process.env.PUBLIC_URL + '/connects/' + this.state.connect.type + '.png'}></Card.Img>
								</Card.Body>
								<Card.Footer>
									<Link to="/profile/connect">绑定成功</Link>
								</Card.Footer>
							</Card>
							<div className="admin-connect-note">
								<span>图标来源：</span> <a href="https://www.iconfont.cn/" target="_blank" rel="noreferrer noopener">iconfont - 阿里巴巴矢量图标库</a>
							</div>
						</Card.Body>
					</Card>
				);
			} else {
				if (this.state.error) {
					return (
						<Card className="profile-authorize absolute-center">
							<Card.Body className="loading-container">
								<image alt="logo" src="/logo192.png"/>
							</Card.Body>
							<Card.Footer className="text-center">
								{this.state.error}
							</Card.Footer>
						</Card>
					);
				}
				return (
					<Card className="profile-authorize absolute-center">
						<Card.Body className={['loading-container', 'bg-' + type].join(' ')}>
							<Loading></Loading>
						</Card.Body>
						<Card.Footer className="text-center">
							验证中，请稍候
						</Card.Footer>
					</Card>
				);
			}
		}
	}
}

export default Authorize;