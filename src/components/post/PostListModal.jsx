import React from "react";
import {Button, Card, Col, Form, FormControl, InputGroup, Modal, Row} from "react-bootstrap";
import Paginator from "@components/paginator/Paginator";
import Loading from "@components/loading/Loading";
import PostBox from "@components/post/PostBox";
import Utils from "@utils/Utils";
import "./PostListModal.scss";
import InfiniteScroll from "react-infinite-scroll-component";

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

    componentDidMount() {
        this.getPostList(0);
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
        if (typeof page == 'undefined') {
            page = this.state.page
        }
        let cancelTokenSource = Utils.postList({page: page, limit: this.state.limit, search: this.state.search}, response => {
            console.log(response);
            this.setState({
                isLoading: false,
                posts: this.state.posts.concat(response.data.posts),
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
        console.log(page);
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

    preview = (index, event) => {
        event.stopPropagation();
        let post = this.state.posts[index];
        window.open('/post/' + post.uuid);
    }

    select = (index, event) => {
        event.stopPropagation();
        this.props.selectPost(this.state.posts[index])
    }

    render() {
        let boxList
        if (this.state.isLoading) {
            boxList = <Loading></Loading>
        } else {
            if (this.state.posts.length > 0) {
                boxList = this.state.posts.map((item, index) =>
                    <PostBox thumb={item.cover} name={item.title} description={item.sub_title} key={index} preview={this.preview.bind(this, index)} select={this.select.bind(this, index)}></PostBox>
                );
            }
        }
        return (
            <Modal className={this.state.count > 1 ? 'have-scrollbar post-list-modal' : 'no-scrollbar post-list-modal'} centered show={this.props.show} onHide={this.props.hide}>
                <Modal.Header className="post-header">
                    <Form inline="true" onSubmit={this.handleSearch}>
                        <InputGroup className="post-table-search">
                            <FormControl placeholder="输入内容搜索" onChange={this.searchChange}/>
                            <Button className="btn-main-color" type="submit">搜索</Button>
                        </InputGroup>
                    </Form>
                </Modal.Header>
                <Modal.Body id="post-model-container">
                    <InfiniteScroll scrollableTarget='post-model-container' dataLength={this.state.count} next={this.getPostList} hasMore={this.state.page < this.state.count} loader={<Loading></Loading>}>
                        {boxList}
                    </InfiniteScroll>
                </Modal.Body>
            </Modal>
        )
    }
}

export default PostListModal;