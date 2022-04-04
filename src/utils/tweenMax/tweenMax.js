import ImagesLoaded from "imagesloaded";
import * as THREE from "three";
import vertex from "./vertex.vs";
import fragment from "./fragment.fs";
import gsap from "gsap";
import "./tweenMax.scss";
import Parallax from "@/utils/tweenMax/webgl/parallax";
import Split from "@/utils/tweenMax/webgl/split";
import Separate from "@/utils/tweenMax/webgl/separate";
import Slide from "@/utils/tweenMax/webgl/slide";
import Fade from "@/utils/tweenMax/webgl/fade";
import Clamp from "@utils/tweenMax/webgl/clamp";
import Blinds from "@utils/tweenMax/webgl/blinds";

class TweenMax {
    //three.js glsl
    vertex = vertex;
    fragment = '';
    //当前图片索引
    current = 0
    //总图片数
    count = 0
    //轮播定时器
    timeout = null
    //是否正在动画
    animating = false
    //根节点类名
    containerClass = "tweenmax-carousel"
    //默认配置项
    options = {
        container: document.getElementById(this.containerClass),
        afterLoaded: function () {

        },
        timeout: 5,
        files: [],
        width: document.body.clientWidth,
        height: document.body.clientHeight
    }
    //three.js渲染器对象
    renderer = null
    //three.js场景对象
    scene = null
    //three.js
    camera = null
    //three.js
    material = null
    //已加载图片数据
    images = []

    constructor(props) {
        this.options = Object.assign({}, this.options, props)
        if (this.options.container.className.indexOf(this.containerClass) === -1) {
            this.options.container.className = this.options.container.className + ' ' + this.containerClass
        }
        this.count = this.options.files.length
        ImagesLoaded(this.options.container.querySelectorAll('img'), () => {
            this.createRender()
            this.loadFiles()
            this.fragmentShader()
            this.createMesh()
            this.animate()
            this.setCurrent(0)
            this.switch(false)
            this.options.afterLoaded()
            this.bindEvent()
            this.setTimeout()
        });
        this.createPaginator()
        this.createCaption()
    }

    destroy() {
        this.clearTimeout()
        this.unbindEvent()
    }

    paginate(index) {
        if (this.current === index) {
            return
        }
        if (this.animating) {
            return
        }
        this.clearTimeout()
        this.animating = true
        let reverse = this.current > index
        this.setCurrent(index)
        this.switch(reverse, () => {
            this.animating = false
            this.setTimeout()
        })
    }

    resize() {
        const renderWidth = this.options.container.clientWidth;
        const renderHeight = this.options.container.clientHeight;
        this.renderer.setSize(renderWidth, renderHeight);
    }

    focus() {
        this.clearTimeout()
    }

    blur() {
        this.setTimeout()
    }

    bindEvent() {
        let paginateButtons = Array.from(this.options.container.querySelectorAll('button'));
        paginateButtons.forEach((paginateButton, index) => {
            paginateButton.addEventListener('click', this.paginate.bind(this, index));
        });
        window.addEventListener('resize', this.resize.bind(this), true);
        this.options.container.querySelector('#carousel-caption').addEventListener('mouseover', this.focus.bind(this), true);
        this.options.container.querySelector('#carousel-caption').addEventListener('mouseout', this.blur.bind(this), true);
    }

    unbindEvent() {
        let paginateButtons = Array.from(this.options.container.querySelectorAll('button'));
        paginateButtons.forEach((paginateButton, index) => {
            paginateButton.removeEventListener('click', this.paginate.bind(this, index));
        });
        window.removeEventListener('resize', this.resize.bind(this), true);
        this.options.container.querySelector('#carousel-caption').addEventListener('mouseover', this.focus.bind(this), true);
        this.options.container.querySelector('#carousel-caption').addEventListener('mouseout', this.blur.bind(this), true);
    }

    setTimeout() {
        this.clearTimeout()
        let currentFile = this.getCurrentFile()
        this.timeout = setTimeout(() => {
            this.current++;
            if (this.current === this.options.files.length) {
                this.current = 0
            }
            this.switch(false, () => {
                this.setTimeout()
            })
        }, currentFile.timeout * 1000);
    }

    clearTimeout() {
        if (this.timeout) {
            clearTimeout(this.timeout)
        }
    }

