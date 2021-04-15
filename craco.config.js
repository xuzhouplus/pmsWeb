const path = require('path')

const pathResolve = pathUrl => path.join(__dirname, pathUrl)

module.exports = {
	webpack: {
		alias: {
			'@': pathResolve( "src"),
			'@public':pathResolve( "public"),
			'@components': pathResolve( "src/components"),
			'@pages': pathResolve("src/pages"),
			'@utils': pathResolve("src/utils")
		}
	}
};
