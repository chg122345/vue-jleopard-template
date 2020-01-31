<template>
  <el-input
    v-bind="$attrs"
    :value="numberValue"
    type="text"
    @input="limitNumber($event,$attrs.dot)"
  />
</template>

<script>
  export default {
    name: "FormNumberInput",
    props: {
      value: [Number, String],
      // 是否可以输入负数
      minusAble: Boolean
    },
    data() {
      return {
        numberValue: this.value
      }
    },
    watch: {
      value: {
        handler(val) {
          // val === undefined && this.numberValue !== '-'
          if (val+'.' !== this.numberValue) {
            this.numberValue = val
          }
        }
      }
    },
    methods: {
      limitNumber(val, num = 2) {
        if (val === undefined || val == null || val === '') {
          this.numberValue = null
          if (this.value) {
            this.$emit('input', null)
          }
          return
        }
        let value = val.toString()
        if (this.minusAble) {
          if (value && value.length === 1 && ['-', '+'].includes(value)) {
            this.numberValue = value
            if (this.value) {
              this.$emit('input', null)
            }
            return
          }
        }
        if (num === undefined || num == null || num === 0) { // 整数
          value = this.minusAble ? value.replace(/[^(\-)0-9]+/g, '')
            : value.replace(/[^0-9]+/g, '')
        } else {
          const re = this.minusAble ? new RegExp("^(\\-|\\+)?\\d+(\\.\\d{0," + num + "})?")
            : new RegExp("^\\d+(\\.\\d{0," + num + "})?")
          value = (value.match(re) ? value.match(re)[0] : null) || null
        }
        this.numberValue = value
        let value2 = parseFloat(value)
        if (isNaN(value2)) {
          value2 = null
        }
        if (value && !value.endsWith(".")) {
          this.numberValue = value2
        }
        this.$emit('input', value2)
      },
    }
  }
</script>
