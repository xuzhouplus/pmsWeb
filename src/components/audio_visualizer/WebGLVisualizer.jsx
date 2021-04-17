import React from "react";
import AudioVisualizerWebGL from "@utils/AudioVisualizerWebGL";
import "./WebGLVisualizer.scss"

class WebGLVisualizer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			src: props.src,
			audioVisualizer: null,
			status: 'start'
		}
	}

	componentDidMount() {
		let audioVisualizer = new AudioVisualizerWebGL({
			mount: document.getElementById('webgl-visualizer')
		})
		this.setState({
			audioVisualizer: audioVisualizer,
			status: 'start'
		})
	}

	componentWillUnmount() {
		this.setState({
			audioVisualizer: null,
			status: 'start'
		})
	}

	play = () => {
		this.state.audioVisualizer.play(this.state.src);
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
			<div id="webgl-visualizer" className="webgl-visualizer">
				<div className={['audio-visualizer-button', this.state.status].join(' ')}>
					<button className="play-button" onClick={this.play}></button>
					<button className="replay-button" onClick={this.replay}></button>
				</div>
			</div>
		);
	}

}

export default WebGLVisualizer;