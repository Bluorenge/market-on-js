const paths = require("./paths");
const utils = require("./utils");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const devMode = process.env.NODE_ENV !== "production";

// Обработка стилей
let styleLoaders = [
    {
        loader: MiniCssExtractPlugin.loader,
        options: { publicPath: "../" },
    },
    {
        loader: "css-loader",
        options: { sourceMap: devMode },
    },
    {
        loader: "postcss-loader",
        options: { sourceMap: devMode },
    },
    {
        loader: "sass-loader",
        options: {
            sourceMap: devMode,
            sassOptions: {
                outputStyle: "expanded",
            },
        },
    },
];

// Если дев-режим, то убираем лишнюю обработку стилей для ускорения сборки
if (devMode) {
    styleLoaders[0] = "style-loader";
    styleLoaders.splice(2, 1);
}

module.exports = {
    entry: {
        market: paths.src + "/market.js",
        ["data-maker"]: paths.src + "/data-maker.js",
        ["market-mvp"]: paths.src + "/market-mvp.js",
        ["data-maker-mvp"]: paths.src + "/data-maker-mvp.js",
    },

    output: {
        assetModuleFilename: pathData => {
            const filepath = path.dirname(pathData.filename).split("/").slice(1).join("/");
            return `${filepath}/[name][ext]`;
            // return "${filepath}/[name].[hash][ext][query]";
        },
        clean: true,
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: utils.excludeNodeModulesExcept(["effector"]),
                use: { loader: "babel-loader" },
            },
            {
                test: /\.(css|s[ac]ss)$/i,
                use: styleLoaders,
            },
            {
                test: /\.(ttf|eot|otf|woff2?)$/i,
                type: "asset/resource",
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                type: "asset/resource",
            },
        ],
    },

    plugins: [
        new HTMLWebpackPlugin({
            filename: "market.html",
            template: paths.src + "/views/market.html",
            meta: {
                charset: {
                    charset: "utf-8",
                },
                viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
            },
            chunks: ["market"],
        }),
        new HTMLWebpackPlugin({
            filename: "data-maker.html",
            template: paths.src + "/views/data-maker.html",
            meta: {
                charset: {
                    charset: "utf-8",
                },
                viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
            },
            chunks: ["data-maker"],
        }),
        new HTMLWebpackPlugin({
            filename: "market-mvp.html",
            template: paths.src + "/views/market-mvp.html",
            meta: {
                charset: {
                    charset: "utf-8",
                },
                viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
            },
            chunks: ["market-mvp"],
        }),
        new HTMLWebpackPlugin({
            filename: "data-maker-mvp.html",
            template: paths.src + "/views/data-maker-mvp.html",
            meta: {
                charset: {
                    charset: "utf-8",
                },
                viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",
            },
            chunks: ["data-maker-mvp"],
        }),
    ],
};
