// @title: 主页
// 通过向首行添加注释来配置生成的网页信息
// 可选参数有  @title、 @template 表示网页的title属性，应用的模板文件（相对于public文件夹）
import Vue from 'vue';
import App from 'components/welcome';
// 引用源文件目录下assets、components目录下的组件时，直接写 ' components/relative/to/filename '的形式，
// 避免多层嵌套下人为的路径书写错误，同时文件类型名也可以省略

new Vue({
    render: h => h(App),
}).$mount('#app');
