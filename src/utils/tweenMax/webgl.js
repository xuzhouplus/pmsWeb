//webgl切换效果
import gsap from "gsap";
import * as THREE from "three";

class Webgl {
	vertex = 'varying vec2 vUv;void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}';
	fragment = 'varying vec2 vUv;uniform sampler2D currentImage;uniform sampler2D nextImage;uniform float dispFactor;void main() {vec2 uv = vUv;vec4 _currentImage;vec4 _nextImage;float intensity = 0.3;vec4 orig1 = texture2D(currentImage, uv);vec4 orig2 = texture2D(nextImage, uv);_currentImage = texture2D(currentImage, vec2(uv.x, uv.y + dispFactor * (orig2 * intensity)));_nextImage = texture2D(nextImage, vec2(uv.x, uv.y + (1.0 - dispFactor) * (orig1 * intensity)));vec4 finalTexture = mix(_currentImage, _nextImage, dispFactor);gl_FragColor = finalTexture;}';

	createMesh(file, width, height) {
		let material = new THREE.ShaderMaterial({
			uniforms: {
				dispFactor: {type: "f", value: 0.0},
				currentImage: {type: "t", value: file},
				nextImage: {type: "t", value: null}
			},
			vertexShader: this.vertex,
			fragmentShader: this.fragment,
			transparent: true,
			opacity: 1.0
		});
		const geometry = new THREE.PlaneBufferGeometry(width, height, 1);
		this.mesh = new THREE.Mesh(geometry, material);
		this.mesh.position.set(0, 0, 0);
		return this.mesh;
	}

	switch(scene,file, width, height){

	}

	captionIn(caption) {
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

	captionOut(caption) {

	}

	imageIn(mesh, completed) {
		gsap.to(mesh.material.uniforms.dispFactor, {
			duration: 1,
			value: 1,
			ease: 'Expo.easeInOut',
			onComplete: function () {
				completed && completed()
			}
		});
	}

	imageOut(material, completed) {

	}
}

export default Webgl;