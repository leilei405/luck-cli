import path from "node:path";
import fs from "node:fs";
import { homedir } from "node:os";
import fse from "fs-extra";
import { execa } from 'execa'
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
    const platformPath = createPlatformPath();
    const dir = path.dirname(platformPath);
    if (!pathExistsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(platformPath, platform);
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

  // 获取仓库地址
  getRepoUrl(fullName) {
    const platform =this.getPlatform()
    return `https://${platform}.com/${fullName}.git`
  }

  cloneRepo(fullName, tag) {
    if (tag) {
      return execa('git', ['clone', this.getRepoUrl(fullName), '-b', tag])
    } else {
      return execa('git', ['clone', this.getRepoUrl(fullName), '-b'])
    }
  }
}

export { GitServer, getGitPlatform };
