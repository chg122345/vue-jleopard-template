<template>
  <div class="page-filter-container" @keydown.enter="search">
    <div class="filter-item prefix" v-if="$slots.prefix">
      <slot name="prefix" />
    </div>
    <div
      class="filter-item"
      v-for="(item, index) in getFieldConfigList()"
      :key="index">
      <label
        class="filter-label"
        v-if="item.type !== 'button' && item.type !== 'group-input' && item.label && !item.hiddenLabel">
        {{ item.label }}
      </label>
      <!-- 输入框 -->
      <el-input
        :class="`filter-${item.type}`"
        v-if="item.type === 'input'"
        :type="item.type"
        :size="size"
        :disabled="item.disabled"
        :clearable="item.clearable"
        :placeholder="getPlaceholder(item)"
        @focus="handleEvent(item.event)"
        v-model="searchQuery[item.prop]"
      />

      <!-- 组合文本框 -->
      <el-input
        class="input-with-select"
        :class="`filter-${item.type}`"
        v-if="item.type === 'group-input' && searchQuery[item.prop]"
        :type="item.type"
        :size="size"
        :disabled="item.disabled"
        :clearable="item.clearable"
        :placeholder="getPlaceholder(item)"
        @focus="handleEvent(item.event)"
        v-model="searchQuery[item.prop].value">
        <el-select
          v-model="searchQuery[item.prop].field"
          slot="prepend"
          :clearable="item.clearable"
          :size="size"
          :filterable="item.filterable"
          @change="handleGroupFieldChange($event, item)">
          <el-option
            v-for="(field, index_) in item.options"
            :key="index_"
            :label="field.label"
            :value="field.value"
          />
        </el-select>
      </el-input>

      <!-- 选择框 -->
      <el-select
        :class="`filter-${item.type}`"
        v-if="item.type === 'select'"
        v-model="searchQuery[item.prop]"
        :disabled="item.disabled"
        :size="size"
        @change="handleEvent(item.event)"
        :clearable="item.clearable"
        :filterable="item.filterable"
        :placeholder="getPlaceholder(item)">
        <el-option
          v-for="(itm, index_) in item.options"
          :key="index_"
          :label="itm.label"
          :value="itm.value" />
      </el-select>

      <!-- 时间选择框 -->
      <el-time-select
        :class="`filter-${item.type}`"
        v-if="item.type === 'time'"
        v-model="searchQuery[item.prop]"
        :picker-options="item.timePickerOptions"
        :clearable="item.clearable"
        :size="size"
        :disabled="item.disabled"
        :placeholder="getPlaceholder(item)"
      />
      <!-- 日期选择框 -->
      <el-date-picker
        :class="[`filter-${item.type}`, `date-${item.dateType}`]"
        v-if="item.type === 'date'"
        v-model="searchQuery[item.prop]"
        :picker-options="item.datePickerOptions || datePickerOptions"
        :type="item.dateType"
        :size="size"
        :value-format="item.valueFormat || 'timestamp'"
        :clearable="item.clearable"
        :disabled="item.disabled"
        @focus="handleEvent(item.event)"
        :placeholder="getPlaceholder(item)"
      />
      <!-- 按钮 -->
      <el-button
        :class="`filter-${item.type}`"
        v-else-if="item.type === 'button'"
        :type="item.btType"
        :size="size"
        :icon="item.icon"
        @click="handleClickBtn(item.event)"
      >{{ item.label }}
      </el-button>
      <!-- 组合输入框 -->
      <el-row :class="`filter-${item.type}`" v-if="item.type === 'input-with-input'">
        <el-col :span="11">
          <el-input
            type="input"
            v-if="searchQuery[item.prop]"
            v-model="(searchQuery[item.prop])[0]"
            :size="size"
            :disabled="item.disabled"
            :placeholder="getPlaceholder(item)"
          />
        </el-col>
        <el-col :span="2">-</el-col>
        <el-col :span="11">
          <el-input
            type="input"
            v-if="searchQuery[item.prop]"
            v-model="(searchQuery[item.prop])[1]"
            :size="size"
            :disabled="item.disabled"
            :placeholder="getPlaceholder(item)"
          />
        </el-col>
      </el-row>
    </div>
    <div class="filter-item" v-if="getFieldConfigList().length">
      <!-- 按钮 -->
      <el-button
        class="filter-button"
        type="primary"
        :size="size"
        icon="el-icon-search"
        @click="search">
        搜索
      </el-button>
    </div>
    <div class="filter-item" v-if="$slots.default">
      <slot />
    </div>
    <div class="filter-item suffix" v-if="$slots.suffix">
      <slot name="suffix" />
    </div>
  </div>
