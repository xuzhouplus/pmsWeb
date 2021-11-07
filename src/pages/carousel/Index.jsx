import React from "react";
import {Button, Card, ListGroup} from "react-bootstrap";
import TreeNavibar from "../../components/navbar/TreeNavibar";
import Utils from "../../utils/Utils";
import {connect} from "react-redux";
import CarouselCreateModal from "../../components/carousel/CarouselCreateModal";
import {LinkContainer} from "react-router-bootstrap";
import Map from "@redux/Map";
import './Index.scss'

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idLoading: false,
            carousels: [],
            cancelTokenSource: null,
            showModal: false,
            update: {},
            preview: {}
        };
    }

    componentDidMount() {
        this.getCarouselList();
    }

    componentWillUnmount() {
        if (this.state.cancelTokenSource) {
            this.state.cancelTokenSource.cancel('Operation canceled by the user.');
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextProps.account.uuid !== this.props.account.uuid) {
            this.getCarouselList();
        }
        return true;
    }

    getCarouselList = () => {
        if (this.state.isLoading) {
            return;
        }
        this.setState({
            idLoading: true
        })
        const cancelTokenSource = Utils.getCarouselList({}, (response) => {
            if (this.state.cancelTokenSource) {
                this.setState({
                    carousels: response.data.list,
                    limit: response.data.limit,
                    cancelTokenSource: null,
                    isLoading: false,
                    preview: response.data.list[0]
                })
            }
        }, error => {
            console.log(error);
            this.setState({
                carousels: [],
                cancelTokenSource: null,
                isLoading: false,
                preview: {}
            })
        })
        this.setState({
            cancelTokenSource: cancelTokenSource
        })
    }

    handleModal = () => {
        this.setState({
            showModal: !this.state.showModal
        })
    }

    afterSubmit = (carousel) => {
        this.handleModal();
        this.getCarouselList()
        this.setState({
            update: {},
            preview: carousel
        })
    }

    preview = (index, event) => {
        event.stopPropagation();
        this.setState({
            preview: this.state.carousels[index]
        })
    }

    update = (carousel, event) => {
        event.stopPropagation();
        this.setState({
            update: carousel,
            showModal: true
        })
    }

    delete = (deleteCarousel, event) => {
        event.stopPropagation();
        Utils.deleteCarousel(deleteCarousel.id, (response) => {
            this.getCarouselList();
        }, (error) => {
            console.log(error);
        })
    }

    render() {
        let boxList = this.state.carousels.map((item, index) =>
            <div key={index} className="carousel-button file-box">
                <img key={index} src={item.thumb} alt={item.title} onClick={this.preview.bind(this, index)}></img>
            </div>
        );
        let uploadModal = '';
        if (this.state.showModal) {
            uploadModal = <CarouselCreateModal show={this.state.showModal} handleModal={this.handleModal} afterSubmit={this.afterSubmit} carousel={this.state.update}/>
        }
        let previewBox = '';
        if (this.state.preview) {
            previewBox = <div className="carousel-preview" style={{backgroundImage: "url(" + this.state.preview.url + ")"}}>
                <div className="carousel-info-box">
                    <div className="carousel-preview-title">{this.state.preview.title}</div>
                    <div className="carousel-preview-description">{this.state.preview.description}</div>
                    <Button variant="primary" className="btn-main-color carousel-update-button" onClick={this.update.bind(this, this.state.preview)}>编辑</Button>
                    <Button variant="primary" className="btn-main-color carousel-delete-button" onClick={this.delete.bind(this, this.state.preview)}>删除</Button>
                </div>
            </div>
        }
        let addBox = '';
        if (this.state.limit > this.state.carousels.length) {
            addBox = <Card className="carousel-button file-box" onClick={this.handleModal}>+</Card>
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
                                <ListGroup.Item action active disabled>
                                    轮播管理
                                </ListGroup.Item>
                            </LinkContainer>
                            <LinkContainer to="/post/list">
                                <ListGroup.Item action>
                                    稿件管理
                                </ListGroup.Item>
                            </LinkContainer>
                        </ListGroup>
                    </Card.Body>
                </Card>
                <Card className="carousel-list-container">
                    {uploadModal}
                    <Card.Body id="file-table" className="file-table">
                        {previewBox}
                    </Card.Body>
                    <Card.Footer className="carousel-preview-list">
                        {boxList}
                        {addBox}
                    </Card.Footer>
                </Card>
            </TreeNavibar>
        );
    }
}

export default connect(Map.mapStatesToProps, null)(Index);