import {initData} from "@/api/data";
import "./table.scss"

export default {

  name: 'EditDataTable',

  inheritAttrs: false,

  props: {
    head: {
      type: Array,
      required: true
    },
    rowKeyField: {
      type: String,
      default: 'id'
    },
    showSelection: Boolean,
    showNumber: Boolean,
    toolBar: {
      type: Object,
      default: () => ({
        label: '操作',
        hidden: false,
        width: '',
        minWidth: '',
        align: 'center',
        fixed: false
      })
    },
    // 默认自适应当前屏高度
    height: {
      type: [String, Number],
      default: 'auto'
    },
    // 多级嵌套数据 user:{name:'名称'} prop可以定义成user.name
    showOverflowTooltip: { // 内容超出隐藏
      type: Boolean,
      default: true
    },
    // 没有分页
    noPagination: Boolean,
    // 是否可编辑
    editable: Boolean,
    // 显示新增行
    showAdd: Boolean
  },
  render(h) {
    const _this = this;
    const columnRender = function(col, h) {
      if (!col.hasOwnProperty('children') || col.children.length === 0) {
        if (col.hidden === true) return null;
        return h(_this.editable ? 'elx-editable-column' : 'elx-table-column', {
          props: {
            ...col,
            editRender: _this.bindEditRenderProp(col),
            width: col.width ? col.width.toString() : null,
            minWidth: col.minWidth ? col.minWidth.toString() : null,
            showOverflowTooltip: _this.$scopedSlots[col.prop] ? false : col.showOverflowTooltip !== undefined ? col.showOverflowTooltip : _this.showOverflowTooltip
          },
          key: col.columnKey || col.prop,
          scopedSlots: {
            edit: (props) => {
              if (_this.$scopedSlots[col.prop + 'Edit']) {
                return h('div', [
                  _this.$scopedSlots[col.prop + 'Edit']({
                    ...props
                  })
                ])
              }
            },
            default: (props) => {
              if (_this.$scopedSlots[col.prop]) {
                return h('div', [
                  _this.$scopedSlots[col.prop]({
                    ...props
                  })
                ])
              } else {
                return h('span', {
                  style: col.cellStyle && typeof col.cellStyle === "function"
                    ? col.cellStyle(_this.renderCellValue(props.row, props.column.property), props.row, props.column) : null,
                  domProps: {
                    innerHTML: (col.formatter && typeof col.formatter === 'function')
                      ? col.formatter(_this.renderCellValue(props.row, props.column.property), props.row, props.column) : _this.renderCellValue(props.row, props.column.property)
                  }
                })
              }
            },
          }
        })
      } else {
        if (Array.isArray(col.children) && col.children.length) {
          return h(_this.editable ? 'elx-editable-column' : 'elx-table-column', {
              attrs: {
                label: col.label || col.prop
              }
            },
            [...col.children.map(column => columnRender(column, h))]
          )
        }
        console.error(`[ETable warn] children need Array and can't be empty`)
        return null;
      }
    }

    return h('div', {
      class: {
        'data-table-container': true,
        'no-pagination': _this.noPagination
      }
    }, [
      h(_this.editable ? 'elx-editable' : 'elx-table', {
        ref: 'elTable',
        props: {
          ...this.$attrs,
          editConfig: this.$attrs.config,
          rowKey: _this.rowKeyField,
          rowClassName: _this.tableRowClassName,
          height: _this.getTableHeight
        },
        on: {
          ...this.$listeners,
          'row-click': this.handleRowClick,
          'selection-change': this.handleSelection,
        },
        directives: [{
          name: 'loading',
          value: _this.$attrs.loading,
        }],
        scopedSlots: {
          empty: function() {
            return _this.$slots.empty
          },
          append: function() {
            return _this.$slots.append
          }
        },
      }, [
        _this.showSelection ? h(_this.editable ? 'elx-editable-column' : 'elx-table-column', {
          attrs: {
            type: "selection",
            align: "center",
            width: '60'
          },
        }) : null,
        _this.showNumber ? h(_this.editable ? 'elx-editable-column' : 'elx-table-column', {
          attrs: {
            type: "index",
            label: "序号",
            align: "center",
            width: '60',
          },
        }) : null,
        _this.head.map(col => columnRender(col, h)),
        !_this.toolBar.hidden ? h(_this.editable ? 'elx-editable-column' : 'elx-table-column', {
          props: {
            ..._this.toolBar,
            width: _this.toolBar.width ? _this.toolBar.width.toString() : null,
            minWidth: _this.toolBar.minWidth ? _this.toolBar.minWidth.toString() : null,
            'class-name': 'tool-bar'
          },
          scopedSlots: _this.$scopedSlots.toolbar ? {
            default: (props) => {
              return h('div', [
                _this.$scopedSlots.toolbar({
                  ...props
                })
              ])
            }
          } : null
        }) : null,
        _this.$slots.default //  slot columns
      ]),
      _this.showAdd ? h('div', {
        class: {
          'add-row-container': true
        },
        on: {
          click: _this.insertRow
        },
      }, [
        h('i', {
          class: {
            'el-icon-circle-plus-outline': true
          },
        }),
        h('el-button', {
          attrs: {
            type: 'text'
          },
          domProps: {
            innerHTML: "新增行"
          }
        })
      ]) : null,
      _this.$attrs.total ? h('div', {
        ref: 'pageContainer',
        class: {
          'page-container': true
        }
      }, [
        h('el-pagination', {
          attrs: {
            layout: "total, sizes, prev, pager, next, jumper",
            pageSize: _this.$attrs.offset,
            total: _this.$attrs.total
          },
          on: {
            ...this.$listeners,
            'current-change': _this.handlePageChange,
            'size-change': _this.handleSizeChange
          }
        })
      ]) : null
    ])
  },

  data() {
    return {
      selectionKey: '',
      tableHeight: 500,
      asyncOptions: {}
    }
  },
  computed: {
    getTableHeight() {
      if (this.height === 'auto') {
        return this.tableHeight
      } else if (this.height) {
        return this.height
      } else {
        return null
      }
    }
  },

  created() {
    this.initAsyncOptions(this.head)
  },
  mounted() {
    this.$nextTick(() => {
      this.autoHeight()
    })
  },

  updated() {
    this.$nextTick(() => {
      this.doLayout()
    })
  },

  methods: {
    autoHeight() {
      let pageHeight = this.$refs.pageContainer ? this.$refs.pageContainer.offsetHeight : 62
      if (this.noPagination) {
        pageHeight = 0
      }
      this.tableHeight = window.innerHeight - this.$refs.elTable.$el.getBoundingClientRect().top - pageHeight
    },
    handleSelection(data) {
      this.$emit("handleSelectionChange", data)
      this.$emit('selection-change', data)
      if (!data.length) {
        this.selectionKey = ''
        return
      }
      this.selectionKey = data.map(i => this.renderCellValue(i, this.rowKeyField))
    },
    tableRowClassName({row}) {
      if (this.selectionKey.includes(this.renderCellValue(row, this.rowKeyField))) {
        return 'is-selection-row';
      }
      return '';
    },
    doLayout() {
      this.$refs.elTable.doLayout()
    },
    handleRowClick(row, column) {
      if (this.showSelection) {
        this.$refs.elTable.toggleRowSelection(row)
      }
      this.$emit('row-click', row, column)
    },
    handlePageChange(val) {
      this.$emit('current-change', val)
      this.$emit('handlePageChange', val)
    },
    handleSizeChange(val) {
      this.$emit('size-change', val)
      this.$emit('handleSizeChange', val)
    },
    renderCellValue(row, prop) {
      if (!prop) return
      if (prop.indexOf('.') !== -1) {
        const paths = prop.split('.');
        let current = row;
        let result = null;
        for (let i = 0, j = paths.length; i < j; i++) {
          const path = paths[i];
          if (!current) break;
          if (i === j - 1) {
            result = current[path];
            break;
          }
          current = current[path];
        }
        return result;
      } else {
        return row[prop]
      }
    },
    /**
     * 插入账号
     * @param index
     * @param data
     */
    insertRow(index = -1, data = {}) {
      this.$refs.elTable.insertAt(index, data).then(({row}) => {
        this.$refs.elTable.setActiveCell(row)
      })
    },
    /**
     * 删除一行或者多行
     * @param data
     */
    deleteRows(data = {}) {
      this.$refs.elTable.remove(data)
    },

    bindEditRenderProp(column = {}) {
      const prop = column.prop || column.property
      const editRender = column.editRender || column['edit-render']
      if (!Object.keys(this.asyncOptions).includes(prop)) {
        return editRender
      }
      editRender.options = this.asyncOptions[prop]
      return editRender
    },

    /**
     * 根据url获取option
     */
    getAsyncOptions(data) {
      const {url, params, method} = data.editRender || data['edit-render']
      if (url) {
        initData(url, params, method).then(res => {
          if (res.code === 200) {
            this.$set(this.asyncOptions, data.property || data.prop, res.data || [])
          }
        }).catch(err => {
          console.error(err, '获取字典项失败');
        });
      }
    },
    /**
     * 动态获取下拉选项
     * @param data
     */
    initAsyncOptions(data = []) {
      data.forEach(i => {
        if (i.children && i.children instanceof Array && i.children.length) {
          this.initAsyncOptions(i.children)
        }
        if (i.hasOwnProperty("edit-render") || i.hasOwnProperty("editRender")) {
          this.getAsyncOptions(i)
        }
      })
    }
  }
}
