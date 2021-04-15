import React from "react";
import {Row, Col} from "react-bootstrap";
import "./TreeNavibar.scss";

class TreeNavibar extends React.Component {

	render() {
		return (
			<Row className="tree-navibar-container">
				<Col xs={3} lg={3} className="tree-navibar">
					{this.props.children[0]}
				</Col>
				<Col xs={9} lg={9} className="body-container">
					{this.props.children[1]}
				</Col>
			</Row>
		);
	}
}

export default TreeNavibar;