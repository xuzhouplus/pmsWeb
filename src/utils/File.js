const File = {
    // 获取文件名
    getFileName: (name) => {
        return name.substring(0, name.lastIndexOf("."))
    },
    getExtension: (name, withDot) => {
        if (withDot) {
            // 获取 .后缀名
            return name.substring(name.lastIndexOf("."))
        }
        // 只获取后缀名
        return name.substring(name.lastIndexOf(".") + 1)
    }
}

const Image = {
    //计算高斯模糊
    gaussianBlur: function (src, width, height, callback) {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        let img = document.createElement('img');
        //这里直接修改图片的路径
        img.src = src;
        img.onload = function () {
            //设置canvas的宽高
            canvas.height = height;
            canvas.width = width;
            //将图像绘制到canvas上面
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);
            //从画布获取一半图像
            let data = ctx.getImageData(0, 0, width, height);
            //将图像数据进行高斯模糊 data.data是一个数组，每四个值代表一个像素点的rgba的值，data.width data.height 分别代表图像数据的宽高
            let emptyData = gaussBlur(data);
            //将模糊的图像数据再渲染到画布上面
            ctx.putImageData(emptyData, 0, 0);
            let baseWidth = 1920
            let baseHeight = 1080
            let offsetX = 0
            let offsetY = 0
            let fgWidth = img.width
            let fgHeight = img.height
            if (img.width < baseWidth && img.height > baseHeight) {
                fgWidth = baseHeight / img.height * img.width
                fgHeight = baseHeight / img.height * img.height
                offsetX = (baseWidth - fgWidth) / 2
            } else if (img.width > baseWidth && img.height < baseHeight) {
                fgHeight = baseWidth / img.width * img.height
                offsetY = (baseHeight - fgHeight) / 2
            } else if (img.width > baseWidth && img.height > baseHeight) {
                let widthScale = baseWidth / img.width
                let heightScale = baseHeight / img.height
                if (widthScale > heightScale) {
                    fgWidth = img.width * heightScale
                    fgHeight = img.height * heightScale
                    offsetX = (baseWidth - fgWidth) / 2
                } else {
                    fgWidth = img.width * widthScale
                    fgHeight = img.height * widthScale
                    offsetY = (baseHeight - fgHeight) / 2
                }
            } else {
                offsetX = (baseWidth - img.width) / 2
                offsetY = (baseHeight - img.height) / 2
            }
            fgWidth = fgWidth * width / 1920
            fgHeight = fgHeight * height / 1080
            offsetX = offsetX * width / 1920
            offsetY = offsetY * height / 1080
            ctx.drawImage(img, 0, 0, img.width, img.height, offsetX, offsetY, fgWidth, fgHeight);
            callback && callback(canvas.toDataURL("image/png"))
        };

        function gaussBlur(imgData) {
            let pixes = imgData.data;
            let width = imgData.width;
            let height = imgData.height;
            let gaussMatrix = [],
                gaussSum = 0,
                x, y,
                r, g, b, a,
                i, j, k, len;

            let radius = 10;
            let sigma = 5;

            a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
            b = -1 / (2 * sigma * sigma);
            //生成高斯矩阵
            for (i = 0, x = -radius; x <= radius; x++, i++) {
                g = a * Math.exp(b * x * x);
                gaussMatrix[i] = g;
                gaussSum += g;

            }

            //归一化, 保证高斯矩阵的值在[0,1]之间
            for (i = 0, len = gaussMatrix.length; i < len; i++) {
                gaussMatrix[i] /= gaussSum;
            }
            //x 方向一维高斯运算
            for (y = 0; y < height; y++) {
                for (x = 0; x < width; x++) {
                    r = g = b = a = 0;
                    gaussSum = 0;
                    for (j = -radius; j <= radius; j++) {
                        k = x + j;
                        if (k >= 0 && k < width) {//确保 k 没超出 x 的范围
                            //r,g,b,a 四个一组
                            i = (y * width + k) * 4;
                            r += pixes[i] * gaussMatrix[j + radius];
                            g += pixes[i + 1] * gaussMatrix[j + radius];
                            b += pixes[i + 2] * gaussMatrix[j + radius];
                            // a += pixes[i + 3] * gaussMatrix[j];
                            gaussSum += gaussMatrix[j + radius];
                        }
                    }
                    i = (y * width + x) * 4;
                    // 除以 gaussSum 是为了消除处于边缘的像素, 高斯运算不足的问题
                    // console.log(gaussSum)
                    pixes[i] = r / gaussSum;
                    pixes[i + 1] = g / gaussSum;
                    pixes[i + 2] = b / gaussSum;
                    // pixes[i + 3] = a ;
                }
            }
            //y 方向一维高斯运算
            for (x = 0; x < width; x++) {
                for (y = 0; y < height; y++) {
                    r = g = b = a = 0;
                    gaussSum = 0;
                    for (j = -radius; j <= radius; j++) {
                        k = y + j;
                        if (k >= 0 && k < height) {//确保 k 没超出 y 的范围
                            i = (k * width + x) * 4;
                            r += pixes[i] * gaussMatrix[j + radius];
                            g += pixes[i + 1] * gaussMatrix[j + radius];
                            b += pixes[i + 2] * gaussMatrix[j + radius];
                            // a += pixes[i + 3] * gaussMatrix[j];
                            gaussSum += gaussMatrix[j + radius];
                        }
                    }
                    i = (y * width + x) * 4;
                    pixes[i] = r / gaussSum;
                    pixes[i + 1] = g / gaussSum;
                    pixes[i + 2] = b / gaussSum;
                }
            }
            return imgData;
        }
    },
    //图片上传前预览
    captureThumbnail: function (input, callback) {
        if (!input.type.match('image')) {
            callback("不支持的文件类型")
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = function () {
            callback('', fileReader.result, this)
        };
        fileReader.readAsDataURL(input);
    }
}

const Video = {
    //视频上传前预览
    captureThumbnail: function (input, callback) {
        if (!input.type.match('video')) {
            callback("不支持的文件类型")
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = function () {
            const blob = new Blob([fileReader.result], {type: input.type});
            const url = URL.createObjectURL(blob);
            const video = document.createElement('video');
            const snapImage = function () {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                const image = canvas.toDataURL();
                const success = image.length > 100000;
                if (success) {
                    callback('', image, video)
                    URL.revokeObjectURL(url);
                }
                return success;
            };
            const timeupdate = function () {
                if (snapImage()) {
                    video.removeEventListener('timeupdate', timeupdate);
                    video.pause();
                    // setTimeout(function () {
                    //     video.remove();
                    // }, 500)
                }
            };
            video.addEventListener('timeupdate', timeupdate);
            video.preload = 'metadata';
            video.src = url;
            // Load video in Safari / IE11
            video.muted = true;
            video.playsInline = true;
            video.play().then(r => {
                if (r) {
                    callback(r)
                }
            });
        };
        fileReader.readAsArrayBuffer(input);
    }
}

export {File, Image, Video};