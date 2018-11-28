const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dataPromise = require('../WebpackPromiseData');
const prod = require('../webpack.prod');


dataPromise.then((opt) => {
    const entry = {};
    opt.forEach((a) => {
        let extraPath = a.path.substr(a.path.indexOf('src') + 3);
        if (/\//.test(extraPath)) extraPath = extraPath.substr(0, extraPath.lastIndexOf('/') + 1);
        else extraPath = extraPath.substr(0, extraPath.lastIndexOf('\\') + 1);
        // 文件在src内的路径,形如 /, /a/, /a/b/
        extraPath = extraPath.replace(/\\/g, '/');
        // js入口
        entry[`.${extraPath}js/${a.name}`] = a.path;
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
                './assets/css/[id].[contenthash].css',
                './assets/js/vendors',
                './assets/js/main',
                './assets/js/runtime',
                './assets/css/styles.css',
            ],
        });
    });


    const webpackConfig = Object.assign({}, { entry }, { plugins }, prod);
    webpackConfig.plugins = webpackConfig.plugins.concat(plugins);
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
