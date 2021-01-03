import React from "react";
import {Card, ListGroup, Row, Col} from "react-bootstrap";
import "./TreeNavibar.scss";

class TreeNavibar extends React.Component {

	render() {
		return (
			<Row className="tree-navibar-container">
				<Col xs={3} lg={3} className="tree-navibar">
					<Card>
						<Card.Body>
							<ListGroup as="ul">
								<ListGroup.Item action active={this.props.active == "file"} disabled={this.props.active == "file"} href="/file">
									文件管理
								</ListGroup.Item>
								<ListGroup.Item action active={this.props.active == "carousel"} disabled={this.props.active == "carousel"} href="/carousel">
									轮播管理
								</ListGroup.Item>
								<ListGroup.Item action active={this.props.active == "post"} disabled={this.props.active == "post"} href="/post/list">
									稿件管理
								</ListGroup.Item>
							</ListGroup>
						</Card.Body>
					</Card>
				</Col>
				<Col xs={9} lg={9} className="body-container" id="body-container">
					{this.props.children}
				</Col>
			</Row>
		);
	}
}

export default TreeNavibar;