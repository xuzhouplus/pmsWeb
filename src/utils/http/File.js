import Utils from "@utils/Utils";
import configs from "@/configs";

const FileDetailUrl = '/file/detail'

export function FileDetail(uuid, callback, fallback) {
    return Utils.http('get', configs.proxyBackendHost + FileDetailUrl, {
        uuid: uuid
    }, callback, fallback);
}
