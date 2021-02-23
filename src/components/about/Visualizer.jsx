import React from "react";
import AudioVisualizer from "@/utils/AudioVisualizer";
import "./Visualizer.scss";

class Visualizer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			src: process.env.PUBLIC_URL + '/audio/OneMoreChance.mp3',
			audioVisualizer: null
		}
	}

	componentDidMount() {
		const audioVisualizer = new AudioVisualizer();
		audioVisualizer.init();
		this.setState({
			audioVisualizer: audioVisualizer
		})
	}

	play = () => {
		this.state.audioVisualizer.play(this.state.src);
	}

	resume = () => {
		this.state.audioVisualizer.resume();
	}

	stop = () => {
		this.state.audioVisualizer.stop();
	}

	render() {
		return (
			<div className="audio-visualizer full_container">
				<div id="audio-visualizer-wrapper">
					<canvas id="audio-visualizer-canvas" width="800" height="350"></canvas>
					<div id="audio-visualizer-button">
						<button id="audio-visualizer-play" onClick={this.play}>play</button>
						<button id="audio-visualizer-resume" onClick={this.resume}>resume</button>
						<button id="audio-visualizer-stop" onClick={this.stop}>stop</button>
					</div>
					<div id="audio-visualizer-text"></div>
				</div>
			</div>
		);
	}

}

export default Visualizer;