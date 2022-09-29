varying vec2 vUv;
uniform sampler2D currentImage;
uniform sampler2D nextImage;
uniform float dispFactor;
uniform int switchType;
uniform bool reverse;
#define PI 3.1415926538

float perspective = 0.7;
float unzoom = 0.3;
float reflection = 0.4;
float floating = 3.0;

vec2 project (vec2 p) {
    return p * vec2(1.0, -1.2) + vec2(0.0, -floating/100.);
}

bool inBounds (vec2 p) {
    return all(lessThan(vec2(0.0), p)) && all(lessThan(p, vec2(1.0)));
}

float getProgress(){
    if (reverse) {
        return 1.0 - dispFactor;
    } else {
        return dispFactor;
    }
}

vec4 getFromColor(vec2 pos){
    if (reverse) {
        return texture(nextImage, pos);
    }
    return texture(currentImage, pos);
}
vec4 getToColor(vec2 pos){
    if (reverse) {
        return texture(currentImage, pos);
    }
    return texture(nextImage, pos);
}

vec4 bgColor (vec2 p, vec2 pfr, vec2 pto) {
    vec4 c = vec4(0.0, 0.0, 0.0, 1.0);
    pfr = project(pfr);
    if (inBounds(pfr)) {
        c += mix(vec4(0.0), getFromColor(pfr), reflection * mix(1.0, 0.0, pfr.y));
    }
    pto = project(pto);
    if (inBounds(pto)) {
        c += mix(vec4(0.0), getToColor(pto), reflection * mix(1.0, 0.0, pto.y));
    }
    return c;
}

//branchDefines

void main() {
    vec4 finalTexture;
    //branchDispatcher
    gl_FragColor = finalTexture;
}
