<template>
  <jl-frame :src="sqlApi" />
</template>
<script>
  export default {
    name: 'Index',
    data() {
      return {
        sqlApi: `${process.env.VUE_APP_BASE_API}/sys/druid`
      }
    }
  }
</script>
