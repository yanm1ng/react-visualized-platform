var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    'webpack-hot-middleware/client',
    path.resolve(__dirname, './src/router/index')
  ],
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'bundle.js',
    chunkFilename: '[name].[chunkhash:10].js',
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        query: {
          babelrc: false,
          presets: ['react', 'es2015', 'stage-3'],
          plugins: [
            "transform-class-properties",
            ["import", { libraryName: "antd", style: "css" }]
          ]
        },
        exclude: /^node_modules$/
      }, {
        test: /\.(css|scss)$/,
        loader: ExtractTextPlugin.extract("style", "css!sass!autoprefixer")
      }, {
        test: /\.(png|jpg|jpeg|gif|eot|woff|svg|ttf|woff2)(\?|$)/,
        exclude: /^node_modules$/,
        loader: 'file-loader?name=[name].[ext]'
      }
    ]
  },
  resolve: {
    root: path.resolve(__dirname, './node_modules'),
    extensions: ['', '.js', '.jsx'], //后缀名自动补全
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      output: {
				comments: false,
			},
			compressor: {
				warnings: false
			}
    }),
    new webpack.HotModuleReplacementPlugin(),

    new webpack.optimize.CommonsChunkPlugin('common.js'),

    new ExtractTextPlugin("[name].css"),

    new webpack.DllReferencePlugin({
			context: __dirname,
			manifest: require('./manifest.json'),
		}),
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: './src/index.html',
      inject: 'body',
      hash: true
    })
  ]
};
