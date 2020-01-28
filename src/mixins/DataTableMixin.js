import {initData} from "@/api/data";
const DEFAULT_PAGE = 0
const DataTableMixin = {
  data() {
    return {
      _url: '',
      _params: {},
      _query: {},
      _method: 'get',
      page: DEFAULT_PAGE,
      offset: 10,
      loading: false, // 是否在加载数据
      list: [], // 数据列表
      total: 0,
      _dataField: null,
    }
  },
  methods: {
    /**
     * 拉取数据
     * @returns {Promise<any>}
     */
    async dataTableInit() {
      if (!await this.dataTableBeforeInit()) {
        return
      }
      return new Promise((resolve, reject) => {
        this.loading = true
        initData(this._url, this._params, this._method).then(res => {
          if (res && res.content instanceof Array) {
            this.list = res.content
            this.total = res.totalElements
          } else if (res instanceof Array && res.length) {
            this.list = res
          } else {
            this.list = []
          }
          if (this._dataField) {
            this.list = this.list.map(i => i[this._dataField])
          }
          setTimeout(() => {
            this.loading = false
          }, 170)
          resolve(res)
        }).catch(err => {
          this.loading = false
          reject(err)
        })
      })
    },

    /**
     * 初始化参数
     * @returns {boolean}
     */
    dataTableBeforeInit() {
      return true
    },

    /**
     * 翻页
     * @param val
     */
    dataTablePageChange(val) {
      this.page = DEFAULT_PAGE === 0 ? val - 1 : val
      this.dataTableInit()
    },

    /**
     * 改变每页大小
     * @param val
     */
    dataTableSizeChange(val) {
      this.page = DEFAULT_PAGE
      this.offset = val
      this.dataTableInit()
    },

    /**
     * 搜索
     * @param val
     */
    dataTableSearch(val, status) {
      this.page = DEFAULT_PAGE
      if (val) {
        this._query = val
      }
      if (!status) {
        this.dataTableInit()
      }
    },
    // 预防删除第二页最后一条数据时，或者多选删除第二页的数据时，页码错误导致请求无数据
    dleTableChangePage(size) {
      if (size === undefined) {
          size = 1
      }
      if (this.list.length === size && this.page !== DEFAULT_PAGE) {
          this.page = this.page - 1
      }
    },
    tableFilterList(data) {
      if (data instanceof Array) {
          const arr = []
          const res = []
          data.forEach(i => {
              if (i.query) {
                  if (i.query.type === 'group-input') {
                      const obj = {
                          label: i.label,
                          value: i.property || i.prop,
                      }
                      arr.push(obj)
                  } else {
                      const obj = {
                          type: i.query.type,
                          label: i.label,
                          key: i.property || i.prop,
                          data: i.query.data,
                          value: i.query.value
                      }
                      if (i.query.hidden !== undefined) {
                          Object.assign(obj, { hidden: i.query.hidden, })
                      }
                      res.push(obj)
                  }
              }
          })
          if (arr.length) {
              const obj = {
                  type: 'group-input',
                  key: 'groupInput',
                  data: arr
              }
              res.push(obj)
          }
          return res
      }
      return data
    },
  }
}

export default DataTableMixin
