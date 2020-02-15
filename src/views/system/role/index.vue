<template>
  <div class="content-warp">
    <el-row :gutter="15">
      <!--角色管理-->
      <el-col :xs="24" :sm="24" :md="15" :lg="13" :xl="17">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">角色列表</span>
            <div style="float: right">
              <el-radio-group v-model="tabBtn" size="mini">
                <el-radio-button :label="1">权限分配</el-radio-button>
                <el-radio-button :label="2">角色人员</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="table-top-tool">
            <dynamic-search :data="tableFilterList(tableHead)" @search="dataTableSearch">
              <el-button type="success" size="small" icon="el-icon-plus" @click="subAdd">新增</el-button>
            </dynamic-search>
          </div>
          <edit-data-table
            ref="editTable"
            show-number
            highlight-current-row
            :head="tableHead"
            :loading="loading"
            :data.sync="list"
            :config="{render: 'scroll', renderSize: 100}"
            :editable="false"
            :tool-bar="{label:'操作', align: 'center', width: 130}"
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
      <!-- 授权 -->
      <el-col :xs="24" :sm="24" :md="9" :lg="11" :xl="7">
        <el-card v-show="tabBtn === 1" class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" content="选择指定角色分配权限" placement="top">
              <span class="role-span">权限分配</span>
            </el-tooltip>
            <el-button
              :disabled="!showButton"
              :loading="permissionLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 7px 9px"
              type="primary"
              @click="savePermission">保存</el-button>
          </div>
          <el-tree
            style="margin-bottom: 15px"
            ref="permission"
            node-key="id"
            :data="permissions"
            :props="treeProps"
            :show-checkbox="true"
            :default-checked-keys="permissionIds" />
        </el-card>
        <el-card v-show="tabBtn === 2" class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" content="选择指定角色分配人员" placement="top">
              <span class="role-span" style="line-height: 28px">角色人员</span>
            </el-tooltip>
          </div>
          <j-users :role-id="roleId" :is-show="tabBtn === 2" />
        </el-card>
      </el-col>
    </el-row>

    <j-form ref="subThis" />
  </div>
</template>

<script>
  import DataTableMixin from "@/mixins/DataTableMixin"
  import JForm from './form'
  import JUsers from './users'
  import {del, edit} from "@/api/role";
  import {getPermissionList} from "@/api/menu";
  import ToolBarMixin from "../mixins/ToolBarMixin";

  export default {
    name: "Index",
    components: {JForm, JUsers},
    directives: {},
    filters: {},
    mixins: [DataTableMixin, ToolBarMixin],
    props: {},
    data() {
      return {
        tabBtn: 1,
        tableHead: [
          {
            label: "名称",
            prop: "name",
            minWidth: 80,
            query: {
              type: 'input'
            }
          },
          {
            label: "编码",
            prop: "code"
          },
          {
            label: "是否启用",
            prop: "enabled",
            formatter: (val) => {
              if (val !== undefined) return val ? '启用' : '禁用'
            },
            cellStyle: (val) => {
              if (val !== undefined) return val ? {color: '#13ce66'} : {color: '#FFBA00'}
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
        delLoading: false,
        treeProps: {
          children: 'children',
          label: 'name'
        },
        permissionLoading: false,
        showButton: false,
        permissions: [],
        permissionIds: [],
        roleId: ''
      }
    },
    created() {
      this.$nextTick(() => {
        this.dataTableInit()
        this.getPermissions()
      });
    },
    methods: {
      dataTableBeforeInit() {
        this._url = "/sys/role";
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
      handleCurrentChange(val) {
        if (val) {
          // 清空权限与菜单的选中
          this.$refs.permission.setCheckedKeys([])
          // 保存当前的角色id
          this.roleId = val.id
          // 点击后显示按钮
          this.showButton = val.enabled
          // 初始化
          const permsIds = []
          val.menus.forEach(item => {
            if (val.menus.some(data =>item.id === data.parentId)) {
              return
            } else {
              permsIds.push(item.id)
            }
          })
          this.permissionIds = permsIds
        }
      },
      getPermissions() {
        getPermissionList().then(res => {
          if (res && res.length) {
            const XEUtils = require("xe-utils")
            this.permissions = XEUtils.toArrayTree(res, {key: "id", parentKey: 'parentId', children: 'children'})
          }
        }).catch(err => {
          console.log(err.response)
        })
      },
      savePermission() {
        this.permissionLoading = true
        const role = { id: this.roleId, menus: [] }
        // 获取半选/全选Key
        role.menus = role.menus.concat(this.$refs.permission.getCheckedKeys(),
          this.$refs.permission.getHalfCheckedKeys()).map(i => ({id: i}))
        edit(role).then(() => {
          this.$notify({
            title: '保存成功',
            type: 'success',
            duration: 2500
          })
          this.permissionLoading = false
        }).catch(err => {
          this.permissionLoading = false
          console.log(err)
        })
      }
    }
  }
</script>
