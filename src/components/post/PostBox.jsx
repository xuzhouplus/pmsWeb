import React from "react";
import {Card, Button} from "react-bootstrap";
import './PostBox.scss';

class PostBox extends React.Component {
	render() {
		let previewButton = null;
		if (this.props.preview || this.props.view) {
			previewButton = <Button variant="primary" className="btn-main-color" onClick={this.props.preview} size="sm">查看</Button>
		}
		let putOnButton = null;
		if (this.props.putOn) {
			putOnButton = <Button variant="primary" className="btn-main-color" onClick={this.props.putOn} size="sm">上架</Button>
		}
		let putOffButton = null;
		if (this.props.putOff) {
			putOffButton = <Button variant="primary" className="btn-main-color" onClick={this.props.putOff} size="sm">下架</Button>
		}
		let editButton = null;
		if (this.props.edit) {
			editButton = <Button variant="primary" className="btn-main-color" onClick={this.props.edit} size="sm">编辑</Button>
		}
		let deleteButton = null;
		if (this.props.delete) {
			deleteButton = <Button variant="primary" className="btn-main-color" onClick={this.props.delete} size="sm">删除</Button>
		}
		let selectButton = null;
		if (this.props.select) {
			selectButton = <Button variant="primary" className="btn-main-color" onClick={this.props.select} size="sm">选择</Button>
		}
		let timestamp = new Date().getTime()
		let thumb = this.props.thumb + '?' + timestamp
		return (
			<Card className="post-box" onClick={this.props.preview ? this.props.preview : (this.props.view ? this.props.view : null)}>
				<Card.Img src={thumb} alt={this.props.name} title={this.props.name}></Card.Img>
				<Card.Body>
					<div className="post-detail">
						<h5 className="post-name">{this.props.name}</h5>
						<h5 className="post-paragraph">{this.props.description}</h5>
						<div className="post-button">
							{previewButton}
							{putOnButton}
							{putOffButton}
							{editButton}
							{deleteButton}
							{selectButton}
						</div>
					</div>
				</Card.Body>
			</Card>
		);
	}
}

export default PostBox;
