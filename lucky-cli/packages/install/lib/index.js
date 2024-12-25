import Command from "@lucky.com/command";
import {
  log,
  GitHub,
  makeList,
  getGitPlatform,
  Gitee,
  makeInput,
} from "@lucky.com/utils";
class InstallCommand extends Command {
  get command() {
    return "install";
  }

  get description() {
    return "description ";
  }

  get options() {}

  async action(params) {
    await this.generateGitApi();
    await this.searchGitApi();
  }

  async generateGitApi() {
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
    log.verbose("platform", platform);

    let gitAPI;
    if (platform === "github") {
      gitAPI = new GitHub();
    } else {
      gitAPI = new Gitee();
    }
    gitAPI.savePlatform(platform);
    await gitAPI.init();
    this.gitAPI = gitAPI;
  }

  async searchGitApi() {
    // 关键字
    const keyword = await makeInput({
      message: "请输入搜索关键字",
      validate: (val) => {
        if (!val) {
          return "请输入搜索关键字";
        }
        return true;
      },
    });

    // 编程语言
    const language = await makeInput({
      message: "请输入搜索语言",
    });

    log.verbose(language, "language", keyword, "keyword");
    log.verbose(this.gitAPI.getPlatform(), "getPlatform");

    const platform = this.gitAPI.getPlatform();
    let searchResult;
    this.page = 1;

    // 判断走 GITEE 还是 GITHUB
    if (platform === "github") {
      const params = {
        q: keyword + (language ? `+language:${language}` : ""),
        order: "desc",
        per_page: 2,
        page: 1,
        sort: "count",
      };
      console.log(params, "githubParams");
      searchResult = await this.gitAPI.searchRepositories(params);
    }

    if (platform === "gitee") {
      const params = {
        q: keyword + (language ? `+language:${language}` : ""),
        order: "desc",
        per_page: 5,
        page: 1,
        sort: "stars_count",
      };
      console.log(params, "giteeParams");
      searchResult = await this.gitAPI.searchRepositories(params);
    }

    console.log(searchResult);
  }
}

function Install(instance) {
  return new InstallCommand(instance);
}

export default Install;
