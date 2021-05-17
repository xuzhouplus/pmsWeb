import React from "react"
import AudioVisualizerCanvas from "@utils/AudioVisualizerCanvas";
import "./CanvasVisualizer.scss"

class CanvasVisualizer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// src: process.env.PUBLIC_URL + '/audio/OneMoreChance.mp3',
			src: props.src,
			audioVisualizer: null,
			status: 'loading'
		}
	}

	componentDidMount() {
		const audioVisualizer = new AudioVisualizerCanvas();
		audioVisualizer.init({
			audio: this.state.src,
			onload: () => {
				this.setState({
					status: 'start'
				})
			},
			onended: () => {
				this.setState({
					status: 'stop'
				})
			}
		});
		this.setState({
			audioVisualizer: audioVisualizer
		})
	}

	componentWillUnmount() {
		this.state.audioVisualizer.close();
		this.setState({
			audioVisualizer: null,
			status: 'start'
		})
	}

	play = () => {
		switch (this.state.status) {
			case 'start':
				this.state.audioVisualizer.play();
				this.setState({
					status: 'playing'
				})
				break;
			case 'stop':
				this.state.audioVisualizer.replay();
				this.setState({
					status: 'playing'
				})
				break;
			case 'playing':
				this.props.changeBg()
				break;
			default:
		}
	}

	render() {
		return (
			<div className="canvas-visualizer">
				<canvas id="audio-visualizer-canvas" width="600" height="600"></canvas>
				<div className={['audio-visualizer-button', this.state.status].join(' ')}>
					<button className="logo-button" onClick={this.play}></button>
				</div>
			</div>
		);
	}
}

export default CanvasVisualizer;