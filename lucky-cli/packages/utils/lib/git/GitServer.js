import path from "node:path";
import fs from "node:fs";
import { homedir } from "node:os";
import fse from "fs-extra";
import { execa } from 'execa'
import { pathExistsSync } from "path-exists";
import { makePassword } from "../inquirer.js";
import log from "../log.js";

const TEMP_HOME = ".lucky-cli"; // 临时目录
const TEMP_TOKEN = ".token_ssh"; // token路径
const TEMP_PLATFORM = ".git_platform"; // 平台路径
const TEMP_GIT_REGISTRY_TYPE = ".git_registry_type"; // 仓库类型
const TEMP_GIT_LOGIN = ".git_login"; // 登录名

// 获取token路径
function createTokenPath() {
  return path.resolve(homedir(), TEMP_HOME, TEMP_TOKEN);
}

// 创建平台路径
function createPlatformPath() {
  return path.resolve(homedir(), TEMP_HOME, TEMP_PLATFORM);
}

// 获取平台
function getGitPlatform() {
  if (pathExistsSync(createPlatformPath())) {
    return fs.readFileSync(createPlatformPath()).toString();
  }
  return null;
}

// 获取项目路径
function getProjectPath(cwd, fullName) {
  const projectName = fullName.split('/')[1]; // reactjs/react => react
  return path.resolve(cwd, projectName);

}

// 获取package.json
function getPackageJson (cwd, fullName) {
  const projectPath = getProjectPath(cwd, fullName);
  const pkgPath = path.resolve(projectPath, 'package.json')
  if (pathExistsSync(pkgPath)) {
    return fse.readJsonSync(pkgPath)
  }
  return null
}

// 清除缓存
function clearCache() {
  const platform = createPlatformPath();
  const token =createTokenPath();
  const gitRegistryType = createGitRegistryPath();
  const gitLogin = createGitLoginPath();
  fse.removeSync(platform);
  fse.removeSync(token);
  fse.removeSync(gitRegistryType);
  fse.removeSync(gitLogin);
}

// 创建仓库类型路径
function createGitRegistryPath() {
  return path.resolve(homedir(), TEMP_HOME, TEMP_GIT_REGISTRY_TYPE);
}

// 获取仓库类型
function getGitRegistryType () {
  if (pathExistsSync(createGitRegistryPath())) {
    return fs.readFileSync(createGitRegistryPath()).toString();
  }
  return null;
}

// 创建登录名路径
function createGitLoginPath() {
  return path.resolve(homedir(), TEMP_HOME, TEMP_GIT_LOGIN);
}

// 获取登录名
function getGitLogin () {
  if (pathExistsSync(createGitLoginPath())) {
    return fs.readFileSync(createGitLoginPath()).toString();
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

  // 保存仓库类型
  saveGitRegistryType(registryType) {
    this.registryType = registryType;
    fs.writeFileSync(createGitRegistryPath(), registryType);
  }

  // 获取仓库类型
  getGitRegistryType () {
    return this.registryType;
  }

  // 保存登录名
  saveGitLogin(login) {
    this.login = login;
    fs.writeFileSync(createGitLoginPath(), login);
  }

  // 获取登录名
  getGitLogin () {
    return this.login;
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

  // 克隆仓库
  cloneRepo(fullName, tag) {
    if (tag) {
      return execa('git', ['clone', this.getRepoUrl(fullName), '-b', tag])
    } else {
      return execa('git', ['clone', this.getRepoUrl(fullName), '-b'])
    }
  }

  // 安装依赖
  installDependencies (cwd, fullName) {
    const projectPath = getProjectPath(cwd, fullName)
    if (pathExistsSync(projectPath)) {
      return execa('npm', ['install', '--registry=https://registry.npmmirror.com'], { cwd: projectPath })
    }
    return null
  }

  // 启动项目
  async runRepo(cwd, fullName) {
    const projectPath = getProjectPath(cwd, fullName)
    const pkg = getPackageJson(cwd, fullName);
    if (pkg) {
      const { script, bin, name } = pkg
      if (bin && bin.start) {
         await execa(
            'npm',
            ['install', '-g', name, '--registry=https://registry.npmmirror.com'],
            { cwd: projectPath, stdout: 'inherit' }
        )
      }
      if (script && script.dev) {
        // stdout: 'inherit' 继承当前控制台的输出流
        return execa('npm', ['run', 'dev'], { cwd: projectPath, stdout: 'inherit' })
      } else if (script && script.start) {
        return execa('npm', ['start'], { cwd: projectPath, stdout: 'inherit' })
      } else {
        log.warn('未找到启动命令')
      }
    }
  }

  getUser () {
    throw new Error('getUser must be implemented');
  }

  getOrg () {
    throw new Error('getOrg must be implemented');
  }

  // 创建仓库
  createRepo () {
    console.log('createRepo must be implemented')
  }

}



export { GitServer, getGitPlatform, clearCache, getGitRegistryType, getGitLogin  };
