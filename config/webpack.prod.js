const paths = require("./paths");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require("webpack");

module.exports = merge(common, {
    mode: "production",

    devtool: false,

    output: {
        publicPath: "",
        path: paths.build,
        filename: "js/[name].[contenthash].bundle.js",
    },

    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
            }),
        ],
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: `styles/[name].[contenthash].css`,
        }),
        new CopyPlugin({
            patterns: [{ from: paths.src + "/js/mock/mock.js", to: paths.build + "/mock" }],
        }),
        new webpack.DefinePlugin({
            Market: paths.src + "/js/market-mvp/main.js",
        }),
    ],
});
