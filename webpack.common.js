const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    output: {
        path: path.resolve(__dirname, './build'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.vue$/,
                use: 'vue-loader',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: './assets/fonts/[name].[ext]',
                    },
                },
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: './assets/images/[name].[ext]',
                    },
                },
            },
        ],
    },
    plugins: [
        // vue SFCs单文件支持
        new VueLoaderPlugin(),
        new CleanWebpackPlugin('build'),
    ],
    optimization: {
        runtimeChunk: {
            name: './assets/js/runtime',
        },
        splitChunks: {
            minSize: 30000,
            cacheGroups: {
                // 根据绝对路径匹配vue
                main: {
                    test: /[\\/]node_modules[\\/]vue[\\/]/,
                    name: './assets/js/main',
                    chunks: 'all',
                },
                // 除Vue之外其他框架
                vendors: {
                    test: /[\\/]node_modules[\\/]?!(vue)[\\/]/,
                    name: './assets/js/vendors',
                    chunks: 'all',
                },
                // 分割公共css文件
                styles: {
                    test: /[\\/]assets\.+(css|less)$/,
                    name: './assets/css/styles.css',
                },
            },
        },
    },
};
