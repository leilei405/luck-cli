import { makeList } from '../inquirer.js';
import log from '../log.js';
import GitHub from './GitHub.js';
import Gitee from './Gitee.js';
import { getGitPlatform } from './GitServer.js';

// 初始化git服务器
export async function initGitServer () {
  let platform = getGitPlatform();
  if (!platform) {
    platform = await makeList({
      message: "请选择仓库平台",
      choices: [
        {
          name: "Github",
          value: "github",
        },
        {
          name: "Gitee",
          value: "gitee",
        },
      ],
    });
  }
  log.verbose("当前选择的Git平台", platform);

  let gitAPI;
  if (platform === "github") {
    gitAPI = new GitHub();
  } else {
    gitAPI = new Gitee();
  }

  gitAPI.savePlatform(platform);
  await gitAPI.init();
  return gitAPI;
}


// 初始化git用户 两种类型 1. 个人 2. 组织
export  async function initGitUserType (gitAPI) {
  const user = await gitAPI.getUser();
  const org = await gitAPI.getOrg();
  log.verbose('user', user)
  log.verbose('org', org)

  // const { platform, token } = gitAPI || {};
  // if (!platform || !token) {
  //   log.error("请先初始化Git服务器");
  //   return;
  // }

  // const userType = await makeList({
  //   message: "请选择用户类型",
  //   choices: [
  //     {
  //       name: "个人",
  //       value: "personal",
  //     },
  //     {
  //       name: "组织",
  //       value: "organization",
  //     },
  //   ],
  // });
}

