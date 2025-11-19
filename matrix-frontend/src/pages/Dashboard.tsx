import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div>
      <h1>🎯 仪表盘</h1>
      <p>欢迎使用 Matrix 智能攻防平台</p>
      <nav>
        <h3>🤖 智能体列表</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ margin: "10px 0" }}>
            <Link to="/app/agents/general">🤖 综合渗透智能体</Link>
          </li>
          <li style={{ margin: "10px 0" }}>
            <Link to="/app/agents/recon">✉️ 信息搜集智能体</Link>
          </li>
          <li style={{ margin: "10px 0" }}>
            <Link to="/app/agents/port-scan">💻 端口探测智能体</Link>
          </li>
          <li style={{ margin: "10px 0" }}>
            <Link to="/app/agents/web-redteam">🌐 Web红队智能体</Link>
          </li>
          <li style={{ margin: "10px 0" }}>
            <Link to="/app/agents/apitest">☁️ API测试智能体</Link>
          </li>
          <li style={{ margin: "10px 0" }}>
            <Link to="/app/agents/vulscan">🎯 漏洞扫描智能体</Link>
          </li>
          <li style={{ margin: "10px 0" }}>
            <Link to="/app/agents/vulexp">😈 漏洞利用智能体</Link>
          </li>
          <li style={{ margin: "10px 0" }}>
            <Link to="/app/agents/code-audit">📃 代码审计智能体</Link>
          </li>
          <li style={{ margin: "10px 0" }}>
            <Link to="/app/agents/post-pentest">🕸️ 后渗透智能体</Link>
          </li>
        </ul>
        <h3>🛠️ 其他功能</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ margin: "10px 0" }}>
            <Link to="/app/settings">⚙️ 设置</Link>
          </li>
          <li style={{ margin: "10px 0" }}>
            <Link to="/app/browser">🌐 浏览器自动化</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
