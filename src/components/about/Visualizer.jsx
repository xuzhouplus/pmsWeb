import React from "react";
import CanvasVisualizer from "@components/audio_visualizer/CanvasVisualizer";
import WebGLVisualizer from "@components/audio_visualizer/WebGLVisualizer";
import "./Visualizer.scss";

class Visualizer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			src: process.env.PUBLIC_URL + '/audio/OneMoreChance.mp3',
			type: this.randomType(),//canvas、webgl
			// src: 'https://m8.music.126.net/21180815163607/04976f67866d4b4d11575ab418904467/ymusic/515a/5508/520b/f0cf47930abbbb0562c9ea61707c4c0b.mp3?infoId=92001',
		}
	}

	randomType = () => {
		let rand = Math.floor(Math.random() * 10);
		if (rand % 2 === 0) {
			return 'webgl';
		} else {
			return 'canvas';
		}
	}

	render() {
		let Visualizer;
		if (this.state.type === 'canvas') {
			Visualizer = CanvasVisualizer
		} else {
			Visualizer = WebGLVisualizer
		}
		return (
			<div className="audio-visualizer full_screen radi">
				<Visualizer src={this.state.src}/>
			</div>
		);
	}

}

export default Visualizer;