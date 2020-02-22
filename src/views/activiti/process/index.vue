<template>
  <div class="content-warp">
    <el-card class="box-card" shadow="never">
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
        :tool-bar="{label:'操作', align: 'center', width: 200, fixed: 'right'}"
        :total="total"
        :offset="offset"
        :page="page"
        @handlePageChange="dataTablePageChange"
        @handleSizeChange="dataTableSizeChange">
        <template #toolbar="{row}">
          <el-button
            size="mini"
            :type="row.isSuspended ? 'success': 'warning'"
            icon="el-icon-video-play"
            @click="subSuspend(row.id, row.isSuspended)" />
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
                @click="subDelete(row.id, row.deploymentId)"
              >确定
              </el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
          </el-popover>
          <el-button type="text" icon="el-icon-view" size="mini">流程图</el-button>
        </template>
      </edit-data-table>
    </el-card>
  </div>
</template>

<script>
  import DataTableMixin from "@/mixins/DataTableMixin"
  import {del, suspend} from "@/api/activiti/process";

  export default {
    name: "Index",
    mixins: [DataTableMixin],
    data() {
      return {
        tableHead: [
          {
            label: "流程定义id",
            prop: "id",
          },
          {
            label: "模型名称",
            prop: "name",
            query: {
              type: 'input',
              hiddenLabel: true
            }
          },
          {
            label: "流程分类",
            prop: "category",
            query: {
              type: 'input',
              hiddenLabel: true
            }
          },
          {
            label: "模型标识",
            prop: "key"
          },
          {
            label: "版本号",
            prop: "version",
            align: 'center',
          },
          {
            label: "状态",
            prop: "isSuspended",
            align: 'center',
            formatter: (val) => {
              return val ? '已失效' : '正常'
            },
            cellStyle: (val) => {
              return val ? {color: '#FFBA00'} : {color: '#13ce66'}
            }
          },
        ],
        delLoading: false,
        checkedIds: [],
        clearLoading: false
      }
    },
    created() {
      this.$nextTick(() => {
        this.dataTableInit()
      });
    },
    methods: {
      dataTableBeforeInit() {
        this._url = "/activiti/process";
        this._method = "get";
        const params = {
          size: this.offset,
          page: this.page,
          type: 1
        };
        this._params = Object.assign(params, this._query);
        return true;
      },
      subDelete(id,deploymentId) {
        this.delLoading = true;
        del(deploymentId).then(() => {
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
      subSuspend(id,isSuspended) {
        this.$confirm('确定要' + (isSuspended ? '激活' : '挂起') + '该流程?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          suspend({id, suspend: !isSuspended}).then((msg) => {
            this.$notify({
              title: msg,
              type: "success",
              duration: 2500
            });
            this.delLoading = false;
            this.dleTableChangePage();
            this.dataTableInit();
          })
        })
      }
    }
  }
</script>
