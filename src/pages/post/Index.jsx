import React from "react";
import Utils from "../../utils/Utils";
import {Col, Container, Row} from "react-bootstrap";
import Loading from "../mask/Loading";
import PostBox from "../../components/post/PostBox";
import InfiniteScroll from "react-infinite-scroll-component";
import "./Index.scss";

class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cancelTokenSource: null,
			isLoading: false,
			search: null,
			page: 0,
			limit: 10,
			posts: []
		}
	}

	componentDidMount() {
		this.getPostList();
	}

	preview = (index, event) => {
		event.stopPropagation();
		let post = this.state.posts[index];
		window.location.href = '/post/' + post.uuid;
	}

	getPostList = () => {
		if (this.state.isLoading) {
			return;
		}
		this.setState({
			idLoading: true
		})
		const cancelTokenSource = Utils.posts({search: this.state.search, page: this.state.page, limit: this.state.limit}, response => {
			console.log(response)
			if (this.state.cancelTokenSource) {
				this.setState({
					page: response.data.page + 1,
					posts: this.state.posts.concat(response.data.posts)
				})
			}
		}, error => {
			console.log(error);
		});
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
		let boxContent
		if (this.state.isLoading) {
			boxContent = <Loading></Loading>
		} else {
			if (this.state.posts.length > 0) {
				const boxList = this.state.posts.map((item, index) => {
						return <PostBox thumb={item.cover} name={item.title} description={item.sub_title} key={index} preview={this.preview.bind(this, index)}></PostBox>
					}
				);
				boxContent = <InfiniteScroll scrollableTarget="post-index-container" dataLength={this.state.posts.length} next={this.getPostList} hasMore={this.state.size < this.state.limit} loader={<Loading></Loading>}>{boxList}</InfiniteScroll>
			} else {
				boxContent = <div className="text-center">暂无数据</div>
			}
		}
		return (
			<Container>
				<Row id="post-index-container" className="post-index-container">
					<Col xs={12} lg={12} className="post-list-box">
						{boxContent}
					</Col>
				</Row>
			</Container>
		);
	}
}

export default Index;