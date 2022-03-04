import React from "react";
import CanvasVisualizer from "@components/audio_visualizer/CanvasVisualizer";
import WebGLVisualizer from "@components/audio_visualizer/WebGLVisualizer";
import "./Visualizer.scss";

class Visualizer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// src: process.env.PUBLIC_URL + '/audio/OneMoreChance.mp3',
			src: process.env.PUBLIC_URL + '/audio/WhateverItTakes.mp3',
			type: null,//canvas、webgl
			// src: 'https://m8.music.126.net/21180815163607/04976f67866d4b4d11575ab418904467/ymusic/515a/5508/520b/f0cf47930abbbb0562c9ea61707c4c0b.mp3?infoId=92001',
			bg1: {
				src: null,
				display: 'none',
			},
			bg2: {
				src: null,
				display: 'none',
			},
			timeout: null
		}
	}

	componentDidMount() {
		this.randomBg()
		this.randomType()
	}

	componentWillUnmount() {
		clearTimeout(this.state.timeout)
		this.setState({
			timeout: null
		})
	}

	randomType = () => {
		let rand = Math.floor(Math.random() * 10);
		if (rand % 2 === 0) {
			return 'webgl'
		} else {
			return 'canvas'
		}
	}

	randomBg = () => {
		const bgs = [
			'/images/carousels/bipenggou.jpg',
			'/images/carousels/dujiangyan.jpg',
			'/images/carousels/emeishan.jpg',
			'/images/carousels/huashan.jpg',
			'/images/carousels/jianmenguan.jpg',
			'/images/carousels/langzhonggucheng.jpg',
			'/images/carousels/uestc.jpg',
			'/images/carousels/yiheyuan.jpg'
		];
		let rand = Math.floor(Math.random() * bgs.length)
		let bg = bgs[rand]
		let bgBox = document.createElement('div')
		bgBox.setAttribute('class', 'full-screen radi')
		bgBox.setAttribute('style', 'background: #fff url(' + bg + ') no-repeat 50% 50%')
		let container = document.getElementById('audio-visualizer')
		let bgList = container.getElementsByClassName('radi')
		if (bgList.length > 0) {
			let removeBg = bgList[0]
			setTimeout(() => {
				removeBg.remove()
			}, 7000)
		}
		container.appendChild(bgBox)
		if (this.state.timeout) {
			clearTimeout(this.state.timeout)
		}
		let timeout = setTimeout(() => {
			this.randomBg()
		}, 10000)
		this.setState({
			timeout: timeout
		})
	}

	render() {
		let Visualizer;
		if (this.state.type === 'canvas') {
			Visualizer = CanvasVisualizer
		} else {
			Visualizer = WebGLVisualizer
		}
		return (
			<div id="audio-visualizer" className="audio-visualizer">
				<Visualizer src={this.state.src} changeBg={this.randomBg}/>
			</div>
		);
	}
}

export default Visualizer;