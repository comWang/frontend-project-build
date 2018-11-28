const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    output: {
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].js',
    },
    resolve: { alias: { vue: 'vue/dist/vue.min.js' } },
    module: {
        rules: [
            {
                test: /\.(css|less)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin('build'),
        new MiniCssExtractPlugin({
            filename: './assets/css/[contenthash].css',
        }),
        new webpack.HashedModuleIdsPlugin(),
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
            }),
            new OptimizeCSSAssetsPlugin(),
        ],
    },


});
