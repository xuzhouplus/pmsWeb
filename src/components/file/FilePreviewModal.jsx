import React from "react";
import {Card, Modal} from "react-bootstrap";
import './FilePreviewModal.scss';

class FilePreviewModal extends React.Component {
	render() {
		return (
			<Modal className="file-preview-modal" centered show size="lg" onHide={this.props.hide}>
				<Modal.Header closeButton>
					<Modal.Title>{this.props.name}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Card className="file-preview-box">
						<Card.Header className="file-image-box" style={{"backgroundImage": "url(" + this.props.preview + ")"}}>
						</Card.Header>
						<Card.Body>
							<Card.Text>
								{this.props.width}{'*'}{this.props.height}{' '}{this.props.type}
							</Card.Text>
							<Card.Text>
								{this.props.description}
							</Card.Text>
						</Card.Body>
					</Card>
				</Modal.Body>
			</Modal>
		);
	}
}

export default FilePreviewModal;