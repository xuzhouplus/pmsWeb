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
		current.className = 'carousel-image'
		current.style.left = '-100%'
		current.style.width = this.width
		current.style.height = this.height
		this.container.appendChild(current)
	}

	switchImage(image, completed) {
		gsap.to(image,  {
			duration: 1,
			left: '0',
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