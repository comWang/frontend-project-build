import goodbye from './components/goodbye.vue';
import Vue from 'vue';

new Vue({
    el:'#app',
    data:{
        msg:'addtional page'
    },
    template:'<goodbye />',
    components:{
        goodbye
    }

});




