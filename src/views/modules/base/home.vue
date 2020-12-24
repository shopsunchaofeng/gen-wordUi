<template>
  <img src="~@/assets/img/111_meitu_1.jpg" :height="height- 130"/>
</template>
<script>
  export default {
    data () {
      return {
        height: ''
      }
    },
    mounted () {
      window.fullHeight = document.documentElement.clientHeight
      this.height = window.fullHeight
    }
  }
</script>
