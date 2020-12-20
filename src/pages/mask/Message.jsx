import React from "react";
import {Col, Row} from "react-bootstrap";

class Message extends React.Component {
	render() {
		return (
			<Row className="mask-message-container">
				<Col xs={12} lg={12}>
					<div className="posts-content h-100 d-flex justify-content-center align-items-center">
						{this.props.message}
					</div>
				</Col>
			</Row>
		);
	}
}

export default Message;