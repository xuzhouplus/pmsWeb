import React from "react";
import {ReactSortable} from "react-sortablejs";
import "./CarouselSortable.scss";

class CarouselSortable extends React.Component {
    loading = "/logo192.png"

    state = {
        carousels: []
    }

    constructor(props) {
        super(props);
        this.state.carousels = props.carousels;
    }


    preview = (index, event) => {
        event.stopPropagation();
        event.preventDefault();
        this.props.preview(index)
    }

    setList = (data) => {
        this.setState({
            carousels: data
        })
    }

    onEnd = (data) => {
        console.log(data)
    }

    render() {
        if (this.props.carousels.length > 0) {
            let boxList = this.props.carousels.map((item, index) => {
                let thumbUrl = item.thumb
                if (item.status === 1) {
                    thumbUrl = this.loading
                }
                return <div key={index} className="carousel-item file-box">
                    <img key={index} src={thumbUrl} alt={item.title} onClick={this.preview.bind(this, index)}></img>
                </div>
            });
            return (
                <ReactSortable className="carousel-sortable" direction="horizontal" list={this.props.carousels} setList={this.setList.bind(this)} onEnd={this.onEnd.bind(this)}>{boxList}</ReactSortable>
            );
        }
        return (<div className="carousel-sortable"></div>);
    }
}

export default CarouselSortable;
