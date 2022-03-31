import fragment from "@utils/tweenMax/webgl/split.fs";
import Effect from "@/utils/tweenMax/webgl/effect";
import gsap from "gsap";

class Split extends Effect {
	type = 'split'
	fragment = fragment
	splitCount = 1

	switchImage(material, duration, completed) {
		new Promise((resolve) => {
			for (let i = 1; i <= this.splitCount; i++) {
				let tweenMaxObj = {
					translate: 0.0
				}
				gsap.to(tweenMaxObj, {
					translate: 1.0,
					ease: 'Power4.easeIn',
					duration: duration,
					delay: duration / this.splitCount * (i - 1),
					onUpdate: () => {
						material.uniforms.sectionIndex.value = i * 1.0
						material.uniforms.dispFactor.value = tweenMaxObj.translate
					},
					onComplete:()=>{
						if (i == this.splitCount) {
							resolve()
						}
					}
				})
			}
		}).then(r => {
			completed && completed()
		})
	}

	switchCaption(completed) {
		completed && completed()
	}
}

export default Split;