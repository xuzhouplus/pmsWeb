import {JSEncrypt} from 'encryptlong';
import axios from "axios";
import configs from "../configs";
import {store} from "../redux/Store";
import {logoutAction, programAction} from "../redux/Actions";
import Swal from "sweetalert2";

const Utils = {
	login: function (account, password, callback, fallback) {
		return this.http('post', configs.proxyBackendHost + configs.loginUrl, {
			account: account,
			password: this.jsEncrypt(password, configs.publicKey)
		}, callback, fallback)
	},
	logout: function (callback, fallback) {
		this.http('post', configs.proxyBackendHost + configs.logoutUrl, null, callback, fallback)
	},
	auth: function (callback, fallback) {
		this.http('get', configs.proxyBackendHost + configs.authUrl, null, callback, fallback)
	},
	site: function (callback, fallback) {
		this.http('get', configs.proxyBackendHost + configs.settingUrl, null, function (response) {
			callback(response);
		}, fallback)
	},
	carousel: function (callback, fallback) {
		return this.http('post', configs.proxyBackendHost + configs.carouselUrl, null, callback, fallback)
	},
	createCarousel: function (data, callback, fallback) {
		return this.http('post', configs.proxyBackendHost + configs.createCarouselUrl, data, callback, fallback)
	},
	deleteCarousel: function (id, callback, fallback) {
		let data = {
			id: id
		}
		return this.http('post', configs.proxyBackendHost + configs.deleteCarouselUrl, data, callback, fallback)
	},
	getFileList: function (data, callback, fallback) {
		return this.http('get', configs.proxyBackendHost + configs.fileListUrl, data, callback, fallback);
	},
	uploadFile: function (data, callback, fallback) {
		let formData = new FormData();
		for (let key in data) {
			formData.append(key, data[key]);
		}
		axios({
			method: 'post',
			url: configs.proxyBackendHost + configs.uploadFileUrl,
			header: {
				"Content-Type": "multipart/form-data"
			},
			data: formData
		}).then(result => {
			console.log(result);
			if (result.data.code === 1) {
				callback(result.data);
			} else {
				fallback(result.statusText);
			}
		}).catch(error => {
			let message;
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				message = error.response.data;
			} else if (error.request) {
				// The request was made but no response was received
				// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
				// http.ClientRequest in node.js
				message = error.request;
			} else {
				// Something happened in setting up the request that triggered an Error
				message = error.message;
			}
			fallback && fallback(message);
		});
	},
	deleteFile: function (data, callback, fallback) {
		axios({
			method: 'post',
			url: configs.proxyBackendHost + configs.deleteFileUrl,
			data: data
		}).then(result => {
			console.log(result);
			if (result.data.code === 1) {
				callback(result.data);
			} else {
				fallback(result.statusText);
			}
		}).catch(error => {
			let message;
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				message = error.response.data;
			} else if (error.request) {
				// The request was made but no response was received
				// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
				// http.ClientRequest in node.js
				message = error.request;
			} else {
				// Something happened in setting up the request that triggered an Error
				message = error.message;
			}
			fallback && fallback(message);
		});
	},
	getCarouselIndex: function (callback, fallback) {
		return this.http('get', configs.proxyBackendHost + configs.carouselUrl, null, callback, fallback);
	},
	getCarouselList: function (data, callback, fallback) {
		return this.http('get', configs.proxyBackendHost + configs.carouselListUrl, data, callback, fallback);
	},
	posts: function (data, callback, fallback) {
		return this.http('get', configs.proxyBackendHost + configs.postUrl, data, callback, fallback);
	},
	postList: function (data, callback, fallback) {
		return this.http('get', configs.proxyBackendHost + configs.postListUrl, data, callback, fallback);
	},
	getPostInfo: function (id, callback, fallback) {
		return this.http('get', configs.proxyBackendHost + configs.getPostInfolUrl, {id: id}, callback, fallback)
	},
	getPostDetail: function (id, callback, fallback) {
		return this.http('get', configs.proxyBackendHost + configs.getPostDetailUrl, {id: id}, callback, fallback)
	},
	savePost: function (data, callback, fallback) {
		return this.http('post', configs.proxyBackendHost + configs.savePostUrl, data, callback, fallback)
	},
	togglePostStatus: function (id, callback, fallback) {
		return this.http('post', configs.proxyBackendHost + configs.togglePostStatusUrl, {id: id}, callback, fallback)
	},
	deletePost: function (id, callback, fallback) {
		return this.http('post', configs.proxyBackendHost + configs.deletePostUrl, {id: id}, callback, fallback)
	},
	connects: function (callback, fallback) {
		return this.http('get', configs.proxyBackendHost + configs.connectsUrl, {}, callback, fallback);
	},
	loginSetting: function (callback, fallback) {
		return this.http('get', configs.proxyBackendHost + configs.loginSettingUrl, {}, callback, fallback);
	},
	baiduSettings: function (type, data, callback, fallback) {
		if (type === 'post') {
			if (data.baidu_secret_key) {
				data.baidu_secret_key = this.jsEncrypt(data.baidu_secret_key, configs.publicKey);
			}
		}
		return this.http(type, configs.proxyBackendHost + configs.baiduSettingsUrl, data, callback, fallback);
	},
	alipaySettings: function (type, data, callback, fallback) {
		if (type === 'post') {
			if (data.alipay_app_primary_key) {
				let that = this;
				if (data.alipay_app_primary_key.length > 117) {
					let splits = data.alipay_app_primary_key.match(/.{1,117}/g);
					data.alipay_app_primary_key = [];
					splits.forEach(function (entry) {
						data.alipay_app_primary_key.push(that.jsEncrypt(entry, configs.publicKey));
					});
				} else {
					data.alipay_app_primary_key = this.jsEncrypt(data.alipay_app_primary_key, configs.publicKey);
				}
			}
		}
		return this.http(type, configs.proxyBackendHost + configs.alipaySettingsUrl, data, callback, fallback);
	},
	facebookSettings: function (type, data, callback, fallback) {
		if (type === 'post') {
			if (data.facebook_app_secret) {
				data.facebook_app_secret = this.jsEncrypt(data.facebook_app_secret, configs.publicKey);
			}
		}
		return this.http(type, configs.proxyBackendHost + configs.facebookSettingUrl, data, callback, fallback);
	},
	githubSettings: function (type, data, callback, fallback) {
		if (type === 'post') {
			if (data.github_app_secret) {
				data.github_app_secret = this.jsEncrypt(data.github_app_secret, configs.publicKey);
			}
		}
		return this.http(type, configs.proxyBackendHost + configs.githubSettingUrl, data, callback, fallback);
	},
	giteeSettings: function (type, data, callback, fallback) {
		if (type === 'post') {
			if (data.gitee_app_secret) {
				data.gitee_app_secret = this.jsEncrypt(data.gitee_app_secret, configs.publicKey);
			}
		}
		return this.http(type, configs.proxyBackendHost + configs.giteeSettingUrl, data, callback, fallback);
	},
	googleSettings: function (type, data, callback, fallback) {
		if (type === 'post') {
			if (data.google_app_secret) {
				data.google_app_secret = this.jsEncrypt(data.google_app_secret, configs.publicKey);
			}
		}
		return this.http(type, configs.proxyBackendHost + configs.googleSettingUrl, data, callback, fallback);
	},
	lineSettings: function (type, data, callback, fallback) {
		if (type === 'post') {
			if (data.line_app_secret) {
				data.line_app_secret = this.jsEncrypt(data.line_app_secret, configs.publicKey);
			}
		}
		return this.http(type, configs.proxyBackendHost + configs.lineSettingUrl, data, callback, fallback);
	},
	qqSettings: function (type, data, callback, fallback) {
		if (type === 'post') {
			if (data.qq_app_secret) {
				data.qq_app_secret = this.jsEncrypt(data.qq_app_secret, configs.publicKey);
			}
		}
		return this.http(type, configs.proxyBackendHost + configs.qqSettingUrl, data, callback, fallback);
	},
	twitterSettings: function (type, data, callback, fallback) {
		if (type === 'post') {
			if (data.twitter_app_secret) {
				data.twitter_app_secret = this.jsEncrypt(data.twitter_app_secret, configs.publicKey);
			}
		}
		return this.http(type, configs.proxyBackendHost + configs.twitterSettingUrl, data, callback, fallback);
	},
	wechatSettings: function (type, data, callback, fallback) {
		if (type === 'post') {
			if (data.wechat_app_secret) {
				data.wechat_app_secret = this.jsEncrypt(data.wechat_app_secret, configs.publicKey);
			}
		}
		return this.http(type, configs.proxyBackendHost + configs.wechatSettingUrl, data, callback, fallback);
	},
	weiboSettings: function (type, data, callback, fallback) {
		if (type === 'post') {
			if (data.weibo_app_secret) {
				data.weibo_app_secret = this.jsEncrypt(data.weibo_app_secret, configs.publicKey);
			}
		}
		return this.http(type, configs.proxyBackendHost + configs.weiboSettingUrl, data, callback, fallback);
	},
	siteSettings: function (type, data, callback, fallback) {
		return this.http(type, configs.proxyBackendHost + configs.siteSettingsUrl, data, callback, fallback);
	},
	carouselSettings: function (type, data, callback, fallback) {
		return this.http(type, configs.proxyBackendHost + configs.carouselSettingsUrl, data, callback, fallback);
	},
	adminProfile: function (type, data, callback, fallback) {
		if (type === 'post' && data.password) {
			data.password = this.jsEncrypt(data.password, configs.publicKey);
		}
		return this.http(type, configs.proxyBackendHost + configs.adminProfileUrl, data, callback, fallback);
	},
	adminConnects: function (data, callback, fallback) {
		return this.http('get', configs.proxyBackendHost + configs.adminConnectsUrl, data, callback, fallback);
	},
	adminAuthorize: function (data, callback, fallback) {
		return this.http('get', configs.proxyBackendHost + configs.adminAuthorizeUrl, data, callback, fallback);
	},
	adminCallback: function (data, callback, fallback) {
		return this.http('get', configs.proxyBackendHost + configs.adminCallbackUrl, data, callback, fallback);
	},
	authorizeUrl: function (data, callback, fallback) {
		return this.http('get', configs.proxyBackendHost + configs.authorizeUrl, data, callback, fallback);
	},
	authorizeCallback: function (data, callback, fallback) {
		return this.http('get', configs.proxyBackendHost + configs.authorizeCallback, data, callback, fallback);
	},
	unbindConnect: function (data, callback, fallback) {
		return this.http('post', configs.proxyBackendHost + configs.unbindConnectUrl, data, callback, fallback);
	},
	http: function (type, url, data, callback, fallback) {
		const CancelToken = axios.CancelToken;
		const source = CancelToken.source();
		let options = {
			method: type,
			url: url,
			cancelToken: source.token
		};
		if (type === 'get') {
			options.params = data;
		} else {
			options.data = data;
		}
		axios(options).then(result => {
			if (result.data.code === 1) {
				callback(result.data);
			} else {
				if (result.data.message) {
					fallback(result.data.message);
				} else {
					fallback(result.statusText);
				}
			}
		}).catch(function (error) {
			let message;
			if (error.response) {
				console.log(error.response)
				if (error.response.status === 401) {
					let state = store.getState();
					console.log(state);
					if (state.auth.uuid) {
						store.dispatch({
							type: logoutAction.type,
							payload: {}
						});
					}
					if (!state.program.showLogin) {
						Swal.fire({
							icon: 'warning',
							text: "你还没有登录，请登录！",
							confirmButtonText: "确定",
							backdrop: true,
							allowOutsideClick: false,
							didClose: function () {
								store.dispatch({
									type: programAction.type,
									payload: {
										showLogin: true
									}
								});
							}
						})
					}
				}
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				message = (error.response.data && error.response.data.message) ? error.response.data.message : error.response.statusText;
			} else if (error.request) {
				// The request was made but no response was received
				// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
				// http.ClientRequest in node.js
				if (error.request.responseType === 'text') {
					message = error.request.responseText;
				} else if (error.request.responseType === 'document') {
					message = error.request.responseXML;
				} else {
					message = error.request.response;
				}
			} else {
				// Something happened in setting up the request that triggered an Error
				message = error.message;
			}
			fallback && fallback(message);
		});
		return source;
	},
	jsEncrypt: function (message, key) {
		// return QuickEncrypt.encrypt( message, key)
		const jsencrypt = new JSEncrypt()
		jsencrypt.setPublicKey(key);
		return jsencrypt.encryptLong(message);
	},
	jsDecrypt: function (message, key) {
		// return QuickEncrypt.encrypt( message, key)
		const jsencrypt = new JSEncrypt()
		jsencrypt.setPrivateKey(key);
		return jsencrypt.decryptLong(message);
	},
	//获取链接中参数的方法
	getQueryString: function (name) {
		const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
		const r = decodeURI(window.location.search).substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	},
	getQueryVariable: function () {
		let queryVariables = {}
		let query = window.location.search.substring(1);
		let vars = query.split("&");
		for (let i = 0; i < vars.length; i++) {
			let pair = vars[i].split("=");
			queryVariables[pair[0]] = pair[1]
		}
		return queryVariables;
	},
	checkPathName: function (pathName) {
		return document.location.pathname.indexOf(pathName) > 0;
	},
	getRequestPath: function () {
		let result = [];
		let path = document.location.pathname
		if (path !== '/') {
			result = path.split('/');
			result.shift();
		}
		return result;
	},
	//动态加载js
	loadScript: function (url, callback) {
		const script = document.createElement("script");
		script.type = "text/javascript";
		if (typeof (callback) !== "undefined") {
			if (script.readyState) {
				script.onreadystatechange = function () {
					if (script.readyState === "loaded" || script.readyState === "complete") {
						script.onreadystatechange = null;
						callback();
					}
				};
			} else {
				script.onload = function () {
					callback();
				};
			}
		}
		script.src = url;
		document.body.appendChild(script);
	},
	initVaptcha: function (groupCode, vid, onSuccess, onError) {
		window.vaptcha({
			//配置参数
			vid: vid, // 验证单元id
			type: 'invisible', // 展现类型 隐藏式
			container: null
			// container: '#captcha' // 按钮容器，可为Element 或者 selector
		}).then(function (vaptchaObj) {
			onSuccess(vaptchaObj);
		}).catch(error => {
			onError(error);
		});
	},
	isPhoneAvailable: function (val) {
		const myReg = /^1[3,4,5,7,8][0-9]{9}$/;
		if (!myReg.test(val)) {
			return false;
		} else {
			return true;
		}
	},
	objectIsEmpty: function (object) {
		if (typeof object === 'undefined') {
			return true;
		}
		return Object.keys(object).length === 0;
	},
	getFileType: function (file) {
		let fileType = file.type.toLowerCase();
		if (configs.imageTypes.indexOf(fileType) >= 0) {
			return 'image';
		}
		if (configs.videoTypes.indexOf(fileType) >= 0) {
			return 'video';
		}
		return null;
	}
}

export default Utils;