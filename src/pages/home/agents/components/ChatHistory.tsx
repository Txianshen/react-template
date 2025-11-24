// 通过查看代码，我发现ChatBot中涉及的显示样式有以下几种：
// 普通文本消息：
// 使用content字段显示正文内容
// 自动进行Markdown解析
// 工具调用消息：
// 包含特定的metadata：{"title": "🛠️ 调用{tool_cat}类工具 '{tool_name}'", "status": "pending"}
// 在工具调用结束时会更新metadata：{"status": "done", "duration": 时间差}
// 智能体切换消息：
// 包含特定的metadata：{"title": "➡️ 智能体发生切换"}
// 内容为：f"当前智能体已经切换至 {console_instance.agent}"
// 选择项消息：
// 包含options字段：options=[{"value": "Yes", "label": yes_label}, {"value": "No", "label": no_label}]
// 没有content内容
// 特殊标记处理：
// [PLANSTART]：用于渗透计划的特殊处理
// [/THINK_BEG]和[/THINK_END]：思考过程的标记处理
// [SAVE_CHAT_HISTORY]：保存聊天历史
// [RECOVERY_HISTORY]：恢复聊天历史
// [TOOL_CALL]：工具调用开始
// [TOOL_CALL_END]：工具调用结束
// [>>]：智能体切换
// [YESORNO]：选择项
// [CONV_END]：对话结束
// 在Gradio的ChatBot组件中，除了通过Accordion组件显示title外，还有以下显示方式：
// 状态指示器：根据metadata中的status字段显示不同的状态（pending/done）
// 进度显示：工具调用时显示执行时间
// 按钮选项：对于包含options的消息，会显示选择按钮
// 特殊图标：通过title中的emoji（如🛠️、➡️）来区分不同类型的消息
