// @title: 主页
import Vue from 'vue';
import welcome from './components/welcome.vue';
import './css/index.css';
import Flexc from './assets/js/flex-container';

new Vue({
    el: '#app',
    data: {
        msg: 'Front end',
    },
    template: '<div rel="flex-container" class="flex-container a1"><welcome /></div>',
    mounted() {
        const instance = new Flexc({
            rel: 'flex-container',
        });
        instance.sayHi();
    },
    components: {
        welcome,
    },
});
