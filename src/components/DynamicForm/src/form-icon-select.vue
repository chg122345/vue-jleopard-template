<template>
  <el-select
    class="icon-select"
    :value="value"
    v-bind="$attrs"
    filterable
    v-on="$listeners">
    <el-option
      v-for="itm in iconList"
      :key="itm"
      :label="itm"
      :value="itm">
      <svg-icon :icon-class="itm" />
      <span style="margin-left: 10px">{{ itm }}</span>
    </el-option>
    <svg-icon :icon-class="value" slot="prefix" style="width: 30px" />
  </el-select>
</template>

<script>
  const req = require.context('@/icons/svg', false, /\.svg$/)
  const requireAll = requireContext => requireContext.keys()
  const re = /\.\/(.*)\.svg/
  const icons = requireAll(req).map(i => {
    return i.match(re)[1]
  })

  export default {
    name: 'FormIconSelect',
    props: {
      value: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        iconList: icons
      }
    }
  }
</script>

<style lang="scss" scoped>
  .icon-select {
    /deep/ .el-input__inner {
      padding-left: 40px!important;
    }
  }
</style>
