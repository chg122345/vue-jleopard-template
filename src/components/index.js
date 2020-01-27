import DragDialog from "./DragDialog"
import EditDataTable from "./EditDataTable"
import DynamicForm from "./DynamicForm"

const components = [
  DragDialog,
  EditDataTable,
  DynamicForm
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
