import React from "react";
import styles from "./dashboard.module.css";

const STATS = [
  { label: "Total Links", value: "142", trend: "+12 this week" },
  { label: "Total Clicks", value: "128,492", trend: "+18.4% vs last month" },
  { label: "Unique Visitors", value: "91,842", trend: "+14.2% vs last month" },
  { label: "Average CTR", value: "11.4%", trend: "+1.8% vs last month" },
];

const RECENT_LINKS = [
  { short: "linkfork.io/launch", destination: "https://acme.com/product-launch", clicks: "24,382", created: "Oct 1, 2026" },
  { short: "linkfork.io/docs", destination: "https://docs.acme.com/getting-started", clicks: "18,804", created: "Sep 28, 2026" },
  { short: "linkfork.io/github", destination: "https://github.com/acme/platform", clicks: "12,219", created: "Sep 22, 2026" },
  { short: "linkfork.io/summer", destination: "https://acme.com/campaigns/summer", clicks: "8,947", created: "Sep 15, 2026" },
  { short: "linkfork.io/demo", destination: "https://demo.acme.com/request", clicks: "6,201", created: "Sep 10, 2026" },
];

export default function DashboardPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>
          Welcome back, Alex. Here&apos;s a snapshot of your account.
        </p>
      </header>

      <div className={styles.statsGrid}>
        {STATS.map((s) => (
          <div key={s.label} className={styles.statCard}>
            <p className={styles.statLabel}>{s.label}</p>
            <p className={styles.statValue}>{s.value}</p>
            <p className={styles.statTrend}>{s.trend}</p>
          </div>
        ))}
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Links</h2>
          <a href="/links" className={styles.viewAll}>View all</a>
        </div>
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Short URL</th>
                <th className={styles.th}>Destination</th>
                <th className={styles.th}>Clicks</th>
                <th className={styles.th}>Created</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_LINKS.map((link) => (
                <tr key={link.short} className={styles.tr}>
                  <td className={styles.td}>
                    <span className={styles.shortUrl}>{link.short}</span>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.destination}>{link.destination}</span>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.clicks}>{link.clicks}</span>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.date}>{link.created}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
