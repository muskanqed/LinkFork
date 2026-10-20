"use client";

import React, { useState, useEffect, useRef } from "react";
import { useUrlDetail } from "@/hooks/useUrls";
import { formatDate } from "@/lib/utils";
import { EditUrlModal } from "@/components/links/EditUrlModal";
import { DeleteUrlModal } from "@/components/links/DeleteUrlModal";
import styles from "./link-detail-modal.module.css";

interface LinkDetailModalProps {
  isOpen: boolean;
  urlId: string | null;
  onClose: () => void;
}

export function LinkDetailModal({
  isOpen,
  urlId,
  onClose,
}: LinkDetailModalProps) {
  // Always invoke hook with fallback to keep React hooks order stable
  const { link, shortUrl, totalClicks, isLoading, error, refetch } =
    useUrlDetail(urlId || "");

  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const prevActiveElement = useRef<HTMLElement | null>(null);

  // Store trigger element on open and restore on close
  useEffect(() => {
    if (isOpen) {
      prevActiveElement.current = document.activeElement as HTMLElement | null;
      // Focus close button initially for accessibility
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);
    } else if (prevActiveElement.current) {
      prevActiveElement.current.focus?.();
      prevActiveElement.current = null;
    }
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Handle Escape key and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // If a nested modal (Edit or Delete) is open, let that modal handle Escape
      if (editing || deleting) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, editing, deleting, onClose]);

  const handleCopy = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !urlId) return null;

  return (
    <div
      className={styles.modalOverlay}
      onClick={(e) => {
        if (e.target === e.currentTarget && !editing && !deleting) {
          onClose();
        }
      }}
      aria-hidden="false"
    >
      <div
        ref={modalRef}
        className={styles.modalCard}
        role="dialog"
        aria-modal="true"
        aria-labelledby="link-detail-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className={styles.modalHeader}>
          <div className={styles.headerTitleGroup}>
            <h2 id="link-detail-modal-title" className={styles.modalTitle}>
              Link Details
            </h2>
          </div>
          <div className={styles.headerActions}>
            <span className={styles.statusBadge}>
              <span className={styles.statusDot} />
              Active
            </span>
            <button
              ref={closeBtnRef}
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close details modal"
            >
              ✕
            </button>
          </div>
        </header>

        {/* Body */}
        <div className={styles.modalBody}>
          {isLoading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className={styles.skeletonLine} style={{ width: "40%" }} />
              <div className={styles.skeletonLine} style={{ width: "70%", height: "36px" }} />
              <div className={styles.skeletonLine} style={{ width: "90%" }} />
              <div className={styles.statsGrid} style={{ marginTop: "0.5rem" }}>
                <div className={styles.statCard}>
                  <div className={styles.skeletonLine} style={{ width: "50%" }} />
                  <div className={styles.skeletonLine} style={{ width: "70%", height: "28px" }} />
                </div>
                <div className={styles.statCard}>
                  <div className={styles.skeletonLine} style={{ width: "50%" }} />
                  <div className={styles.skeletonLine} style={{ width: "70%", height: "28px" }} />
                </div>
                <div className={styles.statCard}>
                  <div className={styles.skeletonLine} style={{ width: "50%" }} />
                  <div className={styles.skeletonLine} style={{ width: "70%", height: "28px" }} />
                </div>
              </div>
            </div>
          )}

          {error && !isLoading && (
            <div className={styles.errorState}>
              <div className={styles.errorIcon}>⚠️</div>
              <h3 className={styles.errorTitle}>Unable to load link details</h3>
              <p className={styles.errorText}>
                {error.message || "This link could not be found or has been deleted."}
              </p>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  className={styles.secondaryActionBtn}
                  onClick={() => refetch()}
                >
                  Retry
                </button>
                <button
                  type="button"
                  className={styles.doneButton}
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {!isLoading && !error && link && (
            <>
              {/* Hero Short Link Box */}
              <div className={styles.heroCard}>
                <div className={styles.heroTop}>
                  <div className={styles.shortUrlWrapper}>
                    <span className={styles.shortUrlLabel}>Short URL</span>
                    <div className={styles.shortUrlRow}>
                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.shortUrlValue}
                        title="Open short link in new tab"
                      >
                        {shortUrl}
                      </a>
                      <button
                        type="button"
                        className={styles.copyIconButton}
                        onClick={handleCopy}
                        title={copied ? "Copied to clipboard" : "Copy short URL"}
                        aria-label="Copy short URL"
                      >
                        {copied ? (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#16a34a"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        )}
                      </button>
                      {copied && <span className={styles.copiedBadge}>Copied!</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Destination URL Card */}
              <div className={styles.destinationCard}>
                <span className={styles.fieldLabel}>Original Destination URL</span>
                <div className={styles.destinationValue}>
                  <a
                    href={link.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.destinationLink}
                    title={link.originalUrl}
                  >
                    <span>{link.originalUrl}</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className={styles.actionButtonsRow}>
                <button
                  type="button"
                  className={styles.primaryActionBtn}
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      Copy Short URL
                    </>
                  )}
                </button>

                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.secondaryActionBtn}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Visit Link
                </a>

                <button
                  type="button"
                  className={styles.secondaryActionBtn}
                  onClick={() => setEditing(true)}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                  </svg>
                  Edit Destination
                </button>

                <button
                  type="button"
                  className={`${styles.secondaryActionBtn} ${styles.dangerActionBtn}`}
                  onClick={() => setDeleting(true)}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  Delete
                </button>
              </div>

              {/* Key Metrics Grid (3 summary cards) */}
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Total Clicks</span>
                  <span className={styles.statValue}>
                    {totalClicks.toLocaleString()}
                  </span>
                  <span className={styles.statMeta}>Recorded redirect visits</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Created Date</span>
                  <span className={styles.statValue} style={{ fontSize: "1.05rem" }}>
                    {formatDate(link.createdAt)}
                  </span>
                  <span className={styles.statMeta}>Date created</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Short Code</span>
                  <span className={`${styles.statValue} ${styles.statCode}`}>
                    {link.shortCode}
                  </span>
                  <span className={styles.statMeta}>Custom hash token</span>
                </div>
              </div>

              {/* Click Analytics Section */}
              <div className={styles.analyticsCard}>
                <div className={styles.analyticsHeader}>
                  <h3 className={styles.analyticsTitle}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                    Click Analytics
                  </h3>
                  <div className={styles.analyticsSummary}>
                    <span className={styles.analyticsCount}>
                      {totalClicks.toLocaleString()}
                    </span>
                    <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                      verified clicks
                    </span>
                  </div>
                </div>

                <div className={styles.analyticsNotice}>
                  <p style={{ margin: 0 }}>
                    This link has received{" "}
                    <strong>{totalClicks.toLocaleString()}</strong> verified clicks
                    recorded in the database.
                  </p>
                  <p
                    style={{
                      margin: "0.35rem 0 0",
                      fontSize: "0.8rem",
                      opacity: 0.85,
                    }}
                  >
                    Note: Granular hourly/daily click timeseries aggregation is
                    pending future analytics endpoint support in the backend service.
                    All click events are securely counted via redirect resolution.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer / Dismiss Bar */}
        {!isLoading && !error && link && (
          <footer className={styles.modalFooter}>
            <div className={styles.footerLeft}>
              <span className={styles.footerIdLabel}>
                Link ID: <code>{link.id}</code>
              </span>
            </div>
            <div className={styles.footerRight}>
              <button
                type="button"
                className={styles.doneButton}
                onClick={onClose}
              >
                Done
              </button>
            </div>
          </footer>
        )}
      </div>

      {/* Existing Edit Modal */}
      <EditUrlModal
        isOpen={editing}
        url={link || null}
        onClose={() => setEditing(false)}
      />

      {/* Existing Delete Modal */}
      <DeleteUrlModal
        isOpen={deleting}
        url={link || null}
        onClose={() => setDeleting(false)}
        onSuccess={() => {
          setDeleting(false);
          onClose();
        }}
      />
    </div>
  );
}
