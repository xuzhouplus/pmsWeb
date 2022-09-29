vec4 swap() {
    float progress = getProgress();
    vec2 pfr, pto = vec2(-1.);

    float size = mix(1.0, 3.0, progress);
    float persp = perspective * progress;
    pfr = (vUv + vec2(-0.0, -0.5)) * vec2(size/(1.0-perspective*progress), size/(1.0-size*persp*vUv.x)) + vec2(0.0, 0.5);

    size = mix(1.0, 3.0, 1.-progress);
    persp = perspective * (1.-progress);
    pto = (vUv + vec2(-1.0, -0.5)) * vec2(size/(1.0-perspective*(1.0-progress)), size/(1.0-size*persp*(0.5-vUv.x))) + vec2(1.0, 0.5);

    if (progress < 0.5) {
        if (inBounds(pfr)) {
            return getFromColor(pfr);
        }
        if (inBounds(pto)) {
            return getToColor(pto);
        }
    }
    if (inBounds(pto)) {
        return getToColor(pto);
    }
    if (inBounds(pfr)) {
        return getFromColor(pfr);
    }
    return bgColor(vUv, pfr, pto);
}
