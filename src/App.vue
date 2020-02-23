<template>
  <div id="app">
    <router-view />
    <approval-dialog ref="approval" />
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    name: 'App',
    mounted() {
      Vue.prototype.$approval = this.$refs.approval
    }
  }
</script>
