import DragDialog from "./DragDialog"
import EditDataTable from "./EditDataTable"
import DynamicForm from "./DynamicForm"
import DynamicSearch from "./DynamicSearch"
import JlFrame from "./JlFrame"
import ApprovalDialog from './ApprovalDialog'

const components = [
  DragDialog,
  EditDataTable,
  DynamicForm,
  DynamicSearch,
  JlFrame,
  ApprovalDialog
]

const install = function(Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  ...components
}
