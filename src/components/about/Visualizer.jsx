import React from "react";
import CanvasVisualizer from "@components/audio_visualizer/CanvasVisualizer";
import WebGLVisualizer from "@components/audio_visualizer/WebGLVisualizer";
import "./Visualizer.scss";
import Helmet from "react-helmet";
import {Col, Container, Row} from "react-bootstrap";
import Navibar from "@components/navbar/Navibar";
import Footer from "@components/footer/Footer";
import MaintainNavbar from "@components/navbar/MaintainNavbar";
import configs from "@/configs";

class Visualizer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// src: process.env.PUBLIC_URL + '/audio/OneMoreChance.mp3',
			src: process.env.PUBLIC_URL + '/audio/WhateverItTakes.mp3',
			type: this.randomType(),//canvas、webgl
			// src: 'https://m8.music.126.net/21180815163607/04976f67866d4b4d11575ab418904467/ymusic/515a/5508/520b/f0cf47930abbbb0562c9ea61707c4c0b.mp3?infoId=92001',
			bg1: {
				src: null,
				display: 'none',
			},
			bg2: {
				src: null,
				display: 'none',
			},
			interval: null
		}
	}

	componentDidMount() {
		setTimeout(() => {
			this.randomBg();
		}, 1500)
		let interval = setInterval(() => {
			this.randomBg();
		}, 5000)
		this.setState({
			interval: interval
		})
	}

	componentWillUnmount() {
		clearInterval(this.state.interval)
		this.setState({
			interval: null
		})
	}

	randomType = () => {
		let rand = Math.floor(Math.random() * 10);
		if (rand % 2 === 0) {
			return 'webgl';
		} else {
			return 'canvas';
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
		let rand = Math.floor(Math.random() * bgs.length);
		let bg = bgs[rand]
		let bgBox = document.createElement('div')
		bgBox.setAttribute('class', 'full_screen position-absolute radi')
		bgBox.setAttribute('style', 'background: #fff url(' + bg + ') no-repeat 50% 50%')
		let container = document.getElementById('audio-visualizer')
		let bgList = container.getElementsByClassName('radi')
		if (bgList.length > 0) {
			let removeBg = bgList[0]
			setTimeout(() => {
				removeBg.remove()
			}, 1500)
		}
		container.appendChild(bgBox)
	}

	render() {
		let Visualizer;
		if (this.state.type === 'canvas') {
			Visualizer = CanvasVisualizer
		} else {
			Visualizer = WebGLVisualizer
		}
		return (
			<Container fluid className="app-container">
				<Helmet title={configs.defaultTitle} link={[{rel: "shortcut icon", href: configs.defaultFavicon}]}></Helmet>
				<Row className={["app-header", "fixed-top", "home-page"]}>
					<Col xs={12} lg={12}>
						<MaintainNavbar/>
					</Col>
				</Row>
				<Row className="app-body">
					<Col xs={12} lg={12}>
						<div id="audio-visualizer" className="row audio-visualizer full_screen">
							<Visualizer src={this.state.src} changeBg={this.randomBg}/>
						</div>
					</Col>
				</Row>
				<Row className={["app-footer", "fixed-bottom", "home-page"]}>
					<Col xs={12} lg={12}>
						<Footer site={{icp: configs.defaultICP}}/>
					</Col>
				</Row>
			</Container>
		);
	}
}

export default Visualizer;