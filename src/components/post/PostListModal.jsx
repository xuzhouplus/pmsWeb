import React from "react";
import {Button, Col, Form, FormControl, InputGroup, Modal, Row} from "react-bootstrap";
import Loading from "@components/loading/Loading";
import PostBox from "@components/post/PostBox";
import Utils from "@utils/Utils";
import "./PostListModal.scss";
import InfiniteScroll from "react-infinite-scroll-component";

class PostListModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
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
        let cancelTokenSource = Utils.postList({
            page: page,
            limit: this.state.limit,
            search: this.state.search
        }, response => {
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

    hideModal = () => {
        this.setState({
            show: false
        })
        setTimeout(() => {
            this.props.hide()
        }, 300)
    }

    render() {
        let boxList
        if (this.state.isLoading) {
            boxList = <Loading></Loading>
        } else {
            if (this.state.posts.length > 0) {
                let boxCount = 0;
                boxList = [];
                let postBox = [];
                let lastCount = this.state.posts.length % 4
                let rowCount = Math.ceil(this.state.posts.length / 4)
                for (const post of this.state.posts) {
                    postBox.push(<Col key={post.uuid} xs={3} lg={3} className="post-list-box"><PostBox thumb={post.cover} name={post.title} description={post.sub_title} preview={this.preview.bind(this, post.uuid)} select={this.select.bind(this, post.uuid)}></PostBox></Col>)
                    boxCount++;
                    let columnCount = boxCount % 4
                    let currentRow = Math.ceil(boxCount / 4)
                    if (columnCount === 0) {
                        boxList.push(<Row key={boxCount} className="post-table-row">
                            {postBox}
                        </Row>)
                        postBox = []
                    }
                    if (columnCount === lastCount && rowCount === currentRow) {
                        boxList.push(<Row key={boxCount} className="post-table-row">
                            {postBox}
                        </Row>)
                        postBox = []
                    }
                }
            }
        }
        return (
            <Modal className={this.state.count > 1 ? 'have-scrollbar post-list-modal' : 'no-scrollbar post-list-modal'}
                   centered show={this.state.show} onHide={this.hideModal}>
                <Modal.Header className="post-header">
                    <Form inline="true" onSubmit={this.handleSearch}>
                        <InputGroup className="post-table-search">
                            <FormControl placeholder="输入内容搜索" onChange={this.searchChange}/>
                            <Button className="btn-main-color" type="submit">搜索</Button>
                        </InputGroup>
                    </Form>
                </Modal.Header>
                <Modal.Body id="post-model-container">
                    <InfiniteScroll scrollableTarget='post-model-container' dataLength={this.state.count}
                                    next={this.getPostList} hasMore={this.state.page < this.state.count}
                                    loader={<Loading></Loading>}>
                        {boxList}
                    </InfiniteScroll>
                </Modal.Body>
            </Modal>
        )
    }
}

export default PostListModal;
