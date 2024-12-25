import path from "node:path";
import fs from "node:fs";
import { homedir } from "node:os";
import fse from "fs-extra";
import { pathExistsSync } from "path-exists";

import log from "../log.js";
import { makePassword } from "../inquirer.js";

const TEMP_HOME = ".lucky-cli";
const TEMP_TOKEN = ".token_ssh";
const TEMP_PLATFORM = ".git_platform";

// 获取token路径
function createTokenPath() {
  return path.resolve(homedir(), TEMP_HOME, TEMP_TOKEN);
}

// 获取平台路径
function createPlatformPath() {
  return path.resolve(homedir(), TEMP_HOME, TEMP_PLATFORM);
}

function getGitPlatform() {
  if (pathExistsSync(createPlatformPath())) {
    return fs.readFileSync(createPlatformPath()).toString();
  }
  return null;
}

// 抽象git服务器
class GitServer {
  constructor() {}

  // 初始化
  async init() {
    const tokenPath = createTokenPath();
    if (pathExistsSync(tokenPath)) {
      this.token = fse.readFileSync(tokenPath).toString();
    } else {
      this.token = await this.getToken();
      fs.writeFileSync(tokenPath, this.token);
    }

    log.verbose("token", this.token);
    log.verbose("tokenPath", tokenPath, "==", pathExistsSync(tokenPath));
  }

  // 保存平台
  savePlatform(platform) {
    this.platform = platform;
    fs.writeFileSync(createPlatformPath(), platform);
  }

  // 获取平台
  getPlatform() {
    return this.platform;
  }

  // 获取token
  getToken() {
    return makePassword({
      message: "请输入token",
    });
  }
}

export { GitServer, getGitPlatform };
