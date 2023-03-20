import React from "react";
import {Card, ListGroup} from "react-bootstrap";
import TreeNavibar from "@components/navbar/TreeNavibar";
import Utils from "@utils/Utils";
import {connect} from "react-redux";
import CarouselCreateModal from "@components/carousel/CarouselCreateModal";
import {LinkContainer} from "react-router-bootstrap";
import Map from "@redux/Map";
import TweenMax from "@utils/tweenMax/tweenMax";
import Sortable from "sortablejs";
import CarouselPreviewer from "@components/carousel/CarouselPreviewer";
import './Index.scss'

class Index extends React.Component {
    loading = "/logo192.png"
    componentActive = true

    constructor(props) {
        super(props);
        this.state = {
            idLoading: false,
            carousels: [],
            cancelTokenSource: null,
            showModal: false,
            update: {},
            previewIndex: null,
            previewCarousel: null,
            tweenMax: null,
            sortable: null,
        };
    }

    componentDidMount() {
        this.getCarouselList();
    }

    componentWillUnmount() {
        if (this.state.cancelTokenSource) {
            this.state.cancelTokenSource.cancel('Operation canceled by the user.');
        }
        this.componentActive = false
        this.destroyTweenMax()
        this.destroyCarouselSortable()
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
                    previewIndex: 0,
                    previewCarousel: response.data.list[0]
                })
                setTimeout(() => {
                    this.initTweenMax(response.data.list[0])
                    this.initCarouselSortable()
                }, 300)
            }
        }, error => {
            console.log(error);
            this.setState({
                carousels: [], cancelTokenSource: null, isLoading: false, previewCarousel: {}
            })
            this.props.error(error)
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
            update: {}
        })
    }

    refresh = (id, callback) => {
        Utils.getCarousel(id, (response) => {
            console.log(response)
            if (response.data.status === 1) {
                if (this.componentActive) {
                    setTimeout(() => {
                        this.refresh(id, callback)
                    }, 300);
                }
            } else {
                callback(response.data)
            }
        }, error => {
            console.log(error)
        })
    }

    preview = (index) => {
        let carousel = this.state.carousels[index]
        this.refresh(carousel.id, (response) => {
            let carousels = this.state.carousels
            carousels[index] = response
            this.state.tweenMax.switchFile(response, null, false, () => {
                this.setState({
                    previewIndex: index,
                    carousels: carousels,
                    previewCarousel: response
                })
            }, () => {
            })
        })
    }

    sortableEnd = (data) => {
        console.log(data)
    }

    initTweenMax = (carousel) => {
        if (this.state.tweenMax) {
            this.state.tweenMax.switchFile(carousel)
            return
        }
        let carouselPreview = document.getElementById('carousel-preview-table')
        let tweenMax = new TweenMax(carouselPreview, {
            files: [],
            effects: Utils.getCarouselEffectTypes(),
            paginator: false,
            events: false,
            autoPlay: false,
            width: carouselPreview.clientWidth,
            height: carouselPreview.clientHeight,
            afterLoaded: () => {
                this.setState({
                    isLoading: false
                })
            }
        })
        if (carousel) {
            tweenMax.switchFile(carousel, null, false)
        }
        this.setState({
            tweenMax: tweenMax
        })

    }

    destroyTweenMax = () => {
        if (this.state.tweenMax) {
            this.state.tweenMax.destroy()
        }
        this.setState({
            tweenMax: null
        })
    }

    cancelSortable = (event) => {
        let item = event.from.children[event.newIndex]
        if (event.newIndex > event.oldIndex) {
            event.from.insertBefore(item, event.from.children[event.oldIndex]);
        } else {
            event.from.insertBefore(item, event.from.children[event.oldIndex + 1]);
        }
    }

    initCarouselSortable = () => {
        let sortable = new Sortable(document.querySelector('.carousel-preview-list'), {
            filter: ".carousel-add-box",
            direction: 'horizontal',
            onEnd: (event) => {
                if (event.newIndex === event.oldIndex) {
                    return;
                }
                let direction
                if (event.newIndex < event.oldIndex) {
                    direction = "left"
                } else {
                    direction = "right"
                }
                let loopIndex = 0
                let sortedOrder = {}
                for (let carousel of this.state.carousels) {
                    let carouselIndex = loopIndex;
                    if (carouselIndex === event.oldIndex) {
                        carouselIndex = event.newIndex
                    } else {
                        if (direction === "left") {
                            if (carouselIndex >= event.newIndex && carouselIndex <= event.oldIndex) {
                                carouselIndex = carouselIndex + 1
                            }
                        } else {
                            if (carouselIndex >= event.oldIndex && carouselIndex <= event.newIndex) {
                                carouselIndex = carouselIndex - 1
                            }
                        }
                    }
                    sortedOrder[carousel.id] = carouselIndex
                    loopIndex++;
                }
                Utils.sortCarouselOrder(sortedOrder, (response) => {
                    console.log(response)
                    this.props.success('修改成功');
                }, (error) => {
                    console.log(error)
                    this.props.error({
                        text: '修改失败',
                        onClose: () => {
                            this.cancelSortable(event)
                        }
                    })
                })
            }
        })
        this.setState({
            sortable: sortable
        })
    }

    destroyCarouselSortable = () => {
        if (this.state.sortable) {
            this.state.sortable.destroy()
        }
    }

    updateCarousel = () => {
        if (this.state.previewCarousel) {
            this.setState({
                showModal: true
            })
        }
    }

    deleteCarousel = () => {
        if (this.state.previewCarousel) {
            Utils.deleteCarousel(this.state.previewCarousel.id, response => {
                this.getCarouselList()
            }, error => {
                console.log(error)
            })
        }
    }

    /**
     *
     * @returns {unknown[]}
     */
    mapCarouselSortable() {
        return this.state.carousels.map((item, index) => {
            let thumbUrl = item.thumb
            if (item.status === 1) {
                thumbUrl = this.loading
            }
            let className = ['carousel-button'];
            if (this.state.previewCarousel.uuid === item.uuid) {
                className.push('active')
            }
            return <div key={index} className={className.join(' ')}>
                <img key={index} src={thumbUrl} alt={item.title} onClick={this.preview.bind(this, index)}></img>
            </div>
        });
    }

    /**
     *
     * @returns {string}
     */
    addBoxButton() {
        let addBox = ''
        if (this.state.limit > this.state.carousels.length) {
            addBox = <Card className="carousel-button carousel-add-box" onClick={this.handleModal}>+</Card>
        }
        return addBox;
    }

    changeCaptionStyle = (carousel) => {
        const previewIndex = this.state.previewIndex
        const carousels = this.state.carousels
        carousels[previewIndex] = carousel
        if (this.state.tweenMax) {
            this.state.tweenMax.setCaptionText(carousel.title, carousel.description)
        }
        this.setState({
            carousels: carousels,
            previewCarousel: carousel
        })
    }

    submitCaptionStyle = () => {
        let previewCarousel = this.state.previewCarousel
        Utils.updateCarouselCaptionStyle(previewCarousel, response => {
            let carousels = this.state.carousels
            carousels[this.state.previewIndex] = response.data
            this.setState({
                previewCarousel: response.data,
                carousels: carousels
            })
            this.props.success('保存成功')
        }, error => {
            console.log(error)
            this.props.error(error)
        })
    }

    changeSwitchType = (effect, reverse) => {
        let previewCarousel = this.state.previewCarousel
        if (effect) {
            previewCarousel.switch_type = effect
            this.setState({
                previewCarousel: previewCarousel
            })
        }
        this.state.tweenMax.switchFile(previewCarousel, null, reverse)
    }

    render() {
        let boxList = this.mapCarouselSortable();
        let addBox = this.addBoxButton();
        return (<TreeNavibar>
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
                <CarouselCreateModal show={this.state.showModal} handleModal={this.handleModal}
                                     afterSubmit={this.afterSubmit}/>
                <Card.Body id="carousel-preview-table" className="carousel-preview-table">
                    <CarouselPreviewer carousel={this.state.previewCarousel} onSwitch={this.changeSwitchType} onChange={this.changeCaptionStyle} onSubmit={this.submitCaptionStyle} onDelete={this.deleteCarousel}></CarouselPreviewer>
                </Card.Body>
                <Card.Footer className="carousel-preview-list">
                    {boxList}
                    {addBox}
                </Card.Footer>
            </Card>
        </TreeNavibar>);
    }
}

export default connect(Map.mapStatesToProps, Map.mapToastDispatchToProps)(Index);
