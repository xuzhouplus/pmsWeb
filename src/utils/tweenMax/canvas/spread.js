import gsap from "gsap";

class Spread {
    blockPixel = 4
    blockX = 0
    blockY = 0

    tweenObj = {
        translate: 0.0
    }

    loadFile(tweenMax, file) {
        return tweenMax.loadFile(file, 'image')
    }

    beforeSwitch(tweenMax, current, last, completed) {
        completed && completed()
    }

    countBlocks(startX, startY, offsetX, offsetY) {
        let arr = []
        for (let i = 0; i < offsetX;) {
            for (let j = 0; j < offsetY; j++) {
                arr.push({x: startX + i, y: startY + j})
                j = j + this.blockPixel
            }
            i = i + this.blockPixel
        }
        return arr;
    }

    countAround(rendered, x, y, dst) {
        let resArr = [];
        for (let m = (x - dst); m <= (x + dst); m++) {
            for (let n = (y - dst); n <= (y + dst); n++) {
                if ((Math.abs(m - x) + Math.abs(n - y), 2 == dst) && (m >= 0 && n >= 0) && (m <= (this.blockX - 1) && n <= (this.blockY - 1))) {
                    resArr.push({x: m, y: n});
                }
            }
        }
        return resArr;
    }

    switchImage(tweenMax, current, last, completed) {
        let image = this.loadFile(tweenMax, current)
        let render = this
        this.blockX = Math.ceil(tweenMax.options.width / this.blockPixel)
        this.blockY = Math.ceil(tweenMax.options.width / this.blockPixel)
        let rendered = []
        gsap.to(this.tweenObj, {
            translate: 1,
            ease: 'Power4.easeOut',
            duration: 2,
            onUpdate: function () {
                let percent = render.tweenObj.translate
                if (Math.abs(percent) <= 1) {
                    rendered = render.countAround(rendered, render.blockX, render.blockY, Math.ceil(percent * render.blockX))
                    rendered.forEach(function (item, index) {
                        tweenMax.canvas.context.drawImage(image, render.blockX * item.y, render.blockY * item.x, render.blockPixel, render.blockPixel, render.blockX * item.y, render.blockY * item.x, render.blockPixel, render.blockPixel);
                    });
                }
            },
            onComplete: () => {
                this.tweenObj.translate = 0.0
                completed && completed()
            }
        })
    }

    switchCaption(tweenMax, caption) {

    }
}

export default Spread