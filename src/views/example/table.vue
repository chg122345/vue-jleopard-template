<template>
  <edit-data-table
    ref="editTable"
    :head="tableHead"
    :data.sync="tableData"
    :edit-rules="validRules"
    :config="{trigger: 'click', mode: 'cell',render: 'scroll', renderSize: 100}"
    :editable="true"
    :show-add="true">
    <template #name="{scope}">
      <span>55555555555555</span>
    </template>
    <template #user="{row}">
      <span>0000000000000</span>
    </template>
    <template #userEdit="{row}">
      <el-input v-model="row.user" />
    </template>
    <template #toolbar="{row}">
      <el-button @click="$refs.editTable.deleteRows(row)">删除</el-button>
    </template>
  </edit-data-table>
</template>

<script>

  export default {
    name: "Table",
    directives: {},
    filters: {},
    mixins: [],
    props: {},
    data() {
      return {
        tableHead: [
          {
            prop: 'name',
            label: '姓名',
            editRender: {name: 'ElInput'}
          },
          {
            prop: 'age',
            label: '年龄',
            editRender: {type: 'number', name: 'ElInputNumber'}
          },
          {
            prop: 'phone',
            label: '电话',
            editRender: {name: 'ElSelect', props: {multiple: true}, options: [
                {label: '亿', value: '1'},
                {label: '亿2', value: '12'},
                {label: '亿3', value: '13'}
              ]},
            formatter: (row) => {
              return row + '00000'
            }
          },
          {
            prop: 'user',
            label: '用户',
            editRender: {type: 'default'},
          }
        ],
        tableData: [
          {
            name: '名字11',
            age: 45,
            phone: '111100',
            user: '666666'
          },
          {
            name: '名字11',
            age: 45,
            phone: '111100',
            user: '666666'
          },
          {
            name: '名字11',
            age: 45,
            phone: '111100',
            user: '666666'
          },
          {
            name: '名字11',
            age: 45,
            phone: '111100',
            user: '666666'
          },
          {
            name: '名字11',
            age: 45,
            phone: '111100',
            user: '666666'
          },
          {
            name: '名字11',
            age: 45,
            phone: '111100',
            user: '666666'
          },
          {
            name: '名字11',
            age: 45,
            phone: '111100',
            user: '666666'
          },
          {
            name: '名字11',
            age: 45,
            phone: '111100',
            user: '666666'
          },
          {
            name: '名字11',
            age: 45,
            phone: '111100',
            user: '666666'
          },
          {
            name: '名字11',
            age: 45,
            phone: '111100',
            user: '666666'
          },
          {
            name: '名字11',
            age: 45,
            phone: '111100',
            user: '666666'
          },
          {
            name: '名字11',
            age: 45,
            phone: '111100',
            user: '666666'
          },
          {
            name: '名字11',
            age: 45,
            phone: '111100',
            user: '666666'
          },
          {
            name: '名字11',
            age: 45,
            phone: '111100',
            user: '666666'
          },
          {
            name: '名字11',
            age: 45,
            phone: '111100',
            user: '666666'
          },
          {
            name: '名字11',
            age: 45,
            phone: '111100',
            user: '666666'
          }
        ],
        validRules: {
          name: [
            { required: true, message: '请输入键值', trigger: 'blur' }
          ],
          age: [
            { required: true, message: '请选择语言', trigger: 'blur' }
          ],
          user: [
            { required: true, message: '用户不能为空', trigger: 'blur' }
          ]
        },
      }
    },
    computed: {},
    watch: {},
    methods: {
      editActiveEvent(row, column) {
        console.log(row, column)
      }
    }
  }
</script>

<style scoped>

</style>
