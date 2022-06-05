import fragment from "@utils/tweenMax/webgl/separate.glsl";
import Effect from "@/utils/tweenMax/webgl/effect";
import gsap from "gsap";

class Separate extends Effect {
    type = 'separate'
    fragment = fragment
    duration = 1

    switchImage(tweenMax, reverse, completed) {
        tweenMax.material.uniforms.reverse.value = reverse;
        gsap.to(tweenMax.material.uniforms.dispFactor, {
            duration: this.duration,
            value: 1.0,
            ease: 'Expo.easeInOut',
            onComplete: () => {
                tweenMax.material.uniforms.reverse.value = false;
                completed && completed()
            }
        });
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

export default Separate;
