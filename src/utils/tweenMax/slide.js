//滑动切换效果
import gsap from "gsap";

class Slide {
	tweenObj = {
		translate: 0
	}

	loadFile(tweenMax, file) {
		return tweenMax.loadFile(file, 'image')
	}

	switchImage(tweenMax, image, completed) {
		let render = this
		gsap.to(this.tweenObj, {
			duration: 1,
			translate: tweenMax.options.width,
			ease: 'Expo.easeIn',
			onUpdate: function () {
				let translate = render.tweenObj.translate
				let imageX = translate
				let imageY = 0
				let imageWidth = translate
				let imageHeight = tweenMax.options.height
				let canvasX = tweenMax.options.width - translate
				let canvasY = 0
				let canvasWidth = translate
				let canvasHeight = tweenMax.options.height
				tweenMax.renderer.getContext().drawImage(image, imageX, imageY, imageWidth, imageHeight, canvasX, canvasY, canvasWidth, canvasHeight);
			},
			onComplete: () => {
				completed && completed()
			}
		})
	}

	switchCaption(tweenMax, caption) {

	}
}

export default Slide;