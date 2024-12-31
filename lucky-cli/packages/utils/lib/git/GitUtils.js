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

  log.verbose("用户信息", user);
  log.verbose("组织信息", org);
  const { platform, token } = gitAPI || {};
  if (!platform || !token) {
    log.error("请先初始化Git服务器");
    return;
  }

  // 选择仓库类型
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

  // 个人
  if (gitRegistryType === 'user') {
    if (!user.login) {
      gitLogin = await makeList({
        message: "请选择登录名",
        choices: [
          {
            name: user.login,
            value: user.login,
          },
        ],
      });
    } else {
      gitLogin = user.login;
    }
  }

  // 组织
  if (gitRegistryType === 'org') {
    const orgList = org.map(item => ({
      name: item.name || item.login,
      value: item.login,
    }));

    console.log(orgList)
    gitLogin = await makeList({
      message: '请选择组织',
      choices: orgList,
    });
  }

  if (!gitRegistryType || !gitLogin) {
    throw new Error('未获取到用户或组织信息或者请加入一个组织！亦或者 请使用"lucky-cli commit --clear"清除缓存后重试');
  }

  log.verbose("选择的Git仓库类型", gitRegistryType);
  log.verbose("当前选择的Git登录名", gitLogin);

  gitAPI.saveGitRegistryType(gitRegistryType);
  gitAPI.saveGitLogin(gitLogin);

  return gitLogin;

}

