<template>
  <transition name="el-fade-in">
    <drag-dialog
      append-to-body
      :visible.sync="visible"
      :title="options.title"
      enable-drag
      :close-on-click-modal="false"
      width="450px">
      <el-input
        type="textarea"
        :rows="6"
        resize="none"
        placeholder="请输入审批意见"
        v-model="opinion" />
      <div class="footer-btn" slot="footer">
        <el-button type="primary" size="small" @click="_audit(1)">同意</el-button>
        <el-button type="danger" size="small" @click="_audit(0)">打回</el-button>
      </div>
    </drag-dialog>
  </transition>
</template>

<script>
  export default {
    name: 'ApprovalDialog',
    data() {
      return {
        visible: false,
        opinion: '',
        options: {
          title: null,
          resolve: null,
          reject: null
        },
      }
    },
    methods: {
      open(options = {}) {
        this.options.title = options.title || '审批'
        return new Promise((resolve, reject) => {
          this.visible = true
          this.options.resolve = resolve
          this.options.reject = reject
        })
      },
      _audit(sign) {
        if (sign && this.options.resolve) {
          this.options.resolve({
            opinion: this.opinion,
            status: 'agree'
          })
        } else if (!sign && this.options.reject) {
          this.options.reject({
            opinion: this.opinion,
            status: 'back'
          })
        }
        this._doClose()
      },
      _doClose() {
        this.visible = false
        this.opinion = ''
        this.options = {
          title: null,
          resolve: null,
          reject: null
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .footer-btn {
    float: right;
  }
</style>
