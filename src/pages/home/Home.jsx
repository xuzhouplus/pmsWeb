import React from 'react';
import WebGlCarousel from "../../components/carousel/WebGLCarousel";
import BootstrapCarousel from "../../components/carousel/BootstrapCarousel";
import Utils from "../../utils/Utils";
import Loading from "@components/loading/Loading";
import {connect} from "react-redux";
import Map from "@redux/Map"
import './Home.scss';
import Empty from "@components/logo/Empty";

class Home extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            cancelTokenSource: null,
            isLoading: false,
            carousel: {
                type: 'webgl',
                files: []
            }
        }
    }

    componentDidMount() {
        if (this.state.carousel.files.length === 0) {
            this.setState({
                isLoading: true
            })
            let cancelTokenSource = Utils.getCarouselIndex(response => {
                if (this.state.cancelTokenSource) {
                    this.setState({
                        isLoading: false,
                        carousel: {
                            files: response.data
                        }
                    })
                }
            }, (error) => {
                this.setState({
                    isLoading: false
                })
                console.log(error);
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
            if (this.state.carousel.files.length === 0) {
                content = <Empty/>
            } else {
                switch (this.props.site.carousel_type) {
                    case 'webgl':
                        content = <WebGlCarousel files={this.state.carousel.files} interval={this.props.site.carousel_interval}/>
                        break;
                    case 'bootstrap':
                        content = <BootstrapCarousel files={this.state.carousel.files} interval={this.props.site.carousel_interval}/>
                        break;
                    default:
                        content = <WebGlCarousel files={this.state.carousel.files} interval={this.props.site.carousel_interval}/>
                }
            }
        }
        return (
            <div className="home-container home-content d-flex justify-content-center align-items-center row">
                {content}
            </div>
        )
    }
}

export default connect(Map.mapSiteStateToProps)(Home);