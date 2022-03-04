import Paginator from "@utils/tweenMax/paginator";
import ImagesLoaded from "imagesloaded";
import "./tweenMax.scss";
import Webgl from "@utils/tweenMax/webgl";
import Separate from "@utils/tweenMax/separate";
import Slide from "@utils/tweenMax/slide";
import * as THREE from "three";

class TweenMax {
	current = 0
	count = 0
	timeout = null
	containerClass = "tweenmax-webgl"
	//模板
	template = '<div class="slider-inner"><div class="slider-content"><a id="slide-title" href="%href%" target="_blank">%title%</a><div id="slide-description">%description%</div></div></div>'

	options = {
		container: document.getElementById(this.containerClass),
		afterLoaded: function () {

		},
		timeout: 5,
		files: [],
		width: 1920,
		height: 980
	}

	files = {}
	animate = null
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
		this.createRender()
		this.switch()
	}

	destroy() {
		if (this.timeout) {
			clearTimeout(this.timeout)
		}
	}

	createPaginator() {
		let paginator = new Paginator(this.options.files)
		this.options.container.appendChild(paginator)
	}

	createCaption(file) {
		let caption = this.template.replace('%href%', file.url)
		caption = caption.replace('%title%', file.title)
		return caption.replace('%description%', file.description)
	}

	createFirst() {
		let firstFile = this.options.files[0]
		let render = this.getRender(this.loadFile(firstFile))
	}

	createRender() {
		const renderer = new THREE.WebGLRenderer({
			antialias: false
		});
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setClearColor(0x23272A, 1.0);
		renderer.setSize(this.options.width, this.options.height, false);
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0x23272A);
		const camera = new THREE.OrthographicCamera(this.options.width / -2, this.options.width / 2, this.options.height / 2, this.options.height / -2, 1, 1000);
		camera.position.z = 1;
		this.renderer = renderer
		this.camera = camera
		this.scene = scene
		this.options.container.appendChild(renderer.domElement);
		requestAnimationFrame(this.animate);
		renderer.render(this.scene, this.camera);
	}

	switch() {
		let next = this.getNext()
		let current = this.getCurrent()
		let object = this.getRender(next.file);
		let mesh = object.mesh(this.loadFile(next.file), this.loadFile(current.file))
		this.scene.add(mesh);
		object.switchImage(() => {
			object.switchCaption(this.options.container.querySelector('#slide-title'))
			object.switchCaption(this.options.container.querySelector('#slide-description'))
			this.current++
		})
	}

	//加载图片
	loadFile(file) {
		let loaded = this.files[file.url]
		if (loaded) {
			return loaded
		}
		const loader = new THREE.TextureLoader();
		loader.crossOrigin = "anonymous";
		let image = loader.load(file.url);
		image.magFilter = image.minFilter = THREE.LinearFilter;
		image.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
		this.files[file.url] = image
		return image;
	}

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

	prepareNext() {
		let next = this.current + 1
		if (next > this.count) {
			next = 0
		}
		let nextFile = this.options.files[next]
	}

	getNext() {
		let next = this.current + 1
		if (next > this.count) {
			next = 0
		}
		return {index: next, file: this.options.files[next]};
	}

	getCurrent() {
		return {index: this.current, file: this.options.files[this.current]};
	}

	switch() {
		let next = this.getNext()
		this.current = next
	}
}

export default TweenMax