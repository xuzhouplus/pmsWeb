import React from "react";
import {Button, Card, Col, FormControl, InputGroup, Pagination, Row} from "react-bootstrap";
import Loading from "../../components/loading/Loading";
import TreeNavibar from "../../components/navbar/TreeNavibar";
import Utils from "../../utils/Utils";
import PostBox from "../../components/post/PostBox";
import PostEditor from "../../components/post/PostEditor";
import "./List.scss"
import Paginator from "../../components/paginator/Paginator";

class List extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			editor: false,
			editPost: null,
			posts: [],
			page: 1,
			limit: 20,
			count: 0
		}
	}

	componentDidMount() {
		this.getPostList(this.props.match.params.page);
	}

	getPostList = (page) => {
		if (page - 1 > 0) {
			page = 1
		}
		Utils.postList({page: page - 1, limit: this.state.limit}, response => {
			console.log(response);
			this.setState({
				posts: response.data.posts,
				page: response.data.page + 1,
				count: response.data.count
			})
		}, error => {
			console.log(error);
		})
	}

	handleModal = () => {
		this.setState({
			editor: !this.state.editor,
			editPost: null
		})
	}
	afterSave = () => {
		this.handleModal();
		this.setState({
			page: 0
		})
		this.getPostList();
	}
	preview = (index, event) => {
		event.stopPropagation();
		let post = this.state.posts[index];
		window.location.href = '/post/' + post.uuid;
	}
	edit = (index, event) => {
		event.stopPropagation();
		let post = this.state.posts[index];
		this.setState({
			editPost: post.id,
			editor: true
		})
	}
	toggleStatus = (index, event) => {
		event.stopPropagation();
		let post = this.state.posts[index];
		Utils.togglePostStatus(post.id, response => {
			console.log(response)
			this.getPostList(this.state.page);
		}, error => {
			console.log(error);
		});
	}
	delete = (index, event) => {
		event.stopPropagation();
		let post = this.state.posts[index];
		Utils.deletePost(post.id, response => {
			console.log(response)
			this.setState({
				page: 0
			});
			this.getPostList();
		}, error => {
			console.log(error);
		});
	}

	changePage = (page) => {
		console.log(page);
		this.getPostList(page);
	}

	render() {
		let logo = process.env.PUBLIC_URL + '/logo192.png';
		let boxList
		if (this.state.posts.length > 0) {
			boxList = this.state.posts.map((item, index) =>
				<PostBox thumb={item.cover} name={item.title} description={item.sub_title} key={index} preview={this.preview.bind(this, index)} edit={this.edit.bind(this, index)} delete={this.delete.bind(this, index)} putOn={item.status == 2 ? this.toggleStatus.bind(this, index) : null} putOff={item.status == 1 ? this.toggleStatus.bind(this, index) : null}></PostBox>
			);
		} else {
			boxList = <Loading></Loading>
		}
		let editorModal = '';
		if (this.state.editor) {
			editorModal =
				<PostEditor appLogo={logo} id={this.state.editPost} show={this.state.editor} hide={this.handleModal} afterSave={this.afterSave}/>
		}
		return (
			<TreeNavibar active="post">
				{editorModal}
				<Card className="post-list-container">
					<Card.Header className="post-header">
						<Row>
							<Col xs={4} lg={4} className="post-table-search">
								<InputGroup>
									<FormControl placeholder="输入内容搜索"/>
									<InputGroup.Append>
										<Button className="btn-main-color">搜索</Button>
									</InputGroup.Append>
								</InputGroup>
							</Col>
							<Col sx={8} lg={8} className="post-table-buttons">
								<Button onClick={this.handleModal} className="btn-main-color">新建稿件</Button>
							</Col>
						</Row>
					</Card.Header>
					<Card.Body id="post-table" className="post-table">
						<Row className="post-table-list">
							<Col xs={12} lg={12} className="post-list-box">
								{boxList}
							</Col>
						</Row>
					</Card.Body>
					<Card.Footer>
						<Paginator page={this.state.page} count={this.state.count} onClick={this.changePage}></Paginator>
					</Card.Footer>
				</Card>
			</TreeNavibar>
		);
	}
}

export default List;