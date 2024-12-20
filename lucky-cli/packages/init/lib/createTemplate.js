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
  const { type = null, template = "" } = opts;
  let createType; // 项目类型
  let projectName; // 项目名称
  let selectedTemplate; // 选择的项目模版

  // 1. 获取创建类型
  if (type) {
    createType = type;
  } else {
    createType = await getCreateType();
  }
  log.verbose("创建的项目类型", createType);

  // 2. 获取项目名称
  if (createType === TYPE_PROJECT) {
    if (name) {
      projectName = name;
    } else {
      projectName = await getProjectName();
    }

    // 3. 获取模版列表 选中的模版信息
    if (template) {
      selectedTemplate = TEMPLATE_LIST.find((it) => it.value === template);
      if (!selectedTemplate) {
        log.error("项目模版不存在", template);
      }
      log.verbose("我选择的项目模版", selectedTemplate);
    } else {
      const addTemplate = await getTemplateList();
      selectedTemplate = TEMPLATE_LIST.find(
        (item) => item.value === addTemplate
      );
    }

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
  } else {
    throw new Error(`暂未支持 ${createType} 类型的项目创建`);
  }
};

export default createTemplate;
