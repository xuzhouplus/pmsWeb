vec4 fade() {
    vec2 uv = vUv;
    vec4 _currentImage = texture(currentImage, uv);
    vec4 _nextImage = texture(nextImage, uv);
    vec4 finalTexture = mix(_currentImage, _nextImage, dispFactor);
    return finalTexture;
}