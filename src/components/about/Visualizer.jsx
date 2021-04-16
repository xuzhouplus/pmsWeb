import React from "react";
import AudioVisualizer from "@/utils/AudioVisualizer";
import "./Visualizer.scss";

class Visualizer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// src: process.env.PUBLIC_URL + '/audio/OneMoreChance.mp3',
			src: 'https://m8.music.126.net/21180815163607/04976f67866d4b4d11575ab418904467/ymusic/515a/5508/520b/f0cf47930abbbb0562c9ea61707c4c0b.mp3?infoId=92001',
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
			<div className="audio-visualizer full_screen">
				<div id="audio-visualizer-wrapper">
					<canvas id="audio-visualizer-canvas" width="600" height="600"></canvas>
					<div id="audio-visualizer-button" className={this.state.status}>
						<button id="play-button" onClick={this.play}></button>
						<button id="replay-button" onClick={this.replay}></button>
					</div>
				</div>
			</div>
		);
	}

}

export default Visualizer;