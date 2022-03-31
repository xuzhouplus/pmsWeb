import ImagesLoaded from "imagesloaded";
import * as THREE from "three";
import vertex from "./vertex.vs";
import fragment from "./fragment.fs";
import gsap from "gsap";
import "./tweenMax.scss";
import Parallax from "@/utils/tweenMax/webgl/parallax";
import Split from "@/utils/tweenMax/webgl/split";
import Separate from "@/utils/tweenMax/webgl/separate";
import Slide from "@/utils/tweenMax/webgl/slide";

class TweenMax {
	//three.js glsl
	vertex = vertex;
	fragment = '';
	//当前图片索引
	current = 0
	//总图片数
	count = 0
	//轮播定时器
	timeout = null
	//根节点类名
	containerClass = "tweenmax-carousel"
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
	//three.js渲染器对象
	renderer = null
	//three.js场景对象
	scene = null
	//three.js
	camera = null
	//three.js
	material = null
	//已加载图片数据
	images = []

	switchTypeMap = {
		webgl: 1,
		slide: 2,
		split: 3,
		separate: 4
	}

	constructor(props) {
		this.options = Object.assign({}, this.options, props)
		if (this.options.container.className.indexOf(this.containerClass) === -1) {
			this.options.container.className = this.options.container.className + ' ' + this.containerClass
		}
		this.count = this.options.files.length
		ImagesLoaded(this.options.container.querySelectorAll('img'), () => {
			this.createRender()
			this.loadFiles()
			this.fragmentShader()
			this.createMesh()
			this.animate()
			this.setCurrent(0)
			this.switch()
			this.options.afterLoaded()
			this.bindEvent()
			// this.setTimeout()
		});
		this.createPaginator()
		this.createCaption()
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
			if (this.current === this.options.files.length) {
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

	fragmentShader() {
		let branchDispatchers = [];
		let branchDefines = '';
		for (const image of this.images) {
			let fragment = image.render.fragment
			let type = image.render.type
			branchDispatchers.push('if (switchType ==' + image.id + '){ finalTexture = ' + type + '();}')
			branchDefines += fragment
		}
		let branchDispatcher = branchDispatchers.join('else ')
		let fragmentShader = fragment.replace('//branchDefines', branchDefines)
		fragmentShader = fragmentShader.replace('//branchDispatcher', branchDispatcher)
		this.fragment = fragmentShader
	}

	createMesh() {
		this.material = new THREE.ShaderMaterial({
			uniforms: {
				currentImage: {type: "t", value: null},
				nextImage: {type: "t", value: null},
				dispFactor: {type: "f", value: 0.0},
				switchType: {type: "f", value: 0.0},
				sectionIndex: {type: "f", value: 0.0},
			},
			vertexShader: this.vertex,
			fragmentShader: this.fragment,
			transparent: true,
			opacity: 1.0
		});
		const geometry = new THREE.PlaneBufferGeometry(this.options.width, this.options.height, 1, 1);
		let mesh = new THREE.Mesh(geometry, this.material);
		mesh.position.set(0, 0, 0);
		this.scene.add(mesh);
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

	updateCaption() {
		let file = this.getCurrentFile()
		let carouselTitle = this.options.container.querySelector('#carousel-title');
		carouselTitle.innerText = file.title;
		carouselTitle.href = file.link
		let carouselDescription = this.options.container.querySelector('#carousel-description');
		carouselDescription.innerText = file.description
	}

	switch() {
		this.updatePagination()
		//更新轮播图文字
		this.updateCaption()
		this.switchImage(() => {
			let carouselTitle = this.options.container.querySelector('#carousel-title')
			this.switchCaption(carouselTitle)
			let carouselDescription = this.options.container.querySelector('#carousel-description')
			this.switchCaption(carouselDescription)
		})
	}

	/**
	 * 加载图片
	 */
	loadFiles() {
		const loader = new THREE.TextureLoader();
		loader.crossOrigin = "anonymous";
		let index = 0;
		for (const file of this.options.files) {
			let image = loader.load(file.url);
			image.name = file.title
			image.magFilter = image.minFilter = THREE.LinearFilter;
			image.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
			let render = this.switchRender(file)
			this.images.push({
				id: index + '.0',
				image: image,
				render: render
			})
			index++;
		}
	}

	/**
	 * 获取切换效果渲染类
	 * @param file
	 * @returns {Split|Parallax|Slide|Separate}
	 */
	switchRender(file) {
		switch (file.switch_type) {
			case 'parallax':
				return new Parallax();
			case 'split':
				return new Split();
			case 'separate':
				return new Separate();
			case 'slide':
				return new Slide();
		}
	}

	/**
	 * 更新当前图片
	 * @param index
	 */
	setCurrent(index) {
		this.current = index
	}

	getCurrentFile() {
		return this.options.files[this.current]
	}

	getCurrentImage() {
		return this.images[this.current]
	}

	switchImage(completed) {
		let currentImage = this.getCurrentImage()
		let currentFile = this.getCurrentFile()
		this.material.uniforms.switchType.value = currentImage.id * 1.0;
		this.material.uniforms.nextImage.value = currentImage.image;
		this.material.uniforms.nextImage.needsUpdate = true;
		currentImage.render.switchImage(this.material, currentFile.duration, () => {
			this.material.uniforms.currentImage.value = currentImage.image;
			this.material.uniforms.currentImage.needsUpdate = true;
			this.material.uniforms.dispFactor.value = 0.0;
			completed && completed();
		})
	}

	switchCaption(caption) {
		gsap.fromTo(caption, {
			autoAlpha: 1,
			filter: 'blur(0px)',
			y: 0
		}, {
			duration: 0.5,
			autoAlpha: 0,
			filter: 'blur(10px)',
			y: 20,
			ease: 'Expo.easeIn',
			onComplete: function () {
				gsap.to(caption, {
					duration: 0.5,
					autoAlpha: 1,
					filter: 'blur(0px)',
					y: 0
				});
			}
		});
	}
}

export default TweenMax