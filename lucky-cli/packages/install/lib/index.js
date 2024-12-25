import Command from "@lucky.com/command";
import {
  log,
  GitHub,
  makeList,
  getGitPlatform,
  Gitee,
  makeInput,
} from "@lucky.com/utils";

const PREV_PAGE = "${prev_page}"; // 上一页
const NEXT_PAGE = "${next_page}"; // 下一页

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
    this.searchKeyword = await makeInput({
      message: "请输入搜索关键字",
      validate: (val) => {
        if (!val) {
          return "请输入搜索关键字";
        }
        return true;
      },
    });
    // 编程语言
    this.language = await makeInput({
      message: "请输入搜索语言",
    });
    this.page = 1; // 当前页码
    this.perPage = 2; // 每页条数

    // log日志
    log.verbose(
      "language",
      this.language,
      "searchKeyword",
      this.searchKeyword,
      "getPlatform",
      this.gitAPI.getPlatform()
    );

    await this.doSearch();
  }

  async doSearch() {
    const platform = this.gitAPI.getPlatform();
    let searchResult;
    let totalCount = 0;
    let projectList = [];

    // 判断走 GITEE 还是 GITHUB
    if (platform === "github") {
      const params = {
        q:
          this.searchKeyword +
          (this.language ? `+language:${this.language}` : ""),
        order: "desc",
        per_page: this.perPage,
        page: this.page,
        sort: "stars",
      };
      log.verbose("githubParams", params);
      searchResult = await this.gitAPI.searchRepositories(params);
      totalCount = searchResult.total_count; // 总条数
      projectList = searchResult.items.map((item) => {
        return {
          name: `项目名称：${item.name} ＋ 描述：${item.description}`,
          value: item.full_name,
        };
      });
    }

    // 判断当前页面是否为最大页数
    if (this.page * this.perPage < totalCount) {
      projectList.push({
        name: "下一页",
        value: NEXT_PAGE,
      });
    }
    if (this.page > 1) {
      projectList.unshift({
        name: "上一页",
        value: PREV_PAGE,
      });
    }

    const keyword = await makeList({
      message: `请选择要下载的项目，(共 ${totalCount} 条数据)`,
      choices: projectList,
    });

    if (keyword === NEXT_PAGE) {
      await this.nextPage();
    } else if (keyword === PREV_PAGE) {
      await this.prevPage();
    } else {
      // 下载项目
    }

    if (platform === "gitee") {
      const params = {
        q: keyword + (language ? `+language:${language}` : ""),
        order: "desc",
        per_page: this.perPage,
        page: this.page,
        sort: "stars_count",
      };
      log.verbose("giteeParams", params);
      searchResult = await this.gitAPI.searchRepositories(params);
      projectList = searchResult.items.map((item) => {
        return {
          name: `项目名称：${item.name} ＋ 描述 ：${item.description}`,
          value: item.full_name,
        };
      });
      totalCount = searchResult.total_count; // 总条数
    }
    log.verbose("totalCount", totalCount);
    console.log(searchResult);
    console.log(projectList, "===projectList==");
  }

  // 下一页
  async nextPage() {
    this.page++;
    await this.doSearch();
  }

  // 上一页
  async prevPage() {
    this.page--;
    await this.doSearch();
  }
}

function Install(instance) {
  return new InstallCommand(instance);
}

export default Install;