</template>
<script>
  export default {
    name: "DynamicSearch",
    props: {
      // 拦截器列表
      data: {
        type: Array,
        required: true
      },
      size: {
        type: String,
        default: 'small'
      }
    },
    data() {
      return {
        searchQuery: {},
        datePickerOptions: {
          // disabledDate (time) {
          //   // 大于当前的时间都不能选 (+十分钟让点击此刻的时候可以选择到当前时间)
          //   return time.getTime() > +new Date() + 1000 * 600 * 1
          // }
        }
      };
    },
    mounted() {
      this.initParams();
    },
    methods: {
      initParams() {
        const obj = Object.create(null);
        this.data.forEach(item => {
          if (item.prop) {
            if (item.type === 'group-input') {
              obj[item.prop] = {
                field: item.value ? item.value.field : item.data[0].value,
                value: item.value ? item.value.value : ''
              }
            } else if (item.type === 'input-with-input') {
              obj[item.prop] = item.value || ['', '']
            } else {
              obj[item.prop] = item.value;
            }
          }
        });
        this.searchQuery = obj;
      },
      getPlaceholder(row) {
        let placeholder = '';
        if (["input", "textarea", "group-input", "input-with-input"].includes(row.type)) {
          placeholder = "请输入"
        } else if (["select", "time", "date"].includes(row.type)) {
          placeholder = "请选择"
        }
        if (row.label) {
          placeholder += row.label
        }
        return placeholder;
      },
      // 获取字段配置项列表
      getFieldConfigList() {
        return this.data.filter(
          item =>
            !item.hasOwnProperty("hidden") ||
            (item.hasOwnProperty("hidden") && !item.hidden)
        );
      },
      // 绑定相关事件
      handleEvent(event) {
        if (event) this.$emit("handleEvent", event);
      },
      // 按钮点击事件
      handleClickBtn(event, data) {
        if (event) this.$emit("handleClickBtn", event, data);
      },
      handleGroupFieldChange(event, item) {
        const fields = item.data;
        const temp = fields.filter(field => field.value === event);
        item.label = temp[0].label;
        this.searchQuery[item.prop].field = event;
      },
      // 点击搜索按钮的事件
      search() {
        const obj = {}
        this.deleteNullKey(this.searchQuery)
        Object.assign(obj, this.searchQuery)
        if (obj.groupInput) {
          const key = obj.groupInput.field
          const val = obj.groupInput.value
          this.$delete(obj, 'groupInput')
          if (key && val) {
            this.$set(obj, key, val)
          }
        }
        for (const key in obj) {
          if (obj[key] instanceof Array && obj[key].length) {
            obj[key] = obj[key].join(",")
          }
        }
        this.$emit('search', obj)
      },
      deleteNullKey(data = {}) {
        for (const key in data) {
          if (data[key] === undefined || data[key] === '') {
            delete data[key]
          }
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .page-filter-container {
    .filter-item {
      display: inline-flex;
      align-items: center;
      margin-bottom: 7px;
      margin-right: 10px;
    }
    .prefix {
      margin-right: 0;
      float: left;
    }
    .suffix {
      margin-right: 0;
      float: right;
    }
    .filter-label {
      padding-right: 5px;
      font-size: 14px;
      color: #606266;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .filter-input,
    .filter-time,
    .filter-date,
    .filter-select {
      width: 180px;
    }
    .date-daterange {
      width: 230px;
    }
    /*.filter-button {*/
    /*background: #277ac0;*/
    /*}*/
    .input-with-select {
      /deep/ .el-select .el-input {
        width: 110px;
      }
      .el-input-group__prepend {
        background-color: #fff;
        /deep/ .el-input__inner {
          width: 150px;
        }
      }
    }
    .filter-input-with-input {
      display: flex;
      align-items: center;
      text-align: center;
    }
    .float-right {
      float: right;
    }
  }
</style>
