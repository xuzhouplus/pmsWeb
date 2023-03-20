const path = require('path')
const pathResolve = pathUrl => path.join(__dirname, pathUrl)
const {loaderByName, addBeforeLoader} = require("@craco/craco");

module.exports = {
	webpack: {
		alias: {
			'@': pathResolve("src"),
			'@assets': pathResolve("src/assets"),
			'@components': pathResolve("src/components"),
			'@pages': pathResolve("src/pages"),
			'@utils': pathResolve("src/utils"),
			'@redux': pathResolve("src/redux")
		},
		configure: (webpackConfig, {env, paths}) => {
			const rawLoader = {
				test: /\.glsl$/,
				type: 'asset/source'
			}
			addBeforeLoader(webpackConfig, function (rule) {
				return rule['type'] && rule['type'] === 'asset/resource'
			}, rawLoader)
			return webpackConfig
		}
	}
};
