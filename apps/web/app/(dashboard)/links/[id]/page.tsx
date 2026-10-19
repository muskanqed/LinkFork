"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUrl, useUrlClicks, useUpdateUrl, useDeleteUrl } from "@/hooks/useUrls";
import { formatShortUrl } from "@/lib/urls-api";
import styles from "./link-detail.module.css";

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function LinkDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  const { data: link, isLoading, error, refetch } = useUrl(id);
  const { data: clicksData } = useUrlClicks(id);

  const updateMutation = useUpdateUrl();
  const deleteMutation = useDeleteUrl();

  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editDestination, setEditDestination] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  const [deleting, setDeleting] = useState(false);

  // Extract total clicks for this specific URL from clicks response
  const totalClicks = React.useMemo(() => {
    if (!clicksData || !Array.isArray(clicksData)) return 0;
    const match = clicksData.find((item) => item.id === id);
    return match?._count?.clicks ?? 0;
  }, [clicksData, id]);

  const shortUrl = link ? formatShortUrl(link.shortCode) : "";

  const handleCopy = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenEdit = () => {
    if (!link) return;
    setEditDestination(link.originalUrl);
    setEditError(null);
    setEditing(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link) return;

    const trimmed = editDestination.trim();
    if (!trimmed) {
      setEditError("Destination URL cannot be empty");
      return;
    }

    try {
      const parsed = new URL(trimmed);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        setEditError("URL must start with http:// or https://");
        return;
      }
    } catch {
      setEditError("Please enter a valid URL including https://");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: link.id,
        payload: { originalUrl: trimmed },
      });
      setEditing(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update URL";
      setEditError(msg);
    }
  };

  const handleConfirmDelete = async () => {
    if (!link) return;
    try {
      await deleteMutation.mutateAsync(link.id);
      router.push("/links");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete URL");
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className={styles.skeletonLine} style={{ width: "30%" }} />
          <div className={styles.skeletonLine} style={{ width: "60%", height: "32px" }} />
          <div className={styles.skeletonLine} style={{ width: "80%" }} />
        </div>
        <div className={styles.statsRow}>
          <div className={styles.statCard}><div className={styles.skeletonLine} /></div>
          <div className={styles.statCard}><div className={styles.skeletonLine} /></div>
          <div className={styles.statCard}><div className={styles.skeletonLine} /></div>
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
            {error ? error.message : "This link does not exist or has been deleted."}
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
            Destination: <a href={link.originalUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>{link.originalUrl}</a>
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
              onClick={handleOpenEdit}
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
          <p className={styles.statValue} style={{ fontSize: "1.25rem", fontFamily: "monospace" }}>
            {link.shortCode}
          </p>
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Click Analytics</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", color: "var(--muted)", fontSize: "0.9rem" }}>
          <p style={{ margin: 0 }}>
            This link has received <strong>{totalClicks.toLocaleString()}</strong> verified clicks recorded in the database.
          </p>
          <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.85 }}>
            Note: Granular hourly/daily click timeseries aggregation is pending future analytics endpoint support in the backend service. All click events are securely counted via redirect resolution.
          </p>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {editing && (
        <div className={styles.modalOverlay} onClick={() => setEditing(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Edit Destination URL</h3>
            <p className={styles.modalDesc}>
              Update where visitors are redirected when clicking <strong>{shortUrl}</strong>.
            </p>

            <form onSubmit={handleSaveEdit}>
              <div className={styles.modalField}>
                <label htmlFor="editDestDetail" className={styles.modalLabel}>Destination URL</label>
                <input
                  id="editDestDetail"
                  type="url"
                  className={styles.modalInput}
                  value={editDestination}
                  onChange={(e) => {
                    setEditDestination(e.target.value);
                    if (editError) setEditError(null);
                  }}
                  autoFocus
                  disabled={updateMutation.isPending}
                />
                {editError && <p className={styles.modalError}>{editError}</p>}
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.modalCancel}
                  onClick={() => setEditing(false)}
                  disabled={updateMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.modalConfirm}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {deleting && (
        <div className={styles.modalOverlay} onClick={() => setDeleting(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Delete Short Link</h3>
            <p className={styles.modalDesc}>
              Are you sure you want to delete <strong>{shortUrl}</strong>? This action will permanently remove the short link and redirect.
            </p>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.modalCancel}
                onClick={() => setDeleting(false)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`${styles.modalConfirm} ${styles.modalDanger}`}
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting…" : "Delete link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
