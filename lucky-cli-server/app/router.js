/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  router.get("/", controller.home.index);
  // test
  router.get("/api/project/template", controller.project.template);

  // 查询所有的项目模版
  // 查询某个项目模版的详情
  // 创建项目模版
  // 删除项目模版
  // 更新项目模版
  router.resources("/v1/project", controller.v1.project);
};
