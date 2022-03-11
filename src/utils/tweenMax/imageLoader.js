class ImageLoader {
	images = {
		texture: {},
		image: {}
	}

	typeTexture = 'texture'
	typeImage = 'image'

	load(file, type) {
		if (this.images[type][file.uuid]) {
			return this.images[type][file.uuid];
		}
		let image = new Image();
		image.src = file.url
		this.images[type][file.uuid] = image
		return image
	}
}

export default ImageLoader