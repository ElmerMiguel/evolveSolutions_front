import DashboardModerno from "./dashboards/DashboardModerno";
import DashboardLegacy from "./dashboards/DashboardLegacy";

export default function Dashboard() {

  const usarLegacy = false;

  return usarLegacy
    ? <DashboardLegacy />
    : <DashboardModerno />;
}