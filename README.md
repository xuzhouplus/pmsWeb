个人网站前端（PMS）

### 介绍

 - 支持自定义首页特效
 - 支持支付宝、微信、微博、GitHub等常见第三方授权登录
 - 使用ckeditor富文本编辑器，支持从服务端已上传视频、图片文件中选择文件插入编辑器

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### 环境搭建

#### nginx配置

使用nginx配置，把前端开发工程和后端开发工程服务配置到统一域名下，处理请求跨域问题。

```
server {
        #监听端口
        listen       80;
        
        #默认域名
        server_name  web.pms.test;
        
        #最大请求体大小，会影响文件上传
        client_max_body_size 100m;
        
        #后端代理
        location /go/ {
            proxy_pass http://127.0.0.1:8080/;
        }

        #前端代理
        location / {
            proxy_pass http://127.0.0.1:3000;
        }

        #前端开发热更新服务代理
        location /sockjs-node {
            proxy_pass http://127.0.0.1:3000;
            proxy_redirect off;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";

            proxy_set_header Host $host:$server_port;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_read_timeout 7200;
        }
}
```
#### 设置淘宝镜像

```shell
yarn config set registry https://registry.npm.taobao.org/
```

#### 依赖安装

```shell
yarn install
```

#### 修改配置

配置文件目录`src/configs.js`。

| 参数名                | 类型     | 说明                                        |
|:-------------------|:-------|:------------------------------------------|
| defaultTitle       | string | 默认网站名称，当后端不能使用时使用                         |
| defaultICP         | string | 默认网站备案号，当后端不能使用时使用                        |
| defaultLogo        | string | 默认网站Logo，当后端不能使用时使用                       |
| defaultFavicon     | string | 默认网站Favicon，当后端不能使用时使用                    |
| publicKey          | string | 敏感数据加密公钥，与后端的`web.security.primaryKey`相对应 |
| fullpageLicenseKey | string | fullpage授权key                             |
| proxyBackendHost   | string | 后端代理地址                                    |
| vaptchaJsUrl       | string | vaptcha SDK地址                             |
| loginDuration      | int    | 登录时长                                      |
| imageTypes         | array  | 支持上传的图片文件类型，需要后端支持处理响应类型的图片               |
| videoTypes         | array  | 支持上传的视频文件类型，需要ffmpeg支持                    |
| uploadChunkSize    | int    | 分片上传文件分片大小，单位kb                           |

#### 启动

当后端启动后，执行命令启动。
```shell
yarn start
```

#### 打包

```shell
yarn build
```
