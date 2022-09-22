import Utils from "@utils/Utils";
import configs from "@/configs";

const CaptureFrameUrl = '/file/extract-frame'
const CapturePosterUrl = '/file/capture-poster'

export function CaptureFrame(data, callback, fallback) {
    if (!data['file_id']) {
        throw Error('文件id不能为空')
    }
    if (data['seek']) {
        data['point'] = Math.round(data['seek'])
    }
    if (data['width']) {
        data['width'] = Math.round(data['width'])
    }
    if (data['height']) {
        data['height'] = Math.round(data['height'])
    }
    return Utils.http('post', configs.proxyBackendHost + CaptureFrameUrl, data, callback, fallback);
}

export function CapturePoster(data, callback, fallback) {
    if (!data['file_id']) {
        throw Error('文件id不能为空')
    }
    if (data['seek']) {
        data['seek'] = Math.round(data['seek'])
    }
    if (data['width']) {
        data['width'] = Math.round(data['width'])
    }
    if (data['height']) {
        data['height'] = Math.round(data['height'])
    }
    return Utils.http('post', configs.proxyBackendHost + CapturePosterUrl, data, callback, fallback);
}

