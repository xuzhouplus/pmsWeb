vec4 split() {
    vec2 uv = vUv;
    vec4 mixed;
    float chunks = 15.0;
    float chunkX = 1.0 / chunks;
    for(float i = 0.0; i <= chunks; i++) {
        float minX = chunkX * i;
        float maxX = minX + chunkX;
        if(uv.x >= minX && uv.x <= maxX) {
            float percent = min(1.0, dispFactor * (chunks - i));
            float offsetY = 1.0 - percent;
            if(uv.y <= offsetY) {
                mixed = texture(currentImage, vec2(uv.x, uv.y + percent));
            } else {
                mixed = texture(nextImage, vec2(uv.x, uv.y - offsetY));
            }
            break;
        }
    }
    return mixed;
}
