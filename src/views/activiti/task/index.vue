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
          <el-button type="text" icon="el-icon-edit" size="mini" @click="subAudit(row.id)">审核</el-button>
          <el-button type="text" icon="el-icon-view" size="mini" @click="dialog=true; processInstanceId=row.processInstanceId">流程图</el-button>
        </template>
      </edit-data-table>
    </el-card>

    <drag-dialog
      append-to-body
      :visible.sync="dialog"
      title="流程图"
      enable-drag
      width="800px">
      <img :src="imgSrc">
    </drag-dialog>
  </div>
</template>

<script>
  import DataTableMixin from "@/mixins/DataTableMixin"
  import {parseTime} from "@/utils"
  import {audit} from "@/api/activiti/task"

  export default {
    name: "Index",
    mixins: [DataTableMixin],
    data() {
      return {
        tableHead: [
          {
            label: "任务ID",
            prop: "id",
          },
          {
            label: "任务名称",
            prop: "name",
            query: {
              type: 'input',
              hiddenLabel: true
            }
          },
          {
            label: "任务描述",
            prop: "description",
          },
          {
            label: "提交时间",
            prop: "createTime",
            align: 'center',
            width: 160,
            formatter: (val) => {
              if (val) {
                return parseTime(Number(val))
              }
            }
          }
        ],
        delLoading: false,
        dialog: false,
        processInstanceId: ''
      }
    },
    computed: {
      imgSrc() {
        return `http://localhost:5001/process/img/${this.processInstanceId}/instance`
      }
    },
    created() {
      this.$nextTick(() => {
        this.dataTableInit()
      });
    },
    methods: {
      dataTableBeforeInit() {
        this._url = "/activiti/task";
        this._method = "get";
        const params = {
          size: this.offset,
          page: this.page,
          type: 1
        };
        this._params = Object.assign(params, this._query);
        return true;
      },
      subAudit(id) {
        this.$approval.open({title: '请假单审批'}).then(res => {
          audit(id, res).then(() => {
            this.dleTableChangePage();
            this.dataTableInit();
          })
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>
