"use client";

import React from "react";
import styles from "../../../app/(dashboard)/analytics/analytics.module.css";

interface KpiCardProps {
  label: string;
  value: string;
  trend?: string | null;
  trendUp?: boolean | null;
  icon?: string;
}

const Icons: Record<string, React.ReactNode> = {
  clicks: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  visitors: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  ctr: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1" />
      <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z" />
      <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z" />
    </svg>
  ),
  country: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  ),
};

export const KpiCard = ({ label, value, trend, trendUp, icon }: KpiCardProps) => {
  return (
    <div className={styles.kpiCard}>
      <div className={styles.cardHeader}>
        <span className={styles.label}>{label}</span>
        <div className={styles.iconBox}>
          {icon && Icons[icon]}
        </div>
      </div>
      <div className={styles.value}>{value}</div>
      {trend && (
        <div className={`${styles.trend} ${trendUp ? styles.trendUp : styles.trendDown}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {trendUp
              ? <path d="m5 12 7-7 7 7M12 5v14" />
              : <path d="m19 12-7 7-7-7M12 19V5" />}
          </svg>
          <span style={{ fontWeight: 600 }}>{trend}</span>
          <span style={{ color: "var(--muted)", fontWeight: 400 }}>vs. previous period</span>
        </div>
      )}
    </div>
  );
};
