#!/usr/bin/env node
const lib = require("lucky-test-lib");
const params = require("process").argv;
console.log(params, "全部参数");

// 1. 注册一个命令 lucky-test init
const command = params[2];

const options = params.slice(3);
if (options.length > 1) {
  let [option, param] = options;
  option = option.replace(/-/g, "");

  if (lib[command]) {
    lib[command]({ option, param });
  } else {
    console.log(`${command} 指令不存在`);
  }
}

console.log(command, "command");

// 2. 实现参数解析 --version 和 init --name
if (command?.startsWith("--") || command?.startsWith("-")) {
  let globalOption = command.replace(/--|-/g, "");
  if (globalOption === "version" || globalOption === "V") {
    console.log("版本: 1.0.0");
  } else {
    console.log(`${globalOption} 指令不存在`);
  }
}
