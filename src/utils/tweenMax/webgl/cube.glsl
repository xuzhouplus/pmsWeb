vec2 xskew (vec2 p, float persp, float center) {
    float x = mix(p.x, 1.0-p.x, center);
    return (
    (
    vec2(x, (p.y - 0.5*(1.0-persp) * x) / (1.0+(persp-1.0)*x))
    - vec2(0.5-distance(center, 0.5), 0.0)
    )
    * vec2(0.5 / distance(center, 0.5) * (center<0.5 ? 1.0 : -1.0), 1.0)
    + vec2(center<0.5 ? 0.0 : 1.0, 0.0)
    );
}

vec4 cube() {
    float progress = getProgress();
    float uz = unzoom * 2.0*(0.5-distance(0.5, progress));
    vec2 p = -uz*0.5+(1.0+uz) * vUv;
    vec2 fromP = xskew((p - vec2(progress, 0.0)) / vec2(1.0-progress, 1.0), 1.0-mix(progress, 0.0, perspective), 0.0);
    vec2 toP = xskew(p / vec2(progress, 1.0), mix(pow(progress, 2.0), 1.0, perspective), 1.0);
    if (inBounds(fromP)) {
        return getFromColor(fromP);
    } else if (inBounds(toP)) {
        return getToColor(toP);
    }
    return bgColor(vUv, fromP, toP);
}
