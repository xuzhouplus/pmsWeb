//webgl切换效果
import gsap from "gsap";

class Webgl {
	vertex = 'varying vec2 vUv;void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}';
	fragment = 'varying vec2 vUv;uniform sampler2D currentImage;uniform sampler2D nextImage;uniform float dispFactor;void main() {vec2 uv = vUv;vec4 _currentImage;vec4 _nextImage;float intensity = 0.3;vec4 orig1 = texture2D(currentImage, uv);vec4 orig2 = texture2D(nextImage, uv);_currentImage = texture2D(currentImage, vec2(uv.x, uv.y + dispFactor * (orig2 * intensity)));_nextImage = texture2D(nextImage, vec2(uv.x, uv.y + (1.0 - dispFactor) * (orig1 * intensity)));vec4 finalTexture = mix(_currentImage, _nextImage, dispFactor);gl_FragColor = finalTexture;}';

	loadFile(tweenMax, file) {
		return tweenMax.loadFile(file, 'texture')
	}

	beforeSwitch(tweenMax, current, last, completed) {
		tweenMax.canvas.element.style.display = 'none'
		completed && completed()
	}

	switchImage(tweenMax, current, last, completed) {
		let texture = this.loadFile(tweenMax, current)
		tweenMax.mesh.material.uniforms.nextImage.value = texture;
		tweenMax.mesh.material.uniforms.nextImage.needsUpdate = true;
		tweenMax.mesh.material.uniforms.switchType.value = 2;
		gsap.to(tweenMax.mesh.material.uniforms.dispFactor, {
			duration: 2,
			value: 1,
			ease: 'Expo.easeInOut',
			onComplete: () => {
				tweenMax.mesh.material.uniforms.currentImage.value = texture;
				tweenMax.mesh.material.uniforms.currentImage.needsUpdate = true;
				tweenMax.mesh.material.uniforms.dispFactor.value = 0.0;
				completed && completed()
			}
		});
	}

	switchCaption(tweenMax, caption) {
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