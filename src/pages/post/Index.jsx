import React from "react";
import Utils from "../../utils/Utils";
import {Button, Col, Container, Form, FormControl, InputGroup, Row} from "react-bootstrap";
import Loading from "../mask/Loading";
import PostBox from "../../components/post/PostBox";
import {connect} from "react-redux";
import Map from "@redux/Map";
import Paginator from "@components/paginator/Paginator";
import "./Index.scss";

class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cancelTokenSource: null,
			isLoading: false,
			search: null,
			page: 0,
			limit: 20,
			posts: []
		}
	}

	componentDidMount() {
		console.log(this.props)
		this.getPostList(0);
	}

	preview = (uuid, event) => {
		event.stopPropagation();
		window.location.href = '/post/' + uuid;
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
		let cancelTokenSource = Utils.posts({page: page - 1, limit: this.state.limit, search: this.state.search}, response => {
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

	componentWillUnmount() {
		if (this.state.cancelTokenSource) {
			this.state.cancelTokenSource.cancel('Operation canceled by the user.');
		}
	}

	render() {
		let boxList
		let paginator = null
		if (this.state.isLoading) {
			boxList = <Loading></Loading>
		} else {
			if (this.state.posts.length > 0) {
				boxList = [];
				let postBox = [];
				let rowCount = 0
				for (const post of this.state.posts) {
					postBox.push(<Col key={post.uuid} className="post-list-box w-20"><PostBox thumb={post.cover} name={post.title} description={post.sub_title} preview={this.preview.bind(this, post.uuid)}></PostBox></Col>)
					if (postBox.length === 5) {
						rowCount++;
						boxList.push(<Row key={rowCount} className="post-table-row">
							{postBox}
						</Row>)
						postBox = []
					}
				}
				if (postBox > 0) {
					rowCount++;
					while (postBox.length < 4) {
						postBox.push(<Col key={rowCount + "" + postBox.length} className="post-list-box w-20"></Col>)
					}
					boxList.push(<Row key={rowCount} className="post-table-row">
						{postBox}
					</Row>)
				}
				paginator = <div className="post-index-footer">
					<Paginator page={this.state.page} count={this.state.count} onClick={this.changePage}></Paginator>
				</div>
			} else {
				boxList = <div id="post-index-container" className="post-index-container">
					<div className="text-center">暂无数据</div>
				</div>
			}
		}
		return (
			<div className="post-index-container">
				<div className="post-index-header">
					<Form inline="true" onSubmit={this.handleSearch}>
						<Row>
							<Col xs={4} lg={4} className="post-table-search">
								<InputGroup>
									<FormControl placeholder="输入内容搜索" onChange={this.searchChange}/>
									<Button className="btn-main-color" type="submit">搜索</Button>
								</InputGroup>
							</Col>
						</Row>
					</Form>
				</div>
				<Container className="post-index-body">
					{boxList}
				</Container>
				{paginator}
			</div>
		);
	}
}

export default connect(null, Map.mapToastDispatchToProps)(Index);
