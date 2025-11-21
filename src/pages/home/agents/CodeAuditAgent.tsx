import AgentContainer from "./components/AgentContainer";
import { AGENT_CONFIGS } from "@/lib/constance";

export default function CodeAuditAgent() {
  return <AgentContainer config={AGENT_CONFIGS.code_audit} />;
}
