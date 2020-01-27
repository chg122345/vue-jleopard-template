<!-- 拖拽 Dialog -->
<template>
  <el-dialog
    :enable-drag="enableDrag"
    class="popup"
    v-bind="$attrs"
    :visible.sync="dialogShow"
    :width="width"
    :show-close="false"
    v-el-drag-dialog
    v-on="$listeners"
    @close="handleClose">
    <div class="popup-header" :class="{' has-title':title}" slot="title">
      <div class="popup-title">{{ title }}</div>
      <div class="popup-close-btn" @click="close">
        <i class="el-icon-close" />
      </div>
    </div>
    <div class="popup-box">
      <div class="slot-box" :style="{'max-height':maxHeight+'px'}">
        <slot />
      </div>
    </div>
  </el-dialog>
</template>

<script>
    import elDragDialog from '@/directive/el-drag-dialog'

    export default {
        name: "DragDialog",
        directives: {
            elDragDialog
        },
        props: {
          visible: {
                type: Boolean, // 是否弹出窗口
                required: true
            },
            enableDrag: {
                type: Boolean, // 是否开启拖拽功能
                default: false
            },
            title: {
                type: String // 弹出的标题
            },
            width: {
                type: String, // 弹出的宽度
                default: '80%'
            },
            maxHeight: { // 弹窗框最大高度
                type: Number,
                default: document.documentElement.clientHeight - 140 // 导航栏-Dialog标题栏-底部(50-40-50)
            }
        },
        data() {
            return {
                dialogShow: this.visible
            };
        },
        watch: {
          visible(val) {
                this.dialogShow = val;
            },
            dialogShow(val) {
                this.$emit("update:visible", val);
            }
        },
        methods: {
            handleClose() {
               this.close()
               this.$emit("close")
            },
            close() {
                this.dialogShow = false
            }
        }
    };
</script>
<style lang="scss" scoped>
    .popup {
        overflow: hidden;
        & /deep/ .el-dialog {
            width: 100%;
            margin: 0 auto;
            overflow: auto;
        }
        & /deep/ .el-dialog__body {
            padding: 0;
        }
        & /deep/ .el-dialog__header {
            padding: 0;
        }
        & /deep/ .el-dialog--center {
            padding: 0;
        }
    }

    .popup-header {
        width: 100%;
        z-index: 1001;
        display: flex;
        align-items: center;
        padding: 10px 0;
        .popup-title {
            flex: 1;
            font-size: 14px;
            font-weight: bold;
            line-height: 14px;
            padding: 0 20px;
        }
        .popup-close-btn {
          cursor: pointer;
          padding: 4px 20px;
          border-radius: 3px;
          color: #909399;
          font-size: 20px;
          line-height: 14px;
        }
    }

    .has-title {
        background-color: #f2f3f6;
    }

    .popup-box {
        background-color: #fff;
        .slot-box {
            padding: 15px;
            overflow: auto;
        }
    }
</style>
