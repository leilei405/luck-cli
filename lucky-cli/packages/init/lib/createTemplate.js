import { log, makeList } from "@lucky.com/utils";
import { TEMPLATE_LIST, CREATE_TYPE, TYPE_PROJECT } from "./constants.js";

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
  return makeList({
    message: "请输入项目名称",
    defaultValue: "lucky-cli",
  });
};

const createTemplate = async (name, opts) => {
  // 1. 获取创建类型
  const createType = await getCreateType();
  if (createType === TYPE_PROJECT) {
    // 2. 获取项目名称
    const projectName = await getProjectName();
  }
};

export default createTemplate;
