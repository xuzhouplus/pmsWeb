const path = require('path')
const pathResolve = pathUrl => path.join(__dirname, pathUrl)
const CracoRawLoaderPlugin = require("@baristalabs/craco-raw-loader");

module.exports = {
    plugins: [
        {
            plugin: CracoRawLoaderPlugin,
            options: {
                test: /\.glsl$/,
            }
        }
    ],
    webpack: {
        alias: {
            '@': pathResolve("src"),
            '@assets': pathResolve("src/assets"),
            '@components': pathResolve("src/components"),
            '@pages': pathResolve("src/pages"),
            '@utils': pathResolve("src/utils"),
            '@redux': pathResolve("src/redux")
        }
    }
};
