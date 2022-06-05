//webgl切换效果
import * as THREE from "three";
import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";
import Parallax from "@utils/tweenMax/webgl/parallax";
import Split from "@utils/tweenMax/webgl/split";
import Separate from "@utils/tweenMax/webgl/separate";
import Slide from "@utils/tweenMax/webgl/slide";
import Fade from "@utils/tweenMax/webgl/fade";
import Clamp from "@utils/tweenMax/webgl/clamp";
import Blinds from "@utils/tweenMax/webgl/blinds";
import "./tweenMax.scss";

class TweenMax {
    //three.js glsl
    vertex = vertex;
    fragment = '';
    //是否正在动画
    animating = false
    //根节点类名
    containerClass = "tweenmax-carousel"
    //根节点元素
    containerElement = null
    //标题节点元素
    captionElement = null
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
    images = {}
    //特效索引
    effectIndex = 0
    //特效渲染器
    switchRenderers = {}

    constructor(containerElement, props) {
        this.containerElement = containerElement
        this.options = Object.assign({}, this.options, props)
        if (this.containerElement.className.indexOf(this.containerClass) === -1) {
            this.containerElement.className = this.containerElement.className + ' ' + this.containerClass
        }
        this.createRender()
        this.loadFiles()
        this.loadEffects()
        this.fragmentShader()
        this.createMesh()
        this.animate()
        this.options.afterLoaded()
        this.bindEvent()
        this.createCaption()
    }

    destroy() {
        this.unbindEvent()
        this.destroyRender()
    }

    destroyRender() {
        setTimeout(() => {
            if (this.renderer) {
                if (this.animating) {
                    this.destroyRender()
                } else {
                    this.renderer.forceContextLoss();
                    this.renderer = null;
                    this.scene = null;
                    this.camera = null;
                    this.material = null;
                    this.images = {};
                }
            }
        }, 300)
    }

    resize() {
        if (this.renderer) {
            const renderWidth = this.captionElement.clientWidth;
            const renderHeight = this.captionElement.clientHeight;
            this.renderer.setSize(renderWidth, renderHeight);
        }
    }

    bindEvent() {
        window.addEventListener('resize', this.resize.bind(this), true);
    }

    unbindEvent() {
        window.removeEventListener('resize', this.resize.bind(this), true);
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
        for (const type in this.switchRenderers) {
            if (switchTypes.indexOf(type) !== -1) {
                continue;
            }
            let switchRenderer = this.switchRenderers[type]
            let fragment = switchRenderer.renderer.fragment
            branchDispatchers.push('if (switchType ==' + switchRenderer.index + '){ finalTexture = ' + switchRenderer.renderer.type + '();}')
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

    createCaption() {
        let container
        container = this.containerElement.querySelector('.carousel-captions')
        if (!container) {
            container = document.createElement('div')
            container.className = 'carousel-captions'
            let title = document.createElement('a')
            title.className = 'carousel-title'
            let description = document.createElement('div')
            description.className = 'carousel-description'
            container.appendChild(title)
            container.appendChild(description)
            this.containerElement.appendChild(container)
        }
        this.captionElement = container
    }

    /**
     * 加载图片
     */
    loadFile(file) {
        const loader = new THREE.TextureLoader();
        loader.crossOrigin = "anonymous";
        if (!this.images[file.uuid]) {
            let image = loader.load(file.url);
            image.name = file.title
            image.magFilter = image.minFilter = THREE.LinearFilter;
            image.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
            this.images[file.uuid] = image
            this.loadEffect(file.switch_type)
        }
        return this.images[file.uuid];
    }

    loadFiles() {
        for (const file of this.options.files) {
            this.loadFile(file)
        }
    }

    /**
     * 加载特效渲染插件
     * @type {{}}
     */
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

    loadEffects() {
        if (this.options.effects.length > 0) {
            this.options.effects.forEach((effect) => {
                this.loadEffect(effect)
            })
        }
    }

    /**
     * 获取切换效果渲染类
     * @param file
     * @returns {Separate|Slide|Blinds|Parallax|Fade|Clamp|Split}
     */
    getEffectRender(file) {
        return this.loadEffect(file.switch_type)
    }

    switchImage(image, effect, reverse, completed) {
        this.material.uniforms.switchType.value = effect.index;
        this.material.uniforms.nextImage.value = image;
        this.material.uniforms.nextImage.needsUpdate = true;
        effect.renderer.switchImage(this, reverse, () => {
            this.material.uniforms.currentImage.value = image;
            this.material.uniforms.currentImage.needsUpdate = true;
            this.material.uniforms.dispFactor.value = 0.0;
            completed && completed()
        })
    }

    showCaption(file, effect, reverse, completed) {
        let carouselTitle = this.captionElement.querySelector('.carousel-title');
        let carouselDescription = this.captionElement.querySelector('.carousel-description');
        carouselTitle.innerText = file.title;
        carouselTitle.href = file.link
        carouselDescription.innerText = file.description
        effect.renderer.showCaption(this.captionElement, reverse, completed)
    }

    hideCaption(effect, reverse, completed) {
        effect.renderer.hideCaption(this.captionElement, reverse, completed)
    }

    switchFile(file, effectType, reverse, halfway, completed) {
        if (this.animating) {
            console.warn('上一次渲染还没有结束')
            return
        }
        let image = this.loadFile(file)
        let effect
        if (effectType) {
            effect = this.loadEffect(effectType)
        } else {
            effect = this.loadEffect(file.switch_type)
        }
        this.animating = true
        this.hideCaption(effect, reverse, () => {
            halfway && halfway();
            this.switchImage(image, effect, reverse, () => {
                this.animating = false
                this.showCaption(file, effect, reverse, completed)
            })
        })
    }
}

export default TweenMax;
