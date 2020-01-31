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
        <template #icon="{row}">
          <svg-icon :icon-class="row.icon" />
        </template>
        <template #toolbar="{row}">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="subEdit(row)" />
          <el-popover :ref="row.id" placement="top" width="180" v-if="!row.enabled">
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
          <el-button
            size="mini"
            type="info"
            icon="el-icon-view"
            @click="subLook(row)" />
        </template>
      </edit-data-table>
    </el-card>
    <j-form ref="subThis" />
  </div>
</template>

<script>
  import DataTableMixin from "@/mixins/DataTableMixin"
  import JForm from './form'
  import {del} from "@/api/menu";
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
            minWidth: 100,
            query: {
              type: 'input'
            }
          },
          {
            label: "权限编码",
            prop: "perms"
          },
          {
            label: "图标",
            prop: "icon",
            type: 'slot'
          },
          {
            label: "菜单路径",
            prop: "path",
          },
          {
            label: "类型",
            prop: "type",
            formatter: (val) => {
              if (val !== undefined) {
                if (val === 0) {
                  return "目录"
                } else if (val === 1) {
                  return "菜单"
                } else if (val === 2) {
                  return "权限"
                }
              }
            }
          },
          {
            label: "排序号",
            prop: "sortNumber",
            sortable: true
          },
          {
            label: "是否隐藏",
            prop: "isHidden",
            formatter: (val) => {
              if (val !== undefined) return val? "隐藏" : '显示'
            }
          },
          {
            label: "是否启用",
            prop: "enabled",
            formatter: (val) => {
              if (val !== undefined) return val ? '启用' : "禁用"
            }
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
        this._url = "/sys/menu";
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
