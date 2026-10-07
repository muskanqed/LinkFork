import React from "react";
import Link from "next/link";
import styles from "./link-detail.module.css";

const LINK_DETAIL = {
  "1": { short: "linkfork.io/launch", destination: "https://acme.com/product-launch", clicks: 24382, created: "Oct 1, 2026", status: "active" },
  "2": { short: "linkfork.io/docs", destination: "https://docs.acme.com/getting-started", clicks: 18804, created: "Sep 28, 2026", status: "active" },
  "3": { short: "linkfork.io/github", destination: "https://github.com/acme/platform", clicks: 12219, created: "Sep 22, 2026", status: "active" },
  "4": { short: "linkfork.io/summer", destination: "https://acme.com/campaigns/summer", clicks: 8947, created: "Sep 15, 2026", status: "active" },
  "5": { short: "linkfork.io/demo", destination: "https://demo.acme.com/request", clicks: 6201, created: "Sep 10, 2026", status: "active" },
} as Record<string, { short: string; destination: string; clicks: number; created: string; status: string }>;

const DAILY_STATS = [
  { date: "Oct 1", clicks: 812 },
  { date: "Oct 2", clicks: 1094 },
  { date: "Oct 3", clicks: 943 },
  { date: "Oct 4", clicks: 1238 },
  { date: "Oct 5", clicks: 1105 },
  { date: "Oct 6", clicks: 987 },
  { date: "Oct 7", clicks: 421 },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LinkDetailPage({ params }: PageProps) {
  const { id } = await params;
  const link = LINK_DETAIL[id];

  if (!link) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h1 className={styles.title}>Link not found</h1>
          <p className={styles.subtitle}>This link does not exist or has been deleted.</p>
          <Link href="/links" className={styles.backLink}>← Back to Links</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/links" className={styles.breadcrumbLink}>Links</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span className={styles.breadcrumbCurrent}>{link.short}</span>
      </div>

      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{link.short}</h1>
          <p className={styles.destination}>{link.destination}</p>
        </div>
        <span className={`${styles.badge} ${styles[link.status]}`}>{link.status}</span>
      </header>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Total Clicks</p>
          <p className={styles.statValue}>{link.clicks.toLocaleString()}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Created</p>
          <p className={styles.statValue}>{link.created}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Status</p>
          <p className={styles.statValue} style={{ textTransform: "capitalize" }}>{link.status}</p>
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Clicks over time</h2>
        <div className={styles.barChart}>
          {DAILY_STATS.map((d) => {
            const max = Math.max(...DAILY_STATS.map((s) => s.clicks));
            const pct = Math.round((d.clicks / max) * 100);
            return (
              <div key={d.date} className={styles.barGroup}>
                <span className={styles.barValue}>{d.clicks.toLocaleString()}</span>
                <div className={styles.barTrack}>
                  <div className={styles.bar} style={{ height: `${pct}%` }} />
                </div>
                <span className={styles.barLabel}>{d.date}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
