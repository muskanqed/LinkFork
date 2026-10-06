"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import styles from "../../../app/analytics/analytics.module.css";

interface DeviceData {
  device: string;
  percentage: number;
  color: string;
}

interface DeviceBreakdownProps {
  data: DeviceData[];
  totalClicks: string;
}

export const DeviceBreakdown = ({ data, totalClicks }: DeviceBreakdownProps) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.chartTitle}>Device breakdown</h3>
      <div className={styles.donutContainer}>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="percentage"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.donutCenter}>
          <span className={styles.donutValue}>{totalClicks}</span>
          <span className={styles.donutLabel}>total clicks</span>
        </div>
      </div>
      <div className={styles.deviceLegend}>
        {data.map((item, index) => (
          <div key={index} className={styles.legendItem}>
            <span
              className={styles.legendDot}
              style={{ backgroundColor: item.color }}
            />
            <span className={styles.legendText}>
              {item.device} {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
