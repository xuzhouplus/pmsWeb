class Paginator {
	constructor(files) {
		let paginator = document.createElement('div')
		paginator.className = 'tweenmax-webgl-paginator'
		files.map((file, index) => {
			let buttonElement = document.createElement('button');
			buttonElement.setAttribute('data-index', index.toString());
			buttonElement.setAttribute('data-title', file.title);
			buttonElement.setAttribute('data-url', file.url);
			buttonElement.setAttribute('data-link', file.link);
			paginator.appendChild(buttonElement);
		})
		return paginator
	}
}

export default Paginator