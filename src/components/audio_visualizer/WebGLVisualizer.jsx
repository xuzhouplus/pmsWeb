import React from "react";
import AudioVisualizerWebGL from "@utils/AudioVisualizerWebGL";
import "./WebGLVisualizer.scss"

class WebGLVisualizer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			src: props.src,
			audioVisualizer: null,
			status: 'loading',
			bg: null
		}
	}

	componentDidMount() {
		let audioVisualizer = new AudioVisualizerWebGL({
			mount: document.getElementById('webgl-visualizer'),
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
		})
		let isPlaying = audioVisualizer.isPlaying()
		this.setState({
			audioVisualizer: audioVisualizer,
			status: isPlaying ? 'playing' : 'start'
		})
		window.addEventListener('resize', this.onWindowResize.bind(this))
	}

	componentWillUnmount() {
		this.state.audioVisualizer.stop();
		this.setState({
			audioVisualizer: null,
			status: 'start'
		})
		window.removeEventListener('resize', this.onWindowResize.bind(this))
	}

	onWindowResize = () => {
		this.state.audioVisualizer.setup()
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
				this.state.audioVisualizer.pause();
				this.setState({
					status: 'pause'
				})
				break;
			case 'pause':
				this.state.audioVisualizer.resume();
				this.setState({
					status: 'playing'
				})
				break;
			default:
		}
	}

	render() {
		return (
			<div id="webgl-visualizer" className="webgl-visualizer">
				<div className={['audio-visualizer-button', this.state.status].join(' ')}>
					<button className="logo-button" onClick={this.play} title="播放"></button>
				</div>
			</div>
		);
	}

}

export default WebGLVisualizer;
