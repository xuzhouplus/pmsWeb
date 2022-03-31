//滑动切换效果
import gsap from "gsap";

class Slide {
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
        let image = this.loadFile(tweenMax, current)
        let render = this
        gsap.to(this.tweenObj, {
            duration: 1,
            translate: 1,
            ease: 'Expo.easeIn',
            onUpdate: function () {
                let translate = render.tweenObj.translate
                let imageX = 0
                let imageY = 0
                let imageWidth = current.width * translate
                let imageHeight = current.height
                let canvasX = tweenMax.options.width - tweenMax.options.width * translate
                let canvasY = 0
                let canvasWidth = tweenMax.options.width * translate
                let canvasHeight = tweenMax.options.height
                tweenMax.canvas.context.drawImage(image, imageX, imageY, imageWidth, imageHeight, canvasX, canvasY, canvasWidth, canvasHeight);
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

export default Slide;