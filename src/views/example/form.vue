<template>
  <dynamic-form v-bind="formOptions" :value="formData" />
</template>

<script>
export default {
  name: "Form",
  directives: {},
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      formOptions: {
        labelWidth: "160px",
        rules: {
          serialNumber: [
            {required: true, message: "流水号不能为空", trigger: "blur"}
          ],
          plotId: [
            {required: true, message: "地块名称不能为空", trigger: "change"}
          ],
          name: [
            {required: true, message: "项目名称不能为空", trigger: "blur"}
          ],
          area: [{required: true, message: "区域不能为空", trigger: "change"}],
          projectType: [
            {required: true, message: "项目类型不能为空", trigger: "blur"}
          ],
          fatteningScale: [
            {
              validator: (rule, value, callback) => {
                if (!this.formData.sowScale && !value) {
                  callback(new Error('育肥规划与母猪规划规模二者至少必填一个'));
                } else {
                  callback();
                }
              },
              trigger: 'blur'
            }
          ],
          sowScale: [
            {
              validator: (rule, value, callback) => {
                if (!this.formData.fatteningScale && !value) {
                  callback(new Error('育肥规划与母猪规划规模二者至少必填一个'));
                } else {
                  callback();
                }
              },
              trigger: 'blur'
            }
          ],
          constructionManager: [
            {required: true, message: "发展经理不能为空", trigger: "change"}
          ],
          projectAmount: [
            {required: true, message: "拟投资金额不能为空", trigger: "blur"}
          ],
          planStartDate: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error('计划开工日期不能为空'));
                } else if (value > this.formData.planEndDate) {
                  callback(new Error('计划开工日期不能大于计划完工日期'));
                } else {
                  callback();
                }
              },
              trigger: 'change'
            }
          ],
          planEndDate: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error('计划完工日期不能为空'));
                } else if (value < this.formData.planStartDate) {
                  callback(new Error('计划完工日期不能小于计划开工日期'));
                } else {
                  callback();
                }
              },
              trigger: 'change'
            }
          ],
          projectDescription: [
            {required: true, message: "项目概述不能为空", trigger: "blur"}
          ]
        },
        options: [
          {
            label: "流水号",
            prop: "serialNumber",
            span: 6
          },
          {
            label: "地块名称",
            prop: "plotId",
            type: "selectData",
            value: "",
            span: 6,
            showName: 'plotName',
            props: {
              label: "plotName",
              value: "id"
            },
            options: [
              {
                id: '1011222',
                plotName: '啊实打实的撒'
              }
            ]
          },
          {
            label: "片区",
            prop: "zone",
            type: "select",
            span: 6,
            options: [
              {label: '江西总片区', value: 0}
            ]
          },
          {
            label: "项目名称",
            prop: "name",
            type: "text",
            value: "",
            span: 6
          },
          {
            label: "地块用途",
            prop: "purpose",
            type: "select",
            span: 6,
            options: [
              {
                label: '没用的',
                value: 0
              }
            ]
          },
          {
            label: "区域",
            prop: "area",
            type: "radio",
            span: 6,
            options: [
              {
                label: '南方',
                value: 0
              },
              {
                label: '北方',
                value: 1
              }
            ]
          },
          {
            label: "地块地址",
            prop: "plotAddress",
            type: "text",
            span: 12,
          },
          {
            label: "规模(万头)",
            prop: "fatteningScale",
            type: "number",
            span: 6,
          },
          {
            label: "母猪规模(万头)",
            prop: "sowScale",
            type: "number",
            span: 6,
          },
          {
            label: "发展经理",
            prop: "constructionManager",
            type: "selectData",
            span: 6,
            url: "/userManage/selectUser",
            searchKey: 'keyWord',
            params: {
              pageSize: 20,
              pageNum: 1
            },
            searchAbel: true,
            labelFields: ['name', 'number'],
            props: {
              label: 'name',
              value: 'id'
            },
            listeners: {
              dataChange: (val) => {
                this.formData.constructionManagerName = val.name
              }
            },
          },
          {
            label: "拟投资金额（万元）",
            prop: "projectAmount",
            type: "number",
            span: 6,
            dot: 0
          },
          {
            label: "计划开工日期",
            prop: "planStartDate",
            type: "date",
            span: 6,
          },
          {
            label: "计划完工日期",
            prop: "planEndDate",
            type: "date",
            span: 6,
          },
          {
            label: "申请人",
            prop: "applicant",
            span: 6,
          },
          {
            label: "申请时间",
            prop: "applicantDate",
            type: "date",
            span: 6,
            disabled: true
          },
          {
            label: "项目概述",
            prop: "projectDescription",
            type: "textarea",
            span: 24,
            autoSize: {minRows: 3, maxRows: 3},
            height: 100
          }
        ]
      },
      formData: {serialNumber: '10011', projectType: "新建", fatteningScale: 50, applicant: this.$store.getters.name, applicantDate: new Date()},
    }
  },
  computed: {},
  watch: {},
  methods: {}
}
</script>

<style scoped>

</style>
