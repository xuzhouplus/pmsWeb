import React from 'react';
import {connect} from "react-redux";
import Map from "@redux/Map"
import Carousel from "@components/carousel/Carousel";
import './Home.scss';
import Utils from "@utils/Utils";
import Loading from "@components/loading/Loading";
import Empty from "@components/logo/Empty";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cancelTokenSource: null,
            isLoading: false,
            carousel: []
        }
    }

    componentDidMount() {
        if (this.state.carousel.length === 0) {
            this.setState({
                isLoading: true
            })
            let cancelTokenSource = Utils.getCarouselIndex(response => {
                if (this.state.cancelTokenSource) {
                    this.setState({
                        isLoading: false,
                        carousel: response.data,
                        cancelTokenSource: null
                    })
                }
            }, (error) => {
                this.setState({
                    isLoading: false
                })
                console.log(error);
                this.props.error(error)
            });
            this.setState({
                cancelTokenSource: cancelTokenSource
            })
        }
    }

    componentWillUnmount() {
        if (this.state.cancelTokenSource) {
            this.state.cancelTokenSource.cancel('Operation canceled by the user.');
        }
    }

    render() {
        let content;
        if (this.state.isLoading) {
            content = <Loading/>
        } else {
            if (this.state.carousel.length === 0) {
                content = <Empty/>
            } else {
                content = <Carousel carousels={this.state.carousel}></Carousel>
            }
        }
        return (
            <div className="home-container home-content d-flex justify-content-center align-items-center row">
                {content}
            </div>
        )
    }
}

export default connect(Map.mapSiteStateToProps, Map.mapToastDispatchToProps)(Home);
