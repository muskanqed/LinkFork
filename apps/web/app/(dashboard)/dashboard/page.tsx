"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./dashboard.module.css";

// ── Mock data ─────────────────────────────────────────────────────────────────

const KPI_CARDS = [
  {
    label: "Total clicks",
    value: "128,492",
    trend: "18.4%",
    trendUp: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    label: "Total links",
    value: "42",
    trend: "8.2%",
    trendUp: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    label: "Active links",
    value: "38",
    trend: "5.6%",
    trendUp: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2" />
        <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
      </svg>
    ),
  },
  {
    label: "Clicks today",
    value: "4,821",
    trend: "12.1%",
    trendUp: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];

const CLICKS_DATA: Record<Period, { date: string; clicks: number }[]> = {
  "7D": [
    { date: "Sep 28", clicks: 5800 },
    { date: "Sep 29", clicks: 6200 },
    { date: "Sep 30", clicks: 5600 },
    { date: "Oct 1",  clicks: 7100 },
    { date: "Oct 2",  clicks: 7900 },
    { date: "Oct 3",  clicks: 7200 },
    { date: "Oct 4",  clicks: 7400 },
  ],
  "30D": [
    { date: "Sep 5",  clicks: 2800 },
    { date: "Sep 8",  clicks: 3600 },
    { date: "Sep 11", clicks: 3200 },
    { date: "Sep 14", clicks: 4800 },
    { date: "Sep 17", clicks: 4400 },
    { date: "Sep 20", clicks: 5900 },
    { date: "Sep 23", clicks: 5200 },
    { date: "Sep 26", clicks: 6700 },
    { date: "Sep 29", clicks: 6200 },
    { date: "Oct 2",  clicks: 7900 },
    { date: "Oct 4",  clicks: 7400 },
  ],
  "90D": [
    { date: "Jul 5",  clicks: 1800 },
    { date: "Jul 20", clicks: 2400 },
    { date: "Aug 4",  clicks: 2100 },
    { date: "Aug 19", clicks: 3200 },
    { date: "Sep 3",  clicks: 3800 },
    { date: "Sep 18", clicks: 5200 },
    { date: "Oct 4",  clicks: 7400 },
  ],
  "1Y": [
    { date: "Oct '25", clicks: 800 },
    { date: "Nov '25", clicks: 1200 },
    { date: "Dec '25", clicks: 1600 },
    { date: "Jan '26", clicks: 2100 },
    { date: "Feb '26", clicks: 2800 },
    { date: "Mar '26", clicks: 3400 },
    { date: "Apr '26", clicks: 4200 },
    { date: "May '26", clicks: 4900 },
    { date: "Jun '26", clicks: 5500 },
    { date: "Jul '26", clicks: 6100 },
    { date: "Aug '26", clicks: 6800 },
    { date: "Sep '26", clicks: 7400 },
  ],
};

const ACTIVITY = [
  { id: 1, text: "/launch received 142 clicks", time: "2 min ago" },
  { id: 2, text: "/docs received 82 clicks",    time: "18 min ago" },
  { id: 3, text: "/github alias was updated",   time: "2 hours ago" },
  { id: 4, text: "/demo was created",           time: "Yesterday" },
];

const TOP_LINKS = [
  { short: "linkfork.io/launch", destination: "acme.com/product-launch",        clicks: "24,382", ctr: "16.8%", lastClicked: "2 min ago",  status: "Active"  },
  { short: "linkfork.io/docs",   destination: "docs.acme.com/getting-started",  clicks: "18,804", ctr: "14.2%", lastClicked: "8 min ago",  status: "Active"  },
  { short: "linkfork.io/github", destination: "github.com/acme/platform",       clicks: "12,219", ctr: "11.9%", lastClicked: "21 min ago", status: "Active"  },
  { short: "linkfork.io/summer", destination: "acme.com/campaigns/summer",      clicks: "8,947",  ctr: "9.4%",  lastClicked: "3 days ago", status: "Paused"  },
];

// ── Custom tooltip ────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length && payload[0]) {
    return (
      <div style={{
        backgroundColor: "var(--card-background, #fff)",
        padding: "8px 12px",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        fontSize: "0.85rem",
        boxShadow: "0 4px 12px rgb(0 0 0 / 0.08)",
        color: "var(--foreground)",
      }}>
        <p style={{ margin: 0, fontWeight: 600 }}>{label}</p>
        <p style={{ margin: "2px 0 0", color: "var(--muted)" }}>
          {payload[0].value.toLocaleString()} clicks
        </p>
      </div>
    );
  }
  return null;
};

