vec2 transform(vec2 texCoord, float theta, vec2 axisPos, vec2 gridNum, float zOffset) {
    vec2 res = texCoord - axisPos;
    float axisZ = 1.0 / gridNum.x * sqrt(3.0) / 6.0; // 旋转轴的z坐标
    float thetaLocal = -theta;
    res = res / (1.0 + zOffset);
    res = res / (1.0 + axisZ);
    // 执行旋转和投影（投影本质上是剪切）
    res.x = res.x / cos(thetaLocal) - axisZ * sin(thetaLocal);
    res.y = res.y * (1.0 + res.x * sin(thetaLocal) - axisZ * cos(thetaLocal));
    res.x = res.x * (1.0 + res.x * sin(thetaLocal) - axisZ * cos(thetaLocal));
    // 从 (0,0) 移动到 axisPos
    res = res + axisPos;
    // 对超出棋盘格范围的坐标进行处理，设置为 -0.001 和 1.001 在 GL_CLAMP_TO_BORDER 模式下取背景色
    float halfGridWidth = 0.5 / gridNum.x;
    float halfGridHeight = 0.5 / gridNum.y;
    if(res.x < axisPos.x - halfGridWidth)
        res.x = -0.001;
    if(res.x > axisPos.x + halfGridWidth)
        res.x = 1.001;
    if(res.y < axisPos.y - halfGridHeight)
        res.y = -0.001;
    if(res.y > axisPos.y + halfGridHeight)
        res.y = 1.001;
    return res;
}
vec4 blinds() {
    if(dispFactor == 0.0 || dispFactor == 1.0) {
        return mix(texture(currentImage, vUv), texture(nextImage, vUv), dispFactor);
    }
    float pi = 3.1415926;
    vec4 resColor = vec4(dispFactor, 0.0, 0.0, 1.0);// 初始化 resColor
    // 设置翻转栅格数量，横向18，纵向1
    vec2 gridNum = vec2(18.0, 1.0);
    // 获得每个栅格的位置
    vec2 axisPos = floor(vUv * gridNum) * (1.0 / gridNum) + 0.5 / gridNum;
    // 设置每个栅格的旋转角度，与 横向坐标、外界输入ratio 有关
    float rotateTheta = clamp(dispFactor * (1.0 + gridNum.x * 4.0 * pow((0.5 - abs(axisPos.x - 0.5)), 5.0)), 0.0, 1.0) * pi * 2.0 / 3.0;
    // 设置栅格旋转时，向后偏移的量，与 外界输入ratio 有关
    float zOffset = -clamp(0.05 - abs(0.1 * rotateTheta / (pi * 2.0 / 3.0) - 0.05), 0.0, 0.05);

    // 对纹理坐标进行变换，以及纹理采样
    vec2 texCoordAfterTransform = transform(vUv, rotateTheta, axisPos, gridNum, zOffset);
    texCoordAfterTransform.y = vUv.y;
    vec4 texColor1 = texture(currentImage, texCoordAfterTransform);

    vec2 texCoordAfterTransform2 = transform(vUv, rotateTheta + pi / 3.0, axisPos, gridNum, zOffset);
    texCoordAfterTransform2.x = floor(texCoordAfterTransform2.x * gridNum.x + 1.0) / gridNum.x - texCoordAfterTransform2.x + floor(texCoordAfterTransform2.x * gridNum.x) / gridNum.x;
//    texCoordAfterTransform2.y = vUv.y;
    vec4 texColor2 = texture(nextImage, texCoordAfterTransform2);

    // 根据旋转角度，给每个栅格设置遮罩，左边为第一张图，右边为第二张图
    if(fract(vUv.x * gridNum.x) <= (0.5 + sqrt(3.0) / 3.0 * tan(pi / 3.0 - rotateTheta)))
        resColor = texColor1 * (1.0 - rotateTheta / (pi * 2.0 / 3.0));
    else
        resColor = texColor2 * (rotateTheta / (pi * 2.0 / 3.0));
    return resColor;
}
