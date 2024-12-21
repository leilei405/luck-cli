const Controller = require("egg").Controller;

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
  // 项目模版的查询
  index() {
    const { ctx } = this;
    ctx.body = TEMPLATE_LIST;
  }

  // 拿到某个项目模版的详情
  show() {
    const { ctx } = this;
    const id = ctx.params.id;
    const itemTemplate = TEMPLATE_LIST.find((it) => it.value === id);
    console.log("itemTemplate", itemTemplate, id);
    if (itemTemplate) {
      ctx.body = itemTemplate;
    } else {
      ctx.body = {};
    }
  }

  // 项目模版的创建
  create() {
    console.log(this.ctx.request.body);
    this.ctx.body = "create";
  }

  // 项目模版的删除
  destroy() {
    console.log(this.ctx);
    this.ctx.body = "destroy";
  }

  // 项目模版的更新
  update() {
    console.log(this.ctx);
    this.ctx.body = "update";
  }
}

module.exports = ProjectController;
