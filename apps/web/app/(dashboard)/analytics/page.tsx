"use client";

import React, { useState, useMemo } from "react";
import styles from "./analytics.module.css";
import { KpiCard } from "@/components/analytics/KpiCard";
import { ClicksChart } from "@/components/analytics/ClicksChart";
import { TrafficSources } from "@/components/analytics/TrafficSources";
import { DeviceBreakdown } from "@/components/analytics/DeviceBreakdown";
import { GeoDistribution } from "@/components/analytics/GeoDistribution";
import { TopLinksTable } from "@/components/analytics/TopLinksTable";
import { ANALYTICS_MOCK_DATA } from "@/data/analytics-mock";
import { useUrlsWithClicks } from "@/hooks/useUrls";

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

const COUNTRY_OPTIONS = [
  { value: "all", label: "All countries" },
  ...ANALYTICS_MOCK_DATA.geoDistribution.map((g) => ({
    value: g.country,
    label: g.country,
  })),
];

const DEVICE_OPTIONS = [
  { value: "all", label: "All devices" },
  ...ANALYTICS_MOCK_DATA.deviceBreakdown.map((d) => ({
    value: d.device.toLowerCase(),
    label: d.device,
  })),
];

const DATE_OPTIONS = [
  { value: "30d", label: "Last 30 days" },
  { value: "7d", label: "Last 7 days" },
  { value: "24h", label: "Last 24 hours" },
  { value: "90d", label: "Last 90 days" },
  { value: "custom", label: "Custom range" },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d");
  const [selectedLink, setSelectedLink] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedDevice, setSelectedDevice] = useState("all");

  const { urls, totalClicks } = useUrlsWithClicks();

  // Dynamic link filter options from real URLs
  const linkOptions = useMemo(() => {
    const list = [{ value: "all", label: "All links" }];
    for (const u of urls) {
      list.push({
        value: u.id,
        label: u.shortUrl,
      });
    }
    return list;
  }, [urls]);

  // Real Top Links
  const realTopLinks = useMemo(() => {
    if (urls.length === 0) {
      return ANALYTICS_MOCK_DATA.topLinks;
    }

    const sorted = [...urls].sort((a, b) => b.clicks - a.clicks);
    const totalClicksCount = sorted.reduce((sum, u) => sum + u.clicks, 0);

    return sorted.slice(0, 5).map((u, i) => ({
      rank: String(i + 1).padStart(2, "0"),
      shortUrl: u.shortUrl,
      destination: u.originalUrl,
      clicks: u.clicks.toLocaleString(),
      percentage:
        totalClicksCount > 0
          ? `${((u.clicks / totalClicksCount) * 100).toFixed(1)}%`
          : "0%",
    }));
  }, [urls]);

  const kpis = useMemo(() => {
    return ANALYTICS_MOCK_DATA.kpis.map((kpi, idx) => {
      if (idx === 0 && totalClicks > 0) {
        return {
          ...kpi,
          value: totalClicks.toLocaleString(),
        };
      }
      return kpi;
    });
  }, [totalClicks]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Analytics</h1>
        <p className={styles.subtitle}>
          Understand how your links are performing across your entire account.
        </p>
      </header>

      <div className={styles.filters}>
        {/* Date range */}
        <div className={styles.filterWrapper}>
          <select
            className={styles.filter}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            aria-label="Date range"
          >
            {DATE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <span className={styles.filterChevron}>
            <ChevronDown />
          </span>
        </div>

        {/* Real Links Options */}
        <div className={styles.filterWrapper}>
          <select
            className={styles.filter}
            value={selectedLink}
            onChange={(e) => setSelectedLink(e.target.value)}
            aria-label="Filter by link"
          >
            {linkOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <span className={styles.filterChevron}>
            <ChevronDown />
          </span>
        </div>

        {/* Countries */}
        <div className={styles.filterWrapper}>
          <select
            className={styles.filter}
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            aria-label="Filter by country"
          >
            {COUNTRY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <span className={styles.filterChevron}>
            <ChevronDown />
          </span>
        </div>

        {/* Devices */}
        <div className={styles.filterWrapper}>
          <select
            className={styles.filter}
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            aria-label="Filter by device"
          >
            {DEVICE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <span className={styles.filterChevron}>
            <ChevronDown />
          </span>
        </div>
      </div>

      <div className={styles.kpiGrid}>
        {kpis.map((kpi, index) => (
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
          totalClicks={kpis[0]?.value || "0"}
        />
        <GeoDistribution data={ANALYTICS_MOCK_DATA.geoDistribution} />
      </div>

      <TopLinksTable data={realTopLinks} />
    </div>
  );
}
