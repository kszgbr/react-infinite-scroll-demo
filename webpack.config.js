const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (options) => {
    const config = {
        entry: ['babel-polyfill', './src/index.jsx'],

        devServer: {
            hot: true
        },

        output: {
            path: path.resolve(process.cwd(), 'dist'),
            publicPath: '/',
            filename: 'main.bundle.js'
        },

        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: 'babel-loader'
                }, {
                    test: /\.scss$/,
                    exclude: /node_modules/,
                    use: [
                        'style-loader', {
                            loader: 'css-loader',
                            query: {
                                modules: true,
                                sourceMap: true,
                                importLoaders: 2,
                                localIdentName: '[name]__[local]___[hash:base64:4]'
                            }
                        },
                        'sass-loader'
                    ]
                }
            ]
        },

        stats: {
            colors: true
        },

        devtool: 'source-map',

        resolve: {
            modules: [path.resolve('./src'), path.resolve('./node_modules')]
        },

        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new HtmlWebpackPlugin({title: "react-infinite-scroll-demo", filename: "index.html", template: "template.ejs", hash: false, cache: false})
        ]
    };

    return config;
};
