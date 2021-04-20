const path = require('path')

const pathResolve = pathUrl => path.join(__dirname, pathUrl)

module.exports = {
	webpack: {
		alias: {
			'@': pathResolve( "src"),
			'@assets':pathResolve( "assets"),
			'@components': pathResolve( "src/components"),
			'@pages': pathResolve("src/pages"),
			'@utils': pathResolve("src/utils"),
			'@redux': pathResolve("src/redux")
		}
	}
};
