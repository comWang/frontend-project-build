const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const common = require('./webpack.common.js');

function recursiveIssuer(m) {
    if (m.issuer) {
        return recursiveIssuer(m.issuer);
    } if (m.name) {
        return m.name;
    }
    return false;
}


const autoExtractCss = (entryList, option = {}) => {
    if (!Array.isArray(entryList)) throw new Error('type wrong');
    const obj = {};
    entryList.forEach((item) => {
        const fm = item.filename ? item.filename : item;
        obj[fm] = {
            name: fm,
            test: (m, c, entry = fm) => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
            chunks: 'all',
            enforce: true,
        };
    });

    return Object.assign(obj, option);
};


module.exports = merge(common, {
    mode: 'production',
    output: {
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].js',
    },
    resolve: { alias: { vue: 'vue/dist/vue.min.js' } },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin('build'),
        new MiniCssExtractPlugin({
            filename: './css/[id].[contenthash].css',
        }),
        new webpack.HashedModuleIdsPlugin(),
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
            }),
            new OptimizeCSSAssetsPlugin(),
        ],
        splitChunks: {
            cacheGroups: autoExtractCss([
                'page1',
                'page2',
            ]),
        },
    },


});
