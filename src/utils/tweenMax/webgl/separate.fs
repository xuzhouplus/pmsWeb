vec4 separate() {
    vec2 uv = vUv;
    float chunks = 5.0;
    float chunkX = 1.0 / chunks;
    float offsetX = chunkX * dispFactor;

    for(float i = 0.0; i < chunks; i++) {
        float minOffsetX = chunkX * i;
        float maxOffsetX = minOffsetX + offsetX;
        float nextOffsetX = chunkX * (i + 1.0);
        if(uv.x >= minOffsetX && uv.x <= maxOffsetX) {
            return texture2D(nextImage, vec2(uv.x - offsetX + chunkX, uv.y));
        } else if(uv.x > maxOffsetX && uv.x < nextOffsetX) {
            return texture2D(currentImage, vec2(uv.x - offsetX, uv.y));
        }
    }
}
