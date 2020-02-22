<template>
  <div ref="iframe" v-loading="loading" :style="'height:'+ height" class="iframe-wrap">
    <iframe :src="src" frameborder="no" style="width: 100%;height: 100%" scrolling="auto" />
    <div :style="slotStyle">
      <slot />
    </div>
  </div>
</template>
<script>
  export default {
    name: 'JlFrame',
    props: {
      src: {
        type: String,
        required: true
      },
      slotStyle: Object
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

<style scoped>
  .iframe-wrap {
    position: relative;
  }
</style>
