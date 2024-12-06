#!/usr/bin/env node

const commander = require("commander");

// 获取commander的单例
const { program } = commander;

// 实例化commander
// const program = new commander.Command();

// 定制化1  自定义 help 信息
program.helpInformation = () => {
  return `
    Usage:
      $ lucky-test <command> [options]
    Options:
      -V, --version  output the version number
      -h, --help     output usage information
    Commands:
      init [name]    初始化项目
      clone <source> [destination]  执行克隆仓库
      service        启动服务
      `;
};

// program.on("--help", () => {
//   console.log(program.helpInformation());
// });

// 定制化2  实现debug 模式
program.option("-d, --debug", "output the version number");
program.on("option:debug", () => {
  if (program.debug) {
    console.log("开启了debug模式");
    process.env.LOG_LEVEL = "verbose";
  } else {
    console.log("关闭了debug模式");
    process.env.LOG_LEVEL = "info";
  }
});

// 定制化3  对未知命令进行监听
const clone = program.command("clone <source> [destination]");
clone
  .description("执行克隆仓库")
  .option("-f, --force", "强制初始化")
  .action((source, destination, cmdObj) => {
    console.log("克隆了一个仓库", source, destination, cmdObj.force);
  });

program.on("command:*", (obj) => {
  console.log("未知命令", obj); // ['', ''] // 是个列表
  const availableCommands = program.commands.map((cmd) => cmd.name());
  console.log("可用命令", availableCommands);
});

// 执行 lucky-test 时候直接调出帮助信息
program.outputHelp();

// 解析参数
program.parse(process.argv);
