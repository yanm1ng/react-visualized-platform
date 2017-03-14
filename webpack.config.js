var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: ['webpack/hot/dev-server', path.resolve(__dirname, './src/router/index')],
	output: {
		path: path.resolve(__dirname, './build'),
		filename: 'bundle.js'
	},
	devServer: {
		contentBase: '',
		devtool: 'eval',
		hot: true,
		inline: true,
		port: 8888
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
				}
			}, {
				test: /\.(css|scss)$/,
				loader: ExtractTextPlugin.extract("style", "css!sass!autoprefixer")
			}, {
				test: /\.(png|jpg|jpeg|gif|eot|woff|svg|ttf|woff2|appcache)(\?|$)/,
				exclude: /^node_modules$/,
				loader: 'file-loader?name=[name].[ext]'
			}
		]
	},
	resolve: {
		extensions: ['', '.js', '.jsx'], //后缀名自动补全
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.optimize.CommonsChunkPlugin('common.js'),
		new ExtractTextPlugin("[name].css"),
		new HtmlWebpackPlugin({
			filename: '../index.html',
			template: './src/index.html',
			inject: 'body',
			hash: true
		})
	]
};
