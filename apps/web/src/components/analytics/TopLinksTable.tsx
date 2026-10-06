"use client";

import React from "react";
import styles from "../../../app/analytics/analytics.module.css";

interface TopLink {
  rank: string;
  shortUrl: string;
  destination: string;
  clicks: string;
  percentage: string;
}

interface TopLinksTableProps {
  data: TopLink[];
}

export const TopLinksTable = ({ data }: TopLinksTableProps) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.chartTitle}>Top links</h3>
      <div className={styles.linksTable}>
        {data.map((link, index) => (
          <div key={index} className={styles.linkRow}>
            <div className={styles.linkLeft}>
              <span className={styles.rank}>{link.rank}</span>
              <div className={styles.urlGroup}>
                <a href="#" className={styles.shortUrl}>{link.shortUrl}</a>
                <span className={styles.destUrl}>{link.destination}</span>
              </div>
            </div>
            <div className={styles.linkRight}>
              <span className={styles.clickCount}>{link.clicks}</span>
              <span className={styles.percentage}>{link.percentage}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
