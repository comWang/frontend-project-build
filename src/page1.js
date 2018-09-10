import welcome from './components/welcome.vue';
import Vue from 'vue';
import './css/bg-blue.less';


new Vue({
    el:'#app',
    data:{
        msg:'Front end'
    },
    template:'<welcome class="bg-blue" />',
    components:{
        welcome
    }
});




