import ImagesLoaded from "imagesloaded";
import Webgl from "@utils/tweenMax/webgl";
import Separate from "@utils/tweenMax/separate";
import Slide from "@utils/tweenMax/slide";
import * as THREE from "three";
import "./tweenMax.scss";

class TweenMax {
	current = 0
	count = 0
	timeout = null
	containerClass = "tweenmax-webgl"

	options = {
		container: document.getElementById(this.containerClass),
		afterLoaded: function () {

		},
		timeout: 5,
		files: [],
		width: 1920,
		height: 980
	}
	mesh = null

	files = {}
	renderer = null
	scene = null
	camera = null

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
		this.animate()
		this.createFirst()
		this.bindEvent()
		// this.setTimeout()
	}

	destroy() {
		this.clearTimeout()
		this.unbindEvent()
	}

	paginate(index) {
		this.current = index
		this.switch()
	}

	resize() {
		const renderWidth = this.options.container.clientWidth;
		const renderHeight = this.options.container.clientHeight;
		this.renderer.setSize(renderWidth, renderHeight);
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

	createFirst() {
		let firstFile = this.options.files[0]
		this.updateCaption(firstFile)
		let file = this.loadFile(firstFile)
		let mesh = file.render.createMesh(file.texture,firstFile.width,firstFile.height)
		this.scene.add(mesh);
		this.switch()
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
		this.options.container.appendChild(this.renderer.domElement);
	}

	animate() {
		requestAnimationFrame(this.animate.bind(this));
		this.renderer.render(this.scene, this.camera);
	}

	switch() {
		this.updatePagination()
		let current = this.getCurrent()
		let currentFile = this.loadFile(current['file'])
		currentFile.render.switch(this.scene)
		render.imageOut(this.mesh, () => {
			this.mesh.material.vertexShader = render.vertex;
			this.mesh.material.fragmentShader = render.fragment;
			this.mesh.material.uniforms.nextImage.value = currentFile;
			this.mesh.material.uniforms.nextImage.needsUpdate = true;
			render.imageIn(this.mesh, () => {
				this.mesh.material.uniforms.currentImage.value = currentFile;
				this.mesh.material.uniforms.currentImage.needsUpdate = true;
				this.mesh.material.uniforms.dispFactor.value = 0.0;
			})
		})
		let carouselTitle = this.options.container.querySelector('#carousel-title')
		render.captionOut(carouselTitle)
		render.captionIn(carouselTitle)
		let carouselDescription = this.options.container.querySelector('#carousel-description')
		render.captionOut(carouselDescription)
		render.captionIn(carouselDescription)
	}

	/**
	 * 加载图片
	 * @param file
	 * @returns {texture:*,render:*}
	 */
	loadFile(file) {
		let loaded = this.files[file.uuid]
		if (loaded) {
			return loaded
		}
		const loader = new THREE.TextureLoader();
		loader.crossOrigin = "anonymous";
		let image = loader.load(file.url);
		image.magFilter = image.minFilter = THREE.LinearFilter;
		image.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
		this.files[file.uuid] = {
			texture: image,
			render: this.getRender(file)
		}
		return this.files[file.uuid];
	}

	/**
	 * 根据配置加载切换动画
	 * @param file
	 * @returns {Webgl|Slide|Separate}
	 */
	getRender(file) {
		switch (file.switch_type) {
			case 'separate':
				return new Separate();
				break;
			case 'slide':
				return new Slide();
				break;
			case 'webgl':
			default:
				return new Webgl();
		}
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
}

export default TweenMax