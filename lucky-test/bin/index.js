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
  .option("-p, --path <path>", "设置路径");

// // 获取当前的版本号
// .version(pkg.version);

// // 解析参数
// .parse(process.argv);

// command 注册命令
const clone = program.command("clone <source> [destination]");
clone
  .description("执行克隆仓库")
  .option("-f, --force", "强制初始化")
  .action((source, destination, cmdObj) => {
    console.log("克隆了一个仓库", source, destination, cmdObj.force);
  });

// addCommand 注册命令
const service = new commander.Command("service");
service
  .description("启动服务")
  .command("start [port]")
  .action((port, cmdObj) => {
    console.log("启动了一个服务", port);
  });

service
  .description("停止服务")
  .command("stop")
  .action(() => {
    console.log("停止了一个服务");
  });

program.addCommand(service);

// 执行 lucky-test 时候直接调出帮助信息
program.outputHelp();

// 解析参数
program.parse(process.argv);

// 打印出出Options
// console.log(program.opts(), "program.opts()");
// 执行 lucky-test --version
// 执行 lucky-test -V
// 执行 lucky-test --help
// 执行 lucky-test -h
