const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        filename: '[name].js',
        chunkFilename: '[name].js',
    },
    devServer: {
        index: 'index.html',
        hot: true,
        contentBase: path.resolve(__dirname, './build'),
        port: 3000,
        noInfo: true,
    },
    module: {
        rules: [
            {
                test: /\.(css|less)$/,
                use: ['vue-style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
            },
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
    resolve: { alias: { vue: 'vue/dist/vue.js' } },
});
