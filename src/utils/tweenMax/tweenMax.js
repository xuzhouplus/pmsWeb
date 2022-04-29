import ImagesLoaded from "imagesloaded";
import * as THREE from "three";
import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";
import Parallax from "@/utils/tweenMax/webgl/parallax";
import Split from "@/utils/tweenMax/webgl/split";
import Separate from "@/utils/tweenMax/webgl/separate";
import Slide from "@/utils/tweenMax/webgl/slide";
import Fade from "@/utils/tweenMax/webgl/fade";
import Clamp from "@utils/tweenMax/webgl/clamp";
import Blinds from "@utils/tweenMax/webgl/blinds";
import "./tweenMax.scss";

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
    //根节点元素
    containerElement = null
    //标题节点元素
    captionElement = null
    //导航节点元素
    paginatorElement = null
    //默认配置项
    options = {
        afterLoaded: function () {

        },
        timeout: 5,
        files: [],
        width: document.body.clientWidth,
        height: document.body.clientHeight,
        autoPlay: true,
        events: true,
        caption: true,
        paginator: true,
        effects: []
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

    constructor(containerElement, props) {
        this.containerElement = containerElement
        this.options = Object.assign({}, this.options, props)
        if (this.containerElement.className.indexOf(this.containerClass) === -1) {
            this.containerElement.className = this.containerElement.className + ' ' + this.containerClass
        }
        this.count = this.options.files.length
        ImagesLoaded(this.containerElement.querySelectorAll('img'), () => {
            this.createRender()
            this.loadFiles()
            this.loadEffects()
            this.fragmentShader()
            this.createMesh()
            this.animate()
            this.setCurrent(0)
            this.switch(false)
            this.options.afterLoaded()
            this.bindEvent()
            this.setTimeout()
        });
        this.createCaption()
        this.createPaginator()
    }

    destroy() {
        this.clearTimeout()
        this.unbindEvent()
        this.destroyRender()
    }

    destroyRender() {
        if (this.renderer) {
            if (this.animating) {
                setTimeout(() => {
                    this.renderer.forceContextLoss();
                    this.renderer = null;
                    this.scene = null;
                    this.camera = null;
                    this.material = null;
                    this.images = [];
                }, 3000)
            }
        }
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
        if (this.renderer) {
            const renderWidth = this.captionElement.clientWidth;
            const renderHeight = this.captionElement.clientHeight;
            this.renderer.setSize(renderWidth, renderHeight);
        }
    }

    focus() {
        this.clearTimeout()
    }

    blur() {
        this.setTimeout()
    }

    bindEvent() {
        if (!this.options.events) {
            return
        }
        if (this.options.paginator) {
            let paginateButtons = Array.from(this.paginatorElement.querySelectorAll('button'));
            paginateButtons.forEach((paginateButton, index) => {
                paginateButton.addEventListener('click', this.paginate.bind(this, index));
            });
        }
        if (this.options.caption) {
            this.captionElement.querySelector('.carousel-title').addEventListener('mouseover', this.focus.bind(this), true);
            this.captionElement.querySelector('.carousel-title').addEventListener('mouseout', this.blur.bind(this), true);
        }
        window.addEventListener('resize', this.resize.bind(this), true);
    }

    unbindEvent() {
        if (!this.options.events) {
            return
        }
        if (this.options.paginator) {
            let paginateButtons = Array.from(this.paginatorElement.querySelectorAll('button'));
            paginateButtons.forEach((paginateButton, index) => {
                paginateButton.removeEventListener('click', this.paginate.bind(this, index));
            });
        }
        if (this.options.caption) {
            this.captionElement.querySelector('.carousel-title').addEventListener('mouseover', this.focus.bind(this), true);
            this.captionElement.querySelector('.carousel-title').addEventListener('mouseout', this.blur.bind(this), true);
        }
        window.removeEventListener('resize', this.resize.bind(this), true);
    }

    setTimeout() {
        if (!this.options.autoPlay) {
            return
        }
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
        this.renderer.domElement.className = 'carousel-webgl'
        this.containerElement.appendChild(this.renderer.domElement);
    }

    animate() {
        if (this.renderer) {
            requestAnimationFrame(this.animate.bind(this));
            this.renderer.render(this.scene, this.camera);
        }
    }

    fragmentShader() {
        let switchTypes = [];
        let branchDispatchers = [];
        let branchDefines = '';
        for (const image of this.images) {
            let type = image.render.renderer.type
            if (switchTypes.indexOf(type) !== -1) {
                continue;
            }
            let fragment = image.render.renderer.fragment
            branchDispatchers.push('if (switchType ==' + image.render.index + '){ finalTexture = ' + type + '();}')
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
        if (!this.options.paginator) {
            return
        }
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
        this.paginatorElement = paginator
        this.containerElement.appendChild(paginator)
    }

    updatePagination() {
        if (!this.options.paginator) {
            return
        }
        let active = this.paginatorElement.querySelector('.active')
        if (active) {
            active.className = ''
        }
        this.paginatorElement.querySelectorAll('button')[this.current].className = 'active';
    }

    createCaption() {
        if (!this.options.caption) {
            return
        }
        let container = document.createElement('div')
        container.className = 'carousel-captions'
        let title = document.createElement('a')
        title.className = 'carousel-title'
        let description = document.createElement('div')
        description.className = 'carousel-description'
        container.appendChild(title)
        container.appendChild(description)
        this.captionElement = container
        this.containerElement.appendChild(container)
    }

    updateCaption() {
        if (!this.options.caption) {
            return
        }
        let file = this.getCurrentFile()
        let carouselTitle = this.captionElement.querySelector('.carousel-title');
        carouselTitle.innerText = file.title;
        carouselTitle.href = file.link
        let carouselDescription = this.captionElement.querySelector('.carousel-description');
        carouselDescription.innerText = file.description
    }

    switch(reverse, completed) {
        if (!this.renderer) {
            return
        }
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
        for (const file of this.options.files) {
            let image = loader.load(file.url);
            image.name = file.title
            image.magFilter = image.minFilter = THREE.LinearFilter;
            image.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
            let render = this.switchRender(file)
            this.images.push({
                image: image,
                render: render
            })
        }
    }

    switchRenderers = {}

    loadEffects() {
        if (this.options.effects.length > 0) {
            this.options.effects.forEach((effect) => {
                this.loadEffect(effect)
            })
        }
    }

    effectIndex = 0

    loadEffect(type) {
        if (this.switchRenderers[type]) {
            return this.switchRenderers[type]
        }
        let renderer
        switch (type) {
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
            default:
                renderer = new Parallax();
        }
        this.switchRenderers[type] = {
            index: this.effectIndex,
            renderer: renderer
        }
        this.effectIndex++;
        return this.switchRenderers[type];
    }

    /**
     * 获取切换效果渲染类
     * @param file
     * @returns {Separate|Slide|Blinds|Parallax|Fade|Clamp|Split}
     */
    switchRender(file) {
        return this.loadEffect(file.switch_type)
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
        this.material.uniforms.switchType.value = currentImage.render.index;
        this.material.uniforms.nextImage.value = currentImage.image;
        this.material.uniforms.nextImage.needsUpdate = true;
        currentImage.render.renderer.switchImage(this, reverse, () => {
            this.material.uniforms.currentImage.value = currentImage.image;
            this.material.uniforms.currentImage.needsUpdate = true;
            this.material.uniforms.dispFactor.value = 0.0;
            completed && completed()
        })
    }

    switchCaption(reverse) {
        if (!this.options.caption) {
            return
        }
        let file = this.getCurrentFile()
        let carouselTitle = this.captionElement.querySelector('.carousel-title');
        let currentImage = this.getCurrentImage()
        currentImage.render.renderer.switchCaption(carouselTitle, reverse, () => {
            carouselTitle.innerText = file.title;
            carouselTitle.href = file.link
        })
        let carouselDescription = this.captionElement.querySelector('.carousel-description');
        currentImage.render.renderer.switchCaption(carouselDescription, reverse, () => {
            carouselDescription.innerText = file.description
        })
    }

    switchFile(index, effectType) {
        this.setCurrent(index)
        let effectRender = this.loadEffect(effectType)
        this.images[index].render = effectRender
        this.switch(false)
    }
}

export default TweenMax
