"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUrlDetail } from "@/hooks/useUrls";
import { formatDate } from "@/lib/utils";
import { EditUrlModal } from "@/components/links/EditUrlModal";
import { DeleteUrlModal } from "@/components/links/DeleteUrlModal";
import styles from "./link-detail.module.css";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function LinkDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  const { link, shortUrl, totalClicks, isLoading, error, refetch } =
    useUrlDetail(id);

  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleCopy = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className={styles.skeletonLine} style={{ width: "30%" }} />
          <div
            className={styles.skeletonLine}
            style={{ width: "60%", height: "32px" }}
          />
          <div className={styles.skeletonLine} style={{ width: "80%" }} />
        </div>
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.skeletonLine} />
          </div>
          <div className={styles.statCard}>
            <div className={styles.skeletonLine} />
          </div>
          <div className={styles.statCard}>
            <div className={styles.skeletonLine} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h1 className={styles.title}>Link not found</h1>
          <p className={styles.subtitle}>
            {error
              ? error.message
              : "This link does not exist or has been deleted."}
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link href="/links" className={styles.backLink}>
              ← Back to Links
            </Link>
            {error && (
              <button
                type="button"
                onClick={() => refetch()}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--primary)",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/links" className={styles.breadcrumbLink}>
          Links
        </Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span className={styles.breadcrumbCurrent}>{link.shortCode}</span>
      </div>

      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{shortUrl}</h1>
          <p className={styles.destination}>
            Destination:{" "}
            <a
              href={link.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--primary)" }}
            >
              {link.originalUrl}
            </a>
          </p>
          <div className={styles.btnRow}>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={handleCopy}
            >
              {copied ? "✓ Copied!" : "📋 Copy Short URL"}
            </button>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.actionBtn}
            >
              ↗ Visit Link
            </a>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={() => setEditing(true)}
            >
              ✏️ Edit Destination
            </button>
            <button
              type="button"
              className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
              onClick={() => setDeleting(true)}
            >
              🗑️ Delete
            </button>
          </div>
        </div>
        <span className={`${styles.badge} ${styles.active}`}>Active</span>
      </header>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Total Clicks</p>
          <p className={styles.statValue}>{totalClicks.toLocaleString()}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Created</p>
          <p className={styles.statValue}>{formatDate(link.createdAt)}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Short Code</p>
          <p
            className={styles.statValue}
            style={{ fontSize: "1.25rem", fontFamily: "monospace" }}
          >
            {link.shortCode}
          </p>
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Click Analytics</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            color: "var(--muted)",
            fontSize: "0.9rem",
          }}
        >
          <p style={{ margin: 0 }}>
            This link has received{" "}
            <strong>{totalClicks.toLocaleString()}</strong> verified clicks
            recorded in the database.
          </p>
          <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.85 }}>
            Note: Granular hourly/daily click timeseries aggregation is pending
            future analytics endpoint support in the backend service. All click
            events are securely counted via redirect resolution.
          </p>
        </div>
      </div>

      <EditUrlModal
        isOpen={editing}
        url={link}
        onClose={() => setEditing(false)}
      />

      <DeleteUrlModal
        isOpen={deleting}
        url={link}
        onClose={() => setDeleting(false)}
        onSuccess={() => router.push("/links")}
      />
    </div>
  );
}
