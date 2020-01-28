<template>
  <div
    class="page-form-item"
    :class="{'cell-input': cellInput, 'is-look': !editable}"
    :style="{display, width, height: heightCup}">
    <label v-if="!hiddenLabel" class="page-form-item-label" :style="[{width: labelWidthCup}]">
      <div class="left-border" v-if="isPrinting" />
      <span class="require" v-if="required">*</span>
      <span class="page-form-item-label__text">
        {{ label }}
      </span>
    </label>
    <div
      class="page-form-item-content"
      :class="{'align-top': alignTop, noPadding,'noLabel':hiddenLabel}"
      :style="formContentStyle">
      <el-form-item
        v-if="type"
        :prop="prop"
        ref="elpage-form-item"
        style="display: inline-block; width: 100%;">
        <div
          v-if="['text','password','textarea','input'].includes(type)"
          onmouseover="this.title = this.getElementsByClassName('el-input__inner')[0] ?
            this.getElementsByClassName('el-input__inner')[0].value : this.getElementsByClassName('el-textarea__inner')[0].value">
          <el-input
            v-bind="$attrs"
            v-on="bindListeners"
            :value="value"
            :type="$attrs.subtype || type"
            :autosize="autoSize || { minRows: 3, maxRows: 3}"
            resize="none"
            :placeholder="$attrs.disabled?'':placeholder || `请输入${label}`"
          />
        </div>
        <form-number-input
          v-else-if="type === 'number'"
          v-bind="$attrs"
          :value="value"
          v-on="bindListeners"
          :placeholder="$attrs.disabled?'':placeholder || `请输入${label}`" />
        <form-radio
          v-else-if="type === 'radio'"
          v-bind="$attrs"
          v-on="bindListeners"
          :value="value"
          @change="handleChange" />
        <form-select
          v-else-if="['select','cascader'].includes(type)"
          v-bind="$attrs"
          v-on="bindListeners"
          :type="type"
          :value="value"
          @change="handleChange"
          :placeholder="$attrs.disabled?'':placeholder || `请选择${label}`" />
        <form-tree-select
          v-else-if="type === 'treeSelect'"
          v-bind="$attrs"
          v-on="bindListeners"
          :value="value"
          @change="handleChange"
          :placeholder="$attrs.disabled?'':placeholder || `请选择${label}`" />
        <form-select-data
          v-else-if="type === 'selectData'"
          v-bind="$attrs"
          v-on="bindListeners"
          :value="value"
          @change="handleChange"
          :placeholder="$attrs.disabled?'':placeholder || `请选择${label}`" />
        <el-date-picker
          v-else-if="['date','datetime','year','month'].includes(type)"
          v-bind="$attrs"
          v-on="bindListeners"
          :value="value"
          :type="type"
          :editable="false"
          :value-format="valueFormat || 'timestamp'"
          @change="handleChange"
          onmouseover="this.title = this.getElementsByClassName('el-input__inner')[0].value"
          :placeholder="$attrs.disabled?'':placeholder || `请选择${label}`" />
        <form-upload
          v-else-if="type === 'file'"
          v-bind="$attrs"
          v-on="bindListeners"
          :value="value"
          @change="handleChange" />
        <form-slider
          v-else-if="type === 'slider'"
          v-bind="$attrs"
          v-on="bindListeners"
          :value="value" />
      </el-form-item>
      <div class="text-box" v-else-if="value" :style="$attrs.fontStyle" @click="handleChange(value)">{{ value }}</div>
    </div>
  </div>
</template>

