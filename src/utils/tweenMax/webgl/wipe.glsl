vec4 wipe() {
    vec2 uv = vUv;
    vec4 finalTexture;
    float offset = getProgress();
    if (uv.x <= (1.0 - offset)) {
        finalTexture = getFromColor(vec2(uv.x, uv.y));
    } else {
        finalTexture = getToColor(vec2(uv.x + offset - 1.0, uv.y));
    }
    return finalTexture;
}
