import axios from "axios";
import { GitServer } from "./gitServer.js";

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
        ...data,
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

  //
  getOrg() {
    return this.get("/user/orgs")
  }
}

export default Gitee;