<script>

  export default {
    components: {
      'form-number-input': () => import('./form-number-input'),
      'form-radio': () => import('./form-radio'),
      'form-select': () => import('./form-select'),
      'form-tree-select': () => import('./form-tree-select'),
      'form-select-data': () => import('./form-select-data'),
      'form-upload': () => import('./form-upload'),
      'form-slider': () => import('./form-slider')
    },
    props: {
      type: String, // 表单项类型
      autoSize: [Object, Boolean],
      label: String, // label文本
      inline: {
        type: Boolean,
        default: true
      }, // 是否级联显示
      span: [Number, String], // 所占24列中的多少分
      prop: String, // 绑定表单中的属性，用于表单验证
      height: [String, Number], // 表单项的高度
      alignTop: Boolean, // 内容区是否从顶部开始布局，默认垂直居中
      noPadding: Boolean, // 是否有内边距
      isPrinting: Boolean, // 打印中
      valueFormat: String, // 时间格式化
      cellLabelWidth: [Number, String], // 单元格label宽度
      hiddenLabel: Boolean, // 是否隐藏label
      placeholder: String,
      value: {
        type: [Number, String, Array, Date, Object]
      },
      cellInput: Boolean // 在表格中嵌套使用
    },
    inject: {
      editable: {default: true},
      labelWidth: {default: 160},
      rules: {default: {}},
      formSubject: {default: {}}
    },
    data() {
      return {
        validateMsgsProp: {
          msgStatus: true,
          validateMessage: '',
        }
      }
    },
    computed: {
      bindListeners() {
        const events = this.$attrs.listeners
        if (events && Object.keys(events).includes('input')) {
          this.$delete(events, 'input')
        }
        return Object.assign(this.$listeners, events)
      },
      formContentStyle() {
        const {labelWidthCup} = this;
        let str = ''
        if (this.hiddenLabel) {
          str = `width: calc(100% ${labelWidthCup} - ${this.changeRem(42)})`;
        } else {
          str = `width: calc(100% - ${labelWidthCup} - ${this.changeRem(10)})`; // Todo  - 18px - 24px
        }
        if (this.noPadding) {
          str = `width: calc(100% - ${labelWidthCup} - ${this.changeRem(10)}); height: 100%;`;
        }
        return str;
      },
      required() {
        const ruleData = this.rules[this.prop];
        let rq = false;
        if (!ruleData) {
          return rq;
        }
        ruleData.forEach((item) => {
          if (item.required) {
            rq = true;
          }
        });
        return rq;
      },
      labelWidthCup() {
        if (this.hiddenLabel) {
          return '-' + this.changeRem(18);
        }
        const val = this.cellLabelWidth || this.labelWidth;
        if (typeof val === 'number') {
          return this.changeRem(val);
        }
        if (typeof val === 'string') {
          if (val.indexOf('px') > -1) {
            return this.changeRem(val);
          } else if (val.endsWith('%')) {
            return val;
          }
          return this.changeRem(val);
        }
        return this.changeRem(80);
      },
      display() {
        if (this.inline) {
          return 'inline-block';
        }
        return 'block';
      },
      width() {
        if (this.span) {
          return `calc(100% * (${this.span} / 24))`;
        }
        return '100%';
      },
      heightCup() {
        const val = this.height;
        if (typeof val === 'number') {
          return this.changeRem(val);
        }
        if (typeof val === 'string') {
          return this.changeRem(val);
        }
        return '';
      },
    },
    created() {
      this.formSubject.subscribe((x) => {
        if (x.prop === 'all') {
          this.validateMsgsProp.msgStatus = x.msgStatus;
        } else if (x.prop === this.prop) {
          if (x.validateMessage) {
            this.validateMsgsProp.validateMessage = x.validateMessage;
          }
          this.validateMsgsProp.msgStatus = x.msgStatus;
        }
      });
    },
    methods: {
      handleChange(val) {
        this.$emit('handleChange', val, this.prop)
      },
      // 自适应屏幕转换
      changeRem(number) {
        return parseFloat(number) + 'px'
      }
    }
  };
</script>

