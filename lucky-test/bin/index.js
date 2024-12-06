#!/usr/bin/env node

const commander = require("commander");
const pkg = require("../package.json");

// 获取commander的单例
// const { program } = commander;

// 实例化commander
const program = new commander.Command();

program
  .command("install [name]", "安装包", {
    // 命令名称 默认为文件名 可以自定义
    executableFile: "lucky-test",
    // 是否默认命令 默认为false
    isDefault: true,
    // 是否隐藏命令 默认为false
    hidden: false,
  })
  .alias("i")
  .action((name) => {
    console.log("安装了一个包", name);
  });

// 监听所有的命令输出
program
  //  强制用户必须输入一个命令
  .argument("<cmd> [options]")
  .description("test command", {
    cmd: {
      description: "命令名称",
    },
    options: {
      description: "命令选项",
    },
  })
  .action(function (cmd, options) {
    console.log(cmd, "参数", options);
  });

// 执行 lucky-test 时候直接调出帮助信息
program.outputHelp();

// 解析参数
program.parse(process.argv);
