"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "../../../app/analytics/analytics.module.css";

interface ClicksChartProps {
  data: { date: string; clicks: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: "white",
        padding: "8px 12px",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        fontSize: "0.875rem",
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      }}>
        <p style={{ margin: 0, fontWeight: 600, color: "var(--foreground)" }}>{label}</p>
        <p style={{ margin: 0, color: "var(--muted)" }}>{payload[0].value.toLocaleString()} clicks</p>
      </div>
    );
  }
  return null;
};

export const ClicksChart = ({ data }: ClicksChartProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.headerText}>
          <h3 className={styles.chartTitle}>Total clicks</h3>
          <p className={styles.chartSubtitle}>Combined performance for all links</p>
        </div>
      </div>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--border)"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 12 }}
              dx={-10}
              ticks={[0, 2000, 4000, 6000, 8000]}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="clicks"
              stroke="var(--primary)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorClicks)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
