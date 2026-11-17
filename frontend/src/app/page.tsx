import { HealthStatus } from "@/features/health/HealthStatus";
import { HomeView } from "@/theme/pages/HomeView";

export default function Home() {
  return <HomeView serverStatus={<HealthStatus />} />;
}
