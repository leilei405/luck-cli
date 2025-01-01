import path from 'node:path';
import fse from 'fs-extra';
import fs from 'fs';
import SimpleGit from 'simple-git';
import semver, { inc } from 'semver';
import Command from "@lucky.com/command";
import {
  log,
  initGitServer,
  initGitUserType,
  clearCache,
  createRemoteRepo,
  makeInput,
  makeList
} from "@lucky.com/utils";

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
        ['-p, --publish', '发布', false],
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
    const dir = process.cwd();
    // 读取当前项目下package.json 的name做为仓库名称
    const pkg = fse.readJsonSync(path.resolve(dir, PACKAGE_JSON));
    // 仓库名称 因为要生成远程仓库的名称，所以需要读取package.json的name
    this.name = pkg.name;
    // 仓库版本号
    this.version = pkg.version || '1.0.0';
    await createRemoteRepo(this.gitAPI, this.name);

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
      log.success('正在进行Git Remote初始化');
      await this.git.addRemote('origin', remoteRepoUrl);
      log.success('添加Git Remote', remoteRepoUrl);
      await this.checkCommitCode(); // 检查是否有未提交的代码

      // 2-6. 检查是否存在远程 master 分支
      const tags = await this.git.listRemote(['--refs']);
      log.verbose('远程分支', tags);
      if (tags.includes('refs/heads/master')) {
        // 2-6-1. 拉取远程分支的代码 实现代码同步
        await this.pullRemoteRepo('master', { '--allow-unrelated-histories': null });
      } else {
        await this.pushRemoteRepo('master');
      }
    }
  }

  // 推送到远程 master 分支
  async pushRemoteRepo (branchName) {
    log.info(`推送代码到远程 ${branchName} 分支`);
    await this.git.push('origin', branchName);
    log.success(`推送代码成功`);
  }

  // 未提交代码提交
  async checkCommitCode () {
    const status = await this.git.status();
    if (
        status.not_added.length > 0 ||
        status.modified.length > 0 ||
        status.created.length > 0 ||
        status.deleted.length > 0 ||
        status.renamed.length > 0
      )
    {
      log.verbose('当前有未提交的代码', JSON.stringify(status));
      await this.git.add(status.not_added);
      await this.git.add(status.modified);
      await this.git.add(status.created);
      await this.git.add(status.deleted);
      await this.git.add(status.renamed);
      let message = '';
      while (!message) {
        message = await makeInput({
          message: '请输入 Commit 信息',
        });
      }
      await this.git.commit(message);
      log.success('本地代码提交成功');
    }
  }

  /**
   *  @description 3. 代码自动化提交
   *
   */
  async commit () {
    // 3-1. 自动生成版本号
    await this.getCorrectVersion();
    // 3-2. 检查是否有未提交的代码
    await this.checkGitStash();
    // 3-3. 代码冲突检查
    await this.checkGitConflict();
    // 3-4. 自动提交未提交代码提交
    await this.checkCommitCode();
    // 3-5. 切换分支
    await this.checkoutGitBranch(this.branch);
    // 3-6. 合并 & 推送代码到远程分支
    await this.pullRemoteMasterAndBranch();
    // 3-7. 推送代码到远程分支
    await this.pushRemoteRepo(this.branch);
  }

  async pullRemoteMasterAndBranch () {
    log.info(`合并【master】--->>>> ${this.branch} 分支`);
    await this.pullRemoteRepo('master');
    log.success('合并【master】分支成功');
    log.info('检查远程分支');
    const remoteBranchList = await this.getRemoteBranchList();
    if (remoteBranchList.indexOf(this.version) >= 0) {
      log.info(`合并 [${this.branch}] -> [${this.branch}]`);
      await this.pullRemoteRepo(this.branch);
      log.success(`合并远程 [${this.branch}] 分支成功`);
      await this.checkGitConflict();
    } else {
      log.success(`不存在远程分支 [${this.branch}]`);
    }
  }

  // 同步远程分支代码
  async pullRemoteRepo (branchName = 'master', options = {}) {
    log.info(`同步远程 ${branchName} 分支代码`);
    try {
      await this.git.pull('origin', branchName, options)
      log.success('拉取远程分支的代码成功', branchName);
    } catch (err) {
      log.error('git pull origin ' + branchName, err.message);
      if (err.message.indexOf('Couldn\'t find remote ref master') >= 0) {
        log.warn('获取远程[master]分支失败');
      }
      process.exit(0);
    }
  }

  // 切换分支
  async checkoutGitBranch (branchName) {
    const branchList = await this.git.branchLocal();
    log.info('本地分支列表', JSON.stringify(branchList.all))
    if (branchList.all.includes(branchName)) {
      await this.git.checkout(branchName);
      log.success('切换分支成功');
    } else {
      await this.git.checkoutLocalBranch(branchName);
      log.success('创建分支成功');
    }
    log.success(`本地分支切换成功${branchName}`);
  }

  // 代码冲突检查
  async checkGitConflict (branchName) {
    log.info('代码冲突检查');
    const status = await this.git.status();
    if (status.conflicted.length >  0) {
      log.warn('代码冲突, 请先手动去解决冲突');
      return;
    }
    log.success('代码冲突检查成功');
  }

  // 检查git stash 缓存区记录
  async checkGitStash () {
    const stashList = await this.git.stashList();
    if (stashList && stashList.all.length > 0) {
      log.info('当前有Git stash缓存区记录');
      await this.git.stash(['pop']);
      log.success('Git stash 缓存区记录恢复成功');
    }
  }

  // 获取正确的 版本号
  async getCorrectVersion ()  {
    log.info('获取代码分支信息');
    const remoteBranchList = await this.getRemoteBranchList('release');
    log.info('远程分支列表', JSON.stringify(remoteBranchList));
    let releaseVersion;
    if (remoteBranchList && remoteBranchList.length > 0) {
      releaseVersion = remoteBranchList[0];
    }
    const devVersion = this.version;
    if (!releaseVersion) {
      this.branch = `dev/${devVersion}`
    } else if (semver.gte(devVersion, releaseVersion))  {
      log.info('当前本地版本大于线上远程版本', `${devVersion} >= ${releaseVersion}`);
      this.branch = `dev/${devVersion}`
    } else {
      log.info('当前线上版本大于本地版本', `${releaseVersion} >= ${devVersion}`);
      const incType = await makeList({
        message: '请选择版本号升级类型',
        defaultValue: 'patch',
         //   x 大版本号 y 小版本号  z 补丁号  ==>>>  1.0.0  1.1.0  1.0.1
         //   major       minor    patch   ==>>>  1.0.0  1.1.0  1.0.1
         choices: [
           {
             name: `补丁版本号 (${releaseVersion} --> ${semver.inc(releaseVersion, 'patch')})`,
             value: 'patch',
           },
           {
             name: `小版本号 (${releaseVersion} --> ${semver.inc(releaseVersion, 'minor')})`,
             value: 'minor',
           },
           {
             name: `大版本号 (${releaseVersion} --> ${semver.inc(releaseVersion, 'major')})`,
             value: 'major',
           },
        ],
      });

      const incVersion = semver.inc(releaseVersion, incType);
      this.branch = `dev/${incVersion}`;
      this.version = incVersion;
      this.syncVersionToPackageJson();

    }
    log.success('获取代码分支版本号成功', this.branch);
  }

  // 将版本信息同步版本号到package.json
  syncVersionToPackageJson () {
    const dir = process.cwd();
    const pkgPath = path.resolve(dir, PACKAGE_JSON);
    const pkg = fse.readJsonSync(pkgPath);
    if (pkg && pkg.version !== this.version) {
      log.warn('package.json 中的版本号和当前版本号不一致, 开始同步');
      pkg.version = this.version;
      fse.writeJsonSync(pkgPath, pkg, { spaces: 2 });
      log.success('同步成功');
    }
   }

  // 获取远程分支列表
  async getRemoteBranchList (branchName) {
    const remoteList = await this.git.listRemote(['--refs']);
    let reg;
    if (branchName === 'release') {
      // release/0.0.1
      reg = /.+?refs\/tags\/release\/(\d+\.\d+\.\d+)/g;
    } else {
      // dev/0.0.1
      reg = /.+?refs\/tags\/dev\/(\d+\.\d+\.\d+)/g;
    }

    return remoteList.split('\n').map((item) => {
      const match = reg.exec(item);
      reg.lastIndex = 0; // 重置正则表达式的 lastIndex 属性
      if (match && semver.valid(match[1])) {
        return match[1];
      }

    }).filter((item) => item)  // 过滤掉undefined
    .sort((a, b) => { // tag版本号降序排序
      if (semver.lte(b, a)) {
        if (a === b) return 0;
        return -1;
      }
      return 1;
    })
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
