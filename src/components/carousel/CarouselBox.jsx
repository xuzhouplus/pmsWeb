import React from "react";

class CarouselBox extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.renderCanvas();
	}

	renderCanvas = () => {
		let image = new Image();
		image.src = this.props.imageUrl;
		image.onload = function () {
			let canvas = document.getElementById('file-preview-box');
			let context = canvas.getContext('2d');
			context.drawImage(image, 0, 0)
		}
	}

	render() {
		return (
			<canvas id="file-preview-box" width={this.props.width} height={this.props.height}>
			</canvas>
		);
	}
}

export default CarouselBox;