import fragment from "@utils/tweenMax/webgl/wipe.glsl";
import Effect from "@/utils/tweenMax/webgl/effect";
import gsap from "gsap";

class Wipe extends Effect {
    type = 'wipe'
    fragment = fragment
    duration = 2

    switchImage(tweenMax, reverse, completed) {
        let ease = 'Power4.easeOut'
        if (reverse) {
            ease = 'Power4.easeIn'
        }
        gsap.to(tweenMax.material.uniforms.dispFactor, {
            value: 1.0,
            ease: ease,
            duration: this.duration,
            onComplete: () => {
                completed && completed()
            }
        })
    }

    hideCaption(caption, reverse, completed) {
        gsap.fromTo(caption, {
            autoAlpha: 1,
            filter: 'blur(0px)',
        }, {
            duration: this.duration / 2,
            autoAlpha: 0,
            filter: 'blur(10px)',
            ease: 'Expo.easeOut',
            onComplete: function () {
                completed && completed()
            }
        });
    }

    showCaption(caption, reverse, completed) {
        gsap.to(caption, {
            duration: this.duration / 2,
            autoAlpha: 1,
            filter: 'blur(0px)',
            ease: 'Expo.easeIn',
            onComplete: function () {
                completed && completed()
            }
        });
    }
}

export default Wipe;
