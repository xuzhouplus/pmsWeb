import React from "react";
import {Col, Image, Row} from "react-bootstrap";

class Message extends React.Component {
	render() {
		return (
			<Row className="mask-message-container full_screen">
				<Col xs={12} lg={12}>
					<div className="posts-content h-100 d-flex align-items-center" style={{"flexDirection": "column", "marginTop": "13%"}}>
						<div><Image src={process.env.PUBLIC_URL + '/logo192.png'}></Image></div>
						<div>{this.props.message}</div>
					</div>
				</Col>
			</Row>
		);
	}
}

export default Message;