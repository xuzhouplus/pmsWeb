import React from 'react';
import TweenMax from 'gsap';
import * as THREE from 'three';
import ImagesLoaded from 'imagesloaded';
import configs from '@/configs';
import './WebGLCarousel.scss';

class WebGlCarousel extends React.Component {
	constructor(props) {
		super(props);
		this.interval = null;
	}

	renderCarousel(carousels) {
		let webGLCarouselComponent = this;
		let displacementSlider = function (options) {
			const vertex = 'varying vec2 vUv;void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}';
			const fragment = 'varying vec2 vUv;uniform sampler2D currentImage;uniform sampler2D nextImage;uniform float dispFactor;void main() {vec2 uv = vUv;vec4 _currentImage;vec4 _nextImage;float intensity = 0.3;vec4 orig1 = texture2D(currentImage, uv);vec4 orig2 = texture2D(nextImage, uv);_currentImage = texture2D(currentImage, vec2(uv.x, uv.y + dispFactor * (orig2 * intensity)));_nextImage = texture2D(nextImage, vec2(uv.x, uv.y + (1.0 - dispFactor) * (orig1 * intensity)));vec4 finalTexture = mix(_currentImage, _nextImage, dispFactor);gl_FragColor = finalTexture;}';
			//初始化数据，用于加载图片
			let image = null;
			//用于保存加载的图片
			const sliderImages = [];
			//图片列表
			const images = options.images;
			//第一张图片，用于渲染初始页面
			const firstImage = images[0];
			//容器
			const container = options.container;
			//添加初始图片
			let containerHtml = '';
			//添加初始文字
			containerHtml = containerHtml + '<div class="slider-inner">' +
				'<div id="slider-content">' +
				'<div id="slide-title">' +
				firstImage.title
				+ '</div>' +
				'<div id="slide-status">' +
				firstImage.description
				+ '</div>' +
				'</div>' +
				'</div>';
			//添加导航按钮
			containerHtml = containerHtml + '<div id="pagination"></div>';
			//添加初始化内容
			container.innerHTML = containerHtml;
			//导航按钮容器
			const paginationContainer = container.querySelector('#pagination');
			//文字容器
			const slideTitleEl = container.querySelector('#slide-title');
			const slideStatusEl = container.querySelector('#slide-status');
			//页面尺寸
			const renderWidth = container.clientWidth;
			const renderHeight = container.clientHeight;
			const renderer = new THREE.WebGLRenderer({
				antialias: false
			});

			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setClearColor(0x23272A, 1.0);
			renderer.setSize(renderWidth, renderHeight, false);
			container.appendChild(renderer.domElement);

			const loader = new THREE.TextureLoader();
			loader.crossOrigin = "anonymous";
			//加载图片
			images.forEach(function (img, index) {
				if (img.url.indexOf(configs.proxyBackendHost) === -1) {
					img.url = configs.proxyBackendHost + img.url;
				}
				image = loader.load(img.url);
				image.magFilter = image.minFilter = THREE.LinearFilter;
				image.anisotropy = renderer.capabilities.getMaxAnisotropy();
				sliderImages.push(image);
				//添加导航按钮
				let buttonElement = document.createElement('button');
				buttonElement.setAttribute('data-slide', index.toString());
				buttonElement.setAttribute('data-name', img.title);
				paginationContainer.appendChild(buttonElement);
			});
			//设置第一个按钮类为active
			paginationContainer.firstChild.className = 'active';

			const scene = new THREE.Scene();
			scene.background = new THREE.Color(0x23272A);
			const camera = new THREE.OrthographicCamera(renderWidth / -2, renderWidth / 2, renderHeight / 2, renderHeight / -2, 1, 1000);

			camera.position.z = 1;

			const mat = new THREE.ShaderMaterial({
				uniforms: {
					dispFactor: {type: "f", value: 0.0},
					currentImage: {type: "t", value: sliderImages[0]},
					nextImage: {type: "t", value: sliderImages[1]}
				},
				vertexShader: vertex,
				fragmentShader: fragment,
				transparent: true,
				opacity: 1.0
			});

			const geometry = new THREE.PlaneBufferGeometry(container.offsetWidth, container.offsetHeight, 1);
			const object = new THREE.Mesh(geometry, mat);
			object.position.set(0, 0, 0);
			scene.add(object);

			let isAnimating = false;

			const render = function (slideId) {
				pageIndex = slideId;
				if (!isAnimating) {
					isAnimating = true;
					paginationContainer.querySelector('.active').className = '';
					paginationContainer.querySelectorAll('button')[pageIndex].className = 'active';
					mat.uniforms.nextImage.value = sliderImages[slideId];
					mat.uniforms.nextImage.needsUpdate = true;

					TweenMax.to(mat.uniforms.dispFactor, 1, {
						value: 1,
						ease: 'Expo.easeInOut',
						onComplete: function onComplete() {
							mat.uniforms.currentImage.value = sliderImages[slideId];
							mat.uniforms.currentImage.needsUpdate = true;
							mat.uniforms.dispFactor.value = 0.0;
							isAnimating = false;
						}
					});

					let nextSlideTitle = images[slideId]['title'];
					let nextSlideStatus = images[slideId]['description'];

					TweenMax.fromTo(slideTitleEl, 0.5, {
						autoAlpha: 1,
						filter: 'blur(0px)',
						y: 0
					}, {
						autoAlpha: 0,
						filter: 'blur(10px)',
						y: 20,
						ease: 'Expo.easeIn',
						onComplete: function onComplete() {
							slideTitleEl.innerHTML = nextSlideTitle;
							TweenMax.to(slideTitleEl, 0.5, {
								autoAlpha: 1,
								filter: 'blur(0px)',
								y: 0
							});
						}
					});

					TweenMax.fromTo(slideStatusEl, 0.5, {
						autoAlpha: 1,
						filter: 'blur(0px)',
						y: 0
					}, {
						autoAlpha: 0,
						filter: 'blur(10px)',
						y: 20,
						ease: 'Expo.easeIn',
						onComplete: function onComplete() {
							slideStatusEl.innerHTML = nextSlideStatus;
							TweenMax.to(slideStatusEl, 0.5, {
								autoAlpha: 1,
								filter: 'blur(0px)',
								y: 0,
								delay: 0.1
							});
						}
					});
				}
			};
			let pageIndex = 0;
			const loop = function () {
				if (webGLCarouselComponent.interval) {
					clearInterval(webGLCarouselComponent.interval);
				}
				let interval = setInterval(function () {
					const paginateButtons = Array.from(paginationContainer.querySelectorAll('button'));
					pageIndex++;
					pageIndex = parseInt(pageIndex % paginateButtons.length);
					render(pageIndex);
				}, 5000);
				webGLCarouselComponent.interval = interval;
			};
			const addEvents = function addEvents() {
				let paginateButtons = Array.from(paginationContainer.querySelectorAll('button'));
				paginateButtons.forEach(function (paginateButton) {
					paginateButton.addEventListener('click', function () {
						let slideId = parseInt(this.dataset.slide, 10);
						render(slideId);
						loop();
					});
				});
			};

			addEvents();

			window.addEventListener('resize', function (e) {
				renderer.setSize(renderWidth, renderHeight);
			});

			const animate = function animate() {
				requestAnimationFrame(animate);
				renderer.render(scene, camera);
			};
			animate();
			loop();
		};

		let sliderContainer = document.getElementById('slider');
		let carouselImages = sliderContainer.querySelectorAll('img');
		ImagesLoaded(carouselImages, function () {
			new displacementSlider({
				container: sliderContainer,
				images: carousels
			});
		});
	}

	componentDidMount() {
		this.renderCarousel(this.props.files)
	}

	componentWillUnmount() {
		if (this.interval) {
			clearInterval(this.interval);
		}
	}

	render() {
		return (
			<div className="section row carousel" id="slider">
				<div id="image-list">
				</div>
			</div>
		);
	}
}

export default WebGlCarousel;