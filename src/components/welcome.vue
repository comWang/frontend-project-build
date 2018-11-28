<template>
    <div rel="root" class="flex-container">
      <div class="wrap">
        <h2 class="green ctr">welcome {{welcome}}</h2>
        <p class="ctr">滑动以下拉</p>
    </div>
    </div>
</template>


<script>
import FlexC from '../assets/js/flex-container';

  export default {
      data() {
        return {
            welcome:'sweet',
        }
      },
      mounted(){
        new FlexC({rel:'root'});
      },
  }
</script>

<style scoped>
.wrap {
  width:300px;
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