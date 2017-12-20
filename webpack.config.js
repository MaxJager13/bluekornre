const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');

const bootstrapEntryPoints = require('./webpack.bootstrap.config');


const isProd = process.env.NODE_ENV === 'production'; //true | false

const cssDev = [
									'style-loader',
									'css-loader',
									'sass-loader',
									{
										loader: 'sass-resources-loader',
										options: {
											resources: './src/css/partials/resources.scss'
										}
									},
									'postcss-loader'
			];

const cssProd = ExtractTextPlugin.extract({
									fallback: 'style-loader',
									use: [
													'css-loader',
													'sass-loader',
													{
														loader: 'sass-resources-loader',
														options: {
															resources: './src/css/partials/resources.scss'
														}
													},
													'postcss-loader'
									],
								});

const cssConfig = isProd ? cssProd : cssDev;

const bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;

module.exports = {
	entry: {
		app: './src/js/app.js',
		bootstrap: bootstrapConfig
	},
	stats: { //optional settings
		children: false,
		assets: false,
		chunks: false,
		timings: true,
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: './js/[name].bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: cssConfig
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: "babel-loader"
			},
			{
				test: /\.(jpe?g|png|gif|mp4)$/i,
				use: [
						'file-loader?name=assets/[name].[ext]',
						'image-webpack-loader'
					// {
					// 		loader: 'file-loader',
					// 		options: {
					// 			name: '[name].[ext]',
					// 			publicPath: '../',
					// 			outputPath: 'img/'
					// 		}
					// },
					// {
					// 	loader: "image-webpack-loader"
					// }
				]
			},
			{
				test: /\.(woff2?|svg)$/,
				loader: 'url-loader?limit=10000&name=fonts/[name].[ext]'
			},
    	{
				test: /\.(ttf|eot)$/,
				loader: 'file-loader?name=fonts/[name].[ext]'
			},
			{
				test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/,
				loader: 'imports-loader?jQuery=jquery'
			},
		]
	},
	devServer: {
		contentBase: path.join(__dirname, "dist"),
	  compress: true,
		// hot: true,
		stats: "errors-only",
		// open: true
	},
	plugins: [
		// new webpack.HotModuleReplacementPlugin(),
		// new webpack.NamedModulesPlugin(),
		new HtmlWebpackPlugin({
			title: 'HTML Webpack Templete',
			template: './src/index.html',
			hash: true,
			minify: {
				collapseWhitespace: false
			}
		}),
		new ExtractTextPlugin({
			filename: './css/[name].css',
			disable: !isProd,
			allChunks: true
		}),
		new PurifyCSSPlugin({
      paths: glob.sync(path.join(__dirname, 'src/*.html')),
    }),
		new webpack.ProvidePlugin({
			$: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    //   Popper: ['popper.js', 'default'],
    //   Util: "exports-loader?Util!bootstrap/js/dist/util",
    //   Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
		// 	Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
		})
	]
}
