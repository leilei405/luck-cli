#!/usr/bin/env node

const commander = require("commander");
const pkg = require("../package.json");

// 获取commander的单例
// const { program } = commander;

// 实例化commander
const program = new commander.Command();

program
  // 命令名称 会自动获取的 会自动获取package.json中的bin字段的key值
  .name(Object.keys(pkg.bin)[0])

  // 编写帮助信息
  .usage("<command> [options]")

  // option 选项配置 简写 -d 或者 --debug
  .option("-h, --help", "查看帮助信息")
  .option("-V --version", "查看版本号")
  .option("-d, --debug", "查看一些信息日志, 是否启动调试模式, 默认为false")
  .option("-e, --env <env>", "获取查看当前的环境变量")
  .option("-f, --force", "强制初始化")
  .option("-r, --registry <registry>", "设置仓库地址")
  .option("-t, --template <template>", "设置初始模板")
  .option("-p, --path <path>", "设置路径")
  // 解析参数
  .parse(process.argv);

// 打印出Options
// console.log(program.opts(), "program.opts()");
// 执行 lucky-test --version
// 执行 lucky-test -V
// 执行 lucky-test --help
// 执行 lucky-test -h
