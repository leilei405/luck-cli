import axios from "axios";
import { GitServer } from "./gitServer.js";

const BASE_URL = "https://gitee.com/api/v5";

// gitee 服务器
class Gitee extends GitServer {
  constructor() {
    super();
    this.service = axios.create({
      baseURL: BASE_URL,
      timeout: 3000,
    });

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

  post(url, params) {
    return this.service({ url, params, method: "post" });
  }

  searchRepositories(params) {
    return this.get("/search/repositories", params);
  }
}

export default Gitee;
