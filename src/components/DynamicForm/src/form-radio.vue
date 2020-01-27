<template>
  <el-radio-group
    v-bind="$attrs"
    v-on="$listeners">
    <el-radio
      v-for="(item,index) of optionsData"
      :label="item.value"
      v-bind="item"
      :key="index">
      {{ item.label }}
    </el-radio>
  </el-radio-group>
</template>

<script>
  import {initData} from "@/api/data";

  export default {
    name: "FormRadio",
    components: {},
    directives: {},
    filters: {},
    mixins: [],
    props: {
      url: String,
      params: Object,
      options: {
        type: Array,
        default: () => ([])
      },
      props: {
        type: Object,
        default: () => ({
          label: 'label',
          value: 'value'
        })
      },
    },
    data() {
      return {
        optionsData: this.options
      }
    },
    computed: {
      mapSelectOptions() {
        const {label, value} = this.props
        return this.optionsData.map(item => {
          item.label = item[label]
          item.value = item[value]
          return item
        })
      }
    },
    watch: {
      url: {
        handler(val) {
          if (val) {
            this.getAsyncOptions()
          }
        },
        immediate: true
      },
      params: {
        handler(val, oldVal) {
          if (val !== oldVal) {
            this.getAsyncOptions(val)
          }
        },
        deep: true
      },
    },
    methods: {
      getAsyncOptions(params = this.params) {
        const key = encodeURIComponent(this.url + params + this.$attrs.method)
        const optionsSelect = this.$store.state.optionsCache.data
        const index = optionsSelect.findIndex(item => item.key === key)
        if (index !== -1) {
          this.optionsData = optionsSelect[index].options
          return
        } else {
          initData(this.url, params, this.$attrs.method).then(res => {
            if (res.status === 200) {
              this.optionsData = res.data.list || res.data || []
              const obj = {
                key: key,
                options: this.optionsData
              }
              this.$store.dispatch('setCatch', obj)
            }
          })
        }
      },
    }
  }
</script>

<style scoped>

</style>