<style lang="scss" scoped>
  $border-color: #EBEEF3;
  $label-bgcolor: #F9FAFD;
  .page-form-item {
    font-size: 14px;
    font-family: "PingFangSC";
    position: relative;
    border-top: 1px solid $border-color;
    vertical-align: top;
    overflow: hidden;
    height: 60px;
    color: #4D4D4D;

    .page-form-item-label {
      height: 100%;
    }

    .left-border {
      position: absolute;
      height: 100%;
      width: 1px;
      left: 0;
      top: 0;
      background-color: $border-color;
      z-index: 999;
    }

    &-label {
      display: inline-block;
      height: calc(100% - 16px);
      background-color: $label-bgcolor;
      border-right: 1px solid $border-color;
      border-left: 1px solid $border-color;
      text-align: center;

      .require {
        display: inline-block;
        width: 8px;
        color: #F56C6C;
        vertical-align: -3px;
      }

      &__text {
        display: inline-block;
        vertical-align: middle;
        line-height: 1.3em;
        width: 80%;
      }

      &::after {
        content: '';
        display: inline-block;
        vertical-align: middle;
        height: 100%;
      }
    }

    .border-right0 {
      border-right: 0;
    }

    &-content {
      display: inline-block;
      vertical-align: top;
      padding: 8px;
      height: calc(100% - 16px);

      &.noLabel {
        border-left: 1px solid $border-color;
      }

      &::after {
        content: '';
        display: inline-block;
        vertical-align: middle;
        height: 100%;
      }

      &.align-top {
        &::after {
          content: '';
          vertical-align: top;
        }
      }

      &.noPadding {
        padding: 0;
      }
    }

    /deep/ .el-table th {
      background-color: $label-bgcolor;
    }

    /deep/ .el-radio {
      margin-right: 15px;
    }

    /deep/ .el-radio__label {
      font-size: 12px;
    }

    /deep/ .el-input--small .el-input__inner {
      font-size: 12px;
    }

    /deep/ .el-checkbox {
      font-size: 12px;
    }

    /deep/ .el-checkbox__label {
      font-size: 12px;
      vertical-align: -2px;
    }

    /deep/ .el-select {
      width: 100%;
    }

    /deep/ .el-cascader {
      width: 100%;
    }

    /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 100%;
    }

    /deep/ .el-form-item.is-success .el-input__inner,
    /deep/ .el-form-item.is-success .el-input__inner:focus,
    /deep/ .el-form-item.is-success .el-textarea__inner,
    /deep/ .el-form-item.is-success .el-textarea__inner:focus {
      border-color: #DCDFE6;
    }

    /deep/ .el-textarea__inner {
      height: 80px;
    }

    .page-form-item-content {
      height: 100%;
      overflow: hidden;

      /deep/ .el-form-item {
        margin-bottom: 0;

        .el-input__inner {
          /*height: 100%;*/
        }

        /deep/ .is-disabled .el-input__inner, .el-textarea__inner, .el-radio__label {
          color: #4D4D4D;
          /*background: #fff;*/
        }
      }

      .text-box {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        cursor: pointer;
      }

      .slider-box {
        display: flex;
        justify-content: space-between;

        &:first-child {
          flex: 1;
        }
      }
    }
  }

  .cell-input {
    border: 0;
    height: auto;
    min-height: 66px;
    padding-top: 12px;

    .page-form-item-content {
      padding: 0;
      width: 100%;
      border: 0;
      overflow: initial;
    }
  }

  /*详情时去掉边框线*/
  .is-look {
    /deep/ .el-input__inner {
      color: #333;
      background: none;
      border: none;
      cursor: text !important;
    }

    /deep/ .el-textarea {
      .el-textarea__inner {
        color: #333;
        background: none;
        border: none;
        cursor: text !important;
      }
    }

    /deep/ .el-select__tags {
      .el-tag--info {
        color: #333;
        background: none;
        border: none;
        cursor: text !important;
        font-size: 13px;
      }
    }

    /deep/ .el-input__suffix, /deep/ .el-input__prefix {
      display: none;
    }

    /deep/ .select-data-container {
      .select-box {
        .icon {
          display: none;
        }
      }
    }

    /deep/ .el-date-editor {
      .el-input__inner {
        padding-left: 15px;
      }
    }
  }
</style>
