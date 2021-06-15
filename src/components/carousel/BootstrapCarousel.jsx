import React, {PureComponent} from 'react'
import {Carousel} from "react-bootstrap";
import "./BootstrapCarousel.scss"

class BootstrapCarousel extends PureComponent {
	render() {
		let items = this.props.files.map(file => <Carousel.Item key={file.uuid}>
			<img className="d-block full-screen" src={file.url} alt={file.title}/>
			<Carousel.Caption>
				<a className="carousel-title" href={file.link} target="_blank" rel="noreferrer">{file.title}</a>
				<div className="carousel-description">{file.description}</div>
			</Carousel.Caption>
		</Carousel.Item>)

		return (
			<Carousel className="bootstrap-carousel" interval={this.props.interval * 1000} controls={false}>
				{items}
			</Carousel>
		)
	}
}

export default BootstrapCarousel;