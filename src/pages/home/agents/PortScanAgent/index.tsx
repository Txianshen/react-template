import AgentContainer from "../components/AgentContainer";
import { AGENT_CONFIGS } from "@/lib/constance";

export default function PortScanAgent() {
  return <AgentContainer config={AGENT_CONFIGS.port_scan} />;
}
