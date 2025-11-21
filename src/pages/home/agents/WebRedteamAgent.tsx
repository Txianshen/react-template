import AgentContainer from "./components/AgentContainer";
import { AGENT_CONFIGS } from "@/lib/constance";

export default function WebRedteamAgent() {
  return <AgentContainer config={AGENT_CONFIGS.web_redteam} />;
}
