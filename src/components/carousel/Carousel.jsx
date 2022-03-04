import React from 'react'
import Loading from "@components/loading/Loading";
import TweenMax from "@utils/tweenMax/tweenMax";
import "./Carousel.scss";

class Carousel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			tweenMax: null
		}
	}

	componentDidMount() {
		this.init()
	}

	componentWillUnmount() {
		this.destroy()
	}

	init = () => {
		let tweenMax = new TweenMax({
			container: document.getElementById('carousel-container'),
			files: this.props.carousels,
			afterLoaded: () => {
				console.log('loaded')
				this.setState({
					isLoading: false
				})
			}
		})
		this.setState({
			tweenMax: tweenMax
		})
	}

	destroy = () => {
		this.state.tweenMax.destroy()
	}

	render() {
		let content
		if (this.state.isLoading) {
			content = <Loading/>
		} else {
			content = []
			for (const file of this.props.carousels) {
				content.push(<img className="carousel-item" src={file.url} alt={file.title} title={file.title}
								  data-link={file.link}/>)
			}
		}
		return (
			<div id="carousel-container" className="carousel-list">
				{content}
			</div>
		)
	}
}

export default Carousel;