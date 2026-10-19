"use client";

import React, { useMemo, useState } from "react";
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
import { useCurrentUser } from "@/hooks/useAuth";
import { useUrls, useUrlClicks } from "@/hooks/useUrls";
import { formatShortUrl } from "@/lib/urls-api";
import styles from "./dashboard.module.css";

function formatRelativeTime(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

// ── Custom tooltip ────────────────────────────────────────────────────────────

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length && payload[0]) {
    return (
      <div
        style={{
          backgroundColor: "var(--card-background, #fff)",
          padding: "8px 12px",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          fontSize: "0.85rem",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          color: "var(--foreground)",
        }}
      >
        <p style={{ margin: 0, fontWeight: 600 }}>{label}</p>
        <p style={{ margin: "2px 0 0", color: "var(--muted)" }}>
          {payload[0].value.toLocaleString()} clicks
        </p>
      </div>
    );
  }
  return null;
};

type Period = "7D" | "30D" | "90D" | "1Y";
const PERIODS: Period[] = ["7D", "30D", "90D", "1Y"];

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>("30D");

  const { data: user } = useCurrentUser();
  const { data: urls, isLoading: urlsLoading } = useUrls();
  const { data: clicksData, isLoading: clicksLoading } = useUrlClicks("all");

  const clicksMap = useMemo(() => {
    const map = new Map<string, number>();
    if (Array.isArray(clicksData)) {
      for (const item of clicksData) {
        if (item.id && item._count) {
          map.set(item.id, item._count.clicks || 0);
        }
      }
    }
    return map;
  }, [clicksData]);

  // Aggregate Real Metrics
  const totalLinks = urls?.length ?? 0;
  const totalClicks = useMemo(() => {
    if (!urls) return 0;
    return urls.reduce((sum, u) => sum + (clicksMap.get(u.id) || 0), 0);
  }, [urls, clicksMap]);

  const activeLinks = totalLinks;
  const avgClicksPerLink =
    totalLinks > 0 ? (totalClicks / totalLinks).toFixed(1) : "0";

  // Top Performing Links (Real data sorted by clicks desc)
  const topLinks = useMemo(() => {
    if (!urls) return [];
    return [...urls]
      .map((u) => ({
        ...u,
        clicks: clicksMap.get(u.id) || 0,
        shortUrl: formatShortUrl(u.shortCode),
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5);
  }, [urls, clicksMap]);

  // Recent Activity from real URLs
  const recentActivities = useMemo(() => {
    if (!urls || urls.length === 0) return [];
    return [...urls]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5)
      .map((u) => ({
        id: u.id,
        text: `Link created: ${formatShortUrl(u.shortCode)}`,
        time: formatRelativeTime(u.createdAt),
      }));
  }, [urls]);

  // Chart data based on top links click distribution
  const chartData = useMemo(() => {
    if (topLinks.length === 0) {
      return [
        { name: "Day 1", clicks: 0 },
        { name: "Day 2", clicks: 0 },
        { name: "Day 3", clicks: 0 },
        { name: "Day 4", clicks: 0 },
      ];
    }
    return topLinks.map((tl) => ({
      name: tl.shortCode,
      clicks: tl.clicks,
    }));
  }, [topLinks]);

  const maxClicks = Math.max(
    10,
    ...chartData.map((d) => d.clicks)
  );
  const maxTick = Math.ceil(maxClicks / 10) * 10;
  const ticks = Array.from({ length: 5 }, (_, i) => Math.round((maxTick / 4) * i));

  const isLoading = urlsLoading || clicksLoading;

  return (
    <div className={styles.container}>
      {/* ── Greeting ── */}
      <div className={styles.greeting}>
        <div>
          <h1 className={styles.greetTitle}>
            Good morning{user?.name ? `, ${user.name}` : ""}
          </h1>
          <p className={styles.greetSub}>
            Here&apos;s what&apos;s happening with your links and performance.
          </p>
        </div>
        <Link href="/links/create" className={styles.createBtn}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Link
        </Link>
      </div>

      {/* ── KPI cards ── */}
      <div className={styles.kpiGrid}>
        {/* Total clicks */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Total clicks</span>
            <div className={styles.kpiIconBox}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
          </div>
          <p className={styles.kpiValue}>
            {isLoading ? "…" : totalClicks.toLocaleString()}
          </p>
          <p className={styles.kpiTrend}>
            Across all your shortened links
          </p>
        </div>

        {/* Total links */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Total links</span>
            <div className={styles.kpiIconBox}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
          </div>
          <p className={styles.kpiValue}>
            {isLoading ? "…" : totalLinks.toLocaleString()}
          </p>
          <p className={styles.kpiTrend}>
            Active in your workspace
          </p>
        </div>

        {/* Active links */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Active links</span>
            <div className={styles.kpiIconBox}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="2" />
                <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
              </svg>
            </div>
          </div>
          <p className={styles.kpiValue}>
            {isLoading ? "…" : activeLinks.toLocaleString()}
          </p>
          <p className={styles.kpiTrend}>
            Ready to route traffic
          </p>
        </div>

        {/* Average Clicks / Link */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Avg clicks / link</span>
            <div className={styles.kpiIconBox}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
          </div>
          <p className={styles.kpiValue}>
            {isLoading ? "…" : avgClicksPerLink}
          </p>
          <p className={styles.kpiTrend}>
            Calculated from verified clicks
          </p>
        </div>
      </div>

      {/* ── Main section: chart + activity ── */}
      <div className={styles.mainGrid}>
        {/* Clicks overview */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h2 className={styles.chartTitle}>Top Links Click Distribution</h2>
              <p className={styles.chartSubtitle}>
                Verified click performance for your top links.
              </p>
            </div>
            <div className={styles.periodToggle}>
              {PERIODS.map((p) => (
                <button
                  key={p}
                  className={`${styles.periodBtn} ${
                    period === p ? styles.periodBtnActive : ""
                  }`}
                  onClick={() => setPeriod(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.chartArea}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart
                data={chartData}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="dashClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted)", fontSize: 11 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted)", fontSize: 11 }}
                  dx={-4}
                  width={36}
                  ticks={ticks}
                  tickFormatter={(v) => String(v)}
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
            {recentActivities.length > 0 ? (
              recentActivities.map((item) => (
                <div key={item.id} className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div className={styles.activityText}>
                    <p className={styles.activityMsg}>{item.text}</p>
                    <p className={styles.activityTime}>{item.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--muted)",
                  margin: "1rem 0",
                }}
              >
                No recent activity yet. Create your first short link above!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Top performing links ── */}
      <div className={styles.topLinksCard}>
        <div className={styles.topLinksHeader}>
          <div>
            <h2 className={styles.topLinksTitle}>Top performing links</h2>
            <p className={styles.topLinksSub}>
              Your strongest links by total click count
            </p>
          </div>
          <Link href="/links" className={styles.viewAllLink}>
            View all links
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
        {topLinks.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Short Link</th>
                <th className={styles.th}>Destination</th>
                <th className={styles.th}>Clicks</th>
                <th className={styles.th}>Created</th>
                <th className={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {topLinks.map((link) => (
                <tr key={link.id} className={styles.tr}>
                  <td className={styles.td}>
                    <Link
                      href={`/links/${link.id}`}
                      className={styles.shortUrl}
                    >
                      {link.shortUrl}
                    </Link>
                  </td>
                  <td className={styles.td}>
                    <span
                      className={styles.destination}
                      title={link.originalUrl}
                    >
                      {link.originalUrl}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.boldCell}>
                      {link.clicks.toLocaleString()}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.mutedCell}>
                      {formatRelativeTime(link.createdAt)}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${styles.badgeActive}`}>
                      <span
                        className={styles.badgeDot}
                        style={{ background: "#16a34a" }}
                      />
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--muted)" }}>
            <p style={{ margin: "0 0 1rem" }}>You haven&apos;t created any links yet.</p>
            <Link href="/links/create" className={styles.createBtn}>
              Create your first link
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
