//分离切换效果
import gsap from "gsap";

class Separate {
	tweenObj = {
		translate: 0
	}
	ctx = null
	blockWidth = 0
	separateCount = 5


	loadFile(tweenMax, file) {
		return tweenMax.loadFile(file, 'image')
	}

	switchImage(tweenMax, image, completed) {
		let render = this
		let blockWidth = tweenMax.options.width / this.separateCount
		gsap.to(this.tweenObj, {
			translate: blockWidth,
			ease: 'Power4.easeOut',
			duration: 2,
			onUpdate: function () {
				let translate = render.tweenObj.translate
				let percent = translate / blockWidth
				if (Math.abs(percent) <= 1) {
					//画5个块，裁剪出位移差
					for (let i = 1; i <= render.separateCount; i++) {
						let imageX = blockWidth * (i - 1)
						let imageY = 0
						let imageWidth = blockWidth * percent
						let imageHeight = tweenMax.options.height
						let canvasX = blockWidth * i - blockWidth * percent
						let canvasY = 0
						let canvasWidth = blockWidth * percent
						let canvasHeight = tweenMax.options.height
						tweenMax.renderer.getContext().drawImage(image, imageX, imageY, imageWidth, imageHeight, canvasX, canvasY, canvasWidth, canvasHeight);
					}
				}
			},
			onComplete: () => {
				completed && completed()
			}
		})
	}

	switchCaption(tweenMax, caption) {

	}
}

export default Separate