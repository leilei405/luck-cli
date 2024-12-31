import axios from "axios";
import { GitServer } from "./gitServer.js";

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

  // 获取组织信息
  getOrg() {
    return this.get("/user/orgs")
  }

  // 创建仓库
  createRepo(name) {
    console.log("registryType", this.registryType, 'name', name)
    if (this.registryType === 'user') {
      return this.post("/user/repos", { name }, {
        accept: "application/vnd.github+json",
      });
    } else {
      return this.post(`/orgs/${this.login}/repos`, { name }, {
        accept: "application/vnd.github+json",
      });
    }
  }

}

export default GitHub;
