<template>
  <div class="content-warp">
    <el-card class="box-card" shadow="never">
      <div class="table-top-tool">
        <dynamic-search :data="tableFilterList(tableHead)" @search="dataTableSearch">
          <el-button type="success" size="small" icon="el-icon-plus" @click="subAdd">新增</el-button>
        </dynamic-search>
      </div>
      <edit-data-table
        ref="editTable"
        show-number
        :head="tableHead"
        :loading="loading"
        :data.sync="list"
        :config="{render: 'scroll', renderSize: 100}"
        :editable="false"
        :tool-bar="{label:'操作', align: 'center', width: 150, fixed: 'right'}"
        :total="total"
        :offset="offset"
        :page="page"
        @handlePageChange="dataTablePageChange"
        @handleSizeChange="dataTableSizeChange">
        <template #pause="{row}">
          <el-tag :type="row.pause ? 'warning' : 'success'" size="mini">{{ row.pause ? '已暂停' : '运行中' }}</el-tag>
        </template>
        <template #toolbar="{row}">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="subEdit(row)" />
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
    </el-card>
    <j-form ref="subThis" />
  </div>
</template>

<script>
  import DataTableMixin from "@/mixins/DataTableMixin"
  import JForm from './form'
  import {del} from "@/api/monitor/task";
  import ToolBarMixin from "@/views/system/mixins/ToolBarMixin";

  export default {
    name: "Index",
    components: {JForm},
    filters: {},
    mixins: [DataTableMixin, ToolBarMixin],
    data() {
      return {
        tableHead: [
          {
            label: "服务实例",
            prop: "instanceServer",
            minWidth: 120,
            query: {
              type: 'input',
              hiddenLabel: true
            }
          },
          {
            label: "任务名称",
            prop: "jobName",
            query: {
              type: 'input',
              hiddenLabel: true
            }
          },
          {
            label: "Bean名称",
            prop: "beanName",
          },
          {
            label: "执行方法",
            prop: "methodName",
          },
          {
            label: "参数",
            prop: "params",
          },
          {
            label: "cron表达式",
            prop: "cronExpression",
          },
          {
            label: "任务状态",
            prop: "pause",
            type: 'slot'
          },
          {
            label: "备注",
            prop: "remark",
          },
          {
            label: "创建时间",
            property: "created",
            align: 'center',
            width: 160,
            sortable: true
          },
        ],
        delLoading: false
      }
    },
    created() {
      this.$nextTick(() => {
        this.dataTableInit()
      });
    },
    methods: {
      dataTableBeforeInit() {
        this._url = "/monitor/task";
        this._method = "get";
        const params = {
          size: this.offset,
          page: this.page
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
      }
    }
  }
</script>
