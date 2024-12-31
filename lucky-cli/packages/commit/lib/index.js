import path from 'node:path';
import fse from 'fs-extra';
import fs from 'fs';
import SimpleGit from 'simple-git';
import Command from "@lucky.com/command";
import { log, initGitServer, initGitUserType, clearCache, createRemoteRepo } from "@lucky.com/utils";

const CACHE_DIR = '.lucky-cli';
const FILE_GIT_PLATFORM = '.git_platform';
const PACKAGE_JSON = 'package.json';
const FILE_GITIGNORE = '.gitignore';

class CommitCommand extends Command {
  get command() {
    return "commit";
  }

  get description() {
    return "commit description ";
  }

  get options() {
    return [
        ['-c, --clear', '清空缓存', false],
    ];
  }

  async action([{ clear }]) {
    // clear 清除缓存
    if (clear) {
      clearCache()
    }
    // 1. 创建远程仓库
    await this.createRemoteRepo();
    // 2. Git本地初始化
    await this.initLocal();
    // 3. 代码自动化提交
    await this.commit();
    // 4. 代码发布
    await this.publish();
  }

  /**
   *  @description 1. 创建远程仓库
   *
   */
  async createRemoteRepo () {
    // 1-1. 实例化git对象
    this.gitAPI = await initGitServer();

    // 1-2. 仓库类型的选择
    await initGitUserType(this.gitAPI);

    // 1-3. 创建远程仓库
    // 获取项目名称
    const dir = process.cwd()
    // 读取当前项目下package.json 的name做为仓库名称
    const pkg = fse.readJsonSync(path.resolve(dir, PACKAGE_JSON))
    this.name = pkg.name; // 仓库名称 因为要生成远程仓库的名称，所以需要读取package.json的name
    await createRemoteRepo(this.gitAPI, this.name)

    // 1-4. 生成.gitignore
    const fileGitignorePath = path.resolve(dir, FILE_GITIGNORE);
    if (!fs.existsSync(fileGitignorePath)) {
      log.info('.gitignore不存在，开始创建');
      fs.writeFileSync(fileGitignorePath, `.DS_Store
node_modules
/dist

# local env files
.env.local
.env.*.local

# Log files
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Editor directories and files
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?`);
      log.success('.gitignore创建成功');
    }
  }


  /**
   *  @description 2. Git本地初始化
   *
   */
  async initLocal () {
    log.verbose('开始 Git 本地初始化....')
    // 2-1. 生成 gitRemote 地址
    const remoteRepoUrl = this.gitAPI.getRepoUrl(`${this.gitAPI.login}/${this.name}`)

    // 2-2. 初始化 git 对象
    this.git = SimpleGit(process.cwd());
    // 2-2.1 判断当前项目是否进行 Git 初始化
    const gitDir = path.resolve(process.cwd(), '.git');

    // 2-3. 不存在 .git 则进行本地初始化
    if (!fs.existsSync(gitDir)) {
      this.git.init();
      log.success('完成 Git 本地初始化');
    }

    // 2-4. 获取所有的 remote
    const remotes = await this.git.getRemotes();

    // 2-5. 判断是否已经有 remote
    if (!remotes.find((item) => item.name === 'origin')) {
      log.success('正在进行 remote 初始化');
      await this.git.addRemote('origin', remoteRepoUrl);
      log.success('添加 Git Remote', remoteRepoUrl);
    }

    // 2-6. 获取当前未提交的文件
    const status = await this.git.status();

    // 2-7. 拉取远程分支的代码 实现代码同步
    try {
      await this.git.pull('origin', 'master')
      log.success('拉取远程分支的代码成功');
    } catch (err) {
      log.warn('拉取远程分支的代码失败', err);
    }


  }


  /**
   *  @description 3. 代码自动化提交
   *
   */
  async commit () {
    console.log('代码自动化提交')
  }


  /**
   *  @description 4. 代码发布
   *
   */
  async publish () {
    console.log('代码发布')
  }

}

function Commit(instance) {
  return new CommitCommand(instance);
}

export default Commit;
