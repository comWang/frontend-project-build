const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const common = require('../webpack.common.js');
const promiseData = require('../WebpackPromiseData');
const { produceEntry, produceHTML } = require('./autoCreate');

const prodConfig = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    profile: true,
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
        new StatsPlugin('/ANALYSE/stats.json', {
            chunkModules: true,
        }),
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


module.exports = () => (
    new Promise((resolve) => {
        promiseData('src').then((data) => {
            console.log('\033[32m Ready! \033[0m');
            const [entry, plugins] = [produceEntry(data), produceHTML(data)];
            const webpackConfig = Object.assign(
                { entry },
                prodConfig,
            );
            // Object.assign 不能修改数组内部,这里用concat修改
            webpackConfig.plugins = webpackConfig.plugins.concat(plugins);
            resolve(webpackConfig);
        }).catch((err) => {});
    })
);
