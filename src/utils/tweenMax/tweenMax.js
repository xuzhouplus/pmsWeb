import ImagesLoaded from "imagesloaded";
import Webgl from "@utils/tweenMax/webgl";
import Separate from "@utils/tweenMax/separate";
import Slide from "@utils/tweenMax/slide";
import * as THREE from "three";
import "./tweenMax.scss";
import imageLoader from "@utils/tweenMax/imageLoader";

class TweenMax {
	//three.js glsl
	vertex = 'varying vec2 vUv;void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}';
	fragment = 'varying vec2 vUv;uniform sampler2D currentImage;uniform sampler2D nextImage;uniform float dispFactor;void main() {vec2 uv = vUv;vec4 _currentImage;vec4 _nextImage;float intensity = 0.3;vec4 orig1 = texture2D(currentImage, uv);vec4 orig2 = texture2D(nextImage, uv);_currentImage = texture2D(currentImage, vec2(uv.x, uv.y + dispFactor * (orig2 * intensity)));_nextImage = texture2D(nextImage, vec2(uv.x, uv.y + (1.0 - dispFactor) * (orig1 * intensity)));vec4 finalTexture = mix(_currentImage, _nextImage, dispFactor);gl_FragColor = finalTexture;}';
	//当前图片索引
	current = 0
	//总图片数
	count = 0
	//轮播定时器
	timeout = null
	//根节点类名
	containerClass = "tweenmax-webgl"
	//默认配置项
	options = {
		container: document.getElementById(this.containerClass),
		afterLoaded: function () {

		},
		timeout: 5,
		files: [],
		width: 1920,
		height: 980
	}
	//three.js 网格对象
	mesh = null
	//已加载图片数据
	images = {
		texture: {},
		image: {}
	}
	//three.js渲染器对象
	renderer = null
	//three.js场景对象
	scene = null
	//three.js
	camera = null
	//特效渲染器
	effectRenderers = {}
	currentImage = null
	lastImage = null

	constructor(props) {
		this.options = Object.assign({}, this.options, props)
		if (this.options.container.className.indexOf(this.containerClass) !== false) {
			this.options.container.className = this.options.container.className + ' ' + this.containerClass
		}
		this.count = this.options.files.length
		ImagesLoaded(this.options.container.querySelectorAll('img'), () => {
			document.body.classList.remove('loading');
			this.options.afterLoaded()
		});
		this.createPaginator()
		this.createCaption()
		this.createRender()
		this.createMesh()
		this.animate()
		this.setCurrent(0)
		this.switch()
		this.bindEvent()
		// this.setTimeout()
	}

	destroy() {
		this.clearTimeout()
		this.unbindEvent()
	}

	paginate(index) {
		this.setCurrent(index)
		this.switch()
	}

	resize() {
		// const renderWidth = this.options.container.clientWidth;
		// const renderHeight = this.options.container.clientHeight;
		// this.renderer.setSize(renderWidth, renderHeight);
	}

	bindEvent() {
		let paginateButtons = Array.from(this.options.container.querySelectorAll('button'));
		paginateButtons.forEach((paginateButton, index) => {
			paginateButton.addEventListener('click', this.paginate.bind(this, index));
		});
		window.addEventListener('resize', this.resize.bind(this), true);
	}

	unbindEvent() {
		let paginateButtons = Array.from(this.options.container.querySelectorAll('button'));
		paginateButtons.forEach((paginateButton, index) => {
			paginateButton.removeEventListener('click', this.paginate.bind(this, index));
		});
		window.removeEventListener('resize', this.resize.bind(this), true);
	}

	setTimeout() {
		this.timeout = setInterval(() => {
			this.current++;
			if (this.current == this.options.files.length) {
				this.current = 0
			}
			this.switch()
		}, this.options.timeout * 1000);
	}

	clearTimeout() {
		if (this.timeout) {
			clearInterval(this.timeout)
		}
	}

