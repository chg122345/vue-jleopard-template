<template>
  <drag-dialog
    append-to-body
    :visible.sync="dialog"
    destroy-on-close
    title="组织信息"
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
  import {add, edit} from "@/api/dept";

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
            code: [
              {required: true, message: "编码不能为空", trigger: "blur"}
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
              label: "编码",
              prop: "code",
              type: 'text',
              span: 12
            },
            {
              label: "简称",
              prop: "shortName",
              type: 'text',
              span: 12
            },
            {
              label: "全称",
              prop: "displayName",
              type: 'text',
              span: 12
            },
            {
              label: "税码",
              prop: "taxCode",
              type: 'text',
              span: 12
            },
            {
              label: "上级部门",
              prop: "parentId",
              type: "treeSelect",
              span: 12,
              transToTree: true,
              url: '/sys/dept/select',
              params: {page: 0, size: 10},
              props: {
                label: 'name',
                value: 'id'
              }
            },
            {
              label: "叶子节点",
              prop: "leaf",
              type: "radio",
              span: 12,
              options: [
                {
                  label: '否',
                  value: false
                },
                {
                  label: '是',
                  value: true
                }
              ]
            },
            {
              label: "是否启用",
              prop: "enabled",
              type: "switch",
              activeColor: "#13ce66",
              inactiveColor: "#ff4949",
              activeText: "启用",
              inactiveText: "禁用",
              span: 12
            },
            {
              label: "备注",
              prop: "remark",
              type: "textarea",
              span: 24,
              autoSize: {minRows: 3, maxRows: 3},
              height: 90
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
          .then(res => {
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
