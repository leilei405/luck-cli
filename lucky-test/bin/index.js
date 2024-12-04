#!/usr/bin/env node
// const lib = require("lucky-test-lib");
// const params = require("process").argv;
// console.log(params, "全部参数");

// // 1. 注册一个命令 lucky-test init
// const command = params[2];

// const options = params.slice(3);
// if (options.length > 1) {
//   let [option, param] = options;
//   option = option.replace(/-/g, "");

//   if (lib[command]) {
//     lib[command]({ option, param });
//   } else {
//     console.log(`${command} 指令不存在`);
//   }
// }

// console.log(command, "command");

// // 2. 实现参数解析 --version 和 init --name
// if (command?.startsWith("--") || command?.startsWith("-")) {
//   let globalOption = command.replace(/--|-/g, "");
//   if (globalOption === "version" || globalOption === "V") {
//     console.log("版本: 1.0.0");
//   } else {
//     console.log(`${globalOption} 指令不存在`);
//   }
// }
const yargs = require("yargs/yargs");
const dedent = require("dedent");
const { hideBin } = require("yargs/helpers");

const argv = hideBin(process.argv);

const cli = yargs(argv);

cli
  // 使用说明
  .usage("请使用: $0 <命令>/<command> [参数]/[options]")
  .demandCommand(1, "请最少输入一个参数来执行此命令")
  // 给命令注册起一个别名
  .alias("v", "version")
  .alias("h", "help")
  // 设定控制台信息展示的一个宽度 terminalWidth表示铺满
  .wrap(cli.terminalWidth())
  // 注册命令的描述信息 注册多个
  .options({
    debug: {
      type: "boolean",
      describe: "查看一些调试信息(log)日志",
      alias: "d",
    },
  })
  // 命令一个一个注册
  .option("registry", {
    type: "string",
    describe: "请输入你的名字",
    alias: "r",
  })
  // 给我们的命令进行分组
  .group(["debug"], "调试命令 Options")
  .group(["registry"], "注册命令 Options")
  .group(["help"], "使用帮助 Options")
  .group(["version"], "版本信息 Options")
  // 在底部加一段说明
  .epilogue(
    dedent`用起来非常香的一个库、欢迎使用（食用）欢迎大家使用！！！
    Lucky出版必属精品、欢迎大家！！！`
  )
  // 严格模式，不允许输入不存在的命令
  .strict().argv;
