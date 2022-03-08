//webgl切换效果
import gsap from "gsap";
import * as THREE from "three";

class Webgl {
	vertex = 'varying vec2 vUv;void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}';
	fragment = 'varying vec2 vUv;uniform sampler2D currentImage;uniform sampler2D nextImage;uniform float dispFactor;void main() {vec2 uv = vUv;vec4 _currentImage;vec4 _nextImage;float intensity = 0.3;vec4 orig1 = texture2D(currentImage, uv);vec4 orig2 = texture2D(nextImage, uv);_currentImage = texture2D(currentImage, vec2(uv.x, uv.y + dispFactor * (orig2 * intensity)));_nextImage = texture2D(nextImage, vec2(uv.x, uv.y + (1.0 - dispFactor) * (orig1 * intensity)));vec4 finalTexture = mix(_currentImage, _nextImage, dispFactor);gl_FragColor = finalTexture;}';
	width = 1920
	height = 800
	container = null
	mesh = null

	files = {}

	constructor(container, width, height) {
		this.container = container
		this.width = width
		this.height = height
		this.createRender()
		this.createMesh()
		this.animate()
	}

	createRender() {
		this.renderer = new THREE.WebGLRenderer({
			antialias: false
		});
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setClearColor(0x23272A, 1.0);
		this.renderer.setSize(this.width, this.height, false);
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0x23272A);
		this.camera = new THREE.OrthographicCamera(this.width / -2, this.width / 2, this.height / 2, this.height / -2, 1, 1000);
		this.camera.position.z = 1;
		this.container.appendChild(this.renderer.domElement);
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
		const geometry = new THREE.PlaneBufferGeometry(this.width, this.height, 1);
		this.mesh = new THREE.Mesh(geometry, material);
		this.mesh.position.set(0, 0, 0);
		this.scene.add(this.mesh);
	}

	loadFile(file) {
		if (this.files[file.uuid]) {
			return this.files[file.uuid];
		}
		const loader = new THREE.TextureLoader();
		loader.crossOrigin = "anonymous";
		let image = loader.load(file.url);
		image.magFilter = image.minFilter = THREE.LinearFilter;
		image.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
		this.files[file.uuid] = image
		return image
	}

	//预渲染，把canvas切换为上一张图片
	previewRender(current, next) {
		this.mesh.material.uniforms.currentImage.value = current;
		this.mesh.material.uniforms.currentImage.needsUpdate = true;
		this.mesh.material.uniforms.dispFactor.value = 0.0;
		let canvas = this.container.querySelector('canvas')
		canvas.style.display = 'block'
		let image = this.container.querySelector('#carousel-image')
		image.style.display = 'none'
	}

	switchImage(texture, completed) {
		this.mesh.material.uniforms.nextImage.value = texture;
		this.mesh.material.uniforms.nextImage.needsUpdate = true;
		gsap.to(this.mesh.material.uniforms.dispFactor, {
			duration: 1,
			value: 1,
			ease: 'Expo.easeInOut',
			onComplete: () => {
				this.mesh.material.uniforms.currentImage.value = texture;
				this.mesh.material.uniforms.currentImage.needsUpdate = true;
				this.mesh.material.uniforms.dispFactor.value = 0.0;
				completed && completed()
			}
		});
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

export default Webgl;