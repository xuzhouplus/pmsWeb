import Effect from "@utils/tweenMax/webgl/effect";
import fragment from "./clamp.glsl";
import gsap from "gsap";

class Clamp extends Effect {
    type = 'clampEffect'
    fragment = fragment
    duration = 2

    switchImage(tweenMax, reverse, completed) {
        gsap.to(tweenMax.material.uniforms.dispFactor, {
            duration: this.duration,
            value: 1.0,
            ease: 'Expo.easeInOut',
            onComplete: () => {
                completed && completed()
            }
        });
    }

    switchCaption(caption, reverse, halfway, completed) {
        gsap.fromTo(caption, {
            autoAlpha: 1,
            filter: 'blur(0px)',
        }, {
            duration: this.duration / 2,
            autoAlpha: 0,
            filter: 'blur(10px)',
            ease: 'Expo.easeOut',
            onComplete: function () {
                halfway && halfway()
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
        });
    }
}

export default Clamp
