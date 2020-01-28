<template>
  <drag-dialog
    append-to-body
    :visible.sync="dialog"
    title="用户信息"
    enable-drag
    width="800px">
    <dynamic-form v-bind="formOptions" :value="form" ref="pageForm" />
    <div class="bottom-btn-box">
      <el-button type="primary" @click="submit">提交</el-button>
      <el-button type="warning" @click="cancel">取消</el-button>
    </div>
  </drag-dialog>
</template>

<script>
  import {add, edit} from "@/api/user";

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
              {required: true, message: "姓名不能为空", trigger: "blur"}
            ],
          },
          options: [
            {
              label: "姓名",
              prop: "name",
              type: 'text',
              span: 12
            },
            {
              label: "账号",
              prop: "account",
              type: 'text',
              span: 12
            },
            {
              label: "职位",
              prop: "job",
              type: "selectData",
              span: 12,
              showName: 'name',
              props: {
                label: "name",
                key: "id"
              },
              options: [
                {
                  id: '1011222',
                  name: '啊实打实的撒'
                }
              ]
            },
            {
              label: "证件类型",
              prop: "certificateType",
              type: "select",
              span: 12,
              options: [
                {label: '身份证', value: 0}
              ]
            },
            {
              label: "证件号",
              prop: "certificateNumber",
              type: "text",
              span: 12
            },
            {
              label: "编码",
              prop: "code",
              type: "text",
              span: 12,
            },
            {
              label: "性别",
              prop: "sex",
              type: "radio",
              span: 12,
              options: [
                {
                  label: '男',
                  value: 0
                },
                {
                  label: '女',
                  value: 1
                }
              ]
            },
            {
              label: "邮箱",
              prop: "email",
              type: "text",
              span: 12,
            },
            {
              label: "电话",
              prop: "phone",
              type: "number",
              span: 12,
              dot: 0
            },
            {
              label: "部门",
              prop: "dept",
              type: "selectData",
              span: 12,
              url: "/userManage/selectUser",
              searchKey: 'keyWord',
              params: {
                pageSize: 20,
                pageNum: 1
              },
              searchAbel: true,
              labelFields: ['name', 'number'],
              props: {
                label: 'name',
                value: 'id'
              },
              listeners: {
                dataChange: (val) => {
                  this.formData.constructionManagerName = val.name
                }
              },
            },
            {
              label: "生日",
              prop: "birthday",
              type: "date",
              span: 12,
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
