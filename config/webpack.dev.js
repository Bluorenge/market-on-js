const paths = require(`./paths`)
const merge = require(`webpack-merge`)
const common = require(`./webpack.common.js`)
const MiniCssExtractPlugin = require(`mini-css-extract-plugin`)

module.exports = merge(common, {
  mode: `development`,

  output: {
    path: paths.dist,
    filename: `js/[name].js`,
  },

  devtool: `inline-source-map`,

  devServer: {
    historyApiFallback: true,
    contentBase: paths.dist,
    open: true,
    compress: true,
    host: `192.168.1.161`,
    hot: true,
    watchContentBase: true,
    clientLogLevel: `silent`,
    // writeToDisk: true,
    port: 8080
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: `style/[name].css`,
    })
  ]
})