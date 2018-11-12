# VUE前端多页面工程构建（webpack4）
之前一直用的脚手架，这次自己搭建webpack前端项目，花费了不少心思，于是做个总结。
## 1.用法
#### 项目结构如下：
```
project
  |- bulid                   <!-- 这个目录是自动生成的-->
       |- public
       |- css
       |- js
       |- page1.html             <!-- 插件生成的html文件-->
       |- page2.html             <!-- 插件生成的html文件-->
       ...
  |- public/                 <!-- 存放字体、图片、网页模板等静态资源-->
  |- src                     <!-- 源码文件夹-->
       |- components/
       |- css/
       |- js/
       |- page1.js               <!-- 每个页面唯一的VUE实例，需绑定到#app-->
       |- page2.js               <!-- 每个页面唯一的VUE实例，需绑定到#app-->
       ...
  |- package.json
  |- package-lock.json
  |- README.md
```
public文件夹存放一些静态文件，src文件夹存放源码。每个页面通过一个入口文件（page1.js，page2.js,..）生成vue实例，挂载到插件生成的html文件的#app元素上。
#### 安装依赖
``` bash
$ npm install
```
#### 进入开发模式
``` bash
$ npm run start
```
浏览器会打开 `http://localhost:3000`,这时页面一片空白，显示 cannot get几个字。不要慌，在url后面加上 `/page1.html`,回车，便可看见我们的页面。
这是因为我把开发服务器的主页设置为`index.html`，而本例中页面为 page1.html,page2.html,因此会显示一片空白。
#### 开发完成了，构建生产版本：
``` bash
$ npm run build
```
这会产生一个build/文件夹，里面的文件都经过优化，服务器响应的资源，就是来自于这个文件夹。

## 2.介绍

