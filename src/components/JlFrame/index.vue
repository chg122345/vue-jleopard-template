<template>
  <div ref="iframe" v-loading="loading" :style="'height:'+ height">
    <iframe :src="src" frameborder="no" style="width: 100%;height: 100%" scrolling="auto" />
  </div>
</template>
<script>
  export default {
    name: 'JlFrame',
    props: {
      src: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        height: document.documentElement.clientHeight - 50 + 'px;',
        loading: true
      }
    },
    mounted() {
      const that = this
      setTimeout(() => {
        that.loading = false
      }, 230)
      window.onresize = function temp() {
        that.height = window.innerHeight - this.$refs.iframe.getBoundingClientRect().top - 17 + 'px'
        console.log(that.height, this.$refs.iframe.getBoundingClientRect().top)
      }
    }
  }
</script>
