vec4 fade() {
    vec4 _currentImage = texture(currentImage, vUv);
    vec4 _nextImage = texture(nextImage, vUv);
    vec4 finalTexture = mix(_currentImage, _nextImage, dispFactor);
    return finalTexture;
}
