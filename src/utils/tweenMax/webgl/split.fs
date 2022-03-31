vec4 split() {
    vec2 uv = vUv;
    float chunks = 10.0;
    float chunkX = 1.0 / chunks;
    float sectionMinX = (sectionIndex - 1.0) * chunkX;
    float sectionMaxX = sectionIndex * chunkX;

    // if (uv.x<sectionMinX){
    //     return gl_FrontColor;
    // }
    // if(uv.x>=sectionMinX && uv.x<= sectionMaxX){

    // }

    float offsetY = 1.0 * dispFactor;
    if(uv.y <= offsetY) {
        return texture2D(nextImage, vec2(uv.x, uv.y - offsetY + 1.0));
    }
    return texture2D(currentImage, vec2(uv.x, uv.y + offsetY));
}
