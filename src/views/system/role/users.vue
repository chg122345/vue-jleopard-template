<template>
  <div>
    <div class="table-top-tool">
      <dynamic-search :data="tableFilterList(tableHead)" @search="dataTableSearch" />
    </div>
    <edit-data-table
      ref="editTable"
      show-number
      :head="tableHead"
      :loading="loading"
      :data.sync="list"
      :config="{render: 'scroll', renderSize: 100}"
      :editable="false"
      :tool-bar="{label:'操作', align: 'center', width: 80, fixed: 'right'}"
      :total="total"
      :offset="offset"
      :page="page"
      @handlePageChange="dataTablePageChange"
      @handleSizeChange="dataTableSizeChange">
      <template #toolbar="{row}">
        <el-popover :ref="row.id" placement="top" width="180">
          <p>确定删除本条数据吗?</p>
          <div style="text-align: right; margin: 0">
            <el-button
              size="mini"
              type="text"
              @click="$refs[row.id].doClose()"
            >取消
            </el-button>
            <el-button
              :loading="delLoading"
              type="primary"
              size="mini"
              @click="subDelete(row.id)"
            >确定
            </el-button>
          </div>
          <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
        </el-popover>
      </template>
    </edit-data-table>
  </div>
</template>

<script>
  import DataTableMixin from "@/mixins/DataTableMixin"
  import {removeRole} from "@/api/user"

  export default {
    name: "Index",
    directives: {},
    filters: {},
    mixins: [DataTableMixin],
    props: {
      roleId: {
        type: String
      },
      isShow: Boolean
    },
    data() {
      return {
        tableHead: [
          {
            label: "姓名",
            prop: "name",
            sortable: true,
            query: {
              type: 'input'
            }
          },
          {
            label: "编号",
            prop: "code"
          },
          {
            label: "电话",
            prop: "phone",
            width: 120
          },
          {
            label: "邮箱",
            prop: "email"
          },
          {
            label: "性别",
            prop: "sex",
            formatter: (val) => {
              if (val !== undefined) return val === 0 ? "男" : '女'
            }
          },
          {
            label: "组织名称",
            prop: "dept.name"
          },
          {
            label: "职位名称",
            prop: "job.name",
          },
          {
            label: "是否启用",
            prop: "enabled",
            width: 100,
            formatter: (val) => {
              if (val !== undefined) return val ? '启用' : '禁用'
            },
            cellStyle: (val) => {
              if (val !== undefined) return val ? {color: '#13ce66'} : {color: '#FFBA00'}
            }
          },
          {
            label: "注册时间",
            property: "created",
            align: 'center',
            width: 160,
            sortable: true
          },
        ],
        delLoading: false
      }
    },
    watch: {
      roleId: {
        handler(val) {
          if (val) {
            this.dataTableInit()
          }
        },
        immediate: true
      },
      isShow(val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs.editTable.autoHeight()
          })
        }
      }
    },
    methods: {
      dataTableBeforeInit() {
        this._url = "/sys/role/users";
        this._method = "get";
        const params = {
          size: this.offset,
          page: this.page,
          roleId: this.roleId
        };
        this._params = Object.assign(params, this._query);
        return true;
      },
      subDelete(id) {
        this.delLoading = true;
        removeRole({roleId: this.roleId, userId: id}).then(() => {
          this.$notify({
            title: "删除成功",
            type: "success",
            duration: 2500
          });
          this.delLoading = false;
          this.$refs[id].doClose();
          this.dleTableChangePage();
          this.dataTableInit();
        }).catch(() => {
          this.delLoading = false;
          this.$refs[id].doClose();
        });
      }
    }
  }
</script>
