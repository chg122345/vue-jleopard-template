<template>
  <div>
    <div class="table-top-tool">
      <dynamic-search :data="tableFilterList(tableHead)" @search="dataTableSearch">
        <el-button type="success" size="small" icon="el-icon-plus" @click="subAdd" :disabled="!dictThis.dictId">新增</el-button>
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
    <j-form ref="subThis" />
  </div>
</template>

<script>
  import DataTableMixin from "@/mixins/DataTableMixin"
  import JForm from './form'
  import {del} from "@/api/dictDetail";
  import ToolBarMixin from "../../mixins/ToolBarMixin";

  export default {
    name: "Index",
    components: {JForm},
    mixins: [DataTableMixin, ToolBarMixin],
    inject: {
      dictThis: {default: {}}
    },
    data() {
      return {
        tableHead: [
          {
            label: "字典名",
            prop: "label",
            minWidth: 100,
            query: {
              type: 'input'
            }
          },
          {
            label: "字典值",
            prop: "value"
          },
          {
            label: "排序号",
            prop: "sortNumber",
            sortable: true
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
    methods: {
      dataTableBeforeInit() {
        this._url = "/sys/dictDetail/dict";
        this._method = "get";
        const params = {
          size: this.offset,
          page: this.page,
          dict: this.dictThis.dictId
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
