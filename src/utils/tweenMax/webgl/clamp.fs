vec4 clampEffect() {
    vec4 texColor1 = texture(nextImage, vUv);
    vec4 texColor2 = texture(currentImage, vUv);
    float w = 0.5;
    float alpha = clamp(-1.0 / w * vUv.x + (1.0 + w) / w + dispFactor * (-(1.0 + w) / w), 0.0, 1.0);
    if(reverse) {
        return mix(texColor1, texColor2, 1.0 -alpha);
    } else {
        return mix(texColor1, texColor2, alpha);
    }
}
