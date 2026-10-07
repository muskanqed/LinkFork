import React from "react";
import Link from "next/link";
import styles from "./links.module.css";

const LINKS_DATA = [
  {
    id: "1",
    short: "linkfork.io/launch",
    destination: "https://acme.com/product-launch",
    clicks: 24382,
    created: "Oct 1, 2026",
    status: "active",
  },
  {
    id: "2",
    short: "linkfork.io/docs",
    destination: "https://docs.acme.com/getting-started",
    clicks: 18804,
    created: "Sep 28, 2026",
    status: "active",
  },
  {
    id: "3",
    short: "linkfork.io/github",
    destination: "https://github.com/acme/platform",
    clicks: 12219,
    created: "Sep 22, 2026",
    status: "active",
  },
  {
    id: "4",
    short: "linkfork.io/summer",
    destination: "https://acme.com/campaigns/summer",
    clicks: 8947,
    created: "Sep 15, 2026",
    status: "active",
  },
  {
    id: "5",
    short: "linkfork.io/demo",
    destination: "https://demo.acme.com/request",
    clicks: 6201,
    created: "Sep 10, 2026",
    status: "active",
  },
];

export default function LinksPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Links</h1>
          <p className={styles.subtitle}>Manage and track all your short links.</p>
        </div>
        <Link href="/links/create" className={styles.createButton}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Link
        </Link>
      </header>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Short URL</th>
              <th className={styles.th}>Destination</th>
              <th className={styles.th}>Clicks</th>
              <th className={styles.th}>Created</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {LINKS_DATA.map((link) => (
              <tr key={link.id} className={styles.tr}>
                <td className={styles.td}>
                  <span className={styles.shortUrl}>{link.short}</span>
                </td>
                <td className={styles.td}>
                  <span className={styles.destination}>{link.destination}</span>
                </td>
                <td className={styles.td}>
                  <span className={styles.clicks}>{link.clicks.toLocaleString()}</span>
                </td>
                <td className={styles.td}>
                  <span className={styles.date}>{link.created}</span>
                </td>
                <td className={styles.td}>
                  <span className={`${styles.badge} ${styles[link.status]}`}>
                    {link.status}
                  </span>
                </td>
                <td className={styles.td}>
                  <Link href={`/links/${link.id}`} className={styles.viewLink}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