### 2.1 webpack基础配置
我们的开发分为生产环境和开发环境，因此需要有2份webpack的配置文件（可能你会想用env环境变量，然后用3目运算符根据env的值返回不同值。然而这种方法在webpack导出模块的属性中无效，我试过~~~）。这里我们拆分成3个文件，其中`webpack.common.js`是常规的配置，在两种环境下都会用到，`webpack.dev.js`和`webpack.prod.js`则是在2种环境下的特有配置。这里用到 `webpack-merge`这个包，将公共配置和特有配置进行合成。
- webpack.common.js
``` javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const devMode = process.env.NODE_ENV !=='production';

// 需要被打包入口文件数组
// 数组元素类型 {string|object}
// string:将以默认规则生成bundle
// object{filename|title|template} 生成的bundle.html的文件名|title标签内容|路径 /public 下的模板文件(需指定文件后缀)
const entryList = [
    'page1',
    'page2',
];


/**
 * @param {array} entryList
 * @param {object} option:可选  要手动配置的内容
 */
const createEntry = (list = [], option = {}) => {
    const obj = {};
    list.forEach((item) => {
        const name = item.filename ? `./js/${item.filename}` : `./js/${item}`;
        obj[name] = path.resolve(__dirname, './src', `./${item}.js`);
    });
    return Object.assign(obj, option);
};


module.exports = {
    entry: createEntry(entryList),
    output: {
        path: path.resolve(__dirname, './build'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
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
                        name: 'public/fonts/[name].[ext]',
                    },
                },
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'public/images/[name].[ext]',
                    },
                },
            },
        ],
    },
    plugins: createPluginInstance(entryList).concat([
        // vue SFCs单文件支持
        new VueLoaderPlugin(),
    ]),
};

```
这里我们没有进行css文件的配置，是因为生产环境下需要优化、提取，所以在另外2个文件分别配置，详细解释看[这儿](https://webpack.js.org/plugins/mini-css-extract-plugin/)。
- webpack.dev.js
``` javascript
const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        filename: '[name].js',
        chunkFilename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.(css|less)$/,
                use: [
                    'vue-style-loader',
                    'css-loader', 
                    'postcss-loader',
                    'less-loader'
                ],
            },
        ],
    },
    resolve: { alias: { vue: 'vue/dist/vue.js' } },
});

```
vue分为开发版本和生产版本，最后一行是根据路径指定使用哪个版本。
- webpack.prod.js
``` javascript
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const common = require('./webpack.common.js');

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
                test: /\.(css|less)$/,
                use: [
                    MiniCssExtractPlugin.loader, 
                    'css-loader', 
                    'postcss-loader',
                    'less-loader'
                ],
            },
        ],
    },
```
在production环境下，我们使用了哈希值便于[缓存](https://webpack.js.org/guides/caching/)，以后往生产环境下添加其他资源都会如此。

### 2.2 解决文件输出目录
我们期待的build文件夹具有如下结构：
```
build
  |- css/
  |- js/
  |- page1.html
  |- page2.html
  ...
```
即文件按照类型放在一起，html文件直接放在该目录下，可是我们上面的配置的输出结果是混合在一起的。由于name属性既可以是文件名，也可以是`/dir/a`之类带有路径的文件名，我们根据这个特点做出一些修改。
- #### 直接对output的输出路径更改
比如改为`build/js`,其他资源利用相对路径比如`../page1.html`进行修改。我一开始就这样做的，但最终会导致开发服务器无法响应文件的变化，因为他只能针对输出目录下的文件进行监听，该目录之上的文件变化无能为力。
- #### 修改入口名称
这也是我们的最终解决方案。将原来的文件名`page1`修改为`/js/page1`，最终输出的js文件便都会放在js文件夹里。在生产环境下我们通过 MiniCssExtractPlugin 这个插件提取js文件中的css，这是该插件的配置：
``` javascript
new MiniCssExtractPlugin({
            filename:'[name].[contenthash].css'
        })
```
这里的name就是当初入口的名字，受到入口名称更改的影响，上面最终会变成 `js/page1.131de8553ft82.css`，并且该占位符[name]只在编译时有效，这意味着无法用函数对该值进行处理。因此不能使用[name]占位符达到想要的目的，干脆只用[id]。
``` javascript
new MiniCssExtractPlugin({
            filename:'/css/[id].[contenthash].css'
        })
```

## 3.代码分割
在webpack4中使用optimization.splitChunks进行分割.
``` javascript
//webpack.common.js
const path = require('path');

module.exports = {
   // ... 省略其他内容
    optimization:{
        runtimeChunk:{
            name:'./js/runtime'
        },
        splitChunks:{
            // 避免过度分割，设置尺寸不小于30kb
            //cacheGroups会继承这个值
            minSize:30000,
            cacheGroups:{
                //vue相关框架
                main:{
                    test: /[\\/]node_modules[\\/]vue[\\/]/,
                    name: './js/main',
                    chunks:'all'
                },
                //除Vue-*之外其他框架
                vendors:{
                    test: /[\\/]node_modules[\\/]?!(vue)[\\/]/,
                    name: './js/vendors',
                    chunks:'all'
                },
                //业务中可复用的js
                extractedJS:{
                    test:/[\\/]src[\\/].+\.js$/,
                    name:'./js/extractedJS',
                    chunks:'all'
                }
                
            }
        }
    }
};
```
runtimeChunk包含了一些webapck的样板文件，使得你在不改变源文件内容的情况下打包，哈希值仍然改变，因此我们把他单独提取出来，[点这儿](https://webpack.js.org/guides/caching/)了解更多。
cacheGroups用于提取复用的模块，test会尝试匹配（`模块的绝对路径||模块名`），返回值为true且满足[条件](https://webpack.js.org/plugins/split-chunks-plugin/#optimization-splitchunks)的模块会被分割。满足的条件可自定义，比如模块最小应该多大尺寸、至少被导入进多少个chunk（即复用的次数）等。默认在打包前模块不小于30kb才被会分割。
## 4.树抖动
在package.json里加入
``` javascript
"sideEffects"：["*.css","*.less","*.sass",".vue"]
```
该数组之外的文件将会受到[树抖动](https://webpack.js.org/guides/tree-shaking/)的影响——未使用的代码将会从export导出对象中剔除。这将大大减少无用代码。值得一提的是，所有css文件（包括.less,.sass）以及vue的单文件组件都必须放进来，否则会出现样式丢失，之前我就这样被坑过，后来好不容易才找到原因。其实文档说的很详细，当初看的不够仔细忽略了~
## 5. 插件的使用
### 5.1 clean-webpack-plugin
每次打包后都会生成新的文件，这可能会导致无用的旧文件堆积，对于这些无用文件自己一个个删太麻烦，这个插件会在每次打包前自动清理。实际中，我们不想在开发环境下清理掉build命令生成的文件，因此只在生产环境使用了这个插件。
### 5.2 html-Webpack-plugin
我们的源码目录中并没有html文件，打包后的多个html文件，就是我们用这个[插件](https://webpack.js.org/plugins/html-webpack-plugin/)生成的。
``` javascript
//webpack.common.js
// ...省略上面已经出现过的内容

//每个html需要一个插件实例
//批量生成html文件
const createPluginInstance = (list = []) => (
    list.map((item) => {
        return new HtmlWebpackPlugin({
            filename: item.filename ? `${item.filename}.html` : `${item}.html`,
            template: item.template ? `./public/${item.template}` :             './public/template.html',
            title: item.title ? item.title : item,
            chunks: [
                `./js/${item.filename ? item.filename : item}`,
                './js/extractedJS',
                './js/vendors',
                './js/main',
                './js/runtime',
                './css/styles.css',
                devMode ? './css/[id].css' : './css/[id].[contenthash].css',
            ],
        });
    })
);
```
默认会将所有的入口文件，代码分割后的文件打包进一个html文件里，通过指定`chunks`属性来告诉插件`只包含`哪些块，或者exludeChunks指定不应包含那些chunks。这里有个小问题，我们无法让文件刚好只包含他需要的块。若想不包含未使用的chunks，只能根据实际情况手动配置，用这个函数批量生成的文件，总会包含所有的公共打包文件。
### 5.3 mini-css-extract-plugin (prooduction)
该插件用于提取js文件中的css到单独的css文件中。
``` javascript
//webpack.prod.js
//...省略其他内容
plugins:[
        new CleanWebpackPlugin('build'), 
        // 提取css
        new MiniCssExtractPlugin({
            filename:'./css/[id].[contenthash].css'
        }),
        //优化缓存
        new webpack.HashedModuleIdsPlugin()
    ]   
```
### 5.4 optimize-css-assets-webpack-plugin （production）
用于精简打包后的css代码，设置在配置optimization的minimizer属性中，这将会[覆盖](https://webpack.js.org/plugins/mini-css-extract-plugin/#minimizing-for-production)webpack默认设置，因此也要同时设置js的精简工具(这里我们用uglifyplugin插件)：
``` javascript
optimization: {
        minimizer:[
          new UglifyJsPlugin({
            cache: true,
            parallel: true
          }),
          new OptimizeCSSAssetsPlugin()
        ]
    }
```
## 6.开发服务器、热模块替换 (development)
webpack.dev.js中增加如下内容即可：
``` javascript
//...省略其他内容
devServer:{
        index:'index.html',
        hot:true,
        contentBase:path.resolve(__dirname,'./build'),
        port:3000,
        noInfo:true
    },
plugins:[
        new webpack.HotModuleReplacementPlugin()
    ]
```
使用开发服务器可以在我们修改了源文件后自动刷新,因为是将数据放在内存中，因此不会影响硬盘中build文件夹。热模块替换还需要在源文件做[相应修改](https://webpack.js.org/guides/hot-module-replacement/)。我们也为动态导入语法进行了相应配置。
## 7.其他
public用于存放静态资源，打包后也会在build/下创建一个同名文件夹，里面存放的是public会被使用到的资源。如果在.css文件里引用了public里的资源，如图片，添加url的时候要使用绝对路径：
``` css
<!-- src/css/page1.css -->
.bg-img {
    background-image:url(/public/images/1.jpg)
}
```
这样通过 http/https 打开的时候就能正常使用，如果是以文件形式打开（比如打包后双击page1.html），会发现浏览器显示无法找到资源。通过导入图片作为变量引用（`import name from path`），或者使用less，sass等预处理器时，涉及到图片路径，都要使用相对路径。
``` less
<!-- src/css/page1.css -->
.bg-img {
    background-image:url(/public/images/1.jpg);
    width: image-width(../../public/images/1.jpg);
}
```
至于以上结论的原因，在stackoverflow上有个回答，说是目前预处理器(less,sass)在设计上只支持相对路径引入图片。如果url也使用相对路径（url(./a.jpg)），在编译后总会加上文件路径，例如最后把less编译的css输出到css/文件夹下，最终引入路径会变成css/a.jpg。
