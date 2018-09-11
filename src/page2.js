import goodbye from './components/goodbye.vue';
import Vue from 'vue';
import a1 from '../public/images/1.jpg';
import './css/common/bg.css'

new Vue({
    el:'#app',
    data:{
        msg:'addtional page'
    },
    template:`<div class="bg-img"><goodbye /><img src=${a1}></div>`,
    components:{
        goodbye
    }

});




