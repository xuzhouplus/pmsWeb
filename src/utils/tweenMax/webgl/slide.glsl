vec4 slide() {
    vec2 uv = vUv;
    vec4 finalTexture;
    float progress = getProgress();
    float offset = 1.0 * progress;
    if (uv.x <= (1.0 - offset)) {
        finalTexture = getFromColor(vec2(offset + uv.x, uv.y));
    } else {
        finalTexture = getToColor(vec2(uv.x + offset - 1.0, uv.y));
    }
    return finalTexture;
}
