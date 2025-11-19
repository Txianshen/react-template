import axiosInstance from "./axiosInstance";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    username: string;
  };
}

// 登录接口
export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(
    "/api/auth/login",
    data
  );
  return response.data;
};
