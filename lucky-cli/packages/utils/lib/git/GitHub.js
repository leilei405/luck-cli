import axios from "axios";
import ora from "ora";
import { GitServer } from "./gitServer.js";
import log from "../log.js";

const BASE_URL = "https://api.github.com";

// github 服务器
class GitHub extends GitServer {
  constructor() {
    super();
    this.service = axios.create({
      baseURL: BASE_URL,
      timeout: 3000,
    });
    // 添加请求拦截器
    this.service.interceptors.request.use(
      (config) => {
        config.headers["Authorization"] = `Bearer ${this.token}`;
        config.headers["Accept"] = "application/vnd.github+json";
        return config;
      },
      (err) => {
        return Promise.reject(err);
      }
    );

    // 添加响应拦截器
    this.service.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (err) => {
        return Promise.reject(err);
      }
    );
  }

  get(url, params, headers) {
    return this.service({ url, params, method: "get", headers });
  }

  post(url, data, headers) {
    return this.service({
      url,
      data,
      params: {
        access_token: this.token,
      },
      method: "post",
      headers
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
  getTags(fullName, params) {
    return this.get("/repos/" + fullName + "/tags", params);
  }

  // 获取用户授权信息
  getUser() {
    return this.get("/user");
  }

  // 获取github某个仓库信息
  getRepo(owner, repo) {
    return this.get(
    `/repos/${owner}/${repo}`,
    {
        accept: "application/vnd.github+json",
    })
    .catch((err) => {
      if (err.response.status === 404) {
        return null;
      }
      throw err;
    });
  }


  // 获取组织信息
  getOrg() {
    return this.get("/user/orgs")
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
      this.post("/user/repos", { name }, {
        accept: "application/vnd.github+json",
      });
      spinner.succeed('创建个人仓库完成');
      spinner.stop();
      return;
    }

    if (this.registryType === 'org') {
      this.post(`/orgs/${this.login}/repos`, { name }, {
        accept: "application/vnd.github+json",
      });
      spinner.succeed('创建组织仓库完成');
      spinner.stop();
    }
  }

}

export default GitHub;
