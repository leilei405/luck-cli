module.exports = {
  sum(a, b) {
    return a + b;
  },
  mul() {
    return 100;
  },
  init({ option, param }) {
    console.log("执行init初始化流程", option, param);
  },
  publish() {
    console.log("执行publish 发布流程");
  },
  version() {
    console.log("执行version版本流程");
  },
  build() {
    console.log("执行build构建流程");
  },
};
