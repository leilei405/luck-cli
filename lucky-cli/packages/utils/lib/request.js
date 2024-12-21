import axios from "axios";

const BASE_URL = "http://localhost:7001";

const service = axios.create({
  baseURL: BASE_URL,
  timeout: 3000,
});

// 请求拦截器 成功
const onSuccess = (response) => {
  return response.data;
};

// 请求拦截器 失败
const onFiled = (error) => {
  Promise.reject(error);
};

// service.interceptors.request.use(onSuccess, onFiled);
service.interceptors.response.use(onSuccess, onFiled);

export default service;
