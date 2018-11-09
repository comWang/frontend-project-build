const path = require('path');
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dataPromise = require('./WebpackPromiseData');
const dev = require('./webpack.dev');

dataPromise.then((opt) => {
    const entry = {};

    // 产生入口文件
    opt.forEach((a) => {
        let extraPath = a.path.substr(a.path.indexOf('src') + 3);
        if (/\//.test(extraPath)) extraPath = extraPath.substr(0, extraPath.lastIndexOf('/') + 1);
        else extraPath = extraPath.substr(0, extraPath.lastIndexOf('\\') + 1);
        // 文件在src内的路径,形如 /, /a/, /a/b/
        extraPath = extraPath.replace(/\\/g, '/');
        entry[`.${extraPath}js/${a.name}`] = a.path;
    });

    // 根据模板生成Html文件
    const plugins = opt.map((a) => {
        let extraPath = a.path.substr(a.path.indexOf('src') + 3);
        if (/\//.test(extraPath)) extraPath = extraPath.substr(0, extraPath.lastIndexOf('/') + 1);
        else extraPath = extraPath.substr(0, extraPath.lastIndexOf('\\') + 1);
        extraPath = extraPath.replace(/\\/g, '/');
        return new HtmlWebpackPlugin({
            filename: `.${extraPath}${a.name}.html`,
            template: a.template ? `./public/${a.template}` : './public/template-compatible.html',
            title: a.title || a.name,
            chunks: [
                `.${extraPath}js/${a.name}`,
                './static/js/vendors',
                './static/js/main',
                './static/js/runtime',
                './static/css/styles.css',
            ],
        });
    });

    const webpackConfig = Object.assign({}, { entry }, { plugins }, dev);
    // Object.assign 不能修改数组内部,这里用concat修改
    webpackConfig.plugins = webpackConfig.plugins.concat(plugins);
    // Node API 下devServer的配置在这传递才有效
    const devServerOptions = Object.assign({}, webpackConfig.devServer, {
        open: true,
        stats: {
            colors: true,
            error: true,
            modules: false,
            assets: false,
            entrypoints: false,
            hash: false,
            version: false,
        },
    });
    const complier = Webpack(webpackConfig);
    const server = new WebpackDevServer(complier, devServerOptions);
    server.listen(devServerOptions.port || 3000, devServerOptions.host || 'localhost', () => {
        console.info(`Starting server on http://${devServerOptions.host}:${devServerOptions.port}`);
    });
});
