// 擦除
vec4 clampEffect() {
    vec2 uv = vUv;
    vec4 texColor1 = getToColor(uv);
    vec4 texColor2 = getFromColor(uv);
    float progress = getProgress();
    float w = 0.5;
    float alpha = clamp(-1.0 / w * uv.x + (1.0 + w) / w + progress * (-(1.0 + w) / w), 0.0, 1.0);
    //vec4 resColor = vec4(dispFactor, 0.0, 0.0, 1.0);// 初始化 resColor
    vec4 resColor = mix(texColor1, texColor2, alpha);
    return resColor;
}