	createRender() {
		this.renderer = new THREE.WebGLRenderer({
			antialias: false
		});
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setClearColor(0x23272A, 1.0);
		this.renderer.setSize(this.options.width, this.options.height, false);
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0x23272A);
		this.camera = new THREE.OrthographicCamera(this.options.width / -2, this.options.width / 2, this.options.height / 2, this.options.height / -2, 1, 1000);
		this.camera.position.z = 1;
		this.renderer.domElement.id = 'carousel-webgl'
		this.options.container.appendChild(this.renderer.domElement);
	}

	animate() {
		requestAnimationFrame(this.animate.bind(this));
		this.renderer.render(this.scene, this.camera);
	}

	createMesh() {
		let material = new THREE.ShaderMaterial({
			uniforms: {
				dispFactor: {type: "f", value: 0.0},
				currentImage: {type: "t", value: null},
				nextImage: {type: "t", value: null}
			},
			vertexShader: this.vertex,
			fragmentShader: this.fragment,
			transparent: true,
			opacity: 1.0
		});
		const geometry = new THREE.PlaneBufferGeometry(this.options.width, this.options.height, 1);
		this.mesh = new THREE.Mesh(geometry, material);
		this.mesh.position.set(0, 0, 0);
		this.scene.add(this.mesh);
	}

	createPaginator() {
		let paginator = document.createElement('div')
		paginator.className = 'carousel-paginator'
		for (const index in this.options.files) {
			let file = this.options.files[index]
			let buttonElement = document.createElement('button');
			buttonElement.setAttribute('data-index', index.toString());
			buttonElement.setAttribute('data-title', file.title);
			buttonElement.setAttribute('data-url', file.url);
			buttonElement.setAttribute('data-link', file.link);
			paginator.appendChild(buttonElement);
		}
		this.options.container.appendChild(paginator)
	}

	updatePagination() {
		let active = this.options.container.querySelector('.active')
		if (active) {
			active.className = ''
		}
		this.options.container.querySelectorAll('button')[this.current].className = 'active';
	}

	createCaption() {
		let container = document.createElement('div')
		container.id = 'carousel-caption'
		let title = document.createElement('a')
		title.id = 'carousel-title'
		let description = document.createElement('div')
		description.id = 'carousel-description'
		container.appendChild(title)
		container.appendChild(description)
		this.options.container.appendChild(container)
	}

	updateCaption(file) {
		let carouselTitle = this.options.container.querySelector('#carousel-title');
		carouselTitle.innerText = file.title;
		carouselTitle.href = file.link
		let carouselDescription = this.options.container.querySelector('#carousel-description');
		carouselDescription.innerText = file.description
	}

	switch() {
		this.updatePagination()
		//获取特效渲染器
		let currentEffectRenderer = this.getEffectRenderer(this.currentImage.file);
		//加载图片对象，如果是webgl渲染类型，返回的是three.js texture，其他为Image对象
		let currentFile = currentEffectRenderer.loadFile(this, this.currentImage.file)
		//更新轮播图文字
		this.updateCaption(this.currentImage.file)
		currentEffectRenderer.switchImage(this, currentFile, null)
		let carouselTitle = this.options.container.querySelector('#carousel-title')
		currentEffectRenderer.switchCaption(this, carouselTitle)
		let carouselDescription = this.options.container.querySelector('#carousel-description')
		currentEffectRenderer.switchCaption(this, carouselDescription)
	}

	/**
	 * 获取图片特效渲染器
	 * @param file
	 * @returns {Separate|Slide|Webgl|*}
	 */
	getEffectRenderer(file) {
		let effectRenderer = this.effectRenderers[file.uuid]
		if (effectRenderer) {
			return effectRenderer
		}
		switch (file.switch_type) {
			case 'separate':
				effectRenderer = new Separate();
				break;
			case 'slide':
				effectRenderer = new Slide();
				break;
			case 'webgl':
			default:
				effectRenderer = new Webgl();
		}
		this.effectRenderers[file.uuid] = effectRenderer;
		return effectRenderer;
	}

	/**
	 * 加载图片
	 * @param file
	 * @returns {texture:*,render:*}
	 */
	loadFile(file, type) {
		let loaded = this.images[type][file.uuid]
		if (this.images[type][file.uuid] && this.images[type][file.uuid][file]) {
			return loaded
		}
		if (file.switch_type == 'webgl') {
			const loader = new THREE.TextureLoader();
			loader.crossOrigin = "anonymous";
			let image = loader.load(file.url);
			image.magFilter = image.minFilter = THREE.LinearFilter;
			image.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
			this.images[type][file.uuid] = image
		} else {
			let image = new Image();
			image.src = file.url
			this.images[type][file.uuid] = image
		}
		return this.images[type][file.uuid];
	}

	/**
	 * 获取上一张图片
	 * @returns {{file: *, index: number}}
	 */
	getLast() {
		let last
		if (this.current == 0) {
			last = this.count - 1
		} else {
			last = this.current - 1
		}
		return {index: last, file: this.options.files[last]};
	}

	/**
	 * 获取下一张图片
	 * @returns {{file: *, index: number}}
	 */
	getNext() {
		let next = this.current + 1
		if (next > this.count) {
			next = 0
		}
		return {index: next, file: this.options.files[next]};
	}

	/**
	 * 获取当前图片
	 * @returns {{file: *, index: number}}
	 */
	getCurrent() {
		return {index: this.current, file: this.options.files[this.current]};
	}

	/**
	 * 更新当前图片
	 * @param index
	 */
	setCurrent(index) {
		this.lastImage = this.currentImage
		this.current = index
		this.currentImage = this.getCurrent();
	}
}

export default TweenMax