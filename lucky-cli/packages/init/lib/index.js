"use strict";
import Command from "@lucky.com/command";
import { log } from "@lucky.com/utils";

class InitCommand extends Command {
  get command() {
    return "init [name]";
  }

  get description() {
    return "初始化一个项目";
  }

  get options() {
    return [
      ["-f, --force", "是否强制初始化项目", false],
      ["-d, --debug", "是否开启调试模式", false],
    ];
  }

  action([name, otherArgs]) {
    log.success(name, otherArgs, "测试");
  }

  preAction() {
    console.log("命令执行之前");
  }

  postAction() {
    console.log("命令执行之后");
  }
}

function Init(instance) {
  return new InitCommand(instance);
}

export default Init;
