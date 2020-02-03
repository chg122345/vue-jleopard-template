<template>
  <drag-dialog
    append-to-body
    :visible.sync="dialog"
    destroy-on-close
    title="定时任务信息"
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
  import {add, edit} from "@/api/monitor/task";

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
            jobName: [
              {required: true, message: "任务名称不能为空", trigger: "blur"}
            ],
          },
          options: [
            {
              label: "任务名称",
              prop: "jobName",
              type: 'text',
              span: 12
            },
            {
              label: "服务实例",
              prop: "instanceServer",
              type: 'select',
              span: 12,
              options: [
                {label: '系统服务', value: 'jleopard-system'}
              ]
            },
            {
              label: "Bean名称",
              prop: "beanName",
              type: 'text',
              span: 12
            },
            {
              label: "执行方法",
              prop: "methodName",
              type: 'text',
              span: 12
            },
            {
              label: "参数",
              prop: "params",
              type: 'text',
              span: 12
            },
            {
              label: "cron表达式",
              prop: "cronExpression",
              type: 'text',
              span: 12
            },
            {
              label: "任务状态",
              prop: "pause",
              type: "switch",
              activeColor: "#13ce66",
              inactiveColor: "#ff4949",
              activeText: "暂停",
              inactiveText: "启用",
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
