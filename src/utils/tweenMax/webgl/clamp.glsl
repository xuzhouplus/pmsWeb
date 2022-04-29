vec4 clampEffect() {
    vec2 uv = vUv;
    vec4 texColor1 = texture(nextImage, uv);
    vec4 texColor2 = texture(currentImage, uv);
    float w = 0.5;
    float alpha = clamp(-1.0 / w * uv.x + (1.0 + w) / w + dispFactor * (-(1.0 + w) / w), 0.0, 1.0);
    vec4 resColor = vec4(dispFactor, 0.0, 0.0, 1.0);// 初始化 resColor
    if(reverse) {
        resColor = mix(texColor1, texColor2, 1.0 -alpha);
    } else {
        resColor = mix(texColor1, texColor2, alpha);
    }
    return resColor;
}
