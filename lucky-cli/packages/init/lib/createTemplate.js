import { homedir } from "node:os";
import path from "node:path";
import { log, makeList, makeInput, getLatestVersion } from "@lucky.com/utils";
import {
  TEMPLATE_LIST,
  CREATE_TYPE,
  TYPE_PROJECT,
  TEMP_HOME,
} from "./constants.js";

// 获取创建类型
const getCreateType = () => {
  return makeList({
    choices: CREATE_TYPE,
    message: "请选择初始化类型",
    defaultValue: TYPE_PROJECT,
  });
};

// 获取项目的名称
const getProjectName = async () => {
  return makeInput({
    message: "请输入项目名称",
    defaultValue: "",
    validate: (val) => {
      if (!val) {
        return "项目名称不能为空";
      }
      return true;
    },
  });
};

// 获取模版列表
const getTemplateList = async () => {
  return makeList({
    choices: TEMPLATE_LIST,
    message: "请选择要创建的项目模版",
    defaultValue: TEMPLATE_LIST[0],
  });
};

// 安装缓存目录
const makeTargetPath = () => {
  return path.resolve(`${homedir()}/${TEMP_HOME}`, "cli-template");
};

const createTemplate = async (name, opts) => {
  // 1. 获取创建类型
  const createType = await getCreateType();
  if (createType === TYPE_PROJECT) {
    // 2. 获取项目名称
    const projectName = await getProjectName();
    const template = await getTemplateList();
    // 查找模版列表中对应的模版信息
    const selectedTemplate = TEMPLATE_LIST.find(
      (item) => item.value === template
    );

    const lastVersion = await getLatestVersion(selectedTemplate.npmName);
    selectedTemplate.version = lastVersion; // 最新版本

    const targetPath = makeTargetPath();

    // 返回选中的信息
    return {
      type: createType,
      name: projectName,
      template: selectedTemplate,
      targetPath,
    };
  }
};

export default createTemplate;
