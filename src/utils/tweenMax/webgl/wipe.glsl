vec4 wipe() {
    vec2 uv = vUv;
    vec4 finalTexture;
    float offset = 1.0 * dispFactor;
    if(reverse) {
        if(uv.x <= offset) {
            finalTexture = texture(nextImage, vec2(uv.x - offset + 1.0, uv.y));
        } else {
            finalTexture = texture(currentImage, vec2(uv.x, uv.y));
        }
    } else {
        if(uv.x <= (1.0 - offset)) {
            finalTexture = texture(currentImage, vec2(uv.x, uv.y));
        } else {
            finalTexture = texture(nextImage, vec2(uv.x + offset - 1.0, uv.y));
        }
    }
    return finalTexture;
}
