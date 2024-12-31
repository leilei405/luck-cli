import { makeList } from '../inquirer.js';
import log from '../log.js';
import GitHub from './GitHub.js';
import Gitee from './Gitee.js';
import { getGitPlatform, getGitRegistryType, getGitLogin } from './GitServer.js';

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


// 初始化git用户信息
export  async function initGitUserType (gitAPI) {
  let gitRegistryType = getGitRegistryType(); // 仓库类型
  let gitLogin = getGitLogin(); // 登录名
  const user = await gitAPI.getUser(); // 获取用户信息
  const org = await gitAPI.getOrg(); // 获取组织信息
  // log.verbose("用户信息", user);
  // log.verbose("组织信息", org);

  // 1. 判断是否已经初始化Git服务器
  const { platform, token } = gitAPI || {};
  if (!platform || !token) {
    log.error("请先初始化Git服务器");
    return;
  }

  // 2. 判断是否已经选择仓库类型和登录名
  if (!gitRegistryType && !gitLogin) {
    // 请选择仓库类型
    if (!gitRegistryType) {
      gitRegistryType = await makeList({
        message: "请选择仓库类型",
        choices: [
          {
            name: "User",
            value: "user",
          },
          {
            name: "Organization",
            value: "org",
          },
        ],
      });
    }

    // 选择个人仓库或组织
    if (gitRegistryType === 'user') {
      gitLogin = user?.login;
    } else {
      const orgList = org.map(item => ({
        name: item.name || item.login,
        value: item.login,
      }));

      gitLogin = await makeList({
        message: '请选择组织',
        choices: orgList,
      });
    }
  }

  log.verbose("当前选择的Git登录名", gitLogin);
  log.verbose("选择的Git仓库类型", gitRegistryType);

  // 3. 判断是否获取到用户或组织信息
  if (!gitRegistryType || !gitLogin) {
    throw new Error('未获取到用户或组织信息或者请加入一个组织！亦或者 请使用"lucky-cli commit --clear"清除缓存后重试');
  }

  gitAPI.saveGitRegistryType(gitRegistryType);
  gitAPI.saveGitLogin(gitLogin);
  return gitLogin;

}


// 创建远程仓库
export async function createRemoteRepo (gitAPI, registryName) {
  await gitAPI.createRepo(registryName)
}