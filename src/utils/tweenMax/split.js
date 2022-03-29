import gsap from "gsap";

class Split {
    separateCount = 7
    tweenObj = {
        translate: 0.0
    }

    loadFile(tweenMax, file) {
        return tweenMax.loadFile(file, 'image')
    }

    beforeSwitch(tweenMax, current, last, completed) {
        completed && completed()
    }

    switchImage(tweenMax, current, last, completed) {
        this.separateCount = Math.ceil(tweenMax.options.width / 100)
        let currentImage = this.loadFile(tweenMax, current)
        let lastImage
        if (last) {
            lastImage = this.loadFile(tweenMax, last)
        }
        let render = this
        let blockWidth = tweenMax.options.width / this.separateCount
        let fileBlock = current.width / this.separateCount
        for (let i = 1; i <= render.separateCount; i++) {
            if (i == render.separateCount) {
                blockWidth = tweenMax.options.width - (blockWidth * (i - 1))
                fileBlock = current.width - (fileBlock * (i - 1))
            }
            let tweenMaxObj = {
                translate: 0.0
            }
            gsap.to(tweenMaxObj, {
                translate: 1,
                ease: 'Power4.easeOut',
                duration: 2,
                delay: 2 / render.separateCount * (i - 1),
                onUpdate: function () {
                    let percent = tweenMaxObj.translate
                    if (Math.abs(percent) <= 1) {
                        let imageX = blockWidth * (i - 1)
                        let imageY = 0
                        let imageWidth = fileBlock
                        let imageHeight = current.height * percent
                        let canvasX = blockWidth * (i - 1)
                        let canvasY = 0
                        let canvasWidth = blockWidth
                        let canvasHeight = tweenMax.options.height * percent
                        tweenMax.canvas.context.drawImage(currentImage, imageX, imageY, imageWidth, imageHeight, canvasX, canvasY, canvasWidth, canvasHeight);
                        if (last) {
                            let lastImageHeight = last.height * (1 - percent)
                            let lastCanvasY = tweenMax.options.height * percent
                            let lastCanvasHeight = tweenMax.options.height * (1 - percent)
                            tweenMax.canvas.context.drawImage(lastImage, imageX, imageY, imageWidth, lastImageHeight, canvasX, lastCanvasY, canvasWidth, lastCanvasHeight);
                        }
                    }
                },
                onComplete: () => {
                    completed && completed()
                }
            })
        }
    }

    switchCaption(tweenMax, caption) {

    }
}

export default Split