import fragment from "@utils/tweenMax/webgl/split.fs";
import Effect from "@/utils/tweenMax/webgl/effect";
import gsap from "gsap";

class Split extends Effect {
	type = 'split'
	fragment = fragment
	splitCount = 10

	switchImage(tweenMax, duration, completed) {
		gsap.to(tweenMax.material.uniforms.dispFactor, {
			value: 1.0,
			ease: 'Power4.easeOut',
			duration: duration,
			onComplete: () => {
				completed && completed()
			}
		})
	}

	switchCaption(completed) {
		completed && completed()
	}
}

export default Split;