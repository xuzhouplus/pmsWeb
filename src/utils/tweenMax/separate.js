//分离切换效果
import gsap from "gsap";

class Separate {
	width = 1920
	height = 800
	container = null
	files = {}
	tweenObj = {
		translate: 0
	}

	blockWidth = 0
	cutWidth = 0
	cutHeight = 0
	cutX = 0
	cutY = 0
	ctx = null

	constructor(container, width, height) {
		this.container = container
		this.width = width
		this.height = height
	}

	loadFile(file) {
		if (this.files[file.uuid]) {
			return this.files[file.uuid];
		}
		let image = new Image();
		image.src = file.url
		this.files[file.uuid] = image
		return image
	}

	toWebgl() {

	}

	//预渲染，把图片放到窗口右边
	previewRender(last, current) {
		// 每一个显示块的宽度
		this.blockWidth = this.width / 5

		// 使用的图片大小 720/1280=0.5625
		// 图片裁剪区域
		if (this.height / this.width > 0.5625) {
			this.cutWidth = 720 * this.width / this.height
			this.cutX = (1280 - this.cutWidth) / 2
			this.cutHeight = 720
			this.cutY = 0
		} else {
			this.cutHeight = 1280 * this.height / this.width
			this.cutY = (720 - this.cutHeight) / 2
			this.cutWidth = 1280
			this.cutX = 0
		}
		let carouselWebgl = this.container.querySelector('#carousel-webgl')
		if (carouselWebgl) {
			carouselWebgl.style.display = 'none'
		}
		let canvas = document.createElement('canvas')
		canvas.id = 'carousel-canvas'
		canvas.width = this.width
		canvas.height = this.height
		this.container.appendChild(canvas)
		this.ctx = canvas.getContext("2d");
		this.ctx.drawImage(last, 0, 0, this.width, this.height)
		canvas.style.zIndex = 2
	}

	switchImage(image, completed) {
		let render = this
		gsap.to(this.tweenObj, {
			translate: this.width,
			ease: 'Power4.easeOut',
			duration: 2,
			onUpdate: function () {
				let translate = render.tweenObj.translate
				let i = 0
				let percent = -translate / render.width - i
				if (Math.abs(percent) <= 1) {
					let n2scale = 2 - Math.abs(percent) * 2
					if (n2scale > 1) {
						n2scale = 1
					}
					let n1scale = 1 - Math.abs(percent) * 2
					if (n1scale < 0) {
						n1scale = 0
					}
					//画5个块，裁剪出位移差
					render.ctx.drawImage(image, render.cutX + render.cutWidth * percent * 0.2 + render.cutWidth / 5 * Math.abs(percent) * 2, render.cutY, render.cutWidth / 5 * n1scale, render.cutHeight, (render.width * i + translate) * 0.6 + render.blockWidth * (1 - n1scale), 0, render.blockWidth * n1scale, render.height);
					render.ctx.drawImage(image, render.cutX + render.cutWidth / 5 - render.cutWidth * percent * 0.1 + render.cutWidth / 5 - render.cutWidth / 5 * n2scale, render.cutY, render.cutWidth / 5 * n2scale, render.cutHeight, (render.width * i + translate) * 0.6 + render.blockWidth + render.blockWidth - render.blockWidth * n2scale, 0, render.blockWidth * n2scale, render.height);
					render.ctx.drawImage(image, render.cutX + render.cutWidth / 5 * 2 - render.cutWidth * percent * 0.4, render.cutY, render.cutWidth / 5, render.cutHeight, (render.width * i + translate) * 0.6 + render.blockWidth * 2, 0, render.blockWidth, render.height);
					render.ctx.drawImage(image, render.cutX + render.cutWidth / 5 * 3 - render.cutWidth * percent * 0.1, render.cutY, render.cutWidth / 5 * n2scale, render.cutHeight, (render.width * i + translate) * 0.6 + render.blockWidth * 3, 0, render.blockWidth * n2scale, render.height);
					render.ctx.drawImage(image, render.cutX + render.cutWidth / 5 * 4 + render.cutWidth * percent * 0.2, render.cutY, render.cutWidth / 5 * n1scale, render.cutHeight, (render.width * i + translate) * 0.6 + render.blockWidth * 4, 0, render.blockWidth * n1scale, render.height);
				}
			}
		})
	}

	switchCaption(caption) {

	}
}

export default Separate