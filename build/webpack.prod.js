const path = require('path');
const webpackConfig = require('./webpack.config');
const webpackmerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizecssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = webpackmerge(webpackConfig, {
    mode: 'production',
    devtool: 'cheap-module-source-map',
    plugins: [
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../public'),
            to: path.resolve(__dirname, '../dist')
        }])
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            }),
            new OptimizecssAssetsPlugin({})
        ],
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                libs: {
                    name: 'chunk-libs',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: 'initial'
                }
            }
        }
    }
})