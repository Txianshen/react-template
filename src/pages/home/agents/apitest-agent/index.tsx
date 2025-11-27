import AgentContainer from "../components/AgentContainer";
import { AGENT_CONFIGS } from "@/lib/constance";

export default function ApitestAgent() {
  return <AgentContainer config={AGENT_CONFIGS.apitest} />;
}