    createRender() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: false
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x23272A, 1.0);
        this.renderer.setSize(this.options.width, this.options.height, false);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x23272A);
        this.camera = new THREE.OrthographicCamera(this.options.width / -2, this.options.width / 2, this.options.height / 2, this.options.height / -2, 1, 1000);
        this.camera.position.z = 1;
        this.renderer.domElement.id = 'carousel-webgl'
        this.options.container.appendChild(this.renderer.domElement);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }

    fragmentShader() {
        let switchTypes = [];
        let branchDispatchers = [];
        let branchDefines = '';
        for (const image of this.images) {
            let type = image.render.type
            if (switchTypes.indexOf(type) !== -1) {
                continue;
            }
            let fragment = image.render.fragment
            branchDispatchers.push('if (switchType ==' + image.id + '){ finalTexture = ' + type + '();}')
            branchDefines += fragment
            switchTypes.push(type)
        }
        let branchDispatcher = branchDispatchers.join('else ')
        let fragmentShader = fragment.replace('//branchDefines', branchDefines)
        fragmentShader = fragmentShader.replace('//branchDispatcher', branchDispatcher)
        this.fragment = fragmentShader
    }

    createMesh() {
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                currentImage: {type: 't', value: null},
                nextImage: {type: 't', value: null},
                dispFactor: {type: 'f', value: 0.0},
                switchType: {value: 1},
                reverse: {value: false}
            },
            vertexShader: this.vertex,
            fragmentShader: this.fragment,
            transparent: true,
            opacity: 1.0
        });
        const geometry = new THREE.PlaneBufferGeometry(this.options.width, this.options.height, 1, 1);
        let mesh = new THREE.Mesh(geometry, this.material);
        mesh.position.set(0, 0, 0);
        this.scene.add(mesh);
    }

    createPaginator() {
        let paginator = document.createElement('div')
        paginator.className = 'carousel-paginator'
        for (const index in this.options.files) {
            let file = this.options.files[index]
            let buttonElement = document.createElement('button');
            buttonElement.setAttribute('data-index', index.toString());
            buttonElement.setAttribute('data-title', file.title);
            buttonElement.setAttribute('data-url', file.url);
            buttonElement.setAttribute('data-link', file.link);
            paginator.appendChild(buttonElement);
        }
        this.options.container.appendChild(paginator)
    }

    updatePagination() {
        let active = this.options.container.querySelector('.active')
        if (active) {
            active.className = ''
        }
        this.options.container.querySelectorAll('button')[this.current].className = 'active';
    }

    createCaption() {
        let container = document.createElement('div')
        container.id = 'carousel-caption'
        let title = document.createElement('a')
        title.id = 'carousel-title'
        let description = document.createElement('div')
        description.id = 'carousel-description'
        container.appendChild(title)
        container.appendChild(description)
        this.options.container.appendChild(container)
    }

    updateCaption() {
        let file = this.getCurrentFile()
        let carouselTitle = this.options.container.querySelector('#carousel-title');
        carouselTitle.innerText = file.title;
        carouselTitle.href = file.link
        let carouselDescription = this.options.container.querySelector('#carousel-description');
        carouselDescription.innerText = file.description
    }

    switch(reverse, completed) {
        this.updatePagination()
        this.switchImage(reverse, () => {
            completed && completed()
        })
        this.switchCaption(reverse)
    }

    /**
     * 加载图片
     */
    loadFiles() {
        const loader = new THREE.TextureLoader();
        loader.crossOrigin = "anonymous";
        let index = 0;
        for (const file of this.options.files) {
            let image = loader.load(file.url);
            image.name = file.title
            image.magFilter = image.minFilter = THREE.LinearFilter;
            image.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
            let render = this.switchRender(file)
            this.images.push({
                id: index,
                image: image,
                render: render
            })
            index++;
        }
    }

    switchRenderers = {}

    /**
     * 获取切换效果渲染类
     * @param file
     * @returns {Separate|Slide|Blinds|Parallax|Fade|Clamp|Split}
     */
    switchRender(file) {
        if (this.switchRenderers[file.switch_type]) {
            return this.switchRenderers[file.switch_type]
        }
        let renderer
        switch (file.switch_type) {
            case 'parallax':
                renderer = new Parallax();
                break;
            case 'split':
                renderer = new Split();
                break;
            case 'separate':
                renderer = new Separate();
                break;
            case 'slide':
                renderer = new Slide();
                break;
            case 'fade':
                renderer = new Fade();
                break;
            case 'clamp':
                renderer = new Clamp();
                break;
            case 'blinds':
                renderer = new Blinds();
                break;
        }
        this.switchRenderers[file.switch_type] = renderer
        return renderer
    }

    /**
     * 更新当前图片
     * @param index
     */
    setCurrent(index) {
        this.current = index
    }

    getCurrentFile() {
        return this.options.files[this.current]
    }

    getCurrentImage() {
        return this.images[this.current]
    }

    switchImage(reverse, completed) {
        let currentImage = this.getCurrentImage()
        this.material.uniforms.switchType.value = currentImage.id;
        this.material.uniforms.nextImage.value = currentImage.image;
        this.material.uniforms.nextImage.needsUpdate = true;
        currentImage.render.switchImage(this, reverse, () => {
            this.material.uniforms.currentImage.value = currentImage.image;
            this.material.uniforms.currentImage.needsUpdate = true;
            this.material.uniforms.dispFactor.value = 0.0;
            completed && completed()
        })
    }

    switchCaption(reverse) {
        let file = this.getCurrentFile()
        let carouselTitle = this.options.container.querySelector('#carousel-title');
        let currentImage = this.getCurrentImage()
        currentImage.render.switchCaption(carouselTitle, reverse, () => {
            carouselTitle.innerText = file.title;
            carouselTitle.href = file.link
        })
        let carouselDescription = this.options.container.querySelector('#carousel-description');
        currentImage.render.switchCaption(carouselDescription, reverse, () => {
            carouselDescription.innerText = file.description
        })
    }
}

export default TweenMax