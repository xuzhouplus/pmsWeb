varying vec2 vUv;
uniform sampler2D currentImage;
uniform sampler2D nextImage;
uniform int switchType;
uniform float dispFactor;
vec4 parallax() {
    vec2 uv = vUv;
    vec4 _currentImage;
    vec4 _nextImage;
    float intensity = 0.3;
    vec4 orig1 = texture2D(currentImage, uv);
    vec4 orig2 = texture2D(nextImage, uv);
    _currentImage = texture2D(currentImage, vec2(uv.x, uv.y + dispFactor * (orig2 * intensity)));
    _nextImage = texture2D(nextImage, vec2(uv.x, uv.y + (1.0 - dispFactor) * (orig1 * intensity)));
    vec4 finalTexture = mix(_currentImage, _nextImage, dispFactor);
    return finalTexture;
}
vec4 slide() {
    vec2 uv = vUv;
    vec4 finalTexture;
    float offset = 2.0 * dispFactor - 1.0;
    if (uv.x < offset) {
        finalTexture = texture2D(nextImage, vec2(uv.x, uv.y));
    } else {
        finalTexture = texture2D(currentImage, vec2(uv.x - offset, uv.y));
    }
    return finalTexture;
}

vec4 split(){
    vec2 uv = vUv;
    vec4 finalTexture;
    float offset = 2.0 * dispFactor - 1.0;
    if (uv.x < offset) {
        finalTexture = texture2D(nextImage, vec2(uv.x, uv.y));
    } else {
        finalTexture = texture2D(currentImage, vec2(uv.x - offset, uv.y));
    }
    return finalTexture;
}
void main() {
    vec4 finalTexture;
    if (switchType == 1) {
        finalTexture = parallax();
    } else if (switchType == 2) {
        finalTexture = slide();
    }
    gl_FragColor = finalTexture;
}