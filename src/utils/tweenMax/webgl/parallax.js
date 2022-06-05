import fragment from "./parallax.glsl"
import Effect from "@/utils/tweenMax/webgl/effect";
import gsap from "gsap";

class Parallax extends Effect {
	type = 'parallax'
	fragment = fragment
	duration = 1

	switchImage(tweenMax, reverse, completed) {
		gsap.to(tweenMax.material.uniforms.dispFactor, {
			duration: this.duration,
			value: 1.0,
			ease: 'Expo.easeInOut',
			onComplete: () => {
				completed && completed()
			}
		});
	}
	hideCaption(caption, reverse, completed) {
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
				completed && completed()
			}
		});
	}
	showCaption(caption, reverse, completed) {
		gsap.to(caption, {
			duration: 0.5,
			autoAlpha: 1,
			filter: 'blur(0px)',
			y: 0,
			onComplete: function () {
				completed && completed()
			}
		});
	}
}

export default Parallax;
