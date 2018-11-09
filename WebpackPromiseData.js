const fs = require('fs');
const readline = require('readline');
const path = require('path');

// 保存文件名
const fileList = [];

// 获取文件夹下一级文件/文件夹列表
const readFileList = dir => (
    new Promise((resolve, reject) => {
        fs.readdir(dir, { withFileTypes: true }, (err, files) => {
            if (err) {
                reject(err);
                console.log('读取文件目录失败');
            } else {
                const result = files.map(file => ({
                    name: file.name,
                    isFile: file.isFile(),
                    path: dir,
                }));
                resolve(result);
            }
        });
    })
);


// 提取配置信息
const extractProps = (key, str) => {
    const len = key.length;
    const index = str.indexOf(`${key}:`);
    if (index !== -1) {
        return str.substr(index + len + 1);
    }
    return '';
};


// 读取js文件首行内容,并提取出配置对象返回
const readFirstLine = absName => (new Promise((resolve, reject) => {
    let str = null;
    const rl = readline.createInterface({
        input: fs.createReadStream(absName),
        crlfDelay: Infinity,
    });
    rl.on('line', (line) => {
        if (str === null) {
            const obj = {};
            str = line.trim();
            if (/^\/\/.*/.test(str)) {
                const list = str.substr(2).split('@');
                list.forEach((a) => {
                    const val = a.replace(/\s/g, '');
                    const key = val.substr(0, val.indexOf(':') || 0);
                    if (key) obj[key] = extractProps(key, val);
                });
            }
            resolve(obj);
            rl.close();
        }
    });

    rl.on('error', (err) => {
        if (str === null) reject(err);
    });
}));


// 递归遍历给定的整个目录
const walkDirRecur = root => (new Promise((resolve, reject) => {
    fs.stat(root, async (err, stats) => {
        if (err) reject(new Error(`读取文件失败: ${err}`));
        else if (stats.isDirectory()) {
            const files = await readFileList(root);
            const promises = files.map(f => (new Promise(async (suc) => {
                // 仅追踪js/jsx文件
                if (f.isFile && /\.(js)|(jsx)$/.test(f.name) && !/\.test/.test(f.name)) {
                    const absPath = path.resolve(__dirname, root, f.name);
                    const name = f.name.substr(0, f.name.indexOf('.'));
                    fileList.push({ name, path: absPath });
                    suc(f);
                    // 只允许名字带有 page 的文件夹
                } else if (!f.isFile && /page/.test(f.name)) suc(walkDirRecur(path.join(root, f.name)));
                // 其他条件保证成功状态(即其他条件不影响结果)
                else suc('ok');
            })));

            Promise.all(promises).then((data) => {
                resolve(...data);
            });
        } else console.log('遍历的根路径应是目录而非文件');
    });
}));


const produceConfig = async (root) => {
    console.log('Creating webpack entry,please waiting a moment...');
    await walkDirRecur(root).catch((err) => { console.error(err); });
    const promises = fileList.map(file => (new Promise((resolve, reject) => {
        readFirstLine(file.path).then((options) => {
            resolve({
                name: file.name, // ./index.js => index
                path: file.path, // ./index.js => E:/rootDir/src/index.js
                title: options.title,
                template: options.template,
            });
        }).catch((err) => {
            console.error('Readline failed: ', err);
            reject(err);
        });
    })));
    const entryAndOptions = await Promise.all(promises);
    return entryAndOptions;
};


module.exports = produceConfig('./src');
