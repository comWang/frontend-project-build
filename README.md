# webpack4 进阶配置
这里是对[上文](./version1.md)的一个优化提升版。上文是一个通用配置，因为通用，所以显得不够灵活，比如有下面几个缺点：
1. #### 入口文件名要自己写，当文件多的时候太费劲。
2. #### 不能对页面分类，只能一起放在src一级目录下，当文件多的时候体验较差。
3. #### 不能根据页面分类的路径分开缓存。
上面缺点的产生，归根结底是因为按照之前的做法，我们无法在写配置文件的时候得到实际的文件路径，文件名等信息。因此这次我们需要用到Node API ，在编译
前动态得到新增的文件名及路径。
## 1.概述
用 fs.readdir() 方法异步获取src目录下所有文件、子文件名，并通过path.join()递归拼接当前路径，最终得到文件名及其对应的绝对路径。
在这里我们扩展了另一些需求。还记得上文中，我们怎么利用插件为每个js生成不同title的html吗？
``` javascript
const entryList = format({
    filename: 'index',
    title: '主页',
    template: 'template.html',
});
```
对的，是和入口文件一样写在数组中的，每次新增一个js文件就要在数组相应添加一个。用过flow.js的朋友应该知道，只需要在文件首行加上注释，flow便能为这个文件提供类型检查。
这种使用方式很舒服，而这次，我们借鉴flow的做法，只需要在那个js文件首行写一行注释：
``` javascript
// @title: 主页  @template: template.html
import Vue from 'vue';
```
而这个功能的实现，我们需要使用readline()方法，该方法是一个异步方法。因为异步方法的使用，我们就无法使用webpack提供的cli命令了，只能以node api的形式调用。
上面的文件读取功能都放在WebpackPromiseData.js中，再另外创建两个文件： dev.js，dist.js，分别用于开发和构建生产版本。可能有人仍然想用cli，把readline去掉，然后使用
同步的readdirSync不就好了吗，既可以自动读取目录，又可以使用cli一举两得。但这样做，就仍要为title创建数组，每新增一个js文件就要手动添加一个，同时还要匹配路径，这样
自动的意义就不大了。
## 2.用法
``` bash
$ npm install
//  开发
$ npm run start
// 生产
$ npm run build
```
### 这是现在的项目结构
``` 
|- frontend-project-build
  |- CLI/
  |- postcss-unify/
  |- public/
  |- src
    |- assets
      |- images/
      |- js/
      |- less/
    |- components/
    |- less/
    |- index.js
    |- page1
      |- less/
      |- page1.js
    |- page2/
    |- page...
  |- package.json
  |- package-lock.json
  |- .gitignore
  |- ...
```
postcss-unify是我们编写的一个postcss插件，用于将UI图中的尺寸按屏幕比例转化为vw单位，例如UI图中button宽度300px,高度200px,在css/less文件中可以这样写：
``` css
.button {
    width: 150;
    height: 75;
}
```
注意到这里我们写的时候不带尺寸单位，如果带了单位，则不会受此插件的作用。编译后的文件如下所示：
``` css
.button {
    width: 20vw;
    height: 10vw;
}
```
上面的src目录也可以写成
```
|- src
  |- assets/
  |- components/
  |- index
    |- less/
    |- index.js
  |- page1
    |- less/
    |- page1.js
    |- sign.js
    |- mine.js
  |- page...
```
assets存放图片、公共的js/less等资源。编译时，会搜寻名字带有page的文件夹下的js文件生成html文件，使用的模板文件，来自于public目录。
## 3.存在的问题
在开发模式下，修改了源文件内容，webpack-dev-server会自动编译，但是浏览器不会相应作出刷新，总之就是开发服务器无法控制浏览器。目前这个issue已得到开发人员的确认，会在未来
修复，因此现在需要手动刷新。



