import React from "react";
import {Card, Button} from "react-bootstrap";
import './FileBox.scss';

class FileBox extends React.Component {
	render() {
		let previewButton = null;
		if (this.props.preview) {
			previewButton = <Button variant="primary" className="btn-main-color" onClick={this.props.preview} size="sm">查看</Button>
		}
		let sourceButton = null;
		if (this.props.source) {
			sourceButton = <Button variant="primary" className="btn-main-color" onClick={this.props.source} size="sm">原图</Button>
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
			selectButton = <Button variant="primary" className="btn-main-color" onClick={this.props.select} size="sm">使用</Button>
		}
		let status
		switch (this.props.file.status) {
			case 0:
				status = '上传成功'
				break;
			case 1:
				status = '处理中'
				break;
			case 3:
				status = this.props.file.error
				break;
			case 2:
			default:
				status = ''
		}
		let timestamp = new Date().getTime()
		let thumb = this.props.file.thumb + '?' + timestamp
		return (
			<Card className="file-box" onClick={this.props.preview}>
				<Card.Img title={this.props.file.name} alt={this.props.file.name} src={thumb}/>
				<Card.Body>
					<div className="file-detail">
						<h5 className="card-name">{this.props.file.name}</h5>
						<div className="card-paragraph">
							<div>{this.props.file.description}</div>
						</div>
						<div className="card-paragraph">
							<div>{status}</div>
						</div>
						<div className="card-button">
							{previewButton}
							{sourceButton}
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

export default FileBox;
