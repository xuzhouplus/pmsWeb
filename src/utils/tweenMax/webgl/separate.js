import fragment from "@utils/tweenMax/webgl/separate.fs";
import Effect from "@/utils/tweenMax/webgl/effect";
import gsap from "gsap";

class Separate extends Effect {
	id = 4
	type = 'separate'

	fragment = fragment

	switchImage(material, duration, completed) {
		gsap.to(material.uniforms.dispFactor, {
			duration: duration,
			value: 1.0,
			ease: 'Expo.easeInOut',
			onComplete: () => {
				completed && completed()
			}
		});
	}

	switchCaption(completed) {
		completed && completed()
	}
}

export default Separate;