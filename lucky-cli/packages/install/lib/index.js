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
const SEARCH_MODE_REPO = "search_repo"; // 搜索仓库
const SEARCH_MODE_CODE = "search_code"; // 搜索用户

class InstallCommand extends Command {
  get command() {
    return "install";
  }

  get description() {
    return "description ";
  }

  get options() {}

  async action() {
    await this.generateGitApi();
    await this.searchGitApi();
    console.log(this.keyword, '===this.keyword===')
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
    log.verbose("当前选择的Git平台", platform);

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

  // 搜索模式 & 关键字 & 编程语言
  async searchGitApi() {
    // 搜索模式
    const platform = this.gitAPI.getPlatform();
    if (platform === "github") {
      this.mode = await makeList({
        message: "请选择搜索模式",
        choices: [
          {
            name: "搜索仓库",
            value: SEARCH_MODE_REPO,
          },
          {
            name: "搜索源码",
            value: SEARCH_MODE_CODE,
          },
        ],
      });
    } else {
      this.mode = SEARCH_MODE_REPO;
    }
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
    this.perPage = 5; // 每页条数

    // log日志
    log.verbose("searchResult", this.language, this.searchKeyword, platform);

    await this.doSearch();
  }

  async doSearch() {
    const platform = this.gitAPI.getPlatform(); // 平台
    let searchResult; // 搜索结果
    let totalCount = 0; // 总条数
    let projectList = []; // 项目列表

    // 判断走 GITEE 还是 GITHUB
    if (platform === "github") {
      // 搜索参数
      const params = {
        q:
          this.searchKeyword +
          (this.language ? `+language:${this.language}` : ""),
        order: "desc",
        per_page: this.perPage,
        page: this.page,
        sort: "stars",
      };
      log.verbose("GitHub查询参数", params);

      // 判断走搜索仓库还是搜索源码
      if (this.mode === SEARCH_MODE_REPO) {
        searchResult = await this.gitAPI.searchRepositories(params);
        projectList = searchResult.items.map((item) => {
          return {
            name: "名称：" + item.name + "描述：" + item.description,
            value: item.full_name,
          };
        });
      } else {
        searchResult = await this.gitAPI.searchCode(params);
        projectList = searchResult.items.map((item) => {
          return {
            name:
              "名称：" +
              item.repository.full_name +
              "  描述：" +
              (item.repository.description
                ? item.repository.description
                : "没有描述信息哦😯"),
            value: item.repository.full_name,
          };
        });
      }
      totalCount = searchResult.total_count;
      log.verbose(`GitHub搜索结果数量统计 ${totalCount} 条`);
    } else {
      const params = {
        q: this.searchKeyword,
        // language: this.language ? `language:${this.language}` : "",
        sort: "stars_count",
        order: "desc",
        per_page: this.perPage,
        page: this.page,
      };
      if (this.language) {
        params.language = this.language;
      }
      log.verbose("gitee查询参数", params);
      searchResult = await this.gitAPI.searchRepositories(params);
      console.log('searchResult', searchResult)
      projectList = searchResult.items.map((item) => {
        return {
          name: `项目名称：${item.name} ＋ 描述 ：${item.description}`,
          value: item.full_name,
        };
      });
      totalCount = searchResult.total_count; // 总条数
      log.verbose(`Gitee搜索结果数量统计 ${totalCount} 条`);
      console.log('searchResult', searchResult)
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

    if (totalCount > 0) {
      const keyword = await makeList({
        message: `请选择要下载的项目，(共 ${totalCount} 条数据)`,
        choices: projectList,
      });

      if (keyword === NEXT_PAGE) {
        await this.nextPage();
      } else if (keyword === PREV_PAGE) {
        await this.prevPage();
      } else {
        this.keyword = keyword;
      }
    }
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

// 导出实例
function Install(instance) {
  return new InstallCommand(instance);
}

export default Install;
