<template>
  <div class="select-data-container">
    <div class="select-box">
      <el-select
        v-model="labelValue"
        v-bind="$attrs"
        :disabled="disabled"
        :filterable="subType === 'select'"
        :popper-class="subType === 'select'?'':'select-tree'"
        :filter-method="searchAbel ? dataFilter : null"
        v-on="$listeners"
        @change="dataChange"
        @clear="clear"
        clearable
        :value-key="!props.value ? props.key : null"
        onmouseover="this.title = this.getElementsByClassName('el-input__inner')[0].value">
        <el-option
          v-for="(o, index) of mapSelectOptions"
          :key="index"
          :label="o[props.label]"
          :value="props.value? o[props.value] : o"
          :disabled="o.disabled">
          <template v-if="labelFields.length">
            <span v-for="(itm, index2) in labelFields" :key="index2">
              {{ o[itm] }}
            </span>
          </template>
        </el-option>
      </el-select>
      <i class="icon el-icon-search" v-show="searchIconVisible" slot="suffix" @click.stop="alertDialog" />
    </div>
    <search-dialog
      v-if="subType === 'select'"
      :visible-value.sync="dialogShow"
      :props="props"
      :url="url"
      :title="title"
      :options="optionsData"
      :params="params"
      :search-key="searchKey"
      :label-fields="labelFields"
      v-bind="$attrs"
      v-on="$listeners"
      @dataChange="dialogDataChange" />
    <person-dialog
      v-else
      :visible-value.sync="dialogShow"
      :props="props"
      :url="url"
      :title="title"
      :options="optionsData"
      :params="params"
      :search-key="searchKey"
      :label-fields="labelFields"
      v-bind="$attrs"
      v-on="$listeners"
      @dataChange="dialogDataChange" />
  </div>
</template>

<script>
  import {initData} from "@/api/data";

  export default {
    name: "FromSelectData",
    components: {
      'search-dialog': () => import('./dialog/searchDialog'),
      'person-dialog': () => import('./dialog/personDialog')
    },
    directives: {},
    filters: {},
    mixins: [],
    model: {
      prop: 'value',
      event: 'input'
    },
    props: {
      value: [String, Number, Array, Object],
      filterable: Boolean,
      url: {
        type: String,
        default: ''
      }, // 请求地址
      params: {
        type: Object,
        default: () => ({})
      }, // 请求参数
      options: Array, // 选项
      props: {
        type: Object,
        default: () => ({
          label: 'label',
          value: 'value'
        })
      },
      title: {
        type: String,
        default: '数据选择'
      },
      disabled: Boolean,
      dataField: String, // 返回结果中显示的字段名
      // 弹出选则框类型 select treeSelect
      subType: {
        type: String,
        default: 'select'
      },
      labelText: [String, Number, Array], // 无下拉选项时显示的名称
      // 下拉选项显示字段
      labelFields: {
        type: Array,
        default: () => ([])
      },
      searchAbel: Boolean, // 开启搜索
      searchKey: { // 查询请求的key
        type: String,
        default: 'nameOrNumber'
      },
      searchIconVisible: { // 显示搜索图标
        type: Boolean,
        default: true
      },
      searchDialogEnable: { // 是否开启显示搜索框
        type: Boolean,
        default: true
      },
      autoFirst: { // 是否自动选择第一个
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        optionsData: this.options || [],
        labelValue: '',
        dialogShow: false,
      }
    },
    computed: {
      mapSelectOptions() {
        const {label, value, key} = this.props
        const options = this.optionsData
        if (this.value) {
          if (value) {
            if (options.findIndex(i => i[value] === this.value) === -1 && this.labelText) {
              const obj = {}
              this.$set(obj, label, this.labelText)
              this.$set(obj, value, this.value)
              options.push(obj)
            }
          } else if (key && typeof this.value === "object" && options.findIndex(i => i[key] === this.value[key]) === -1) {
            options.push(this.value)
          }
        }
        return options
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
          if (val && this.subType === 'select' && !this.$attrs.cascade) {
            this.getAsyncOptions()
          }
        },
        immediate: true
      },
      params: {
        handler(val, oldVal) {
          if (val !== oldVal && this.subType === 'select') {
            this.getAsyncOptions()
          }
        },
        deep: true
      }
    },
    methods: {
      // 获取选项数据
      getAsyncOptions() {
        const key = encodeURIComponent(this.url + this.params + this.$attrs.method)
        const optionsSelect = this.$store.state.optionsCache.data
        const index = optionsSelect.findIndex(item => item.key === key)
        if (index !== -1) {
          this.optionsData = optionsSelect[index].options
          return
        } else {
          initData(this.url, this.params, this.$attrs.method).then(res => {
            if (res.status === 200) {
              if (res.data && res.data.list && res.data.list instanceof Array) {
                this.optionsData = res.data.list || []
              } else if (res.data instanceof Array && res.data.length) {
                this.optionsData = res.data || []
              } else { // 防止查询条件更新后查不到数据的情况下 清空下拉列表
                this.optionsData = []
                this.labelValue = ''
              }
              if (this.optionsData.length && this.autoFirst) {
                // 自动选择第一个
                this.labelValue = this.props.value ? this.optionsData[0][this.props.value] : this.optionsData[0]
                this.dataChange(this.labelValue)
                this.$emit('input', this.labelValue)
              }
              if (this.dataField) {
                this.optionsData = this.optionsData.map(itm => itm[this.dataField])
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
      // 弹出选择框
      alertDialog() {
        if (!this.searchDialogEnable) return
        if (!this.disabled) {
          this.dialogShow = true
        }
      },
      // dataChange 事件 返回选中的对象
      dataChange(val) {
        const {value} = this.props
        if (value) {
          this.$emit('dataChange', this.optionsData.find(i => i[value] === val))
        } else {
          this.$emit('dataChange', val)
        }
      },
      // change事件
      dialogDataChange(data) {
        const value = this.props.value || this.props.key
        if (this.$attrs.multiple && data instanceof Array && data.length) {
          data.forEach(itm => {
            if (this.optionsData.findIndex(i => i[value] === itm[value]) === -1) {
              this.optionsData.push(itm)
            }
          })
        } else {
          if (this.optionsData.findIndex(i => i[value] === data[value]) === -1) {
            this.optionsData.push(data)
          }
        }
      },
      // 搜索数据
      dataFilter(val) {
        this.$set(this.params, this.searchKey, val)
        this.getAsyncOptions()
      },

      clear() {
        this.$emit('input', null)
      }
    }
  }
</script>

<style scoped lang="scss">
  .select-data-container {
    position: relative;

    /deep/ .el-input {
      &:hover {
        cursor: pointer;
      }

      input {
        &:hover {
          cursor: pointer;
        }
      }
    }

    .select-box {
      position: relative;

      .icon {
        cursor: pointer;
        color: #C0C4CC;
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    /deep/ .el-select {
      width: 100%;
      height: 100%;
      position: relative;

      .el-input__suffix {
        display: none;

        .el-icon-arrow-up {
          display: none;
        }
      }

      &:hover .el-input__suffix {
        display: inline;
        margin-right: 16px;
      }
    }

    /deep/ .is-disabled .el-input__inner {
      color: #4D4D4D;
    }
  }

</style>
<style lang="scss">
  .select-tree {
    display: none;
  }
</style>
