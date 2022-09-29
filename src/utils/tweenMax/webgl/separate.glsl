vec4 separate() {
    vec4 mixed;
    vec2 uv = vUv;
    float chunks = 7.0;
    float chunkX = 1.0 / chunks;
    float offsetX = chunkX * dispFactor;
    if(reverse) {
        for(float i = 0.0; i < chunks; i++) {
            float minOffsetX = chunkX * i;
            float maxOffsetX = minOffsetX + offsetX;
            float nextOffsetX = chunkX * (i + 1.0);
            if(uv.x >= minOffsetX && uv.x <= maxOffsetX) {
                mixed = texture(nextImage, vec2(uv.x - offsetX + chunkX, uv.y));
                break;
            } else if(uv.x > maxOffsetX && uv.x < nextOffsetX) {
                mixed = texture(currentImage, vec2(uv.x - offsetX, uv.y));
                break;
            }
        }
    } else {
        for(float i = 0.0; i < chunks; i++) {
            float minOffsetX = chunkX * i;
            float maxOffsetX = minOffsetX + chunkX - offsetX;
            float nextOffsetX = chunkX * (i + 1.0);
            if(uv.x >= minOffsetX && uv.x <= maxOffsetX) {
                mixed = texture(currentImage, vec2(uv.x + offsetX, uv.y));
                break;
            } else if(uv.x > maxOffsetX && uv.x < nextOffsetX) {
                mixed = texture(nextImage, vec2(uv.x - chunkX + offsetX, uv.y));
                break;
            }
        }
    }
    return mixed;
}
