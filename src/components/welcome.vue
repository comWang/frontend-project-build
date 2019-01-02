<template>
    <div rel="root" class="flex-container">
      <div class="wrap">
        <h2 class="green ctr">welcome {{welcome}}</h2>
        <img :src="a" alt="" style="width:100%">
        <p class="ctr">滑动以下拉</p>
        <p class="ctr">插件测试：60% 屏幕宽度</p>
        <button @click="loadDynamic">点击以动态加载模块</button>
      </div>
    </div>
</template>


<script>
import a from 'assets/images/default/a.jpg';
import FlexC from 'assets/js/flex-container';

  export default {
      data() {
        return {
            welcome:'sweet',
            a,
        }
      },
      methods: {
        // 动态导入语法演示
        loadDynamic() {
          import(/* webpackChunkName: "assets/js/text" */ 'assets/js/text')
          .then(module => {
            alert(module.default.text);
          })
        },
      },
      mounted(){
        new FlexC({rel:'root'});
      },
  }
</script>

<style scoped>
.wrap {
  width:450;
  max-height: 200px;
  margin: auto;
  border: 1px solid #f7f8f8;
  border-radius: 10px;
  background-color: #f7f8f8;
  box-shadow:1px 2px 0 3px #f7f8f8;
}
.ctr {
  text-align: center;
}
.green{
  color: green
}

</style>