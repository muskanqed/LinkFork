"use client";

import React from "react";
import styles from "../../../app/(dashboard)/analytics/analytics.module.css";

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
          height="100"
          viewBox="0 0 240 100"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Simplified continent blobs */}
          <path
            d="M15 55 Q30 35 55 40 Q75 45 85 38 Q95 32 100 40 Q105 50 90 58 Q70 65 50 60 Q30 62 15 55Z"
            fill="#dde3ea"
            stroke="#c8d0db"
            strokeWidth="0.8"
          />
          <path
            d="M110 30 Q130 22 150 28 Q168 34 172 45 Q175 56 162 62 Q145 68 128 62 Q112 55 110 44 Q108 37 110 30Z"
            fill="#dde3ea"
            stroke="#c8d0db"
            strokeWidth="0.8"
          />
          <path
            d="M155 50 Q165 42 178 46 Q188 50 190 58 Q192 66 182 70 Q170 74 160 68 Q152 62 155 50Z"
            fill="#dde3ea"
            stroke="#c8d0db"
            strokeWidth="0.8"
          />
          <path
            d="M175 20 Q190 16 205 20 Q218 26 220 36 Q222 46 212 50 Q200 53 188 47 Q178 40 175 30 Q174 25 175 20Z"
            fill="#dde3ea"
            stroke="#c8d0db"
            strokeWidth="0.8"
          />
          {/* Highlight dots for top countries */}
          <circle cx="140" cy="46" r="4" fill="#2563eb" opacity="0.75" />
          <circle cx="55" cy="46" r="3.5" fill="#2563eb" opacity="0.55" />
          <circle cx="165" cy="54" r="3" fill="#2563eb" opacity="0.45" />
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
