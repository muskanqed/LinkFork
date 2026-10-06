"use client";

import React from "react";
import styles from "../../../app/(dashboard)/analytics/analytics.module.css";

interface TrafficSource {
  source: string;
  clicks: string;
  percentage: number;
}

interface TrafficSourcesProps {
  data: TrafficSource[];
}

export const TrafficSources = ({ data }: TrafficSourcesProps) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.chartTitle}>Traffic sources</h3>
      <div className={styles.sourceList}>
        {data.map((item, index) => (
          <div key={index} className={styles.sourceRow}>
            <div className={styles.sourceInfo}>
              <span className={styles.sourceName}>{item.source}</span>
              <span className={styles.sourceStats}>
                {item.clicks} · {item.percentage}%
              </span>
            </div>
            <div className={styles.progressContainer}>
              <div
                className={styles.progressBar}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
