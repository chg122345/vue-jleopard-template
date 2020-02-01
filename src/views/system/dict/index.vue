<template>
  <div class="content-warp">

    <!-- 字典列表 -->
    <el-row :gutter="15">
      <el-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
        <el-card class="box-card">
          <span slot="header">字典列表</span>
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
            @handleSizeChange="dataTableSizeChange"
            @current-change="handleCurrentChange">
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
      </el-col>
      <!-- 字典详情列表 -->
      <el-col :xs="24" :sm="24" :md="13" :lg="13" :xl="13">
        <el-card class="box-card">
          <span slot="header">字典详情</span>
          <dict-detail ref="dictDetail" />
        </el-card>
      </el-col>
    </el-row>
    <j-form ref="subThis" />
  </div>
</template>

<script>
  import DataTableMixin from "@/mixins/DataTableMixin"
  import JForm from './form'
  import DictDetail from './dictDetail'
  import {del} from "@/api/dict";
  import ToolBarMixin from "../mixins/ToolBarMixin";

  export default {
    name: "Index",
    components: {JForm, DictDetail},
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
            minWidth: 100,
            query: {
              type: 'input'
            }
          },
          {
            label: "编码",
            prop: "code"
          },
          {
            label: "创建时间",
            property: "created",
            align: 'center',
            width: 160,
            sortable: true
          },
        ],
        delLoading: false,
        dictId: ''
      }
    },
    provide() {
      return {
        dictThis: this,
      };
    },
    created() {
      this.$nextTick(() => {
        this.dataTableInit()
      });
    },
    methods: {
      dataTableBeforeInit() {
        this._url = "/sys/dict";
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
      // 选中字典后，设置字典详情数据
      handleCurrentChange(val) {
        if (val) {
          this.dictId = val.id
          this.$refs.dictDetail.dataTableInit()
        }
      }
    }
  }
</script>
