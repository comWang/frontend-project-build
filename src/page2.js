import Vue from 'vue';
import goodbye from './components/goodbye.vue';
import '../public/images/2x/1.jpg';


new Vue({
    el: '#app',
    data: {
        msg: 'addtional page',
    },
    template: '<goodbye />',
    components: {
        goodbye,
    },

});
