<template>
  <div class="content-warp">
    <el-card class="box-card" shadow="never">
      <div class="table-top-tool">
        <dynamic-search :data="tableFilterList(tableHead)" @search="dataTableSearch">
          <el-button type="warning" size="small" :disabled="!checkedIds.length" @click="subDeleteBach">删除勾选</el-button>
          <el-button
            type="danger"
            size="small"
            :disabled="!list.length"
            :loading="clearLoading"
            icon="el-icon-delete"
            @click="clearAll">清空
          </el-button>
        </dynamic-search>
      </div>
      <edit-data-table
        ref="editTable"
        show-number
        show-selection
        :head="tableHead"
        :loading="loading"
        :data.sync="list"
        :config="{render: 'scroll', renderSize: 100}"
        :editable="false"
        :tool-bar="{label:'操作', align: 'center', width: 150, fixed: 'right'}"
        :total="total"
        :offset="offset"
        :page="page"
        @selection-change="handleSelectionChange"
        @handlePageChange="dataTablePageChange"
        @handleSizeChange="dataTableSizeChange">
        <template #toolbar="{row}">
          <el-button
            size="mini"
            type="info"
            icon="el-icon-view"
            @click.stop="subLook(row)" />
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
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" @click.stop="" />
          </el-popover>
        </template>
      </edit-data-table>
    </el-card>
    <drag-dialog
      append-to-body
      :visible.sync="dialogVisible"
      destroy-on-close
      title="定时任务信息"
      enable-drag
      width="800px">
      <div v-html="exDetail" />
    </drag-dialog>
  </div>
</template>

<script>
  import DataTableMixin from "@/mixins/DataTableMixin"
  import {del, deleteBach, deleteAll} from "@/api/monitor/log";

  export default {
    name: "Index",
    mixins: [DataTableMixin],
    data() {
      return {
        tableHead: [
          {
            label: "服务实例",
            prop: "instanceServer",
            minWidth: 110,
            query: {
              type: 'input',
              hiddenLabel: true
            }
          },
          {
            label: "操作用户",
            prop: "userAccount",
            query: {
              type: 'input',
              hiddenLabel: true
            }
          },
          {
            label: "IP",
            prop: "requestIp",
            align: 'center',
            width: 120,
          },
          {
            label: "请求方式",
            prop: "requestMethod",
          },
          {
            label: "请求URL",
            prop: "actionUrl",
          },
          {
            label: "请求方法",
            prop: "actionMethod",
            width: 100
          },
          {
            label: "请求参数",
            prop: "params",
            minWidth: 150,
          },
          {
            label: "异常信息",
            prop: "exDesc",
            minWidth: 200,
          },
          {
            label: "发生时间",
            property: "created",
            align: 'center',
            width: 160,
            sortable: true,
            query: {
              type: 'date',
              dateType: 'daterange',
              valueFormat: 'yyyy-MM-dd'
            }
          },
        ],
        delLoading: false,
        checkedIds: [],
        clearLoading: false,
        dialogVisible: false,
        exDetail: ''
      }
    },
    created() {
      this.$nextTick(() => {
        this.dataTableInit()
      });
    },
    methods: {
      dataTableBeforeInit() {
        this._url = "/monitor/log";
        this._method = "get";
        const params = {
          size: this.offset,
          page: this.page,
          type: 2
        };
        this._params = Object.assign(params, this._query);
        return true;
      },
      subDelete(id) {
        this.delLoading = true;
        del(id).then(() => {
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
      },
      subDeleteBach() {
        this.$confirm('确定要删除勾选的数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteBach(this.checkedIds.join(",")).then(() => {
            this.$notify({
              title: "删除成功",
              type: "success",
              duration: 2500
            });
            this.dleTableChangePage();
            this.dataTableInit();
          })
        })
      },
      clearAll() {
        this.$confirm('确定清空数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.clearLoading = true
          deleteAll().then(() => {
            this.$notify({
              title: "删除成功",
              type: "success",
              duration: 2500
            });
            this.dleTableChangePage();
            this.dataTableInit();
            this.clearLoading = false
          }).catch(() => {
            this.clearLoading = false
          })
        })
      },
      handleSelectionChange(data) {
        this.checkedIds = data.map(i => i.id)
      },
      subLook(row) {
        this.dialogVisible = true
        this.exDetail = window.atob(row.exDetail)
      }
    }
  }
</script>
