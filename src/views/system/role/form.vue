<template>
  <drag-dialog
    append-to-body
    :visible.sync="dialog"
    title="角色信息"
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
  import {add, edit} from "@/api/role";

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
            dsScope: [
              {
                validator: (rule, value, callback) => {
                  if (this.form.type === 4 && !value) {
                    callback(new Error('数据权限不能为空'));
                  } else {
                    callback();
                  }
                },
                trigger: "blur"
              }
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
              label: "数据权限类型",
              prop: "type",
              type: 'select',
              options: [
                {label: '全部', value: 1},
                {label: '本级', value: 2},
                {label: '本级及下级', value: 3},
                {label: '自定义', value: 4}
              ],
              span: 12
            },
            {
              label: "数据权限",
              prop: "dsScope",
              type: "treeSelect",
              span: 12,
              transToTree: true,
              url: '/sys/dept/select',
              props: {
                label: 'name',
                value: 'id'
              }
            },
            {
              label: "是否启用",
              prop: "enabled",
              type: "switch",
              activeColor: "#13ce66",
              inactiveColor: "#ff4949",
              activeText: "启用",
              inactiveText: "禁用",
              span: 24
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
