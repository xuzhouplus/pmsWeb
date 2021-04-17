import React from "react"
import AudioVisualizer from "@utils/AudioVisualizer";
import "./CanvasVisualizer.scss"

class CanvasVisualizer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// src: process.env.PUBLIC_URL + '/audio/OneMoreChance.mp3',
			src: props.src,
			audioVisualizer: null,
			status: 'start'
		}
	}

	componentDidMount() {
		const audioVisualizer = new AudioVisualizer();
		audioVisualizer.init();
		this.setState({
			audioVisualizer: audioVisualizer
		})
	}

	componentWillUnmount() {
		this.setState({
			audioVisualizer: null,
			status: 'start'
		})
	}

	play = () => {
		this.state.audioVisualizer.play(this.state.src, () => {
			this.setState({
				status: 'stop'
			})
		});
		this.setState({
			status: 'playing'
		})
	}

	replay = () => {
		this.state.audioVisualizer.replay();
		this.setState({
			status: 'playing'
		})
	}

	render() {
		return (
			<div className="canvas-visualizer">
				<canvas id="audio-visualizer-canvas" width="600" height="600"></canvas>
				<div className={['audio-visualizer-button', this.state.status].join(' ')}>
					<button className="play-button" onClick={this.play}></button>
					<button className="replay-button" onClick={this.replay}></button>
				</div>
			</div>
		);
	}
}

export default CanvasVisualizer;