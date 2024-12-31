import path from 'node:path'
import fse from 'fs-extra'
import Command from "@lucky.com/command";
import { log, initGitServer, initGitUserType, clearCache, createRemoteRepo } from "@lucky.com/utils";

const CACHE_DIR = '.lucky-cli';
const FILE_GIT_PLATFORM = '.git_platform';

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
    await this.createRemoteRepo();
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
    const pkg = fse.readJsonSync(path.resolve(dir, 'package.json'))
    await createRemoteRepo(this.gitAPI, pkg.name)
  }


  /**
   *  @description 2. Git本地初始化
   *
   */
  async initLocal () {}


  /**
   *  @description 3. 代码自动化提交
   *
   */
  async commit () {}


  /**
   *  @description 4. 代码发布
   *
   */
  async publish () {}


}

function Commit(instance) {
  return new CommitCommand(instance);
}

export default Commit;
