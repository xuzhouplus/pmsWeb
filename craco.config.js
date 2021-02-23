const path = require("path");
const fs = require('fs');

module.exports = {
	webpack: {
		alias: {
			'@': path.resolve(__dirname, "src"),
			'@public': path.resolve(__dirname, "public"),
			'@components': path.resolve(__dirname, "src/components"),
		}
	}
};
