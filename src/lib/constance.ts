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
