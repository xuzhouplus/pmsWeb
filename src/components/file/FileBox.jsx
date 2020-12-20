import React from "react";
import {Card, Button} from "react-bootstrap";
import './FileBox.scss';

class FileBox extends React.Component {
	render() {
		return (
			<Card className="file-box" onClick={this.props.preview} style={{"backgroundImage": "url(" + this.props.thumb + ")"}}>
				<Card.Body>
					<Card.Title>{this.props.name}</Card.Title>
					<Card.Text>
						{this.props.description}
					</Card.Text>
					<Button variant="primary" onClick={this.props.preview}>查看</Button>{' '}
					<Button variant="primary" onClick={this.props.source}>原图</Button>{' '}
					<Button variant="primary" onClick={this.props.delete}>删除</Button>
				</Card.Body>
			</Card>
		);
	}
}

export default FileBox;