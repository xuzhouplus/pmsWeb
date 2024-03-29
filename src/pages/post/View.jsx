import React from "react";
import Utils from "../../utils/Utils";
import {Col, Row} from "react-bootstrap";
import PostViewer from "@components/post/PostViewer";
import "./View.scss";
import Map from "@redux/Map";
import {connect} from "react-redux";
import {withRouter} from "@components/router/Router";

class View extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			post: {}
		}
	}

	componentDidMount() {
		this.getPostDetail(this.props.router.params.uuid);
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
			this.props.error(error)
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
					<PostViewer value={this.state.post.content}/>
				</Col>
			</Row>
		);
	}
}

export default connect(null,Map.mapToastDispatchToProps)(withRouter(View));
