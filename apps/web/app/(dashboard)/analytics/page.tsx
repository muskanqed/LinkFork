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
import { useUrls, useUrlClicks } from "@/hooks/useUrls";
import { formatShortUrl } from "@/lib/urls-api";

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

  const { data: urls } = useUrls();
  const { data: clicksData } = useUrlClicks("all");

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

  // Dynamic link filter options from real URLs
  const linkOptions = useMemo(() => {
    const list = [{ value: "all", label: "All links" }];
    if (urls && urls.length > 0) {
      for (const u of urls) {
        list.push({
          value: u.id,
          label: formatShortUrl(u.shortCode),
        });
      }
    }
    return list;
  }, [urls]);

  // Real Top Links
  const realTopLinks = useMemo(() => {
    if (!urls || urls.length === 0) {
      return ANALYTICS_MOCK_DATA.topLinks;
    }

    const sorted = [...urls]
      .map((u) => ({
        ...u,
        clicks: clicksMap.get(u.id) || 0,
      }))
      .sort((a, b) => b.clicks - a.clicks);

    const totalClicksCount = sorted.reduce((sum, u) => sum + u.clicks, 0);

    return sorted.slice(0, 5).map((u, i) => ({
      rank: String(i + 1).padStart(2, "0"),
      shortUrl: formatShortUrl(u.shortCode),
      destination: u.originalUrl,
      clicks: u.clicks.toLocaleString(),
      percentage:
        totalClicksCount > 0
          ? `${((u.clicks / totalClicksCount) * 100).toFixed(1)}%`
          : "0%",
    }));
  }, [urls, clicksMap]);

  // Real total clicks
  const totalVerifiedClicks = useMemo(() => {
    if (!urls) return null;
    return urls.reduce((sum, u) => sum + (clicksMap.get(u.id) || 0), 0);
  }, [urls, clicksMap]);

  const kpis = useMemo(() => {
    return ANALYTICS_MOCK_DATA.kpis.map((kpi, idx) => {
      if (idx === 0 && totalVerifiedClicks !== null) {
        return {
          ...kpi,
          value: totalVerifiedClicks.toLocaleString(),
        };
      }
      return kpi;
    });
  }, [totalVerifiedClicks]);

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
