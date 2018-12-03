const HtmlWebpackPlugin = require('html-webpack-plugin');

const produceEntry = (opt) => {
    const entry = {};
    opt.forEach((a) => {
        let extraPath = a.path.substr(a.path.indexOf('src') + 3);
        if (/\//.test(extraPath)) extraPath = extraPath.substr(0, extraPath.lastIndexOf('/') + 1);
        else extraPath = extraPath.substr(0, extraPath.lastIndexOf('\\') + 1);
        // 文件在src内的路径,形如 /, /a/, /a/b/
        extraPath = extraPath.replace(/\\/g, '/');
        entry[`.${extraPath}js/${a.name}`] = a.path;
    });
    return entry;
};


const produceHTML = opt => (
    opt.map((a) => {
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
                './assets/js/vendors',
                './assets/js/main',
                './assets/js/runtime',
                './assets/css/styles.css',
            ],
        });
    })
);


module.exports = { produceEntry, produceHTML };
