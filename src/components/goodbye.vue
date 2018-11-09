<template>
  <div class='bg-img'>
    <h2 class="red">Goodbye ! {{goodbye}}</h2>
    <p>expect see you soon </p>
  </div>
</template>


<script>
import '../assets/images/1.jpg';
  export default {
      data:function () {
        return {
            goodbye:'my dear'
        }
      }
  }
</script>

<style scoped lang='less'>
@import '../assets/less/bg.less';
.red{
  color: red
}

</style>