const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dataPromise = require('./WebpackPromiseData');
const prod = require('./webpack.prod');


dataPromise.then((opt) => {
    const entry = {};
    const cacheGroups = {};
    // 产生入口文件及分割css
    opt.forEach((a) => {
        let extraPath = a.path.substr(a.path.indexOf('src') + 3);
        if (/\//.test(extraPath)) extraPath = extraPath.substr(0, extraPath.lastIndexOf('/') + 1);
        else extraPath = extraPath.substr(0, extraPath.lastIndexOf('\\') + 1);
        // 文件在src内的路径,形如 /, /a/, /a/b/
        extraPath = extraPath.replace(/\\/g, '/');
        const extraPathWin = extraPath.replace(/\//g, '[\\/]');
        const extraPathLin = extraPath.replace(/\//g, '[\\\\]');
        // js入口
        entry[`.${extraPath}js/${a.name}`] = a.path;
        // css根据路径分割
        const cssFrom = RegExp(`(/src${extraPathWin}?=${a.name})|(src/${extraPathLin})?=${a.name}`);
        cacheGroups[`${a.name}Style`] = {
            test: cssFrom,
            name: `.${extraPath}css/${a.name}.[contenthash].css`,
        };
    });

    // 根据模板生成Html文件
    const plugins = opt.map((a) => {
        let extraPath = a.path.substr(a.path.indexOf('src') + 3);
        if (/\//.test(extraPath)) extraPath = extraPath.substr(0, extraPath.lastIndexOf('/') + 1);
        else extraPath = extraPath.substr(0, extraPath.lastIndexOf('\\') + 1);
        // 文件在src内的路径,不包括文件名和.符号
        extraPath = extraPath.replace(/\\/g, '/');
        return new HtmlWebpackPlugin({
            filename: `.${extraPath}${a.name}.html`,
            template: a.template ? `./public/${a.template}` : './public/template-compatible.html',
            title: a.title || a.name,
            chunks: [
                `.${extraPath}js/${a.name}`,
                './static/css/[id].[contenthash].css',
                './static/js/vendors',
                './static/js/main',
                './static/js/runtime',
                './static/css/styles.css',
            ],
        });
    });


    const webpackConfig = Object.assign({}, { entry }, { plugins }, prod);
    webpackConfig.plugins = webpackConfig.plugins.concat(plugins);
    const org = webpackConfig.optimization.splitChunks.cacheGroups;
    webpackConfig.optimization.splitChunks.cacheGroups = Object.assign({}, org, cacheGroups);
    webpack(webpackConfig, (err, stats) => {
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false,
        }));
    });
});
