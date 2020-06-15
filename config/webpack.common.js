const paths = require(`./paths`)
const path = require(`path`)
const TerserPlugin = require(`terser-webpack-plugin`)
const { CleanWebpackPlugin } = require(`clean-webpack-plugin`)
const HTMLWebpackPlugin = require(`html-webpack-plugin`)
const MiniCssExtractPlugin = require(`mini-css-extract-plugin`)

const devMode = process.env.NODE_ENV !== `production`

function excludeNodeModulesExcept(modules) {
  var pathSep = path.sep
  if (pathSep == '\\') pathSep = '\\\\'
  var moduleRegExps = modules.map(function (modName) {
    return new RegExp('node_modules' + pathSep + modName)
  })

  return function (modulePath) {
    if (/node_modules/.test(modulePath)) {
      for (var i = 0; i < moduleRegExps.length; i++)
        if (moduleRegExps[i].test(modulePath)) return false
      return true
    }
    return false
  }
}

module.exports = {
  entry: {
    market: paths.src + `/market.js`,
    [`data-maker`]: paths.src + `/data-maker.js`,
    [`market-mvp`]: paths.src + `/market-mvp.js`,
    [`data-maker-mvp`]: paths.src + `/data-maker-mvp.ts`,
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
        extractComments: false,
        cache: true,
        parallel: true,
      }),
    ],
    // minimize: false,
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'swc-loader',
            options: {
              sync: true,
              jsc: {
                parser: {
                  syntax: 'typescript',
                },
              },
            },
          },
          'ts-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: excludeNodeModulesExcept(['effector']),
        use: {
          loader: `babel-loader`,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: [
          devMode ? `style-loader` : MiniCssExtractPlugin.loader,
          {
            loader: `css-loader`,
            options: {
              sourceMap: devMode,
            },
          },
          {
            loader: `postcss-loader`,
            options: {
              sourceMap: devMode,
            },
          },
          {
            loader: `sass-loader`,
            options: {
              sassOptions: {
                outputStyle: `expanded`,
              },
            },
          },
        ],
      },
      {
        test: /\.(ttf|eot|otf|woff2?)$/i,
        use: [
          {
            loader: `file-loader`,
            options: {
              name: `fonts/[name].[ext]`,
            },
          },
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: `file-loader`,
            options: {
              name: `[path][name].[ext]`,
              context: `src`,
            },
          },
        ],
      },
    ],
  },
  
  resolve: {
    extensions: ['.ts', '.js'],
  },

  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
    }),
    new HTMLWebpackPlugin({
      filename: `market.html`,
      template: paths.src + `/views/market.html`,
      meta: {
        charset: {
          charset: `utf-8`,
        },
        viewport: `width=device-width, initial-scale=1, shrink-to-fit=no`,
      },
      chunks: [`market`],
    }),
    new HTMLWebpackPlugin({
      filename: `data-maker.html`,
      template: paths.src + `/views/data-maker.html`,
      meta: {
        charset: {
          charset: `utf-8`,
        },
        viewport: `width=device-width, initial-scale=1, shrink-to-fit=no`,
      },
      chunks: [`data-maker`],
    }),
    new HTMLWebpackPlugin({
      filename: `market-mvp.html`,
      template: paths.src + `/views/market-mvp.html`,
      meta: {
        charset: {
          charset: `utf-8`,
        },
        viewport: `width=device-width, initial-scale=1, shrink-to-fit=no`,
      },
      chunks: [`market-mvp`],
    }),
    new HTMLWebpackPlugin({
      filename: `data-maker-mvp.html`,
      template: paths.src + `/views/data-maker-mvp.html`,
      meta: {
        charset: {
          charset: `utf-8`,
        },
        viewport: `width=device-width, initial-scale=1, shrink-to-fit=no`,
      },
      chunks: [`data-maker-mvp`],
    }),
  ],
}
