import {Card, ListGroup} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import React from "react";

class Navibar extends React.PureComponent {
	render() {
		return (
			<Card>
				<Card.Body>
					<ListGroup as="ul">
						<LinkContainer to="/profile/index">
							<ListGroup.Item action active={this.props.active === 'index'} disabled={this.props.active === 'index'}>
								基础配置
							</ListGroup.Item>
						</LinkContainer>
						<LinkContainer to="/profile/connect">
							<ListGroup.Item action active={this.props.active === 'connect'} disabled={this.props.active === 'connect'}>
								第三方互联
							</ListGroup.Item>
						</LinkContainer>
					</ListGroup>
				</Card.Body>
			</Card>
		);
	}
}

export default Navibar;