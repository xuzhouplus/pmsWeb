import React from "react";
import Utils from "../../utils/Utils";
import {Col, Row} from "react-bootstrap";
import Loading from "../mask/Loading";

class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			search: null
		}
	}

	componentDidMount() {
		Utils.posts({search: this.state.search}, function (response) {
			console.log(response);
		}, function (error) {
			console.log(error);
		})
	}

	render() {
		return (
			<Row className="home-container">
				<Col xs={12} lg={12}>
					<div className="posts-content h-100 d-flex justify-content-center align-items-center">
						<Loading></Loading>
					</div>
				</Col>
			</Row>
		);
	}
}

export default Index;