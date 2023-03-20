import fragment from "@utils/tweenMax/webgl/cube.glsl";
import Effect from "@/utils/tweenMax/webgl/effect";
import gsap from "gsap";

class Cube extends Effect {
    type = 'cube'
    fragment = fragment
    duration = 3

    switchImage(tweenMax, reverse, completed) {
        tweenMax.material.uniforms.reverse.value = !reverse;
        gsap.to(tweenMax.material.uniforms.dispFactor, {
            value: 1.0,
            ease: 'Power4.easeInOut',
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

export default Cube;