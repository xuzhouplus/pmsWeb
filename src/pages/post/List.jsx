import React from "react";
import {Button, Card, Col, Pagination} from "react-bootstrap";
import Loading from "../../components/loading/Loading";
import TreeNavibar from "../../components/navbar/TreeNavibar";
import FileBox from "../../components/file/FileBox";
import "./List.scss"
import FileUploadModal from "../../components/file/FileUploadModal";
import PostEditor from "../../components/post/PostEditor";
import Utils from "../../utils/Utils";

class List extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			editor: false,
			posts: [],
			page: 0,
			limit: 20
		}
	}

	componentDidMount() {
		this.getPostList();
	}

	getPostList = () => {
		Utils.postList({page: this.state.page, limit: this.state.limit}, response => {
			console.log(response);
			this.setState({
				posts: response.data.posts,
				page: response.data.page + 1
			})
		}, error => {
			console.log(error);
		})
	}

	handleModal = () => {
		this.setState({
			editor: !this.state.editor
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

	render() {
		let logo = process.env.PUBLIC_URL + '/logo192.png';
		let boxList
		if (this.state.posts.length > 0) {
			boxList = this.state.posts.map((item, index) =>
				<FileBox thumb={item.cover} name={item.title} description={item.sub_title} key={index} preview={this.preview.bind(this, index)} delete={this.delete.bind(this, index)}></FileBox>
			);
		} else {
			boxList = <Loading></Loading>
		}
		let editorModal = '';
		if (this.state.editor) {
			editorModal = <PostEditor appLogo={logo} show={this.state.editor} hide={this.handleModal} afterSave={this.afterSave}/>
		}
		return (
			<TreeNavibar active="post">
				{editorModal}
				<Card className="post-list-container">
					<Card.Header className="post-header">
						<Col xs={12} lg={12}>
							<Button onClick={this.handleModal} className="btn-main-color">新建稿件</Button>
						</Col>
					</Card.Header>
					<Card.Body id="post-table" className="post-table">
						<Col xs={12} lg={12} className="post-list-box">
							{boxList}
						</Col>
					</Card.Body>
					<Card.Footer>
						<Pagination>
							<Pagination.First/>
							<Pagination.Prev/>
							<Pagination.Item>{1}</Pagination.Item>
							<Pagination.Ellipsis/>

							<Pagination.Item>{10}</Pagination.Item>
							<Pagination.Item>{11}</Pagination.Item>
							<Pagination.Item active>{12}</Pagination.Item>
							<Pagination.Item>{13}</Pagination.Item>
							<Pagination.Item disabled>{14}</Pagination.Item>

							<Pagination.Ellipsis/>
							<Pagination.Item>{20}</Pagination.Item>
							<Pagination.Next/>
							<Pagination.Last/>
						</Pagination>
					</Card.Footer>
				</Card>
			</TreeNavibar>
		);
	}
}

export default List;