vec4 slide() {
    vec2 uv = vUv;
    vec4 finalTexture;
    float offset = 1.0 * dispFactor;
    if(reverse) {
        if(uv.x <= offset) {
            finalTexture = texture2D(nextImage, vec2(uv.x - offset + 1.0, uv.y));
        } else {
            finalTexture = texture2D(currentImage, vec2(uv.x - offset, uv.y));
        }
    } else {
        if(uv.x <= (1.0 - offset)) {
            finalTexture = texture2D(currentImage, vec2(offset + uv.x, uv.y));
        } else {
            finalTexture = texture2D(nextImage, vec2(uv.x + offset - 1.0, uv.y));
        }
    }
    return finalTexture;
}
