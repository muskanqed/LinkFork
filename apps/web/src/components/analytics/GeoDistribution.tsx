"use client";

import React from "react";
import styles from "../../../app/analytics/analytics.module.css";

interface GeoData {
  country: string;
  percentage: number;
}

interface GeoDistributionProps {
  data: GeoData[];
}

export const GeoDistribution = ({ data }: GeoDistributionProps) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.chartTitle}>Geographic distribution</h3>
      <div className={styles.mapPlaceholder}>
        <svg
          width="100%"
          height="120"
          viewBox="0 0 200 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 40C40 30 60 50 80 40S120 30 140 40S180 50 190 40V60C180 70 150 60 130 70S80 80 50 70S10 60 10 40Z"
            fill="#f1f5f9"
            stroke="var(--border)"
            strokeWidth="1"
          />
          <circle cx="60" cy="45" r="3" fill="var(--primary)" />
          <circle cx="110" cy="40" r="3" fill="var(--primary)" />
          <circle cx="150" cy="55" r="3" fill="var(--primary)" />
        </svg>
      </div>
      <div className={styles.countryList}>
        {data.map((item, index) => (
          <div key={index} className={styles.countryRow}>
            <span className={styles.countryName}>{item.country}</span>
            <span className={styles.countryValue}>{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
