const paths = require(`./paths`)
const TerserPlugin = require(`terser-webpack-plugin`)
const { CleanWebpackPlugin } = require(`clean-webpack-plugin`)
const HTMLWebpackPlugin = require(`html-webpack-plugin`)
const MiniCssExtractPlugin = require(`mini-css-extract-plugin`)

const devMode = process.env.NODE_ENV !== `production`

module.exports = {
  entry: {
    market: paths.src + `/market.js`,
    [`data-maker`]: paths.src + `/data-maker.js`,
    [`market-mvp`]: paths.src + `/market-mvp.js`
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        },
        extractComments: false,
        cache: true,
        parallel: true
      })
    ],
    minimize: false
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        // include: [
        //   /node_modules\/effector\/effector.es.js/,
        //   paths.src
        // ],
        use: {
          loader: `babel-loader`
        }
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: [
          devMode ? `style-loader` : MiniCssExtractPlugin.loader,
          {
            loader: `css-loader`,
            options: {
              sourceMap: devMode
            }
          },
          {
            loader: `postcss-loader`,
            options: {
              sourceMap: devMode
            }
          },
          {
            loader: `sass-loader`,
            options: {
              sassOptions: {
                outputStyle: `expanded`
              }
            }
          }
        ]
      },
      {
        test: /\.(ttf|eot|otf|woff2?)$/i,
        use: [
          {
            loader: `file-loader`,
            options: {
              name: `fonts/[name].[ext]`
            }
          }
        ]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: `file-loader`,
            options: {
              name: `[path][name].[ext]`,
              context: `src`
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin({
      verbose: true
    }),
    new HTMLWebpackPlugin({
      filename: `market.html`,
      template: paths.src + `/views/market.html`,
      meta: {
        charset: {
          charset: `utf-8`
        },
        viewport: `width=device-width, initial-scale=1, shrink-to-fit=no`
      },
      chunks: [`market`]
    }),
    new HTMLWebpackPlugin({
      filename: `data-maker.html`,
      template: paths.src + `/views/data-maker.html`,
      meta: {
        charset: {
          charset: `utf-8`
        },
        viewport: `width=device-width, initial-scale=1, shrink-to-fit=no`
      },
      chunks: [`data-maker`]
    }),
    new HTMLWebpackPlugin({
      filename: `market-mvp.html`,
      template: paths.src + `/views/market-mvp.html`,
      meta: {
        charset: {
          charset: `utf-8`
        },
        viewport: `width=device-width, initial-scale=1, shrink-to-fit=no`
      },
      chunks: [`market-mvp`]
    })
  ]
}
