//分离切换效果
import gsap from "gsap";

class Separate {
    tweenObj = {
        translate: 0.0
    }
    separateCount = 5


    loadFile(tweenMax, file) {
        return tweenMax.loadFile(file, 'image')
    }

    beforeSwitch(tweenMax, current, last, completed) {
        completed && completed()
    }

    switchImage(tweenMax, current, last, completed) {
        let image = this.loadFile(tweenMax, current)
        let render = this
        let blockWidth = tweenMax.options.width / this.separateCount
        let fileWidth = current.width / this.separateCount
        gsap.to(this.tweenObj, {
            translate: 1,
            ease: 'Power4.easeOut',
            duration: 2,
            onUpdate: function () {
                let percent = render.tweenObj.translate
                if (Math.abs(percent) <= 1) {
                    //画5个块，裁剪出位移差
                    for (let i = 1; i <= render.separateCount; i++) {
                        let imageX = blockWidth * (i - 1)
                        let imageY = 0
                        let imageWidth = fileWidth * percent
                        let imageHeight = current.height
                        let canvasX = blockWidth * i - blockWidth * percent
                        let canvasY = 0
                        let canvasWidth = blockWidth * percent
                        let canvasHeight = tweenMax.options.height
                        tweenMax.canvas.context.drawImage(image, imageX, imageY, imageWidth, imageHeight, canvasX, canvasY, canvasWidth, canvasHeight);
                    }
                }
            },
            onComplete: () => {
                render.tweenObj.translate = 0.0;
                completed && completed()
            }
        })
    }

    switchCaption(tweenMax, caption) {

    }
}

export default Separate