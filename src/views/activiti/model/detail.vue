<template>
  <jl-frame :src="api" />
</template>

<script>
    import {getToken} from "@/utils/auth";

    export default {
        name: "Detail",
        data() {
            return {
              api: null
            }
        },
      created() {
          const id = this.$route.query.id
          this.api = `http://localhost:5001/editor?modelId=${id}&token=Bearer ${getToken()}`
      }
    }
</script>
