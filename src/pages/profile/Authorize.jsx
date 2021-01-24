import React from "react";
import Loading from "../../components/loading/Loading";
import {Card} from "react-bootstrap";
import Utils from "../../utils/Utils";

class Authorize extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			connect: {}
		}
	}

	componentDidMount() {
		this.getAdminConnect();
	}

	getAdminConnect = () => {
		Utils.adminConnect({union_id: Utils.getQueryString('union_id')}, response => {
			this.setState({
				connect: response.data
			})
		}, error => {
			console.log(error);
		})
	}

	render() {
		if (Utils.objectIsEmpty(this.state.connects)) {
			return (<Loading/>);
		} else {
			return (
				<Card className="admin-connect-container">
					<Card.Body className="admin-connect-table">
						<Card>
							<Card.Body>
								<Card.Img src={process.env.PUBLIC_URL + '/connects/alipay.png'}></Card.Img>
							</Card.Body>
							<Card.Footer>
								支付宝
							</Card.Footer>
						</Card>
						<div className="admin-connect-note">
							<span>图标来源：</span> <a href="https://www.iconfont.cn/" target="_blank">iconfont - 阿里巴巴矢量图标库</a>
						</div>
					</Card.Body>
				</Card>
			);
		}
	}
}

export default Authorize;