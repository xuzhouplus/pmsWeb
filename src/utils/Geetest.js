import Utils from "./Utils";

const Captcha = function (options) {
	this.options = {
		groupCode: null,
		onReady: function () {

		},
		onSuccess: function () {

		},
		onError: function (error) {

		},
		onClose: function () {

		}
	};
	this.options = Object.assign({}, this.options, options);
	this.init();
};
Captcha.prototype = {
	instance: null,
	init: function () {
		const that = this;
		Utils.initGeetest(this.options.groupCode, function (captcha) {
			that.instance = captcha;
			if (that.options.onReady) {
				that.instance.onReady(function () {
					that.options.onReady();
				});
			}
			if (that.options.onSuccess) {
				that.instance.onSuccess(function () {
					that.options.onSuccess(that.instance.getValidate())
				});
			}
			if (that.options.onError) {
				that.instance.onError(function (error) {
					that.options.onError(error);
				});
			}
			if (that.options.onClose) {
				that.instance.onClose(function () {
					that.options.onClose()
				});
			}
		});
	},
	reset: function () {
		this.instance.reset();
	},
	verify: function () {
		this.instance.verify();
	},
	validate: function () {
		return this.instance.getValidate();
	},
	destroy: function () {
		this.instance.destroy();
	}
};
const Geetest = {
	load: function (callback) {
		Utils.loadScript(process.env.PUBLIC_URL + window.configs.geetest_js_url, function () {
			callback && callback();
		});
	},
	new: function (options) {
		return new Captcha(options);
	}
}

export default Geetest;