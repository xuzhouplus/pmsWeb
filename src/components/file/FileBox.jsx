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
        let editButton = null;
        if (this.props.edit) {
            editButton = <Button variant="primary" className="btn-main-color" onClick={this.props.edit}>编辑</Button>
        }
        let deleteButton = null;
        if (this.props.delete) {
            deleteButton = <Button variant="primary" className="btn-main-color" onClick={this.props.delete}>删除</Button>
        }
        let selectButton = null;
        if (this.props.select) {
            selectButton = <Button variant="primary" className="btn-main-color" onClick={this.props.select}>使用</Button>
        }
        let status = null
        switch (this.props.file.status) {
            case 0:
                status = '上传成功'
                break;
            case 1:
                status = '处理中'
                break;
            case 2:
                status = ''
                break;
            case 3:
                status = this.props.file.error
                break;
        }

        return (
            <Card className="file-box" onClick={this.props.preview}>
                <Card.Img variant="top" src={this.props.file.thumb}/>
                <Card.Body>
                    <Card.Title as="h4">{this.props.file.name}</Card.Title>
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
                </Card.Body>
            </Card>
        );
    }
}

export default FileBox;
