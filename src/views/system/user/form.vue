<template>
  <drag-dialog
    append-to-body
    :visible.sync="dialog"
    :title="title"
    enable-drag
    :width="width">
    <dynamic-form v-bind="formOptions" :value="form" ref="pageForm" />
    <div class="bottom-btn-box">
      <el-button type="primary" @click="submit" :loading="loading" size="small">提交</el-button>
      <el-button type="warning" @click="cancel" size="small">取消</el-button>
    </div>
  </drag-dialog>
</template>

<script>
  import {add, edit, resetPassword} from "@/api/user";

  export default {
    inject: {
      parentThis: {default: {}}
    },
    data() {
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        loading: false,
        dialog: false,
        form: {},
        width: '800px',
        title: '用户信息',
        formOptions: {},
        userOptions: {
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
              label: "生日",
              prop: "birthday",
              type: "date",
              valueFormat: 'yyyy-MM-dd',
              span: 12,
            },
            {
              label: "部门",
              prop: "dept",
              type: "selectData",
              span: 12,
              searchKey: 'codeOrName',
              url: '/sys/dept/select',
              subType: 'treeSelect',
              transToTree: true,
              params: {page: 0, size: 10},
              searchAbel: true,
              labelFields: ['name', 'code'],
              props: {
                label: 'name',
                key: 'id'
              }
            },
            {
              label: "职位",
              prop: "job",
              type: "selectData",
              span: 12,
              showName: 'name',
              cascade: 'dept',
              props: {
                label: "name",
                key: "id"
              },
              url: '/sys/job/select',
              params: {page: 0, size: 10, deptId: null}
            },
            {
              label: "角色",
              prop: "roles",
              type: "selectData",
              span: 12,
              showName: 'name',
              multiple: true,
              props: {
                label: "name",
                key: "id"
              },
              url: '/sys/role',
              params: {page: 0, size: 10}
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
        isResetPwd: false,
        resetPwdOptions: {
          labelWidth: "80",
          rules: {
            password: [
              {required: true, message: "密码不能为空", trigger: "blur"}
            ],
            checkPassword: [
              { validator: validatePass2, trigger: 'blur' }
            ],
          },
          options: [
            {
              label: "密码",
              prop: "password",
              type: 'password',
              span: 24
            },
            {
              label: "确认密码",
              prop: "checkPassword",
              type: 'password',
              span: 24
            },
          ]
        }
      };
    },
    watch: {
      dialog(val) {
        if (val) {
          if (this.isResetPwd) {
            this.formOptions = this.resetPwdOptions
            this.title = '重置密码'
            this.width = '500px'
          } else {
            this.formOptions = this.userOptions
            this.title = '用户信息'
            this.width = '800px'
          }
          this.$nextTick(() => {
            this.$refs.pageForm.clearValidate();
          });
        } else {
          this.isResetPwd = false
        }
      }
    },
    methods: {
      submit() {
        this.$refs.pageForm.validate().then(() => {
          if (this.isResetPwd) {
            this.resetPwd()
          } else if (this.form.id) {
            this.doEdit()
          } else {
            this.doAdd()
          }
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
      resetPwd() {
        resetPassword(this.form).then(() => {
          this.cancel();
          this.$notify({
            title: "重置成功",
            type: "success",
            duration: 2500
          });
        })
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
