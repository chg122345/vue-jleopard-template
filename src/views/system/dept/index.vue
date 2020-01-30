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
  import {del} from "@/api/dept";
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
            label: "名称",
            prop: "name",
            sortable: true,
            minWidth: 120,
            query: {
              type: 'input'
            }
          },
          {
            label: "编码",
            prop: "code"
          },
          {
            label: "简称",
            prop: "shortName",
          },
          {
            label: "全称",
            prop: "displayName",
          },
          {
            label: "税码",
            prop: "taxCode",
          },
          {
            label: "叶子节点",
            prop: "leaf",
            formatter: (val) => {
              if (val !== undefined) return val === 0 ? "否" : '是'
            }
          },
          {
            label: "是否启用",
            prop: "enabled",
            formatter: (val) => {
              if (val !== undefined) return val === 0 ? "禁用" : '启用'
            }
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
        this._transTreeOption = {key: 'id', parentKey: 'parentId', children: 'children'}
        this._url = "/sys/dept";
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
