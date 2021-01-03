import React from "react";
import {Card, Button} from "react-bootstrap";
import './FileBox.scss';

class FileBox extends React.Component {
	render() {
		let previewButton = null;
		if (this.props.preview) {
			previewButton = <Button variant="primary" className="btn-main-color" onClick={this.props.preview}>查看</Button>
		}
		let sourceButton = null;
		if (this.props.source) {
			sourceButton = <Button variant="primary" className="btn-main-color" onClick={this.props.source}>原图</Button>
		}
		let deleteButton = null;
		if (this.props.delete) {
			deleteButton = <Button variant="primary" className="btn-main-color" onClick={this.props.delete}>删除</Button>
		}
		let selectButton = null;
		if (this.props.select) {
			selectButton = <Button variant="primary" className="btn-main-color" onClick={this.props.select}>使用</Button>
		}

		return (
			<Card className="file-box" onClick={this.props.preview} style={{"backgroundImage": "url(" + this.props.thumb + ")"}}>
				<Card.Body>
					<Card.Title>{this.props.name}</Card.Title>
					<Card.Text>
						{this.props.description}
					</Card.Text>
					{previewButton}
					{sourceButton}
					{deleteButton}
					{selectButton}
				</Card.Body>
			</Card>
		);
	}
}

export default FileBox;