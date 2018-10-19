import Vue from 'vue';
import welcome from './components/welcome.vue';
import './css/page1.less';
import Flexc from './flex-container';

new Vue({
    el: '#app',
    data: {
        msg: 'Front end',
    },
    template: '<div rel="flex-container" class="flex-container"><welcome /></div>',
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
