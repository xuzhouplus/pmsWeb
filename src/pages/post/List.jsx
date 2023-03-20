import React from "react";
import {Button, Card, Col, Form, FormControl, InputGroup, ListGroup, Row} from "react-bootstrap";
import Loading from "../../components/loading/Loading";
import TreeNavibar from "../../components/navbar/TreeNavibar";
import Utils from "../../utils/Utils";
import PostBox from "../../components/post/PostBox";
import PostEditor from "../../components/post/PostEditor";
import Paginator from "../../components/paginator/Paginator";
import {LinkContainer} from "react-router-bootstrap";
import {connect} from "react-redux";
import Map from "@redux/Map";
import "./List.scss"
import {withRouter} from "@components/router/Router";

class List extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cancelTokenSource: null,
			isLoading: false,
			editor: false,
			editPost: null,
			select: false,
			search: '',
			posts: [],
			page: 1,
			limit: 20,
			count: 0
		}
	}

	componentDidMount() {
		this.getPostList(this.props.router.params.page);
	}

	componentWillUnmount() {
		if (this.state.cancelTokenSource) {
			this.state.cancelTokenSource.cancel('Operation canceled by the user.');
		}
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		if (nextProps.account.uuid !== this.props.account.uuid) {
			this.getPostList(this.props.router.params.page);
		}
		return true;
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
		let cancelTokenSource = Utils.postList({page: page - 1, limit: this.state.limit, search: this.state.search}, response => {
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
			this.props.error(error)
		})
		this.setState({
			cancelTokenSource: cancelTokenSource
		})
	}
	showEditor = () => {
		this.setState({
			editor: 'rt'
		})
	}
	hideEditor = () => {
		this.setState({
			editor: null,
			editPost: null
		})
	}
	afterSave = () => {
		this.hideEditor();
		this.setState({
			page: 0
		})
		this.getPostList();
	}

	preview = (uuid, event) => {
		event.stopPropagation();
		window.open('/post/' + uuid);
	}

	edit = (uuid, event) => {
		event.stopPropagation();
		this.setState({
			editPost: uuid,
			editor: 'rt'
		})
	}

	toggleStatus = (uuid, event) => {
		event.stopPropagation();
		Utils.togglePostStatus(uuid, response => {
			this.props.success('修改成功')
			this.getPostList(this.state.page);
		}, error => {
			console.log(error);
			this.props.error(error)
		});
	}

	delete = (uuid, event) => {
		event.stopPropagation();
		Utils.deletePost(uuid, response => {
			this.setState({
				page: 0
			});
			this.props.success('删除成功')
			this.getPostList();
		}, error => {
			console.log(error);
			this.props.error(error)
		});
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

	render() {
		let logo = process.env.PUBLIC_URL + '/logo192.png';
		let boxList
		if (this.state.isLoading) {
			boxList = <Loading></Loading>
		} else {
			if (this.state.posts.length > 0) {
				boxList = [];
				let rowItems = [];
				let rowCount = 0;
				for (const post of this.state.posts) {
					rowItems.push(<Col key={post.uuid} xs={3} lg={3} className="card-body-box"><PostBox thumb={post.cover} name={post.title} description={post.sub_title} preview={this.preview.bind(this, post.uuid)} edit={this.edit.bind(this, post.uuid)} delete={this.delete.bind(this, post.uuid)} putOn={post.status === 2 ? this.toggleStatus.bind(this, post.uuid) : null} putOff={post.status === 1 ? this.toggleStatus.bind(this, post.uuid) : null}></PostBox></Col>)
					if (rowItems.length === 4) {
						rowCount++;
						boxList.push(<Row key={rowCount} className="card-body-row">
							{rowItems}
						</Row>)
						rowItems = []
					}
				}
				if (rowItems) {
					rowCount++;
					boxList.push(<Row key={rowCount} className="card-body-row">
						{rowItems}
					</Row>)
				}
			}
		}
		let postEditor = null
		if (this.state.editor) {
			postEditor = <PostEditor appLogo={logo} id={this.state.editPost} show={this.state.editor} hide={this.hideEditor} afterSave={this.afterSave}/>
		}
		return (
			<TreeNavibar>
				<Card>
					<Card.Body>
						<ListGroup as="ul">
							<LinkContainer to="/file/list">
								<ListGroup.Item action>
									文件管理
								</ListGroup.Item>
							</LinkContainer>
							<LinkContainer to="/carousel">
								<ListGroup.Item action>
									轮播管理
								</ListGroup.Item>
							</LinkContainer>
							<LinkContainer to="/post/list">
								<ListGroup.Item action active disabled>
									稿件管理
								</ListGroup.Item>
							</LinkContainer>
						</ListGroup>
					</Card.Body>
				</Card>
				<Card className="post-list-container card-panel">
					{postEditor}
					<Card.Header className="card-panel-header">
						<Form inline="true" onSubmit={this.handleSearch}>
							<Row>
								<Col xs={4} lg={4} className="card-header-search">
									<InputGroup>
										<FormControl placeholder="输入内容搜索" onChange={this.searchChange}/>
										<Button className="btn-main-color" type="submit">搜索</Button>
									</InputGroup>
								</Col>
								<Col sx={8} lg={8} className="card-header-buttons">
									<Button onClick={this.showEditor} className="btn-main-color">新建稿件</Button>
								</Col>
							</Row>
						</Form>
					</Card.Header>
					<Card.Body id="post-table" className="card-panel-body">
						{boxList}
					</Card.Body>
					<Card.Footer className="card-panel-footer">
						<Paginator page={this.state.page} count={this.state.count} onClick={this.changePage}></Paginator>
					</Card.Footer>
				</Card>
			</TreeNavibar>
		);
	}
}

export default connect(Map.mapAccountStateToProps, Map.mapToastDispatchToProps)(withRouter(List));
