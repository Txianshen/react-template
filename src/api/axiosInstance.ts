import axios, { type AxiosError, type AxiosResponse } from "axios";
import { toast } from "sonner";

// 创建 axios 实例
// 根据环境变量决定是否使用代理
const baseURL = import.meta.env.VITE_API_SERVICE_URL
  ? `${import.meta.env.VITE_API_SERVICE_URL}${import.meta.env.VITE_API_BASE_URL}`
  : import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    // 错误处理
    if (error.response) {
      const status = error.response.status;
      const message = (error.response.data as { message?: string })?.message;

      switch (status) {
        case 401:
          toast.error("未授权，请重新登录");
          localStorage.removeItem("token");
          window.location.href = "/#/login";
          break;
        case 403:
          toast.error("没有权限访问该资源");
          break;
        case 404:
          toast.error("请求的资源不存在");
          break;
        case 500:
          toast.error("服务器错误");
          break;
        default:
          toast.error(message || "请求失败");
      }
    } else if (error.request) {
      toast.error("网络错误，请检查网络连接");
    } else {
      toast.error("请求配置错误");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
