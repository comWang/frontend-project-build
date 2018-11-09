import Vue from 'vue';
import goodbye from '../components/goodbye.vue';


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
