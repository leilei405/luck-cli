import axios from "axios";
import ora from "ora";
import { GitServer } from "./gitServer.js";
import log from "../log.js";

const BASE_URL = "https://gitee.com/api/v5";

// gitee 服务器
class Gitee extends GitServer {
  constructor() {
    super();
    this.service = axios.create({
      baseURL: BASE_URL,
      timeout: 5000,
    });

    // 添加响应拦截器
    this.service.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  get(url, params, headers) {
    return this.service({
      url,
      params: {
        ...params,
        access_token: this.token,
      },
      method: "get",
      headers,
    });
  }

  post(url, data, headers) {
    return this.service({
      url,
      data,
      params: {
        access_token: this.token,
      },
      method: "post",
      headers,
    });
  }

  // 搜索仓库
  searchRepositories(params) {
    return this.get("/search/repositories", params);
  }

  // 搜索源码
  searchCode(params) {
    return this.get("/search/code", params);
  }

  // 获取仓库的tags
  getTags(fullName) {
    return this.get("/repos/" + fullName + "/tags");
  }

  // 获取用户授权信息
  getUser() {
    return this.get("/user");
  }

  // 获取组织信息
  getOrg() {
    return this.get("/user/orgs")
  }

  // 获取gitee某个仓库信息
  getRepo(owner, repo) {
    return this.get(`/repos/${owner}/${repo}`).catch((err) => {
      if (err.response.status === 404) {
        return null;
      }
      throw err;
    });
  }

  // 创建仓库
  async createRepo(name) {
    // 创建前检查仓库是否存在 存在的话直接跳过创建
    const repoInfo = await this.getRepo(this.login, name)
    // 仓库存在直接返回仓库信息
    if (repoInfo) {
      log.info('仓库已存在, 不需要进行创建')
      return repoInfo;
    }

    // 否则直接创建仓库
    const spinner = ora('正在创建仓库...').start();
    if (this.registryType === 'user') {
      this.post("/user/repos", { name });
      spinner.succeed('创建个人仓库完成');
      spinner.stop();
      return;
    }

    if (this.registryType === 'org') {
      this.post(`/orgs/${this.login}/repos`, { name });
      spinner.succeed('创建组织仓库完成');
      spinner.stop();
    }
  }

}

export default Gitee;
