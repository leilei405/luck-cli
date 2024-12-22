import { homedir } from "node:os";
import path from "node:path";
import {
  log,
  makeList,
  makeInput,
  getLatestVersion,
  printErrorLog,
  request,
} from "@lucky.com/utils";

import { CREATE_TYPE, TYPE_PROJECT, TEMP_HOME } from "./constants.js";

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

// 选择所在团队
const getTeam = (team) => {
  return makeList({
    choices: team.map((_) => ({ name: _, value: _ })),
    message: "请选择所在团队",
  });
};

// 获取模版列表
const getTemplateList = async (TEMPLATE_LIST) => {
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

// 通过API的方式获取模版列表
const projectTemplateList = async () => {
  try {
    const data = await request({
      url: "/v1/project",
      method: "get",
    });
    log.verbose("list", data);
    return data;
  } catch (err) {
    printErrorLog(err, "获取模版列表失败");
    return [];
  }
};

const createTemplate = async (name, opts) => {
  const TEMPLATE_LIST = await projectTemplateList();
  if (!TEMPLATE_LIST.length) {
    throw new Error("模版列表为空");
  }

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
      // 获取团队信息
      let teamList = TEMPLATE_LIST.map((item) => item.team);
      teamList = [...new Set(teamList)];
      await getTeam(teamList);
      const addTemplate = await getTemplateList(TEMPLATE_LIST);
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
