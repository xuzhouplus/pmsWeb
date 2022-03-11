//webgl切换效果
import gsap from "gsap";

class Webgl {
	loadFile(tweenMax,file) {
		return tweenMax.loadFile(file, 'texture')
	}

	switchImage(tweenMax, texture, completed) {
		tweenMax.mesh.material.uniforms.nextImage.value = texture;
		tweenMax.mesh.material.uniforms.nextImage.needsUpdate = true;
		gsap.to(tweenMax.mesh.material.uniforms.dispFactor, {
			duration: 1,
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

	switchCaption(tweenMax,caption) {
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