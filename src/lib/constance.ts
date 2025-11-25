// 模型配置常量
export const MODEL_OPTIONS = {
  DeepSeek: {
    label: "DeepSeek 模型",
    choices: ["deepseek-v3", "deepseek-r1"],
  },
  OpenAI: {
    label: "OpenAI 模型",
    choices: [
      "gpt-4.1",
      "gpt-4.1-mini",
      "gpt-4o",
      "chatgpt-4o-latest",
      "gpt-4o-mini",
      "o4-mini",
      "o3-mini",
    ],
  },
  通义千问: {
    label: "千问模型",
    choices: [
      "qwen3-max",
      "qwen3-30b-a3b-thinking-2507",
      "qwen3-30b-a3b-instruct-2507",
      "qwen3-235b-a22b-thinking-2507",
      "qwen3-235b-a22b-instruct-2507",
      "qwen2.5-32b-instruct",
      "qwen2.5-coder-32b-instruct",
      "qwq-32b",
      "qwen3-32b",
      "qwen3-coder-30b-a3b-instruct",
    ],
  },
} as const;

// 模型提供商类型
export type ProviderType = keyof typeof MODEL_OPTIONS | "自定义模型";

// 智能体配置常量
export const AGENT_CONFIGS = {
  general: {
    type: "general" as const,
    name: "综合渗透智能体",
    description:
      "综合渗透智能体是基于多智能体协作的自动化攻击框架,深度整合信息搜集,端口探测、漏洞扫描、漏洞利用等模块,支持从信息收集到漏洞利用的全流程渗透,具备智能决策能力和深度关联分析,可生成带攻击链可视化的渗透报告,适用于红蓝对抗演练、漏洞验证等场景,需严格遵守渗透政击授权范围。",
    placeholder: "请输入渗透目标,例如:目标是aifeex.com",
    showAdvancedFeatures: true,
  },
  recon: {
    type: "recon" as const,
    name: "信息搜集智能体",
    description:
      "信息搜集智能体是多引擎的自动化信息搜集工具,支持主动扫描和被动检索,可快速发现目标域名的隐藏资产,内置智能去重和结果分类功能,支持自定义字典深度爆破,适用于企业资产梳理、渗透测试信息收集等场景,需注意遵守网络安全法规禁止未授权扫描。",
    placeholder:
      "请输入信息搜集指令,例如:请帮我找出jumpvip.vip的所有子域名以及IP信息",
  },
  port_scan: {
    type: "port_scan" as const,
    name: "端口探测智能体",
    description:
      "端口探测智能体是集成多种扫描工具的专业的网络端口探测,支持TCP/UDP协议的多模式探测,可执行快速扫描、深度全端口扫描和隐蔽式SYN扫描。支持批量扫描IP段,集成服务指纹识别和安全风险分析。适用于网络运维排障、服务器安全审计、物联网设备管理等场景,使用时需遵守网络安全法规。",
    placeholder:
      "请输入端口探测指令,例如:请帮我扫描IP地块40.255.223.178的全部端口",
  },
  web_redteam: {
    type: "web_redteam" as const,
    name: "Web红队智能体",
    description:
      "Web红队智能体是集合多种工具的AI自动化渗透测试工具,集成了Web目录扫描、技术栈探测等核心功能。通过智能化的多线程扫描技术,可快速探测目标站点隐藏目录、暴露接口及未授权资源;基于预置的指纹库,自动识别常见web框架;其模块化设计支持自定义策略扩展,适用于红队实战、资产自查等场景。",
    placeholder:
      "请输入Web渗透指令,例如:请帮我扫描https://long-admin-98k.verycomplicated.zbtcsgo.com的web路径,发现可能的渗透点",
  },
  apitest: {
    type: "apitest" as const,
    name: "API测试智能体",
    description:
      "API安全测试专家专注于通过流量分析与自动化手段深度检测业务系统中的安全风险。能够模拟真实用户操作触发API调用,快速识别异常请求并精准定位潜在漏洞。借助请求重放与智能篡改技术,可高效验证越权、注入、敏感数据泄露等典型安全问题。所有测试均严格遵循授权范围与安全规范,确保过程可控、结果可复现。目标是在政击发生前,发现并修复API层面的安全隐患。",
    placeholder: "请输入API测试指令",
  },
  vulscan: {
    type: "vulscan" as const,
    name: "漏洞扫描智能体",
    description:
      "漏洞扫描智能体是融合了人工智能的新一代自动化安全核心引擎。它突破传统扫描工具的限制,通过自适应的探测策略与实时威胁情报协同,能够主动、精准地狩猎系统中的安全弱点。该智能体大幅提升了漏洞检出效率与精准度,并能根据业务环境动态调整扫描强度,成为智能安全运维不可或缺的核心防线。",
    placeholder: "请输入Web漏洞扫描指令,例如:请对120.78.172.48目标进行poc扫描",
  },
  vulexp: {
    type: "vulexp" as const,
    name: "漏洞利用智能体",
    description:
      "漏洞利用智能体是一个高度智能化的自动化攻击引擎。它利用AI分析目标系统的薄弱环节,并模拟黑客的逻辑链条进行决策。它能自主调用与编排渗透工具,精准发起漏洞验证和政击模拟。它在对抗环境中具备动态感知能力,可以灵活地实时切换政击模式、规避检测,并在整个过程中守护自身安全,最终形成闭环的政击能力测试与安全态势反馈。",
    placeholder: "请输入漏洞利用指令,例如:请对目标xxx.xxx利用CVE-xxxx-xxxx",
  },
  code_audit: {
    type: "code_audit" as const,
    name: "代码审计智能体",
    description:
      "代码审计智能体负责自动化代码安全分析,专为渗透测试设计。其通过静态代码扫描与语义理解技术,精准识别SQL注入、反序列化、逻辑漏洞等高危风险,覆盖Java、Python、PHP等主流语言;结合漏洞模式库与上下文关联分析,可定位隐蔽缺陷并生成修复方案,同时降低误报率。支持与开发流程集成,助力红队快速聚焦核心漏洞,提升审计效率与代码安全性。",
    placeholder:
      "请输入代码审计指令,例如:请帮我指出下面代码有什么安全问题？<代码>",
  },
  post_pentest: {
    type: "post_pentest" as const,
    name: "后渗透智能体",
    description:
      "后渗透智能体是一款基于自然语言交互的攻防辅助工具,专为渗透测试及红队实战设计。通过理解用户提问的上下文,它能实时生成针对权限维持、横向移动、痕迹清理等后渗透场景的解决方案,提供精准的命令示例、工具调用及绕过检测技巧。支持多平台指令适配与动态知识库更新,帮助渗透人员快速响应复杂内网环境,优化政击链路,适用于实时攻防演练与自动化战术决策。",
    placeholder:
      "请输入后渗透问答指令,例如：window凭证获取中 如何获取系统保存的RDP密码？",
  },
} as const;

// 聊天历史模拟数据常量
export const MOCK_MESSAGE_LIST = [
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
