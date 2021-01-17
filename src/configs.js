const configs = {
	publicKey: "-----BEGIN PUBLIC KEY-----\n" +
		"MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDD1jENRClo1hdOjCZAaq8FGxVP\n" +
		"W5owB/XaYvMSF3g9qntPQimol0QPKhv844IfjdsseyPcqrn9p4cbgGo2jtPtOfQ+\n" +
		"PrINf17SoVWYSKxebLdZq2v5TeiWqXRoYLyZhLfnWo3ZO4bPhP0U9WoXQR6Ek/7t\n" +
		"vvE/9qLTkQzDNGF56QIDAQAB\n" +
		"-----END PUBLIC KEY-----",
	fullpageLicenseKey: 'B2024500-5DBF4886-84798F7B-C8C76066',
	backendHost: "http://pms.test",
	proxyBackendHost: "http://web.pms.test/backend",
	vaptchaJsUrl: "://v.vaptcha.com/v3.js",
	settingUrl: "/setting",
	authUrl: "/admin/auth",
	loginUrl: "/admin/login",
	logoutUrl: "/admin/logout",
	carouselUrl: "/carousel",
	carouselListUrl: "/carousel/list",
	createCarouselUrl: "/carousel/create",
	deleteCarouselUrl: "/carousel/delete",
	previewCarouselUrl: "/carousel/preview",
	fileUrl: "",
	fileListUrl: "/file",
	uploadFileUrl: "/file/upload",
	deleteFileUrl: "/file/delete",
	postUrl: "/post",
	postListUrl: "/post/list",
	savePostUrl: "/post/save",
	getPostInfolUrl: "/post/info",
	getPostDetailUrl: "/post/detail",
	togglePostStatusUrl: "/post/toggle-status",
	deletePostUrl: "/post/delete",
	loginDuration: 3 * 24 * 60 * 60,
	imageTypes: [
		'image/png',
		'image/jpg',
		'image/jpeg'
	],
	videoTypes: [
		'video/mp4'
	]
}
export default configs;