<template>
  <drag-dialog
    append-to-body
    :visible.sync="dialog"
    title="字典项信息"
    enable-drag
    width="500px">
    <dynamic-form v-bind="formOptions" :value="form" ref="pageForm" />
    <div class="bottom-btn-box">
      <el-button type="primary" @click="submit" size="small">提交</el-button>
      <el-button type="warning" @click="cancel" size="small">取消</el-button>
    </div>
  </drag-dialog>
</template>

<script>
  import {add, edit} from "@/api/dictDetail";

  export default {
    inject: {
      dictThis: {default: {}},
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
            label: [
              {required: true, message: "名称不能为空", trigger: "blur"}
            ],
            value: [
              {required: true, message: "值不能为空", trigger: "blur"}
            ],
          },
          options: [
            {
              label: "字典名",
              prop: "label",
              type: 'text',
              span: 24
            },
            {
              label: "字典值",
              prop: "value",
              type: 'text',
              span: 24
            },
            {
              label: "排序号",
              prop: "sortNumber",
              type: 'number',
              span: 24
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
        this.form.dict = {id: this.dictThis.dictId}
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
