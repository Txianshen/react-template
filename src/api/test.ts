/**
 * 示例 API 接口 - 仅供学习参考
 *
 * 使用方法：
 * 1. 从这里导入 API 方法
 * 2. 在组件中调用，传入需要的参数
 * 3. 由于 axiosInstance 已统一处理响应，接口直接返回数据
 *
 * 示例：
 * const { data } = await testApi.getTest({ id: 1 })
 */
import axiosInstance from "./axiosInstance";

export const testApi = {
  /**
   * GET 请求示例
   * @param params - 查询参数对象，例如 { id: 1 }
   * @returns Promise，直接返回 response.data
   */
  getTest: (params?: Record<string, unknown>) =>
    axiosInstance.get("/test", { params }),
};