// ── Page ──────────────────────────────────────────────────────────────────────

type Period = "7D" | "30D" | "90D" | "1Y";
const PERIODS: Period[] = ["7D", "30D", "90D", "1Y"];

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>("30D");
  const chartData = CLICKS_DATA[period];
  const maxTick = Math.ceil(Math.max(...chartData.map((d) => d.clicks)) / 2000) * 2000;
  const ticks = Array.from({ length: Math.floor(maxTick / 2000) + 1 }, (_, i) => i * 2000);

  return (
    <div className={styles.container}>

      {/* ── Greeting ── */}
      <div className={styles.greeting}>
        <div>
          <h1 className={styles.greetTitle}>Good morning, Alex</h1>
          <p className={styles.greetSub}>Here&apos;s what&apos;s happening with your links.</p>
        </div>
        <Link href="/links/create" className={styles.createBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Link
        </Link>
      </div>

      {/* ── KPI cards ── */}
      <div className={styles.kpiGrid}>
        {KPI_CARDS.map((kpi) => (
          <div key={kpi.label} className={styles.kpiCard}>
            <div className={styles.kpiHeader}>
              <span className={styles.kpiLabel}>{kpi.label}</span>
              <div className={styles.kpiIconBox}>{kpi.icon}</div>
            </div>
            <p className={styles.kpiValue}>{kpi.value}</p>
            <p className={styles.kpiTrend}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.trendArrow}>
                <polyline points="18 15 12 9 6 15" />
              </svg>
              <strong>{kpi.trend}</strong>&nbsp;vs. previous period
            </p>
          </div>
        ))}
      </div>

      {/* ── Main section: chart + activity ── */}
      <div className={styles.mainGrid}>

        {/* Clicks overview */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h2 className={styles.chartTitle}>Clicks overview</h2>
              <p className={styles.chartSubtitle}>Track how your links are performing over time.</p>
            </div>
            <div className={styles.periodToggle}>
              {PERIODS.map((p) => (
                <button
                  key={p}
                  className={`${styles.periodBtn} ${period === p ? styles.periodBtnActive : ""}`}
                  onClick={() => setPeriod(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.chartArea}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="dashClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted)", fontSize: 11 }}
                  dy={8}
                  interval="preserveStartEnd"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted)", fontSize: 11 }}
                  dx={-4}
                  width={36}
                  ticks={ticks}
                  tickFormatter={(v) => `${v / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#dashClicks)"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0, fill: "#2563eb" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent activity */}
        <div className={styles.activityCard}>
          <div className={styles.activityHeader}>
            <h2 className={styles.activityTitle}>Recent activity</h2>
            <p className={styles.activitySub}>Updates from your workspace</p>
          </div>
          <div className={styles.activityList}>
            {ACTIVITY.map((item) => (
              <div key={item.id} className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className={styles.activityText}>
                  <p className={styles.activityMsg}>{item.text}</p>
                  <p className={styles.activityTime}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Top performing links ── */}
      <div className={styles.topLinksCard}>
        <div className={styles.topLinksHeader}>
          <div>
            <h2 className={styles.topLinksTitle}>Top performing links</h2>
            <p className={styles.topLinksSub}>Your strongest links this month</p>
          </div>
          <Link href="/links" className={styles.viewAllLink}>
            View all links
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Link</th>
              <th className={styles.th}>Destination</th>
              <th className={styles.th}>Clicks</th>
              <th className={styles.th}>CTR</th>
              <th className={styles.th}>Last clicked</th>
              <th className={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {TOP_LINKS.map((link) => (
              <tr key={link.short} className={styles.tr}>
                <td className={styles.td}>
                  <span className={styles.shortUrl}>{link.short}</span>
                </td>
                <td className={styles.td}>
                  <span className={styles.destination}>{link.destination}</span>
                </td>
                <td className={styles.td}>
                  <span className={styles.boldCell}>{link.clicks}</span>
                </td>
                <td className={styles.td}>
                  <span className={styles.boldCell}>{link.ctr}</span>
                </td>
                <td className={styles.td}>
                  <span className={styles.mutedCell}>{link.lastClicked}</span>
                </td>
                <td className={styles.td}>
                  <span className={`${styles.badge} ${link.status === "Active" ? styles.badgeActive : styles.badgePaused}`}>
                    <span className={styles.badgeDot} />
                    {link.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
