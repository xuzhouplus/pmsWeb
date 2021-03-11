import React from "react";
import Utils from "../../utils/Utils";
import {Col, Row} from "react-bootstrap";
import PostMdViewer from "../../components/post/PostMdViewer";
import "./View.scss";

class View extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			post: {}
		}
	}

	componentDidMount() {
		console.log(this.props.match.params.uuid);
		this.getPostDetail(this.props.match.params.uuid);
	}

	getPostDetail = (id) => {
		Utils.getPostDetail(id, response => {
			if (response.code === 1) {
				this.setState({
					post: response.data
				})
			}
		}, error => {
			console.log(error);
		})
	}

	render() {
		return (
			<Row className="post-view-container">
				<Col xs={8} lg={8}>
					<div className="post-title">
					<h1>{this.state.post.title}</h1>
					<h5>{this.state.post.sub_title}</h5>
					</div>
					<PostMdViewer value={this.state.post.content}/>
				</Col>
			</Row>
		);
	}
}

export default View;