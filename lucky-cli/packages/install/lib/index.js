import ora from 'ora'
import Command from "@lucky.com/command";
import {
  log,
  GitHub,
  makeList,
  getGitPlatform,
  Gitee,
  makeInput, printErrorLog,

} from "@lucky.com/utils";

const PREV_PAGE = "prev_page"; // 上一页
const NEXT_PAGE = "next_page"; // 下一页
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
    await this.selectProjectTags();
    await this.downLoadRepo();
    log.verbose('keyword', this.keyword)
    log.verbose('selectTag', this.selectedTag)
    await this.installDependencies();
    // await this.runRepo();
  }

  // 下载指定版本
  async downLoadRepo () {
    const spinner = ora(`正在下载  ${this.keyword} 版本：${this.selectedTag} .....`).start()
    try {
      await this.gitAPI.cloneRepo(this.keyword, this.selectedTag)
      spinner.stop();
      log.success(`下载成功${this.keyword} 版本：${this.selectedTag}`);
    } catch (err) {
      spinner.stop();
      printErrorLog(err)
    }
  }

  // 安装依赖
  async installDependencies () {
    const spinner = ora(`正在安装依赖 ${this.keyword} 版本：${this.selectedTag} .....`).start();
    try {
      await this.gitAPI.installDependencies(process.cwd(), this.keyword, this.selectedTag)
      spinner.stop();
      log.success(`安装成功 ${this.keyword} 版本：${this.selectedTag}`);
    } catch (err) {
      spinner.stop();
      log.error(`安装失败 ${this.keyword} 版本：${this.selectedTag}`);
      printErrorLog(err)
    }
  }

  // 启动项目
  async runRepo ( ) {
    await this.gitAPI.runRepo(process.cwd(), this.keyword);
  }

  // 生成GitApi
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
    this.perPage = 10; // 每页条数

    // log日志
    log.verbose("searchResult", this.language, this.searchKeyword, platform);

    await this.doSearch();
  }

  // 选择项目的tags
  async selectProjectTags() {
    this.tagPage = 1;
    this.tagPerPage = 20;
    await this.doSelectTags()
  }

  // 选择tags
  async doSelectTags () {
    const platform = this.gitAPI.getPlatform();
    let tagsListChoices = [];
    // 判断走github还是gitee分支
    if (platform === 'github') {
      const tagsParams ={
        page: this.tagPage,
        per_page: this.tagPerPage,
      }

      const tagList = await this.gitAPI.getTags(this.keyword, tagsParams);
      tagsListChoices = tagList.map((item) => ({
        name: item.name,
        value: item.name,
      }));

      // 插入上一页下一页
      if (tagList.length > 0) {
        tagsListChoices.push({
          name: '下一页',
          value: NEXT_PAGE
        })
      }

      if (this.tagPage > 1) {
        tagsListChoices.unshift({
          name: '上一页',
          value: PREV_PAGE
        })
      }
    } else {
      const tagList = await this.gitAPI.getTags(this.keyword);
      tagsListChoices = tagList.map((item) => ({
        name: item.name,
        value: item.name,
      }));
      // 插入上一页下一页
      if (tagList.length > 0) {
        tagsListChoices.push({
          name: '下一页',
          value: NEXT_PAGE
        })
      }
      if (this.tagPage > 1) {
        tagsListChoices.unshift({
          name: '上一页',
          value: PREV_PAGE
        })
      }
    }

    // 选中的tags
    const selectedTag = await makeList({
      message: "请选择要下载的版本",
      choices: tagsListChoices
    });

    if (selectedTag === NEXT_PAGE) {
      await this.nextTags();
    } else if (selectedTag === PREV_PAGE) {
      await this.prevTags();
    } else {
      this.selectedTag = selectedTag
    }
  }

  // 搜索仓库 源码
  async doSearch() {
    const platform = this.gitAPI.getPlatform();
    let searchResult;
    let totalCount = 0;
    let projectList = [];

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
        // sort: "stars",
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
        language: this.language ? `language:${this.language}` : "",
        // sort: "stars_count",
        order: "desc",
        per_page: this.perPage,
        page: this.page,
      };
      if (this.language) {
        params.language = this.language;
      } else {
        delete params.language
      }
      log.verbose("gitee查询参数", params);
      searchResult = await this.gitAPI.searchRepositories(params);
      console.log('searchResult', searchResult)
      projectList = searchResult.map((item) => {
        return {
          name: `项目名称：${item.name} ＋ 描述 ：${item.description}`,
          value: item.full_name,
        };
      });
      totalCount = 9999; // 总条数
      log.verbose(`Gitee搜索结果数量统计 ${totalCount} 条`);
      console.log('searchResult', searchResult)
    }

    // 判断当前页面是否为最大页数
    if (platform === 'github' && this.page * this.perPage < totalCount || projectList.length > 0) {
      projectList.push({
        name: "下一页",
        value: NEXT_PAGE,
      });
    }

    // 判断当前页面是否为第一页
    if (this.page > 1) {
      projectList.unshift({
        name: "上一页",
        value: PREV_PAGE,
      });
    }



    // 选择项目
    if (totalCount > 0) {
      const keyword = await makeList({
        message: platform === 'github' ? `请选择要下载的项目，(共 ${totalCount} 条数据)` : '请选择要下载的项目',
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

  // github gitee 下一页
  async nextPage() {
    this.page++;
    await this.doSearch();
  }

  // github gitee 上一页
  async prevPage() {
    this.page--;
    await this.doSearch();
  }

  // tags下一页
  async nextTags () {
    this.tagPage++;
    await this.doSelectTags();
  }

  // tags上一页
  async prevTags () {
    this.tagPage--;
    await this.doSelectTags();
  }
}

// 导出实例
function Install(instance) {
  return new InstallCommand(instance);
}

export default Install;
