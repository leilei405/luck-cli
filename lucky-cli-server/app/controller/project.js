const { Controller } = require("egg");

const TEMPLATE_LIST = [
  {
    name: "vue3 模版",
    value: "template-vue3",
    npmName: "@lucky.com/vue3-template",
    version: "1.0.1",
  },
  {
    name: "react18 模版",
    value: "template-react18",
    npmName: "@lucky.com/react18-template",
    version: "1.0.0",
  },
  {
    name: "vue-element-admin 模版",
    value: "template-vue-element-admin",
    npmName: "@lucky.com/template-vue-element-admin",
    version: "1.0.0",
  },
];

class ProjectController extends Controller {
  async template() {
    const { ctx } = this;
    ctx.body = TEMPLATE_LIST;
  }
}

module.exports = ProjectController;
