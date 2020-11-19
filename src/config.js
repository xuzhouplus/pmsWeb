const configs = {
	publicKey: "-----BEGIN PUBLIC KEY-----\n" +
		"MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDD1jENRClo1hdOjCZAaq8FGxVP\n" +
		"W5owB/XaYvMSF3g9qntPQimol0QPKhv844IfjdsseyPcqrn9p4cbgGo2jtPtOfQ+\n" +
		"PrINf17SoVWYSKxebLdZq2v5TeiWqXRoYLyZhLfnWo3ZO4bPhP0U9WoXQR6Ek/7t\n" +
		"vvE/9qLTkQzDNGF56QIDAQAB\n" +
		"-----END PUBLIC KEY-----",
	backendHost: "http://web.pms.test/backend",
	vaptchaJsUrl: "://v.vaptcha.com/v3.js",
	settingUrl: "/setting",
	authUrl: "/admin/auth",
	loginUrl: "/admin/login",
	logoutUrl: "/admin/logout",
	loginDuration: 3 * 24 * 60 * 60
}
export default configs;