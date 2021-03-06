<template>
  <div>
    <drag-dialog :width="width" :title="title" :visible.sync="visible" append-to-body enable-drag>
      <el-input
        :validate-event="false"
        placeholder="请输入关键字"
        v-model="keyword"
        @keyup.enter.native="search()">
        <i slot="suffix" class="el-input__icon el-icon-search cursor" @click="search()" />
      </el-input>
      <div class="option-box">
        <el-scrollbar>
          <ul class="drawing-list-wrap" v-if="!multiple">
            <li
              class="list-item"
              :class="setClass(item)"
              v-for="(item, index) in dataList"
              @click="picker(item)"
              :key="index">
              <slot :row="item">
                <template>
                  {{ getName(item) }}
                </template>
              </slot>
            </li>
          </ul>
          <div class="drawing-list-wrap" v-else>
            <el-checkbox-group v-model="checkedValues">
              <el-checkbox v-for="(item, index) in dataList" :indeterminate="isChecked(item)" :label="item" :key="index">
                {{ getName(item) }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-scrollbar>
      </div>
      <div slot="footer" class="dialog-footer clearfix">
        <span class="page-box" v-if="total">
          <el-pagination
            :current-page.sync="currentPage"
            :page-size="10"
            layout="prev, pager, next, jumper"
            :total="total" />
        </span>
        <span class="btn-box">
          <el-button @click="visible = false" size="small">取 消</el-button>
          <el-button type="primary" size="small" @click="confirm">确 定</el-button>
        </span>
      </div>
    </drag-dialog>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import {deepClone} from "@/utils";

  export default {
    name: 'SearchBox',
    props: {
      value: [String, Number, Array, Object],
      visibleValue: {
        required: true,
        type: Boolean
      },
      width: {
        type: [String, Number],
        default: '700px'
      },
      url: {
        required: true,
        type: String
      },
      params: Object, // 请求参数
      title: {
        type: String,
        default: '搜索'
      },
      searchKey: { // 查询请求的key
        type: String,
        default: 'codeOrName'
      },
      props: {
        type: Object,
        default: () => ({
          label: 'label',
          value: 'value'
        })
      },
      options: Array,
      multiple: Boolean, // 是否多选
      pathPage: Boolean, // 分页参数是否在url上 格式：url/pageSize/page,
      labelFields: Array // 下拉选项显示字段
    },
    data() {
      return {
        keyword: '',
        visible: false,
        dataList: this.options,
        activeItem: null,
        checkedValues: [],
        currentPage: 1,
        total: 0
      }
    },
    watch: {
      value: {
        handler(val) {
          if (val) {
            if (this.multiple && val instanceof Array) {
              this.checkedValues = val
            } else if (!this.multiple) {
              this.activeItem = val
            }
          }
        },
        immediate: true
      },
      visibleValue: {
        handler(val) {
          if (val !== this.visible) this.visible = val
        },
        immediate: true
      },
      visible(val) {
        if (this.visibleValue !== val) this.$emit('update:visibleValue', val)
      },
      currentPage(val) {
        this.params.page = val - 1
        this.params.size = val
        if (this.pathPage) {
          const url = this.url.substring(0, this.url.lastIndexOf('/') + 1) + val
          this.search(url)
        } else {
          this.search()
        }
      },
      options: {
        handler(val) {
          this.dataList = val
        },
        deep: true
      }
    },
    created() {
      if (!this.dataList.length && this.url && !this.$attrs.cascade) {
        this.search()
      }
    },
    methods: {
      search(url = this.url) {
        const param = deepClone(this.params) || {}
        param[this.searchKey] = this.keyword
        request({
          url: url,
          method: this.$attrs.method || 'get',
          params: param,
          data: param
        }).then(res => {
          if (res instanceof Array && res.length) {
            this.dataList = res || []
          } else if (res.content && res.content instanceof Array) {
            this.dataList = res.content || []
            this.total = res.totalElements || 0
          }
        })
      },
      picker(item) {
        this.activeItem = item
        this.confirm()
      },
      confirm() {
        const {value} = this.props
        if (!this.multiple) {
          if (!this.activeItem) {
            this.visible = false
            return
          }
          const bindVal = value ? this.activeItem[value] : this.activeItem
          this.$emit('change', bindVal)
          this.$emit('input', bindVal)
          this.$emit('dataChange', this.activeItem)
        } else {
          const values = value ? this.checkedValues.map(i => i[value]) : this.checkedValues
          this.$emit('change', values)
          this.$emit('input', values)
          this.$emit('dataChange', this.checkedValues)
        }
        this.visible = false
      },
      // 显示的内容
      getName(item) {
        if (this.labelFields.length) {
          return this.labelFields.map(i => item[i]).join(" ")
        } else {
          return item[this.props.label]
        }
      },
      setClass(item) {
        if (!this.activeItem) return ''
        const key = this.props.value || this.props.key
        if (this.activeItem[key] === item[key]) {
          return 'active-item'
        }
        return ''
      },
      isChecked(item) {
        if (!this.checkedValues.length) return false
        const key = this.props.key || this.props.value
        return this.checkedValues.map(i => i[key]).includes(item[key])
      },
      changeRem(number) {
        return (parseFloat(number) * Math.min(this.$scale, 1)) + 'px'
      }
    }
  }
</script>

<style scoped lang="scss">
  .option-box {
    height: 300px;
  }

  .drawing-list-wrap {
    padding: 0px;
    height: 300px;

    .list-item {
      list-style: none;
      margin: 0;
      cursor: pointer;
      padding: 12px 0 12px 5px;
      transition: all .3s ease-in;

      &:hover {
        background-color: #F5F7FA;
      }

      &:active {
        background-color: #409EFF;
      }

      border-bottom: 1px solid #f4f5f6;
    }

    .active-item {
      color: #409EFF;
    }

    /deep/ .el-checkbox {
      display: inherit;
      margin: 0;
      padding: 12px 0 12px 5px;
      transition: all .3s ease-in;
    }
  }

  /deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  /deep/ .el-icon-circle-check {
    display: none;
  }

  .cursor {
    cursor: pointer;
  }

  .dialog-footer {
    width: 100%;

    .page-box {
      float: left;
    }

    .btn-box {
      float: right;
    }
  }
</style>
