//webgl切换效果
import * as THREE from "three";
import TweenMax from "gsap";

class Webgl {
	vertex = 'varying vec2 vUv;void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}';
	fragment = 'varying vec2 vUv;uniform sampler2D currentImage;uniform sampler2D nextImage;uniform float dispFactor;void main() {vec2 uv = vUv;vec4 _currentImage;vec4 _nextImage;float intensity = 0.3;vec4 orig1 = texture2D(currentImage, uv);vec4 orig2 = texture2D(nextImage, uv);_currentImage = texture2D(currentImage, vec2(uv.x, uv.y + dispFactor * (orig2 * intensity)));_nextImage = texture2D(nextImage, vec2(uv.x, uv.y + (1.0 - dispFactor) * (orig1 * intensity)));vec4 finalTexture = mix(_currentImage, _nextImage, dispFactor);gl_FragColor = finalTexture;}';
	material = null

	mesh(current, next) {
		const mat = new THREE.ShaderMaterial({
			uniforms: {
				dispFactor: {type: "f", value: 0.0},
				currentImage: {type: "t", value: current},
				nextImage: {type: "t", value: next}
			},
			vertexShader: this.vertex,
			fragmentShader: this.fragment,
			transparent: true,
			opacity: 1.0
		});

		mat.uniforms.nextImage.value = next;
		mat.uniforms.nextImage.needsUpdate = true;
		this.material = mat

		const geometry = new THREE.PlaneBufferGeometry(container.offsetWidth, container.offsetHeight, 1);
		const object = new THREE.Mesh(geometry, mat);
		object.position.set(0, 0, 0);
		return object
	}

	switchCaption(caption) {
		TweenMax.fromTo(caption, 0.5, {
			autoAlpha: 1,
			filter: 'blur(0px)',
			y: 0
		}, {
			autoAlpha: 0,
			filter: 'blur(10px)',
			y: 20,
			ease: 'Expo.easeIn',
			onComplete: function () {
				TweenMax.to(caption, 0.5, {
					autoAlpha: 1,
					filter: 'blur(0px)',
					y: 0
				});
			}
		});
	}

	switchImage(completed) {
		TweenMax.to(this.material.uniforms.dispFactor, 1, {
			value: 1,
			ease: 'Expo.easeInOut',
			onComplete: function () {
				completed && completed()
			}
		});
	}
}

export default Webgl;