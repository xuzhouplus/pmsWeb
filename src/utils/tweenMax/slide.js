//滑动切换效果
import gsap from "gsap";

class Slide {
	width = 1920
	height = 800
	container = null
	files = {}

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

	//预渲染，把图片放到窗口右边
	previewRender(last, current) {

	}

	switchImage(image, completed) {
		image.className = 'carousel-image'
		image.style.left = this.width
		image.style.width = this.width
		image.style.height = this.height
		this.container.appendChild(image)
		gsap.to(image,  {
			duration: 1,
			x: 0,
			ease: 'Expo.easeIn',
			onComplete: () => {
				completed && completed()
			}
		})
	}

	switchCaption(caption) {

	}
}

export default Slide;