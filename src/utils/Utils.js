import {JSEncrypt} from 'jsencrypt';
import axios from "axios";
import configs from "../config";

const Utils = {
	login: function (account, password, callback, fallback) {
		this.http('post', configs.backendHost + configs.loginUrl, {account: account, password: this.jsEncrypt(password)}, callback, fallback)
	},
	logout: function (callback, fallback) {
		this.http('post', configs.backendHost + configs.logoutUrl, null, callback, fallback)
	},
	auth: function (callback, fallback) {
		this.http('post', configs.backendHost + configs.authUrl, null, callback, fallback)
	},
	site: function (callback, fallback) {
		let siteConfigs = localStorage.getItem('site_configs');
		if (siteConfigs) {
			callback(JSON.parse(siteConfigs));
		}
		this.http('get', configs.backendHost + configs.settingUrl, null, function (response) {
			localStorage.setItem('site_configs', JSON.stringify(response));
			callback(response);
		}, fallback)
	},
	posts: function (data, callback, fallback) {
		this.http('get', configs.backendHost + configs.postUrl, data, callback, fallback)
	},
	http: function (type, url, data, callback, fallback) {
		axios({
			method: type,
			url: url,
			data: data
		}).then(result => {
			console.log(result);
			if (result.data.code === 1) {
				callback(result.data);
			} else {
				fallback(result.statusText);
			}
		}).catch(function (error) {
			console.log(error);
			fallback(error.toString());
		});
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
	}
}

export default Utils;