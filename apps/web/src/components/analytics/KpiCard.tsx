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

export const KpiCard = ({ label, value, trend, trendUp, icon }: KpiCardProps) => {
  return (
    <div className={styles.kpiCard}>
      <div className={styles.cardHeader}>
        <span className={styles.label}>{label}</span>
        <div className={styles.icon}>
          {icon === "clicks" && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          )}
          {icon === "visitors" && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          )}
          {icon === "ctr" && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          )}
          {icon === "country" && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          )}
        </div>
      </div>
      <div className={styles.value}>{value}</div>
      {trend && (
        <div className={`${styles.trend} ${trendUp ? styles.trendUp : styles.trendDown}`}>
          {trendUp ? "↗" : "↘"} {trend} vs. previous period
        </div>
      )}
    </div>
  );
};
