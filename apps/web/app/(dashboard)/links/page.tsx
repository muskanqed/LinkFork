"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./links.module.css";

// ── Data ──────────────────────────────────────────────────────────────────────

const LINKS_DATA = [
  {
    id: "1",
    short: "linkfork.io/launch",
    name: "Product launch",
    destination: "https://acme.com/product-launch",
    clicks: 24382,
    created: "Sep 12, 2026",
    lastClick: "2 min ago",
    status: "Active",
  },
  {
    id: "2",
    short: "linkfork.io/docs",
    name: "Developer docs",
    destination: "https://docs.acme.com/getting-started",
    clicks: 18804,
    created: "Aug 28, 2026",
    lastClick: "8 min ago",
    status: "Active",
  },
  {
    id: "3",
    short: "linkfork.io/github",
    name: "GitHub repository",
    destination: "https://github.com/acme/platform",
    clicks: 12219,
    created: "Aug 14, 2026",
    lastClick: "21 min ago",
    status: "Active",
  },
  {
    id: "4",
    short: "linkfork.io/summer",
    name: "Summer campaign",
    destination: "https://acme.com/campaigns/summer",
    clicks: 8947,
    created: "Jul 2, 2026",
    lastClick: "3 days ago",
    status: "Paused",
  },
  {
    id: "5",
    short: "linkfork.io/demo",
    name: "Live demo",
    destination: "https://demo.acme.com/request",
    clicks: 6201,
    created: "Jun 19, 2026",
    lastClick: "1 hour ago",
    status: "Active",
  },
  {
    id: "6",
    short: "linkfork.io/report",
    name: "Spring report",
    destination: "https://acme.com/reports/spring-2026",
    clicks: 4818,
    created: "Mar 4, 2026",
    lastClick: "Jun 30, 2026",
    status: "Expired",
  },
];

// ── Status badge ──────────────────────────────────────────────────────────────

type StatusType = "Active" | "Paused" | "Expired";

const DOT_COLORS: Record<StatusType, string> = {
  Active:  "#16a34a",
  Paused:  "#d97706",
  Expired: "#dc2626",
};

function StatusBadge({ status }: { status: StatusType }) {
  return (
    <span className={`${styles.badge} ${styles[`badge${status}`]}`}>
      <span className={styles.badgeDot} style={{ background: DOT_COLORS[status] }} />
      {status}
    </span>
  );
}

// ── Chevron icon ──────────────────────────────────────────────────────────────

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

// ── Three-dot menu icon ───────────────────────────────────────────────────────

const DotsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5"  r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LinksPage() {
  const [search, setSearch] = useState("");
  const [filterLinks, setFilterLinks] = useState("all");
  const [filterDate, setFilterDate] = useState("30d");
  const [filterSort, setFilterSort] = useState("clicks");

  return (
    <div className={styles.container}>

      {/* ── Page header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Your Links</h1>
          <p className={styles.subtitle}>Create, organize, and monitor all your shortened URLs.</p>
        </div>
        <Link href="/links/create" className={styles.createButton}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Link
        </Link>
      </div>

      {/* ── Table card ── */}
      <div className={styles.tableCard}>

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.searchWrapper}>
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search links..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.filters}>
            <div className={styles.filterWrapper}>
              <select className={styles.filterSelect} value={filterLinks} onChange={(e) => setFilterLinks(e.target.value)} aria-label="Filter links">
                <option value="all">All links</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="expired">Expired</option>
              </select>
              <span className={styles.filterChevron}><ChevronDown /></span>
            </div>
            <div className={styles.filterWrapper}>
              <select className={styles.filterSelect} value={filterDate} onChange={(e) => setFilterDate(e.target.value)} aria-label="Filter by date">
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <span className={styles.filterChevron}><ChevronDown /></span>
            </div>
            <div className={styles.filterWrapper}>
              <select className={styles.filterSelect} value={filterSort} onChange={(e) => setFilterSort(e.target.value)} aria-label="Sort by">
                <option value="clicks">Most clicks</option>
                <option value="recent">Most recent</option>
                <option value="alpha">Alphabetical</option>
              </select>
              <span className={styles.filterChevron}><ChevronDown /></span>
            </div>
          </div>
        </div>

        {/* Table */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Link</th>
              <th className={styles.th}>Destination</th>
              <th className={styles.th}>Clicks</th>
              <th className={styles.th}>Created</th>
              <th className={styles.th}>Last click</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {LINKS_DATA.map((link) => (
              <tr key={link.id} className={styles.tr}>
                <td className={styles.td}>
                  <div className={styles.linkCell}>
                    <Link href={`/links/${link.id}`} className={styles.shortUrl}>{link.short}</Link>
                    <span className={styles.linkName}>{link.name}</span>
                  </div>
                </td>
                <td className={styles.td}>
                  <span className={styles.destination}>{link.destination}</span>
                </td>
                <td className={styles.td}>
                  <span className={styles.clicksNum}>{link.clicks.toLocaleString()}</span>
                </td>
                <td className={styles.td}>
                  <span className={styles.dateCell}>{link.created}</span>
                </td>
                <td className={styles.td}>
                  <span className={link.status === "Expired" ? styles.expiredDate : styles.dateCell}>
                    {link.lastClick}
                  </span>
                </td>
                <td className={styles.td}>
                  <StatusBadge status={link.status as StatusType} />
                </td>
                <td className={styles.td}>
                  <button className={styles.dotsBtn} aria-label="More actions">
                    <DotsIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
