<template>
  <drag-dialog
    append-to-body
    :visible.sync="dialog"
    title="菜单权限信息"
    enable-drag
    width="800px">
    <dynamic-form v-bind="formOptions" :value="form" :editable="editable" ref="pageForm" />
    <div class="bottom-btn-box" v-if="editable">
      <el-button type="primary" @click="submit" size="small">提交</el-button>
      <el-button type="warning" @click="cancel" size="small">取消</el-button>
    </div>
  </drag-dialog>
</template>

<script>
  import {add, edit} from "@/api/menu";

  export default {
    inject: {
      parentThis: {default: {}}
    },
    data() {
      return {
        loading: false,
        dialog: false,
        form: {},
        editable: true,
        formOptions: {
          labelWidth: "80",
          rules: {
            name: [
              {required: true, message: "名称不能为空", trigger: "blur"}
            ],
            perms: [
              {required: true, message: "编码不能为空", trigger: "blur"}
            ],
            type: [
              {required: true, message: "类型不能为空", trigger: "change"}
            ],
          },
          options: [
            {
              label: "名称",
              prop: "name",
              type: 'text',
              span: 12
            },
            {
              label: "权限编码",
              prop: "perms",
              type: 'text',
              span: 12
            },
            {
              label: "类型",
              prop: "type",
              type: 'select',
              options: [
                {
                  label: '目录',
                  value: 0,
                },
                {
                  label: '菜单',
                  value: 1,
                },
                {
                  label: '权限',
                  value: 2,
                }
              ],
              span: 12
            },
            {
              label: "是否隐藏",
              prop: "isHidden",
              type: "radio",
              span: 12,
              options: [
                {
                  label: '是',
                  value: true
                },
                {
                  label: '否',
                  value: false
                }
              ]
            },
            {
              label: "外链菜单",
              prop: "iframe",
              type: "radio",
              span: 12,
              options: [
                {
                  label: '是',
                  value: true
                },
                {
                  label: '否',
                  value: false
                }
              ]
            },
            {
              label: "路径",
              prop: "path",
              type: 'text',
              span: 12
            },
            {
              label: "组件",
              prop: "component",
              type: 'text',
              span: 12
            },
            {
              label: "图标",
              prop: "icon",
              type: 'iconSelect',
              span: 12
            },
            {
              label: "上级菜单",
              prop: "parentId",
              type: "treeSelect",
              span: 24,
              transToTree: true,
              url: '/sys/menu/select',
              params: {type: '0,1'},
              props: {
                label: 'name',
                value: 'id'
              }
            },
            {
              label: "排序号",
              prop: "sortNumber",
              type: 'number',
              minusAble: true,
              span: 12
            },
            {
              label: "是否启用",
              prop: "enabled",
              type: "radio",
              span: 12,
              options: [
                {
                  label: '是',
                  value: true
                },
                {
                  label: '否',
                  value: false
                }
              ]
            }
          ]
        },
      };
    },
    watch: {
      dialog(val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs.pageForm.clearValidate();
            const index = this.formOptions.options.findIndex(i => i.prop === 'parentId')
            if (this.form.id) {
              this.$set(this.formOptions.options[index], 'disabledValue', [this.form.id])
            } else {
              this.$set(this.formOptions.options[index], 'disabledValue', [-1])
            }
          });
        } else {
          this.editable = true
        }
      }
    },
    methods: {
      submit() {
        this.$refs.pageForm.validate().then(() => {
          if (this.form.id) {
            this.doEdit()
          } else this.doAdd()
        })
      },
      doAdd() {
        add(this.form)
          .then(() => {
            this.cancel();
            this.$notify({
              title: "添加成功",
              type: "success",
              duration: 2500
            });
            this.loading = false;
            this.parentThis.dataTableInit();
          })
          .catch(err => {
            this.loading = false;
            console.log(err);
          });
      },
      doEdit() {
        edit(this.form)
          .then(res => {
            this.cancel();
            this.$notify({
              title: "修改成功",
              type: "success",
              duration: 2500
            });
            this.loading = false;
            this.parentThis.dataTableInit();
          })
          .catch(err => {
            this.loading = false;
            console.log(err.response.data.message);
          });
      },
      cancel() {
        this.dialog = false;
      }
    }
  };
</script>

<style scoped lang="scss">
  .bottom-btn-box {
    margin-top: 15px;
    width: 100%;
    display: inline-flex;
    justify-content: flex-end;
  }
</style>
