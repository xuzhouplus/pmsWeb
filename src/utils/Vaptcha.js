import Utils from "./Utils";

const Captcha = function (options) {
	this.options = {
		groupCode: null,
		vid: null,
		onReady: function () {

		},
		onSuccess: function () {

		}
	};
	this.options = Object.assign({}, this.options, options);
	this.init();
}
Captcha.prototype = {
	instance: null,
	init: function () {
		const that = this;
		Utils.initVaptcha(this.options.groupCode, this.options.vid, function (captcha) {
			that.instance = captcha;
			if (that.options.onReady) {
				that.options.onReady();
			}
			if (that.options.onSuccess) {
				that.instance.listen("pass", function () {
					that.options.onSuccess(that.instance.getToken());
				})
			}
		});
	},
	reset: function () {
		this.instance.reset();
	},
	verify: function () {
		this.instance.validate();
	},
	validate: function () {
		return this.instance.getToken();
	}
};
const Vaptcha = {
	load: function (callback) {
		Utils.loadScript(window.configs.vaptcha_js_url, function () {
			callback && callback();
		});
	},
	new: function (options) {
		return new Captcha(options);
	}
}

export default Vaptcha;