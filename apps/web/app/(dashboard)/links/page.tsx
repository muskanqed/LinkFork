"use client";

import React, { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useUrlsWithClicks } from "@/hooks/useUrls";
import { formatDate } from "@/lib/utils";
import { UrlItem } from "@/lib/urls-api";
import { EditUrlModal } from "@/components/links/EditUrlModal";
import { DeleteUrlModal } from "@/components/links/DeleteUrlModal";
import { LinkDetailModal } from "@/components/links/LinkDetailModal";
import styles from "./links.module.css";

// ── Icons ────────────────────────────────────────────────────────────────────

const ChevronDown = () => (
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
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const DotsIcon = () => (
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
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

const ExternalIcon = () => (
  <svg
    width="13"
    height="13"
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
);

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status = "Active" }: { status?: string }) {
  return (
    <span className={`${styles.badge} ${styles.badgeActive}`}>
      <span className={styles.badgeDot} style={{ background: "#16a34a" }} />
      {status}
    </span>
  );
}

// ── Page Component ────────────────────────────────────────────────────────────

function LinksPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { urls, rawUrls, isLoading, error, refetch } = useUrlsWithClicks();

  // Filters & Search
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("all");
  const [filterSort, setFilterSort] = useState("recent");

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Active action menu
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Copied feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals state
  const [editingUrl, setEditingUrl] = useState<UrlItem | null>(null);
  const [deletingUrl, setDeletingUrl] = useState<UrlItem | null>(null);

  // Detail Modal state (synced with ?detail=id query param)
  const detailUrlParam = searchParams.get("detail");
  const [detailUrlId, setDetailUrlId] = useState<string | null>(detailUrlParam);

  // Keep state in sync with URL searchParams (e.g. browser back/forward or direct link)
  useEffect(() => {
    setDetailUrlId(searchParams.get("detail"));
  }, [searchParams]);

  const handleOpenDetail = useCallback(
    (id: string) => {
      setDetailUrlId(id);
      const params = new URLSearchParams(searchParams.toString());
      params.set("detail", id);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, searchParams, router]
  );

  const handleCloseDetail = useCallback(() => {
    setDetailUrlId(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("detail");
    const q = params.toString();
    router.push(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }, [pathname, searchParams, router]);

  // Filtered & Sorted items
  const filteredLinks = useMemo(() => {
    let result = [...urls];

    // Search filter
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (u) =>
          u.shortCode.toLowerCase().includes(q) ||
          u.originalUrl.toLowerCase().includes(q)
      );
    }

    // Date filter
    if (filterDate !== "all") {
      const now = Date.now();
      const cutoffMap: Record<string, number> = {
        "7d": 7 * 24 * 60 * 60 * 1000,
        "30d": 30 * 24 * 60 * 60 * 1000,
        "90d": 90 * 24 * 60 * 60 * 1000,
        "1y": 365 * 24 * 60 * 60 * 1000,
      };
      const cutoff = cutoffMap[filterDate];
      if (cutoff) {
        result = result.filter((u) => {
          const createdTime = new Date(u.createdAt).getTime();
          return now - createdTime <= cutoff;
        });
      }
    }

    // Sort
    result.sort((a, b) => {
      if (filterSort === "clicks") {
        return b.clicks - a.clicks;
      }
      if (filterSort === "alpha") {
        return a.originalUrl.localeCompare(b.originalUrl);
      }
      // "recent" default
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });

    return result;
  }, [urls, search, filterDate, filterSort]);

  // Pagination calculation
  const totalRecords = filteredLinks.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);
  const paginatedLinks = filteredLinks.slice(startIndex, endIndex);

  // Copy handler
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setActiveMenuId(null);
    setTimeout(() => {
      setCopiedId((current) => (current === id ? null : current));
    }, 2000);
  };

  const handleOpenEdit = (url: UrlItem) => {
    setEditingUrl(url);
    setActiveMenuId(null);
  };

  const handleOpenDelete = (url: UrlItem) => {
    setDeletingUrl(url);
    setActiveMenuId(null);
  };

  return (
    <div className={styles.container}>
      {/* ── Page header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Your Links</h1>
          <p className={styles.subtitle}>
            Create, organize, and monitor all your shortened URLs.
          </p>
        </div>
        <Link href="/links/create" className={styles.createButton}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
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
            <svg
              className={styles.searchIcon}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by short code or destination..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className={styles.filters}>
            <div className={styles.filterWrapper}>
              <select
                className={styles.filterSelect}
                value={filterDate}
                onChange={(e) => {
                  setFilterDate(e.target.value);
                  setPage(1);
                }}
                aria-label="Filter by date"
              >
                <option value="all">All time</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <span className={styles.filterChevron}>
                <ChevronDown />
              </span>
            </div>
            <div className={styles.filterWrapper}>
              <select
                className={styles.filterSelect}
                value={filterSort}
                onChange={(e) => setFilterSort(e.target.value)}
                aria-label="Sort by"
              >
                <option value="recent">Most recent</option>
                <option value="clicks">Most clicks</option>
                <option value="alpha">Alphabetical</option>
              </select>
              <span className={styles.filterChevron}>
                <ChevronDown />
              </span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div style={{ padding: "1.5rem" }}>
            <table className={styles.table}>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className={styles.tr}>
                    <td className={styles.td} style={{ width: "30%" }}>
                      <div className={styles.skeletonLine} />
                    </td>
                    <td className={styles.td} style={{ width: "40%" }}>
                      <div className={styles.skeletonLine} />
                    </td>
                    <td className={styles.td} style={{ width: "15%" }}>
                      <div className={styles.skeletonLine} />
                    </td>
                    <td className={styles.td} style={{ width: "15%" }}>
                      <div className={styles.skeletonLine} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>⚠️</div>
            <h3 className={styles.emptyTitle}>Unable to load links</h3>
            <p className={styles.emptyText}>{error.message}</p>
            <button
              type="button"
              className={styles.retryBtn}
              onClick={() => refetch()}
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State (User has no links at all) */}
        {!isLoading && !error && rawUrls && rawUrls.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔗</div>
            <h3 className={styles.emptyTitle}>No shortened links yet</h3>
            <p className={styles.emptyText}>
              Create your first trackable short link to start gathering analytics
              and sharing clean URLs.
            </p>
            <Link
              href="/links/create"
              className={styles.createButton}
              style={{ marginTop: "0.5rem" }}
            >
              Create your first link
            </Link>
          </div>
        )}

        {/* Filter Empty State (Search returned 0 results) */}
        {!isLoading &&
          !error &&
          rawUrls &&
          rawUrls.length > 0 &&
          filteredLinks.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🔍</div>
              <h3 className={styles.emptyTitle}>No matching links found</h3>
              <p className={styles.emptyText}>
                No links matched your search query or filter criteria. Try
                clearing your filters.
              </p>
              <button
                type="button"
                className={styles.retryBtn}
                onClick={() => {
                  setSearch("");
                  setFilterDate("all");
                  setFilterSort("recent");
                }}
              >
                Reset filters
              </button>
            </div>
          )}

        {/* Table Content */}
        {!isLoading && !error && paginatedLinks.length > 0 && (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Short Link</th>
                  <th className={styles.th}>Destination URL</th>
                  <th className={styles.th}>Clicks</th>
                  <th className={styles.th}>Created</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}></th>
                </tr>
              </thead>
              <tbody>
                {paginatedLinks.map((link) => (
                  <tr
                    key={link.id}
                    className={`${styles.tr} ${styles.trClickable}`}
                    onClick={() => handleOpenDetail(link.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${link.shortCode}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleOpenDetail(link.id);
                      }
                    }}
                  >
                    <td className={styles.td}>
                      <div className={styles.linkCell}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                          }}
                        >
                          <a
                            href={`/links?detail=${link.id}`}
                            className={styles.shortUrl}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleOpenDetail(link.id);
                            }}
                          >
                            {link.shortUrl}
                          </a>
                          {copiedId === link.id && (
                            <span className={styles.copiedToast}>✓ Copied</span>
                          )}
                        </div>
                        <span className={styles.linkName}>
                          Code: {link.shortCode}
                        </span>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <span
                        className={styles.destination}
                        title={link.originalUrl}
                      >
                        {link.originalUrl}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.clicksNum}>
                        {link.clicks.toLocaleString()}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.dateCell}>
                        {formatDate(link.createdAt)}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <StatusBadge status="Active" />
                    </td>
                    <td className={`${styles.td} ${styles.actionCell}`}>
                      <button
                        type="button"
                        className={styles.dotsBtn}
                        aria-label="More actions"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(
                            activeMenuId === link.id ? null : link.id
                          );
                        }}
                      >
                        <DotsIcon />
                      </button>

                      {activeMenuId === link.id && (
                        <div
                          className={styles.actionMenu}
                          onClick={(e) => e.stopPropagation()}
                          onMouseLeave={() => setActiveMenuId(null)}
                        >
                          <button
                            type="button"
                            className={styles.actionItem}
                            onClick={() => handleCopy(link.id, link.shortUrl)}
                          >
                            📋 Copy short URL
                          </button>
                          <a
                            href={link.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.actionItem}
                            onClick={() => setActiveMenuId(null)}
                          >
                            <ExternalIcon /> Open in new tab
                          </a>
                          <button
                            type="button"
                            className={styles.actionItem}
                            onClick={() => {
                              setActiveMenuId(null);
                              handleOpenDetail(link.id);
                            }}
                          >
                            📊 View details
                          </button>
                          <button
                            type="button"
                            className={styles.actionItem}
                            onClick={() => handleOpenEdit(link)}
                          >
                            ✏️ Edit destination
                          </button>
                          <button
                            type="button"
                            className={`${styles.actionItem} ${styles.actionItemDanger}`}
                            onClick={() => handleOpenDelete(link)}
                          >
                            🗑️ Delete link
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination controls */}
            <div className={styles.paginationBar}>
              <div className={styles.paginationInfo}>
                Showing {startIndex + 1} to {endIndex} of {totalRecords} links
              </div>

              <div className={styles.paginationControls}>
                <div className={styles.rowsPerPage}>
                  <span>Rows:</span>
                  <select
                    className={styles.rowsSelect}
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                    aria-label="Rows per page"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                <button
                  type="button"
                  className={styles.pageBtn}
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-label="Previous page"
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    return (
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - currentPage) <= 1
                    );
                  })
                  .map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`${styles.pageBtn} ${
                        currentPage === p ? styles.pageBtnActive : ""
                      }`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))}

                <button
                  type="button"
                  className={styles.pageBtn}
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  aria-label="Next page"
                >
                  ›
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <LinkDetailModal
        isOpen={Boolean(detailUrlId)}
        urlId={detailUrlId}
        onClose={handleCloseDetail}
      />

      <EditUrlModal
        isOpen={Boolean(editingUrl)}
        url={editingUrl}
        onClose={() => setEditingUrl(null)}
      />

      <DeleteUrlModal
        isOpen={Boolean(deletingUrl)}
        url={deletingUrl}
        onClose={() => setDeletingUrl(null)}
      />
    </div>
  );
}

export default function LinksPage() {
  return (
    <Suspense fallback={null}>
      <LinksPageContent />
    </Suspense>
  );
}
