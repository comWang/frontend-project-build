<template>
  <div class='bg-img'>
    <h2 class="red">Goodbye ! {{goodbye}}</h2>
    <p>expect see you soon </p>
  </div>
</template>


<script>
  export default {
      data:function () {
        return {
            goodbye:'my dear'
        }
      }
  }
</script>

<style scoped lang='less'>
@import '../css/common/bg.less';
.red{
  color: red
}

</style>