"use strict";
import Command from "@lucky.com/command";
import { log } from "@lucky.com/utils";
import createTemplate from "./createTemplate.js";
import downloadTemplate from "./downloadTemplate.js";
import installTemplate from "./installTemplate.js";

/**
 * @author Lucky
 * @example 示例
 * @description 初始化一个项目
 * 交互式创建项目: lucky-cli init
 * 非交互式创建项目: lucky-cli init <project-name> -t <project / page> -tp <template>
 */
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
      ["-t, --type <type>", "项目类型(project / page)"],
      ["-tp --template <template>", "项目模版名称"],
    ];
  }

  async action([name, otherArgs]) {
    log.verbose("创建的项目名称：", name);
    log.verbose("命令行参数配置：", otherArgs);
    // 1. 选择项目模版，生成项目信息
    const selectedTemplate = await createTemplate(name, otherArgs);
    log.verbose("创建的项目信息预览", selectedTemplate);
    // 2. 下载项目模版至缓存目录
    await downloadTemplate(selectedTemplate);
    // 3. 安装项目模版至项目目录
    await installTemplate(selectedTemplate, otherArgs);
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
