<template>
  <el-select
    v-if="type === 'select'"
    v-model="labelValue"
    v-bind="$attrs"
    :disabled="dynamicDisabledAbel? (dynamicDisabled || $attrs.disabled) : $attrs.disabled"
    v-on="$listeners"
    onmouseover="this.title = this.getElementsByClassName('el-input__inner')[0].value"
    @change="dataChange">
    <el-option
      v-for="o in mapSelectOptions"
      :key="o.value"
      :label="o.label"
      :value="o.value"
      :disabled="o.disabled">
      <template v-if="labelFields.length">
        <span v-for="(itm, index) in labelFields" :key="index">
          {{ o[itm] }}
        </span>
      </template>
    </el-option>
  </el-select>
  <el-cascader
    v-else-if="type === 'cascader'"
    v-model="labelValue"
    v-bind="$attrs"
    v-on="$listeners"
    :disabled="dynamicDisabledAbel? (dynamicDisabled || $attrs.disabled) : $attrs.disabled"
    onmouseover="this.title = this.getElementsByClassName('el-input__inner')[0].value"
    :props="props"
    :options="mapSelectOptions" />
</template>

<script>
  import {initData} from "@/api/data";
  import {objectEqual} from "@/utils"

  export default {
    name: "FromSelect",
    components: {},
    directives: {},
    filters: {},
    mixins: [],
    model: {
      prop: 'value',
      event: 'input'
    },
    props: {
      value: [String, Number, Boolean, Array],
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
          value: 'value',
          children: 'children'
        })
      },
      type: String,
      dataField: String, // 返回结果中显示的字段名
      // 下拉选项显示字段
      labelFields: {
        type: Array,
        default: () => ([])
      },
      dynamicOptions: Array, // 动态选项   适用于一个框 多种条件选项
      dynamicOptionsAbel: Boolean, // 是否开启动态选项
      dynamicDisabled: Boolean, // 选择禁用   适用于一个框 多种条件
      dynamicDisabledAbel: Boolean
    },
    data() {
      return {
        optionsData: this.options || [],
        labelValue: ''
      }
    },
    computed: {
      mapSelectOptions() {
        if (this.type === 'cascader') {
          this.filterNullData(this.optionsData)
          return this.optionsData
        } else {
          const {label, value} = this.props
          return this.optionsData.map(item => {
            item.label = item[label]
            item.value = item[value]
            return item
          })
        }
      }
    },
    watch: {
      value: {
        handler(val) {
          this.labelValue = val
        },
        immediate: true
      },
      url: {
        handler(val) {
          if (val && !this.$attrs.cascade) {
            this.getAsyncOptions()
          }
        },
        immediate: true
      },
      params: {
        handler(val, oldVal) {
          if (!objectEqual(val, oldVal)) {
            this.getAsyncOptions(val)
          }
        },
        deep: true
      },
      dynamicOptions: {
        handler(val) {
          if (!this.url && this.dynamicOptionsAbel) {
            this.optionsData = val
          }
        },
        immediate: true,
        deep: true
      },
    },
    methods: {
      getAsyncOptions(params = this.params) {
          const key = encodeURIComponent(this.url + JSON.stringify(params) + this.$attrs.method)
          const optionsSelect = this.$store.state.optionsCache.data
          const index = optionsSelect.findIndex(item => item.key === key)
          if (index !== -1) {
              this.optionsData = optionsSelect[index].options
              return
          } else {
            initData(this.url, params, this.$attrs.method).then(res => {
                  if (res.status === 200) {
                      this.optionsData = res.data.list || res.data || []
                      if (this.dataField) {
                          this.optionsData = this.optionsData[this.dataField]
                      }
                      const obj = {
                          key: key,
                          options: this.optionsData
                      }
                      this.$store.dispatch('setCatch', obj)
                  }
              })
          }
      },

      filterNullData(data = []) {
        data.forEach(i => {
          if (i.hasOwnProperty('children') && i.children instanceof Array && i.children.length) {
            this.filterNullData(i.children)
          } else {
            delete i.children
          }
        })
      },

      dataChange(val) {
        const {value} = this.props
        this.$emit('dataChange', this.optionsData.find(i => i[value] === val))
      }
    }
  }
</script>

<style scoped lang="scss">
  /deep/.is-disabled .el-input__inner{
    color: #4D4D4D;
  }
</style>
