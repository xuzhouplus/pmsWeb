import {JSEncrypt} from 'jsencrypt';
import axios from "axios";

const Utils = {
	getLoginConfig: function (groupCode, callback, fallback) {
		axios({
			method: 'get',
			url: window.configs.cmc_group_url + "/lr/login/get-login-conf",
			data: {
				group_code: groupCode
			}
		}).then(result => {
			callback(result);
		}).catch(error => {
			fallback && fallback(error);
		});
	},
	http: function (type, url, data, callback) {
		axios({
			method: type,
			url: url,
			data: data
		}).then(result => {
			callback(result);
		});
	},
	postLoginForm: function (params, loginUrl, callback) {
		axios({
			method: 'post',
			url: window.configs.cmc_group_url + loginUrl,
			data: params
		}).then(result => {
			callback(result);
		});
	},
	postResetForm: function (params, callback) {
		axios({
			method: 'post',
			url: window.configs.cmc_group_url + window.configs.reset_user_pwd_url,
			data: params
		}).then(result => {
			callback(result);
		});
	},
	postRegisterForm: function (params, callback) {
		axios({
			method: 'post',
			url: window.configs.cmc_group_url + window.configs.local_reg_url,
			data: params
		}).then(result => {
			callback(result);
		});
	},
	jsEncrypt: function (message) {
		const key = window.configs.public_key;
		const jsencrypt = new JSEncrypt()
		jsencrypt.setPublicKey(key);
		return jsencrypt.encrypt(message);
	},
	getGroupCode: function () {
		let group_code_data = window.location.pathname.match(/login\/([0-9]+)(.|\?)/);
		if (!group_code_data) {
			group_code_data = window.location.pathname.match(/\/([0-9]+)(.|\?)/);
		}
		if (group_code_data) {
			if (!group_code_data[1]) {
				throw "当前登录地址错误";
			} else {
				return group_code_data[1];
			}
		}
	},
	sendMobileCodeMessage: function (params, callback) {
		axios({
			method: 'post',
			url: window.configs.cmc_group_url + window.configs.send_mobile_code_message_url,
			data: params
		}).then(result => {
			callback(result);
		});
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
	initGeetest: function (groupCode, onSuccess, onError) {
		axios({
			method: 'get',
			url: window.configs.cmc_group_url + "/vc/verify/init-geetest?t=" + (new Date()).getTime(),
			data: {
				group_code: groupCode
			}
		}).then(result => {
			window.initGeetest({
					gt: result.data.gt,
					challenge: result.data.challenge,
					new_captcha: result.data.new_captcha,
					product: "bind", // 产品形式，包括：float，bind，popup。注意只对PC版验证码有效
					offline: !result.data.success,
					width: "300px",//弹窗宽度，px或%
				}, function (captchaObj) {
					onSuccess(captchaObj);
				}
			);
		}).catch(error => {
			onError(error);
		});
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
	resetPwd: function (user_token) {
		// layer.open({
		// 	title: '修改密码',
		// 	btn: ['确认', '取消'],
		// 	type: 1,
		// 	skin: 'layui-layer-demo', //样式类名
		// 	closeBtn: 0, //不显示关闭按钮
		// 	shadeClose: false,
		// 	anim: 2,
		// 	area: ['420px', '350px'],
		// 	content: '<div id="reset-pwd"><div style="margin-bottom: 0px;" class="force-login-title"><p>您的密码过于简单，不符合当前系统密码强度设定，请重置密码</p><input class="login-input" id="reset-old-pwd" type="password" placeholder="请输入旧密码"/><input class="login-input" id="reset-new-pwd1" style="margin-top: 10px;" type="password" placeholder="请确认新密码"/><input id="reset-new-pwd2" class="login-input" style="margin-top: 10px;" type="password" placeholder="请输入新密码"/></div></div>',
		// 	yes: function (index, layero) {
		// 		var old_pwd = $('#reset-old-pwd').val();
		// 		var new_pwd = $('#reset-new-pwd1').val();
		// 		var new_pwd1 = $('#reset-new-pwd2').val();
		// 		if (!old_pwd) {
		// 			layer.msg('请输入旧密码');
		// 			return false;
		// 		}
		// 		if (!new_pwd) {
		// 			layer.msg('请输入新密码');
		// 			return false;
		// 		}
		// 		if (!new_pwd1) {
		// 			layer.msg('请确认新密码');
		// 			return false;
		// 		}
		// 		if (new_pwd != new_pwd1) {
		// 			layer.msg('请确认新密码，输入密码不一致');
		// 			return false;
		// 		}
		// 		if (new_pwd.length < 6) {
		// 			layer.msg('密码过于简短，请输入6-16位密码');
		// 			return false
		// 		}
		// 		params = {user_token: user_token, old_pwd: old_pwd, new_pwd: new_pwd};
		// 		resetPwdAction(params, function (data) {
		// 			var result = JSON.parse(data);
		// 			if (result.code === 10000) {
		// 				layer.closeAll();
		// 				$('#login_pwd').val(new_pwd);
		// 				layer.msg('修改密码成功，请重新登录');
		// 			} else {
		// 				layer.msg(result.message);
		// 			}
		// 		});
		// 	},
		// 	btn2: function (index, layero) {
		// 		layer.closeAll();
		// 	}
		// });
	},

	//获取字符串强度值
	getStrStrong: function (str) {
		let strong = 0;
		const len = window.pwd_len ? window.pwd_len : 6;
		if (str.length < len) {
			return 0;
		}
		if (/[0-9]+/.test(str)) {
			strong++;
		}
		if (/[a-z]+/.test(str)) {
			strong++;
		}
		if (/[A-Z]+/.test(str)) {
			strong++;
		}
		if (/[\'.,:;*?~`!@#$%^&+=)(<>{}]|\]|\[|\/|\\\|\"|\|/.test(str)) {
			strong++;
		}
		return strong;
	},
	isPhoneAvailable: function (val) {
		const myReg = /^1[3,4,5,7,8][0-9]{9}$/;
		if (!myReg.test(val)) {
			return false;
		} else {
			return true;
		}
	},
	isPasswordAvailable: function (val) {
		const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
		if (!reg.test(val)) {
			return false;
		} else {
			return true;
		}
	}
}

export default Utils;