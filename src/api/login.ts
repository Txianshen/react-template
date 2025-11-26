import axiosInstance from "./axiosInstance";

export interface LoginRequest {
  username: string;
  password: string;
}

// 定义与后端匹配的登录响应类型
export interface LoginResponse {
  access_token: string;
  token_type: string;
  username: string;
  role: string;
}

// 定义与后端匹配的登出响应类型
export interface LogoutResponse {
  message: string;
}

// 登录接口
export const loginApi = async (data: LoginRequest): Promise<any> => {
  const response = await axiosInstance.post<LoginResponse>("/auth/login", data);
  return response.data;
};

// logout接口
export const logoutApi = async (): Promise<LogoutResponse> => {
  const response = await axiosInstance.post<LogoutResponse>("/auth/logout");
  return response.data;
};
