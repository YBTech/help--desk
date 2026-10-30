import { StatsPanel } from "../StatsPanel/StatsPanel";
import { RecentActivity } from "../RecentActivity/RecentActivity";
import styles from "./Dashboard.module.css";
import { useEffect, useState } from "react";
import type { DashboardStats } from "../../types/dashboard.types";
import type { Ticket } from "../../../tickets/types/ticket.types";
import axios from "axios";
import type { ApiResponse } from "../../../../shared/types/api.types";
import { LoadingSpinner } from "../../../../shared/components/LoadingSpinner/LoadingSpinner";

const url = "http://localhost:4000/api";

export function Dashboard() {
  // 🔴 TODO:
  // 1. Fetch GET /stats and GET /stats/recent with axios (base URL: http://localhost:4000/api)
  // 2. Display the stats and recent activity data (pass them to StatsPanel and RecentActivity)
  // 3. Handle loading and error states
  const [states, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchDashboard() {
      try {
        const [statsRes, recentRes] = await Promise.all([
          axios.get<ApiResponse<DashboardStats>>(`{url}/stats`),
          axios.get<ApiResponse<Ticket[]>>(`${url}/stats/recent`),
        ]);
        if (cancelled) return;
        setStats(statsRes.data.data);
        setRecent(recentRes.data.data);
      } catch (error) {
        if (cancelled) return;
        setError(
          (axios.isAxiosError(error) && error.response?.data?.message) ||
            "Failed to load dashboard!",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchDashboard();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.dashboard}>
      <h1>Dashboard</h1>
      {states && <StatsPanel stats={states} />}
      <RecentActivity tickets={recent} />
    </div>
  );
}
