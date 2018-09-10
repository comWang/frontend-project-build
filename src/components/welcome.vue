<template>
  <div>
    <h2 class="green">welcome {{welcome}}</h2>
    <p>we`re waiting for you!</p>
  </div>  
</template>


<script>
  export default {
      data:function () {
        return {
            welcome:'sweet'
        }
      }
  }
</script>

<style scoped>
.green{
  color: green
}
</style>