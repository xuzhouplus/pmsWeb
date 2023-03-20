import React from "react";
import {Button, Card, Col, Form, FormControl, InputGroup, Modal, Row} from "react-bootstrap";
import Loading from "@components/loading/Loading";
import PostBox from "@components/post/PostBox";
import Utils from "@utils/Utils";
import Paginator from "@components/paginator/Paginator";
import "./PostListModal.scss";

class PostListModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cancelTokenSource: null,
			isLoading: false,
			search: '',
			posts: [],
			page: 1,
			limit: 20,
			count: 0
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.show !== this.props.show) {
			this.getPostList(0)
		}
	}

	componentWillUnmount() {
		if (this.state.cancelTokenSource) {
			this.state.cancelTokenSource.cancel('Operation canceled by the user.');
		}
	}

	getPostList = (page) => {
		if (this.state.isLoading) {
			return;
		}
		this.setState({
			idLoading: true
		})
		if ((typeof page == 'undefined') || (page - 1) < 0) {
			page = 1
		}
		let cancelTokenSource = Utils.postList({
			page: page - 1,
			limit: this.state.limit,
			search: this.state.search
		}, response => {
			this.setState({
				isLoading: false,
				posts: response.data.posts,
				page: response.data.page + 1,
				count: response.data.count,
				cancelTokenSource: null
			})
		}, error => {
			console.log(error);
			this.setState({
				posts: [],
				cancelTokenSource: null,
				isLoading: false
			})
		})
		this.setState({
			cancelTokenSource: cancelTokenSource
		})
	}

	changePage = (page) => {
		this.getPostList(page);
	}

	searchChange = (event) => {
		this.setState({
			search: event.target.value ? event.target.value.trim() : null
		})
	}

	handleSearch = (event) => {
		event.stopPropagation();
		event.preventDefault();
		this.getPostList(0)
	}

	preview = (uuid, event) => {
		event.stopPropagation();
		window.open('/post/' + uuid);
	}

	select = (uuid, event) => {
		event.stopPropagation();
		Utils.getPostDetail(uuid, data => {
			this.props.selectPost(data.data)
		}, error => {
			console.log(error)
		})
	}

	render() {
		let boxList
		if (this.state.isLoading) {
			boxList = <Loading></Loading>
		} else {
			if (this.state.posts.length > 0) {
				boxList = [];
				let postBox = [];
				let rowCount = 0
				for (const post of this.state.posts) {
					postBox.push(<Col key={post.uuid} xs={3} lg={3} className="card-body-box"><PostBox thumb={post.cover} name={post.title} description={post.sub_title} preview={this.preview.bind(this, post.uuid)} select={this.select.bind(this, post.uuid)}></PostBox></Col>)
					if (postBox.length === 4) {
						rowCount++
						boxList.push(<Row key={rowCount} className="card-body-row">
							{postBox}
						</Row>)
						postBox = []
					}
				}
				if (postBox) {
					rowCount++
					boxList.push(<Row key={rowCount} className="card-body-row">
						{postBox}
					</Row>)
				}
			}
		}
		return (
			<Modal className="post-list-modal" centered show={this.props.show} onHide={this.props.hide}>
				<Modal.Body>
					<Card className="card-panel">
						<Card.Header>
							<Form inline="true" onSubmit={this.handleSearch}>
								<Row>
									<Col xs={4} lg={4} className="card-header-search">
										<InputGroup>
											<FormControl placeholder="输入内容搜索" onChange={this.searchChange}/>
											<Button className="btn-main-color" type="submit">搜索</Button>
										</InputGroup>
									</Col>
								</Row>
							</Form>
						</Card.Header>
						<Card.Body className="card-panel-body">
							{boxList}
						</Card.Body>
						<Card.Footer className="card-panel-footer">
							<Paginator page={this.state.page} count={this.state.count} onClick={this.changePage}></Paginator>
						</Card.Footer>
					</Card>
				</Modal.Body>
			</Modal>
		)
	}
}

export default PostListModal;
