"use strict";
import Command from "@lucky.com/command";
import { log } from "@lucky.com/utils";
import createTemplate from "./createTemplate.js";
import downloadTemplate from "./downloadTemplate.js";

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

  async action([name, otherArgs]) {
    log.verbose("init", name, otherArgs);
    // 1. 选择项目模版，生成项目信息
    const selectedTemplate = await createTemplate(name, otherArgs);
    log.verbose("tempalte", selectedTemplate);
    // 2. 下载项目模版至缓存目录
    const download = await downloadTemplate(selectedTemplate);
    // 3. 安装项目模版至项目目录
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
