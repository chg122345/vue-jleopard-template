<template>
  <jl-frame :src="sqlApi" />
</template>
<script>
  export default {
    name: 'Index',
    data() {
      return {
        sqlApi: `http://192.168.198.1:8008/druid`
      }
    }
  }
</script>
