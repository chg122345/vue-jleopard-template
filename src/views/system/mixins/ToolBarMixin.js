import {deepClone} from "@/utils";

const ToolBarMixin = {
  data() {
    return {
      _subThis: null
    }
  },
  provide() {
    return {
      parentThis: this,
    };
  },
  updated() {
    this._subThis = this.$refs.subThis
  },
  methods: {
    subAdd() {
      this._subThis.form = {}
      this._subThis.dialog = true
    },
    subEdit(data) {
      this._subThis.form = deepClone(data)
      this._subThis.dialog = true
    },
    subLook(data) {
      this._subThis.form = deepClone(data)
      this._subThis.editable = false
      this._subThis.dialog = true
    }
  }
}

export default ToolBarMixin
