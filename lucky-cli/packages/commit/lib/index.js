import path from 'node:path';
import fs from 'node:fs'
import { homedir } from 'node:os'
import Command from "@lucky.com/command";
import { log, getGitPlatform, initGitServer } from "@lucky.com/utils";

const CACHE_DIR = '.lucky-cli';
const FILE_GIT_PLATFORM = '.git_platform';

class CommitCommand extends Command {
  get command() {
    return "commit";
  }

  get description() {
    return "commit description ";
  }

  get options() {}

  async action() {
    await this.createRemoteRepo();
  }

  /**
   *  @description 1. 创建远程仓库
   *
   */
  async createRemoteRepo () {
    this.git = await initGitServer()

    console.log(this.git.platform, 'git')
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
  async commit () {

  }


  /**
   *  @description 4. 代码发布
   *
   */
  async publish () {

  }
}

function Commit(instance) {
  return new CommitCommand(instance);
}

export default Commit;
