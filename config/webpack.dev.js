const paths = require("./paths");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const devMode = process.env.NODE_ENV !== `production`;
const smp = new SpeedMeasurePlugin();

const mergedConfig = merge(common, {
    mode: "development",

    output: {
        path: paths.dist,
        filename: `js/[name].js`,
    },

    devServer: {
        static: paths.dist,
        open: true,
        compress: true,
        host: "127.0.0.1",
        hot: false,
        port: 3003,
        devMiddleware: {
            // writeToDisk: true,
        },
    },

    plugins: [],
});

module.exports = smp.wrap(mergedConfig);
