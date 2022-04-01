import fragment from "@utils/tweenMax/webgl/slide.fs";
import Effect from "@/utils/tweenMax/webgl/effect";
import gsap from "gsap";

class Slide  extends Effect{
	type = 'slide'
	fragment = fragment
	switchImage(tweenMax, duration, completed) {
		gsap.to(tweenMax.material.uniforms.dispFactor, {
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

export default Slide;