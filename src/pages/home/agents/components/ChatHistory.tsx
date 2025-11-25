import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/chat";
import { useMemo } from "react";

// 定义消息类型
export type MessageType = {
  role: "user" | "assistant";
  metadata: {
    title?: string;
    duration?: number;
    status?: string;
  } | null;
  content: string;
  options: unknown[] | null;
};

// 模拟数据
const MOCK_MESSAGE_LIST: MessageType[] = [
  {
    role: "user",
    metadata: null,
    content: "10.97.59.142:12824 ，ctf/web题目，目标是成为#1打败挂哥，获取flag",
    options: null,
  },
  {
    role: "assistant",
    metadata: null,
    content: "☁️思考中...\n[+] ✅正在启动后台进程...",
    options: null,
  },
  {
    role: "assistant",
    metadata: {
      title: "➡️ 智能体发生切换",
    },
    content: "当前智能体已经切换至 综合渗透智能体",
    options: [],
  },
  {
    role: "assistant",
    metadata: null,
    content:
      "[+] 当前运行模式 CTF\n[+] 设置模型`'gpt-4.1'`，当前共有`22`个智能体...\n[+] 模型设置完成\n[+] 🔥欢迎使用浙大AI辅助渗透测试后台V4.0，系统初始化中...\n[+] 系统准备就绪。即将从阶段 'vulscan' 开始。\n[+] 当前exec_prompt: 基于当前上下文进行工具调用，完成渗透测试",
    options: null,
  },
  {
    role: "assistant",
    metadata: {
      title: "➡️ 智能体发生切换",
    },
    content: "当前智能体已经切换至 计划智能体",
    options: [],
  },
  {
    role: "assistant",
    metadata: null,
    content:
      "[+] 💼 正在制作/更新计划...\n## 🔍 当前渗透阶段：漏洞扫描（vulscan）\n\n### 📋 任务清单\n| 步骤 | 任务描述                                       | 状态      |\n|------|------------------------------------------------|-----------|\n| 1    | 使用TscanClient的POC扫描模块对目标进行全面漏洞检测        | ⚠️ 未完成  |\n| 2    | 分析TscanClient扫描输出，初步梳理潜在漏洞与风险点         | ⚠️ 未完成  |\n| 3    | 若初步扫描结果不理想，则调整参数或更换工具（如nmap NSE、nikto、web_sqlmap）补充扫描  | ⚠️ 未完成 |\n| 4    | 针对表单/接口请求，拟用curl进行手动漏洞检测               | ⚠️ 未完成 |\n| 5    | 汇总所有扫描结果，初步归纳已发现的漏洞和可疑点            | ⚠️ 未完成 |\n\n---\n### 📌 当前要执行的下一步任务\n\n对目标 `10.97.59.142:12824`，启动TscanClient的POC扫描模块进行第一次全面漏洞检测，重点识别Web相关风险点。\n\n- 关注类型：包含但不限于Web漏洞、弱口令、任意文件读取、命令执行、SQL注入等与ctf/web题型常见风险相关的漏洞。\n- 要求：完成后分析TscanClient的扫描输出，形成阶段性结果并据此调整后续扫描重点。\n\n请执行上述第一步任务，待获取扫描结果后继续规划。",
    options: null,
  },
  {
    role: "assistant",
    metadata: {
      title: "➡️ 智能体发生切换",
    },
    content: "当前智能体已经切换至 vulscan智能体",
    options: [],
  },
  {
    role: "assistant",
    metadata: null,
    content: "",
    options: null,
  },
  {
    role: "assistant",
    metadata: {
      title: "🛠️ 调用综合安全类工具 'TscanClient'",
      duration: 1.45001220703125,
      status: "done",
    },
    content:
      "工具正在执行中...\n\n💻当前命令: `TscanClient -u http://10.97.59.142:12824 --poc --max-connections 16 --no-write --no-browser --json`  ⏰超时设置: `5000s`\n工具执行结果 `stdout` : ",
    options: [],
  },
  {
    role: "assistant",
    metadata: null,
    content:
      "TscanClient的POC扫描模块针对目标 http://10.97.59.142:12824 的自动化漏洞检测已启动，但本轮运行未返回实际漏洞扫描输出内容（工具输出为空或发生异常）。\n\n【处理措施与调整】\n- 当前未获得有效漏洞数据，需基于最佳实践采取如下循环优化操作：\n\n1. 检查并简化关键参数，确保调用格式兼容性和静默高效执行。\n2. 优先尝试标准POC扫描模式，并控制并发量，避免特殊参数可能引发的兼容误差。\n\n【将立即进行参数微调，重新调用TscanClient，确保获取有效的漏洞扫描结果。】\n\n如仍无法获得有效输出，将自动切换nuclei工具进行Web POC补充检测，避免遗漏任何重要风险点。\n\n即将执行修正后的TscanClient基础POC扫描……",
    options: null,
  },
  {
    role: "assistant",
    metadata: {
      title: "🛠️ 调用综合安全类工具 'TscanClient'",
      duration: 1.5547676086425781,
      status: "done",
    },
    content:
      "工具正在执行中...\n\n💻当前命令: `TscanClient -u http://10.97.59.142:12824 --poc --json`  ⏰超时设置: `5000s`\n工具执行结果 `stdout` : ",
    options: [],
  },
  {
    role: "assistant",
    metadata: null,
    content: "",
    options: null,
  },
  {
    role: "assistant",
    metadata: {
      title: "🛠️ 调用综合安全类工具 'TscanClient'",
      duration: 1.4518017768859863,
      status: "done",
    },
    content:
      "工具正在执行中...\n\n💻当前命令: `TscanClient -u http://10.97.59.142:12824 --poc`  ⏰超时设置: `5000s`\n工具执行结果 `stdout` : ",
    options: [],
  },
  {
    role: "assistant",
    metadata: null,
    content: "",
    options: null,
  },
  {
    role: "assistant",
    metadata: {
      title: "🛠️ 调用综合安全类工具 'TscanClient'",
      duration: 10.035072088241577,
      status: "done",
    },
    content:
      "工具正在执行中...\n\n💻当前命令: `TscanClient -u http://10.97.59.142:12824`  ⏰超时设置: `5000s`\n工具执行结果 `stdout` : \n\n\u001b[K[07:49:03] [INFO] Start UrlScan:http://10.97.59.142:12824\n\n\u001b[K[07:49:11] [+] [TCP/HTTP] [502]  http://10.97.59.142:12824 [None]\nCheckFinish Found No Poc: http://10.97.59.142:12824\n\n\u001b[K[07:49:11] [+] Url扫描结束:http://10.97.59.142:12824\n\n\u001b[K[07:49:11] [+] 项目任务完成:Default, Timeuse：8.274847851\n\n\u001b[K[07:49:11] [+] 扫描结束,耗时: 8.552988101s",
    options: [],
  },
  {
    role: "assistant",
    metadata: null,
    content:
      'TscanClient POC模式对目标 http://10.97.59.142:12824 的扫描已完成，工具检测流程输出如下关键结论：\n\n---\n\n### 【TscanClient 扫描结果】\n\n- HTTP响应状态码：502（Bad Gateway）\n- 目标状态：未检测出任何已知POC漏洞\n- 特殊提示：工具扫描中无漏洞命中，确认"无POC发现"。\n- 总执行时长：约8.5秒\n\n---\n\n### 【阶段性分析】\n\n- 目标当前对外响应为502，疑似服务异常或存在WAF/网关拦截。\n- 本轮未发现Web通用高危漏洞、弱口令、任意文件读取、命令执行、SQL注入等风险点。\n- 得到的核心结果为目标站点服务状态及不可用性，无有效漏洞细节输出。\n\n---\n\n【后续策略】\n- 无直接漏洞发现时，需采用多工具互补排查，排除工具兼容性或误杀问题。\n- 核查具体Web响应（如error page），结合nikto、nuclei等工具进行补充Web漏洞检测。\n- 必要时再次尝试更细粒度端口/中间件探测与异常行为分析。\n\n【下一步任务】\n进入第3步，组合使用nikto和nuclei对目标进行更细致的Web漏洞检测与异常行为分析。\n\n是否立即启动并汇总nikto + nuclei检测结果？如有语句敏感字段或特殊流程需求，请补充说明。',
    options: null,
  },
  {
    role: "assistant",
    metadata: {
      title: "➡️ 智能体发生切换",
    },
    content: "当前智能体已经切换至 评估智能体",
    options: [],
  },
  {
    role: "assistant",
    metadata: null,
    content:
      " `评价反馈`: \n已按计划完成了TscanClient的POC扫描，并对扫描结果做了阶段性分析。任务切入点明确，已关注目标服务不可用性等异常现象。尽管当前工具未发现高危漏洞，后续已提出补充扫描策略（多工具联合检测），流程规范、衔接合理。建议按照既定规划继续推进下一步多工具细化扫描工作，提升未被单一工具覆盖的漏洞发现率。 \n `评价得分`: 通过 \n[!] 根据反馈继续运行...",
    options: null,
  },
  {
    role: "assistant",
    metadata: {
      title: "➡️ 智能体发生切换",
    },
    content: "当前智能体已经切换至 计划智能体",
    options: [],
  },
  {
    role: "assistant",
    metadata: null,
    content:
      "[+] 💼 正在制作/更新计划...\n## 🔍 当前渗透阶段：漏洞扫描（vulscan）\n\n### 📋 任务清单（进度更新）\n| 步骤 | 任务描述                                                                      | 状态      |\n|------|-------------------------------------------------------------------------------|-----------|\n| 1    | 使用TscanClient的POC扫描模块对目标进行全面漏洞检测                             | ✅ 已完成  |\n| 2    | 分析TscanClient扫描输出，初步梳理潜在漏洞与风险点                              | ✅ 已完成  |\n| 3    | 若初步扫描结果不理想，则调整参数或更换工具（如nmap NSE、nikto、nuclei、web_sqlmap）补充扫描 | ⚠️ 未完成 |\n| 4    | 针对Web页面异常或表单/接口请求，综合curl/manual等方式进行细粒度检测               | ⚠️ 未完成 |\n| 5    | 汇总所有扫描结果，归纳发现的漏洞或潜在风险点                                   | ⚠️ 未完成 |\n\n---\n### 📌 当前要执行的下一步任务\n\n组合使用 **nikto** 及 **nuclei** 对目标 `http://10.97.59.142:12824` 进行深入Web漏洞扫描及异常行为分析，探索如下要点：\n\n- **目标重点**：检测目标服务器潜在的基础Web弱点、常见配置错误、安全头部缺失、异常返回特征或可能暴露的敏感信息。\n- **补充说明**：\n  - 若扫描中持续遇到502响应或页面不可用现象，请记录详细特征信息，为后续进一步判定（如绕过、安全防护机制分析）做准备。\n  - 如遇明显Web应用防护措施，可适当调整请求头、访问方式，对抗WAF等阻断机制。\n\n**执行要求**：\n- 首先完成nikto和nuclei常规检测，收集关键扫描输出和特色响应。\n- 对任何检测到的异常Web指纹、风险点、或服务异常行为作初步归纳，为后续更针对性的手动检测（如curl请求验证）作准备。\n\n请按此计划推进，待获得扫描结果后再做动态调整。",
    options: null,
  },
  {
    role: "assistant",
    metadata: {
      title: "➡️ 智能体发生切换",
    },
    content: "当前智能体已经切换至 vulscan智能体",
    options: [],
  },
  {
    role: "assistant",
    metadata: null,
    content: "",
    options: null,
  },
  {
    role: "assistant",
    metadata: {
      title: "🛠️ 调用漏洞挖掘类工具 'nikto'",
      duration: 80.2793538570404,
      status: "done",
    },
    content:
      "工具正在执行中...\n\n💻当前命令: `nikto -host http://10.97.59.142:12824 -ask no -nointeractive -Tuning x 2`  ⏰超时设置: `1000s`\n工具执行结果 `stdout` : \n- Nikto v2.1.5\n---------------------------------------------------------------------------\n+ No web server found on 10.97.59.142:12824\n---------------------------------------------------------------------------\n+ 0 host(s) tested\n\n工具执行结果 `stderr` : ",
    options: [],
  },
  {
    role: "assistant",
    metadata: null,
    content: "",
    options: null,
  },
  {
    role: "assistant",
    metadata: {
      title: "🛠️ 调用漏洞挖掘类工具 'nuclei'",
      duration: 13.628521203994751,
      status: "done",
    },
    content:
      "工具正在执行中...\n\n💻当前命令: `nuclei -u http://10.97.59.142:12824 -severity medium,high,critical -ni -silent`  ⏰超时设置: `1000s`\n工具执行结果 `stdout` : \n\n工具执行结果 `stderr` : ",
    options: [],
  },
];

