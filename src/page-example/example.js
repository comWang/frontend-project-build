// @title: 示例
import Vue from 'vue';
import './css/red.css';

new Vue({
    el: '#app',
    data: {
        msg: 'This is an example',
    },
    template: '<div class="red">{{msg}}</div>',
});
