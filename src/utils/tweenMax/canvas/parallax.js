import gsap from "gsap";

class Parallax {
	tweenObj = {
		translate: 0.0
	}


	loadFile(tweenMax, file) {
		return tweenMax.loadFile(file, 'image')
	}

	beforeSwitch(tweenMax, current, last, completed) {
		completed && completed()
	}

	mix(){}

	switchImage(tweenMax, current, last, completed) {
		let image = this.loadFile(tweenMax, current)
		let tmp = document.createElement('canvas')
		tmp.width = current.width
		tmp.height = current.height
		let tmpCtx = tmp.getContext('2d')
		tmpCtx.drawImage(image, 0, 0)
		let render = this
		gsap.to(this.tweenObj, {
			translate: 1,
			ease: 'Power4.easeOut',
			duration: 2,
			onUpdate: function () {
				let percent = render.tweenObj.translate
				if (Math.abs(percent) <= 1) {
					//画5个块，裁剪出位移差
					for (let i = 0; i < tweenMax.options.width; i++) {
						for (let j = 0; j < tweenMax.options.height; j++) {
							let pixelColor = tweenMax.canvas.context.getImageData(i, j, 1, 1)
							let tmpColor = tmpCtx.getImageData(i, j, 1, 1)
						}
						let imageX = blockWidth * (i - 1)
						let imageY = 0
						let imageWidth = fileWidth * percent
						let imageHeight = current.height
						let canvasX = blockWidth * i - blockWidth * percent
						let canvasY = 0
						let canvasWidth = blockWidth * percent
						let canvasHeight = tweenMax.options.height
						tweenMax.canvas.context.drawImage(image, imageX, imageY, imageWidth, imageHeight, canvasX, canvasY, canvasWidth, canvasHeight);
					}
				}
			},
			onComplete: () => {
				render.tweenObj.translate = 0.0;
				completed && completed()
			}
		})
	}

	switchCaption(tweenMax, caption) {

	}
}

export default Parallax;