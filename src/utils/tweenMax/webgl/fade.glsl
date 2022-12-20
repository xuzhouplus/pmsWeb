vec4 fade() {
    vec2 uv = vUv;
    float progress = getProgress();
    vec4 _currentImage = getFromColor(uv);
    vec4 _nextImage = getToColor(uv);
    vec4 finalTexture = mix(_currentImage, _nextImage, progress);
    return finalTexture;
}
