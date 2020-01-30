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
        :tool-bar="{label:'操作', align: 'center', width: 200, fixed: 'right'}"
        :total="total"
        :offset="offset"
        :page="page"
        @handlePageChange="dataTablePageChange"
        @handleSizeChange="dataTableSizeChange">
        <template #toolbar="{row}">
          <el-button
            size="mini"
            type="success"
            icon="el-icon-key"
            @click="resetPwd(row.id)" />
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
  import {del} from "@/api/user";
  import ToolBarMixin from "../mixins/ToolBarMixin";

  export default {
    name: "Index",
    components: {JForm},
    directives: {},
    filters: {},
    mixins: [DataTableMixin, ToolBarMixin],
    props: {},
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
            width: 100
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
    created() {
      this.$nextTick(() => {
        this.dataTableInit();
      });
    },
    methods: {
      dataTableBeforeInit() {
        this._url = "/sys/user";
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
      },
      resetPwd(id) {
        this._subThis.isResetPwd = true
        this._subThis.form = {id}
        this._subThis.dialog = true
      }
    }
  }
</script>
