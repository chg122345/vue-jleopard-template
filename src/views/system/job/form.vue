<template>
  <drag-dialog
    append-to-body
    :visible.sync="dialog"
    title="职位信息"
    enable-drag
    width="800px">
    <dynamic-form v-bind="formOptions" :value="form" ref="pageForm" />
    <div class="bottom-btn-box">
      <el-button type="primary" @click="submit" size="small">提交</el-button>
      <el-button type="warning" @click="cancel" size="small">取消</el-button>
    </div>
  </drag-dialog>
</template>

<script>
  import {add, edit} from "@/api/job";

  export default {
    inject: {
      parentThis: {default: {}}
    },
    data() {
      return {
        loading: false,
        dialog: false,
        form: {},
        formOptions: {
          labelWidth: "80",
          rules: {
            name: [
              {required: true, message: "名称不能为空", trigger: "blur"}
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
              label: "排序号",
              prop: "sortNumber",
              type: 'number',
              span: 12
            },
            {
              label: "是否启用",
              prop: "enabled",
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
              label: "所属部门",
              prop: "dept",
              type: "selectData",
              span: 24,
              url: '/sys/dept/select',
              subType: 'treeSelect',
              transToTree: true,
              params: {page: 0, size: 10},
              props: {
                label: 'name',
                key: 'id'
              }
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
