import {JSEncrypt} from 'jsencrypt';
import axios from "axios";
import configs from "../configs";

const Utils = {
	login: function (account, password, callback, fallback) {
		return this.http('post', configs.proxyBackendHost + configs.loginUrl, {
			account: account,
			password: this.jsEncrypt(password)
		}, callback, fallback)
	},
	logout: function (callback, fallback) {
		this.http('post', configs.proxyBackendHost + configs.logoutUrl, null, callback, fallback)
	},
	auth: function (callback, fallback) {
		this.http('post', configs.proxyBackendHost + configs.authUrl, null, callback, fallback)
	},
	site: function (callback, fallback) {
		let siteConfigs = localStorage.getItem('site_configs');
		if (siteConfigs) {
			callback(JSON.parse(siteConfigs));
		}
		this.http('get', configs.proxyBackendHost + configs.settingUrl, null, function (response) {
			localStorage.setItem('site_configs', JSON.stringify(response));
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
	savePost: function (data, callback, fallback) {
		return this.http('post', configs.proxyBackendHost + configs.savePostUrl, data, callback, fallback)
	},
	deletePost: function (id, callback, fallback) {
		return this.http('post', configs.proxyBackendHost + configs.deletePostUrl, {id: id}, callback, fallback)
	},
	http: function (type, url, data, callback, fallback) {
		const CancelToken = axios.CancelToken;
		const source = CancelToken.source();
		let options = {
			method: type,
			url: url,
			cancelToken: source.token
		};
		if (type == 'get') {
			options.params = data;
		} else {
			options.data = data;
		}
		axios(options).then(result => {
			console.log(result);
			if (result.data.code === 1) {
				callback(result.data);
			} else {
				fallback(result.statusText);
			}
		}).catch(function (error) {
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
		return source;
	},
	jsEncrypt: function (message) {
		const key = configs.publicKey;
		const jsencrypt = new JSEncrypt()
		jsencrypt.setPublicKey(key);
		return jsencrypt.encrypt(message);
	},
	//获取链接中参数的方法
	getQueryString: function (name) {
		const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
		const r = decodeURI(window.location.search).substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	},
	checkPathName: function (pathName) {
		return document.location.pathname.indexOf(pathName) > 0;
	},
	//动态加载js
	loadScript: function (url, callback) {
		const script = document.createElement("script");
		script.type = "text/javascript";
		if (typeof (callback) != "undefined") {
			if (script.readyState) {
				script.onreadystatechange = function () {
					if (script.readyState == "loaded" || script.readyState == "complete") {
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
		if (typeof object == 'undefined') {
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