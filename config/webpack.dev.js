const readline = require('readline');
const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('../webpack.common.js');
const promiseData = require('../WebpackPromiseData');
const { produceEntry, produceHTML } = require('./autoCreate');

// 请在这里更改端口等信息
const [https, host, port] = [false, '192.168.0.70', 3000];


// 显示编译进度
const handler = (percentage, message) => {
    const ratio = Math.round(percentage * 100);
    const info =  ratio === 100 ? '\033[32m ' + ratio + '% Successful! \033[0m' : '\033[32m ' + ratio + '% ' + message + '\033[0m';
    const link = ` ${https? 'https://' : 'http://'}${host}:${port} `;
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(info);
    if (ratio >= 100) console.log('按住Ctrl单击右边以预览 \033[32m' + link + '\033[0m');
};


const devConfig = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        filename: '[name].js',
        chunkFilename: '[name].js',
    },
    devServer: {
        https,
        index: 'index.html',
        hot: true,
        contentBase: path.resolve(__dirname, './build'),
        port,
        noInfo: true,
        host,
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
        new webpack.ProgressPlugin(handler),
    ],
    resolve: { alias: { vue: 'vue/dist/vue.js' } },
});


module.exports = () => (
    new Promise((resolve) => {
        promiseData('src').then((data) => {
            console.log('\033[32m Ready! \033[0m');
            const [entry, plugins] = [produceEntry(data), produceHTML(data)];
            const webpackConfig = Object.assign(
                { entry },
                devConfig,
            );
            // Object.assign 不能修改数组内部,这里用concat修改
            webpackConfig.plugins = webpackConfig.plugins.concat(plugins);
            resolve(webpackConfig);
        }).catch((err) => {});
    })
);
