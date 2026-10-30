import { Link } from "react-router-dom";
import { StatusBadge } from "../../../../shared/components/Badges/Badges";
import styles from "./RecentActivity.module.css";
import type { Ticket } from "../../../tickets/types/ticket.types";

// 🔴 TODO: Accept tickets prop (Ticket[]) and render each ticket as a link with title, updated date, and status badge
export function RecentActivity({ tickets }: { tickets: Ticket[] }) {
  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Recent Activity</h2>
      <div className={styles.list}>
        {tickets.length === 0 && <div className={styles.itemDate}>No recent activity</div>}
        {tickets.map(ticket => (
          <Link key={ticket.id} to={`/tickets/${ticket.id}`} className={styles.item}>
          <div className={styles.itemRow}>
            <div>
              <div className={styles.itemTitle}>
                {ticket.title}
              </div>
              <div className={styles.itemDate}>{ticket.updatedAt}</div>
            </div>
            <StatusBadge status={ticket.status} />
          </div>
        </Link>
        ))}
      </div>
    </div>
  );
}
