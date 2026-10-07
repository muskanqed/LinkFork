import React from "react";
import styles from "./analytics.module.css";
import { KpiCard } from "@/components/analytics/KpiCard";
import { ClicksChart } from "@/components/analytics/ClicksChart";
import { TrafficSources } from "@/components/analytics/TrafficSources";
import { DeviceBreakdown } from "@/components/analytics/DeviceBreakdown";
import { GeoDistribution } from "@/components/analytics/GeoDistribution";
import { TopLinksTable } from "@/components/analytics/TopLinksTable";
import { ANALYTICS_MOCK_DATA } from "@/data/analytics-mock";

const ChevronDown = () => (
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
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default function AnalyticsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Analytics</h1>
        <p className={styles.subtitle}>
          Understand how your links are performing across your entire account.
        </p>
      </header>

      <div className={styles.filters}>
        <div className={styles.filterWrapper}>
          <select className={styles.filter}>
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 24 hours</option>
            <option>Custom range</option>
          </select>
          <span className={styles.filterChevron}>
            <ChevronDown />
          </span>
        </div>

        <div className={styles.filterWrapper}>
          <select className={styles.filter}>
            <option>All links</option>
          </select>
          <span className={styles.filterChevron}>
            <ChevronDown />
          </span>
        </div>

        <div className={styles.filterWrapper}>
          <select className={styles.filter}>
            <option>All countries</option>
          </select>
          <span className={styles.filterChevron}>
            <ChevronDown />
          </span>
        </div>

        <div className={styles.filterWrapper}>
          <select className={styles.filter}>
            <option>All devices</option>
          </select>
          <span className={styles.filterChevron}>
            <ChevronDown />
          </span>
        </div>
      </div>

      <div className={styles.kpiGrid}>
        {ANALYTICS_MOCK_DATA.kpis.map((kpi, index) => (
          <KpiCard
            key={index}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
            trendUp={kpi.trendUp}
            icon={kpi.icon}
          />
        ))}
      </div>

      <ClicksChart data={ANALYTICS_MOCK_DATA.clicksTimeSeries} />

      <div className={styles.breakdownGrid}>
        <TrafficSources data={ANALYTICS_MOCK_DATA.trafficSources} />
        <DeviceBreakdown
          data={ANALYTICS_MOCK_DATA.deviceBreakdown}
          totalClicks={ANALYTICS_MOCK_DATA.kpis[0]?.value || "0"}
        />
        <GeoDistribution data={ANALYTICS_MOCK_DATA.geoDistribution} />
      </div>

      <TopLinksTable data={ANALYTICS_MOCK_DATA.topLinks} />
    </div>
  );
}
