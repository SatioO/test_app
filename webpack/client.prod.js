const { clientCommon, PATHS } = require("./common.config")
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin")
const UglifyJSPlugin = require("uglifyjs-webpack-plugin")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
	.BundleAnalyzerPlugin
const webpack = require("webpack")

const clientProdConfig = Object.assign(clientCommon, {
	devtool: "source-map",
	entry: { main: PATHS.CLIENT },
	output: Object.assign(clientCommon.output, {
		filename: "js/[name].[chunkhash].js",
		chunkFilename: "js/[name].[chunkhash].js"
	}),
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: "vendor",
			minChunks: module => {
				// this assumes your vendor imports exist in the node_modules directory
				return (
					module.context &&
					module.context.indexOf("node_modules") !== -1
				)
			}
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: "bootstrap",
			minChunks: Infinity
		}),
		new ExtractCssChunks({ filename: "[name].[chunkhash].css" }),
		new UglifyJSPlugin({
			parallel: true,
			sourceMap: true,
			extractComments: true,
			uglifyOptions: {
				ecma: 5,
				compress: {
					dead_code: true,
					drop_debugger: true,
					hoist_funs: true,
					inline: true,
					join_vars: true,
					reduce_vars: true,
					warnings: true,
					drop_console: true,
					keep_infinity: true
				}
			}
		}),
		new BundleAnalyzerPlugin({
			openAnalyzer: true,
			generateStatsFile: true,
			statsFilename: "stats.json"
		}),
		new webpack.DefinePlugin({
			__DEV__: false,
			__PROD__: true,
			__SERVER__: false,
			__CLIENT__: true,
			"process.env.NODE_ENV": JSON.stringify("production")
		})
	]
})

module.exports = clientProdConfig
