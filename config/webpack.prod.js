const paths = require(`./paths`)
const { merge } = require(`webpack-merge`)
const common = require(`./webpack.common.js`)
const MiniCssExtractPlugin = require(`mini-css-extract-plugin`)
const CopyPlugin = require(`copy-webpack-plugin`)
const webpack = require(`webpack`)

module.exports = merge(common, {
  mode: `production`,

  devtool: false,

  output: {
    publicPath: ``,
    path: paths.build,
    filename: `js/[name].[contenthash].bundle.js`,
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: `styles/[name].[contenthash].css`,
    }),
    new CopyPlugin([{ from: paths.src + `/js/mock/mock.js`, to: paths.build + `/mock` }]),
    new webpack.DefinePlugin({
      Market: paths.src + `/js/market-mvp/main.js`,
    }),
  ],
})
