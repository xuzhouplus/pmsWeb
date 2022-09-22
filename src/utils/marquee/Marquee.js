class Marquee {
    options = {
        selector: '.marquee',
        hoverToStop: true,
        hoverToStart: true,
        speed: 5,
        direction: 'right',
        loop: true,
        space: 5,
        seamless: true,
        autoPlay: true,
        overOnly: true,
    }

    containerEle = null
    containerWidth = 0
    itemEle = null
    itemWidth = 0
    copyEle = null

    constructor(props) {
        this.options = Object.assign({}, this.options, props)
        this.init()
        if (!this.options.overOnly) {
            if (this.options.autoPlay) {
                this.play()
            }
            this.bindEvents()
        }
    }

    init() {
        this.containerEle = document.querySelector(this.options.selector)
        if (!this.containerEle) {
            throw Error(this.options.selector + '不存在')
        }
        if (this.containerEle.className.indexOf('marquee-container') === -1) {
            this.containerEle.className = this.containerEle.className + ' marquee-container'
        }
        this.containerEle.style.position = 'relative'
        this.containerEle.style.overflow = 'hidden'
        this.containerEle.style.whiteSpace = 'nowrap'
        this.containerEle.style.minWidth = this.containerEle.clientWidth + 'px'
        this.containerEle.style.minHeight = this.containerEle.clientHeight + 'px'
        this.width = this.containerEle.clientWidth
        const item = document.createElement('div')
        item.className = 'marquee-item'
        item.style.position = 'absolute'
        item.style.display = 'flex'
        item.innerHTML = this.containerEle.innerHTML
        if (this.options.seamless && this.options.space > 0) {
            const space = document.createElement('div')
            space.style.width = this.options.space + 'px'
            item.appendChild(space)
        }
        this.containerEle.innerHTML = ''
        this.containerEle.appendChild(item)
        this.itemEle = item
        this.itemWidth = this.itemEle.clientWidth
        this.containerWidth = this.containerEle.clientWidth
        if (this.options.overOnly && this.itemWidth < this.containerWidth) {
            this.options.overOnly = true
            return
        }
        if (this.options.loop && this.options.seamless) {
            if (this.itemWidth < this.containerWidth) {
                let appendWidth = this.itemWidth
                while (appendWidth < this.containerWidth) {
                    this.itemEle.innerHTML += item.innerHTML
                    appendWidth = appendWidth + this.itemWidth
                }
                this.itemWidth = appendWidth
            }
        }
        const copyEle = this.itemEle.cloneNode(true)
        copyEle.style.left = this.containerWidth + 'px'
        this.containerEle.appendChild(copyEle)
        this.copyEle = copyEle
        this.copyLeft = this.containerWidth
    }

    animating = true

    //当前执行时间
    nowTime = 0;
    //记录每次动画执行结束的时间
    lastTime = Date.now();
    //我们自己定义的动画时间差值
    diffTime = 40;

    animate() {
        //记录当前时间
        this.nowTime = Date.now()
        // 当前时间-上次执行时间如果大于diffTime，那么执行动画，并更新上次执行时间
        if (this.nowTime - this.lastTime > this.diffTime) {
            this.lastTime = this.nowTime
            this.render();
        }
        if (this.animating) {
            requestAnimationFrame(this.animate.bind(this))
        }
    }

    itemLeft = 0
    copyLeft = 0
    animateEle = 'main'

    render() {
        if (this.animateEle === 'main') {
            this.itemEle.style.left = `${this.itemLeft--}px`
            if (!this.options.loop) {
                this.clear()
                return
            }
            if (this.options.seamless) {
                if (this.itemLeft < (this.itemWidth - this.containerWidth) * -1) {
                    this.copyEle.style.left = `${this.copyLeft--}px`
                    if (this.itemLeft > this.itemWidth) {
                        this.animateEle = 'copy'
                        this.itemLeft = this.containerWidth
                    }
                }
            } else {
                if (this.itemLeft < this.itemWidth * -1) {
                    this.copyEle.style.left = `${this.copyLeft--}px`
                    this.animateEle = 'copy'
                    this.itemLeft = this.containerWidth
                }
            }
        } else {
            this.copyEle.style.left = `${this.copyLeft--}px`
            if (this.options.seamless) {
                if (this.copyLeft < (this.itemWidth - this.containerWidth) * -1) {
                    this.itemEle.style.left = `${this.itemLeft--}px`
                    if (this.copyLeft > this.itemWidth) {
                        this.animateEle = 'main'
                        this.copyLeft = this.containerWidth
                    }
                }
            } else {
                if (this.copyLeft < this.itemWidth * -1) {
                    this.itemEle.style.left = `${this.itemLeft--}px`
                    this.animateEle = 'main'
                    this.copyLeft = this.containerWidth
                }
            }
        }
    }

    clear() {
        this.animating = false
    }

    reset() {
        this.clear()
        if (!this.options.overOnly) {
            this.itemEle.style.left = '0px'
            this.itemLeft = 0
            if (this.copyLeft) {
                this.copyEle.style.left = this.containerWidth + 'px'
                this.copyLeft = this.containerWidth
            }
        }
    }

    play() {
        if (this.isDestroyed) {
            throw Error('跑马灯已销毁，需重新初始化')
        }
        this.animating = true
        this.animate()
    }

    pause() {
        this.clear()
    }

    stop() {
        this.clear()
        this.reset()
    }

    resume() {
        this.play()
    }

    isDestroyed = false

    destroy() {
        this.isDestroyed = true
        this.stop()
        this.unbindEvents()
    }

    onMouseHover() {
        if (this.animating) {
            this.pause()
        } else {
            this.play()
        }
    }

    onMouseOut() {
        if (this.animating) {
            this.play()
        } else {
            this.pause()
        }
    }

    bindEvents() {
        this.containerEle.addEventListener('mouseenter', this.onMouseHover.bind(this))
        this.containerEle.addEventListener('mouseleave', this.onMouseOut.bind(this))
    }

    unbindEvents() {
        this.containerEle.removeEventListener('mouseenter', this.onMouseHover.bind(this))
        this.containerEle.removeEventListener('mouseleave', this.onMouseOut.bind(this))
    }
}

export default Marquee
