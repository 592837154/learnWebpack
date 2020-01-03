const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const vueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const devMode = process.argv.indexOf('--mode=production') === -1;
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: {
        main: path.resolve(__dirname, '../src/main.js')
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[hash:8].js'
    },
    module: {
        noParse: /jquery/,
        rules: [
            {
                test: /\.js$/,
                use: [
                    'cache-loader',
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                ],
                include: [path.resolve(__dirname, '../src')],
                exclude: /node_modules/,
            },
            {
                test: /\.vue$/,
                use: [
                    'cache-loader',
                    {
                    loader: 'vue-loader',

                    options: {
                        compilerOptions: {
                            preserveWhitespace: false
                        }
                    }
                }],
                include: [path.resolve(__dirname, '../src')],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    'cache-loader',
                    {
                    loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: "../dist/css/",
                        hmr: devMode
                    }
                }, 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [require('autoprefixer')]
                    }
                }],
                include: [path.resolve(__dirname, '../src')],
                exclude: /node_modules/,
            },
            {
                test: /\.less$/,
                use: [
                    'cache-loader',
                    {
                    loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: "../dist/css/",
                        hmr: devMode
                    }
                }, 'css-loader', 'less-loader', {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [require('autoprefixer')]
                    }
                }],
                include: [path.resolve(__dirname, '../src')],
                exclude: /node_modules/,
            },
            {
                test: /\.(jep?g|png|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10240,
                        fallback: {
                            loader: 'file-loader',
                            options: {
                                name: 'img/[name].[hash:8].[ext]'
                            }
                        }
                    }
                },
                include: [path.resolve(__dirname, '../src')],
                exclude: /node_modules/,
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10240,
                        fallback: {
                            loader: 'file-loader',
                            options: {
                                name: 'media/[name].[hash:8].[ext]'
                            }
                        }
                    }
                },
                include: [path.resolve(__dirname, '../src')],
                exclude: /node_modules/,
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10240,
                        fallback: {
                            loader: 'file-loader',
                            options: {
                                name: 'media/[name].[hash:8].[ext]'
                            }
                        }
                    }
                },
                include: [path.resolve(__dirname, '../src')],
                exclude: /node_modules/,
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html')
        }),
        new vueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./vendor-manifest.json')
        }),
        new CopyWebpackPlugin([{
            from: 'static', to: 'static'
        }]),
        // new BundleAnalyzerPlugin({
        //     analyzerHost: '127.0.0.1',
        //     analyzerPort: 2021
        // })
    ],
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.runtime.esm.js',
            ' @': path.resolve(__dirname, '../src')
        },
        extensions: ['*', '.js', '.json', '.vue']
    },
    optimization: {
        minimizer: [
            new ParallelUglifyPlugin({
                cacheDir: '.catch/',
                uglifyJS: {
                    output: {
                        comments: false,
                        beautify: false
                    },
                    compress: {
                        drop_console: true,
                        collapse_vars: true,
                        reduce_vars: true
                    }
                }
            })
        ]
    },
    externals: {
        echarts: 'echarts'
    }

}