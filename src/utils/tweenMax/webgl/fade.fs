vec4 fade() {
    vec2 uv = vUv;
    vec4 _currentImage = texture2D(currentImage, uv);
    vec4 _nextImage = texture2D(nextImage, uv);
    vec4 finalTexture = mix(_currentImage, _nextImage, dispFactor);
    return finalTexture;
}