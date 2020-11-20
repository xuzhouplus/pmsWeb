import React from "react";
import LoadingComponent from "../../components/loading/Loading"
import {Col, Row} from "react-bootstrap";

class Loading extends React.Component {
	render() {
		return (
			<Row className="mask-loading-container">
				<Col xs={12} lg={12}>
					<div className="posts-content h-100 d-flex justify-content-center align-items-center">
						<LoadingComponent></LoadingComponent>
					</div>
				</Col>
			</Row>
		)
	}
}

export default Loading;