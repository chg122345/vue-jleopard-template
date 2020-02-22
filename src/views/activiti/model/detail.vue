<template>
  <jl-frame :src="url" :slot-style="{ position: 'absolute',top: '12px',right: '10px'}">
    <el-button type="danger" icon="el-icon-circle-close" size="small" plain @click="close">关闭</el-button>
  </jl-frame>
</template>

<script>
    import {getToken} from "@/utils/auth";

    export default {
        name: "Detail",
        data() {
            return {
              url: null
            }
        },
      created() {
          const id = this.$route.query.id
          this.url = `http://localhost:5001/editor?modelId=${id}&token=Bearer ${getToken()}`
      },
      methods: {
        close() {
          this.$router.replace("/activiti/model")
        }
      }
    }
</script>
