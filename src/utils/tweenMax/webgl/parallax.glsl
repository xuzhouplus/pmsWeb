vec4 parallax() {
    vec2 uv = vUv;
    vec4 _currentImage;
    vec4 _nextImage;
    float intensity = 0.3;
    float progress = getProgress();
    vec4 orig1 = getFromColor(uv);
    vec4 orig2 = getToColor(uv);
    _currentImage = getFromColor(vec2(uv.x, uv.y + progress * (orig2 * intensity)));
    _nextImage = getToColor(vec2(uv.x, uv.y + (1.0 - progress) * (orig1 * intensity)));
    vec4 finalTexture = mix(_currentImage, _nextImage, progress);
    return finalTexture;
}