// 定义 ChatHistory 组件
export default function ChatHistory() {
  // 定义 messageList 变量，用于渲染对话列表
  const messageList = useMemo(() => MOCK_MESSAGE_LIST, []);

  return (
    <Conversation className="h-full">
      <ConversationContent>
        {messageList.map((message, index) => {
          // 智能体切换提示卡片
          if (message.metadata?.title?.includes("智能体发生切换")) {
            return (
              <div key={index} className="w-full max-w-[80%]">
                <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
                  <div className="text-blue-800 font-medium text-sm">
                    {message.metadata.title}
                  </div>
                  <div className="text-blue-700 text-sm mt-1">
                    {message.content}
                  </div>
                </div>
              </div>
            );
          }

          // 工具调用卡片
          if (message.metadata?.title?.includes("调用")) {
            return (
              <div key={index} className="w-full max-w-[80%]">
                <div className="bg-gray-100 border border-gray-300 rounded-lg">
                  <div className="flex items-center justify-between p-3 border-b border-gray-300">
                    <div className="font-medium text-sm">
                      {message.metadata.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {message.metadata.duration?.toFixed(2)}s
                    </div>
                  </div>
                  <div className="p-3">
                    <MessageResponse>{message.content}</MessageResponse>
                  </div>
                </div>
              </div>
            );
          }

          // 普通消息
          return (
            <Message
              key={index}
              from={message.role}
              className={message.role === "user" ? "ml-auto" : ""}
            >
              <MessageContent>
                <MessageResponse>{message.content}</MessageResponse>
              </MessageContent>
            </Message>
          );
        })}
      </ConversationContent>
    </Conversation>
  );
}
