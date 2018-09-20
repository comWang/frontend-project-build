import Vue from 'vue';
import welcome from './components/welcome.vue';
import './css/common/bg-blue.less';
import './css/page1.less';

new Vue({
    el: '#app',
    data: {
        msg: 'Front end',
    },
    template: '<div class="a1 bg-blue"><welcome /></div>',
    components: {
        welcome,
    },
});
