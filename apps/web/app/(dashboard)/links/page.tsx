"use client";

import React, { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { usePaginatedUrlsWithClicks } from "@/hooks/useUrls";
import { formatDate } from "@/lib/utils";
import { UrlItem } from "@/lib/urls-api";
import { EditUrlModal } from "@/components/links/EditUrlModal";
import { DeleteUrlModal } from "@/components/links/DeleteUrlModal";
import { LinkDetailModal } from "@/components/links/LinkDetailModal";
import styles from "./links.module.css";

function getPageNumbers(currentPage: number, totalPages: number): number[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: number[] = [];
  pages.push(1);
  if (currentPage > 3) {
    pages.push(-1); // indicator for ellipsis
  }
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  if (currentPage < totalPages - 2) {
    pages.push(-1); // indicator for ellipsis
  }
  pages.push(totalPages);
  return pages;
}

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

  // Read initial pagination from URL searchParams
  const initialPage = Math.max(
    1,
    parseInt(searchParams.get("page") || "1", 10) || 1
  );
  const limitParam = parseInt(searchParams.get("limit") || "10", 10);
  const initialLimit = [10, 25, 50].includes(limitParam) ? limitParam : 10;

  // Pagination state
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialLimit);

  // Server-side paginated links
  const {
    urls,
    pagination,
    isLoading,
    error,
    refetch,
  } = usePaginatedUrlsWithClicks(page, pageSize);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("all");
  const [filterSort, setFilterSort] = useState("recent");

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
    const p = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    if (p !== page) {
      setPage(p);
    }
    const l = parseInt(searchParams.get("limit") || "10", 10);
    if ([10, 25, 50].includes(l) && l !== pageSize) {
      setPageSize(l);
    }
    setDetailUrlId(searchParams.get("detail"));
  }, [searchParams, page, pageSize]);

  // Gracefully recover when page exceeds totalPages (e.g. after deletion of last item on page)
  useEffect(() => {
    if (pagination) {
      if (pagination.totalPages > 0 && page > pagination.totalPages) {
        setPage(pagination.totalPages);
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(pagination.totalPages));
        const q = params.toString();
        router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
      } else if (pagination.totalPages === 0 && page !== 1) {
        setPage(1);
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");
        const q = params.toString();
        router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
      }
    }
  }, [pagination, page, searchParams, pathname, router]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      const maxPage = pagination?.totalPages
        ? Math.max(1, pagination.totalPages)
        : 1;
      if (newPage < 1 || newPage > maxPage || newPage === page) return;
      setPage(newPage);
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(newPage));
      const q = params.toString();
      router.push(q ? `${pathname}?${q}` : pathname, { scroll: false });
    },
    [pagination?.totalPages, page, searchParams, pathname, router]
  );

  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      if (![10, 25, 50].includes(newSize) || newSize === pageSize) return;
      setPageSize(newSize);
      setPage(1);
      const params = new URLSearchParams(searchParams.toString());
      params.set("limit", String(newSize));
      params.set("page", "1");
      const q = params.toString();
      router.push(q ? `${pathname}?${q}` : pathname, { scroll: false });
    },
    [pageSize, searchParams, pathname, router]
  );

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

  // Filtered & Sorted items on the current server page
  const displayedLinks = useMemo(() => {
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
      // "recent" default (already ordered descending by backend)
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });

    return result;
  }, [urls, search, filterDate, filterSort]);

  // Pagination calculation from server metadata
  const totalRecords = pagination?.totalItems ?? 0;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);
  const startIndex = totalRecords === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex =
    totalRecords === 0
      ? 0
      : Math.min((page - 1) * pageSize + urls.length, totalRecords);

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
        {!isLoading && !error && totalRecords === 0 && (
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
          totalRecords > 0 &&
          displayedLinks.length === 0 && (
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
        {!isLoading && !error && displayedLinks.length > 0 && (
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
                {displayedLinks.map((link) => (
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
                Showing {startIndex} to {endIndex} of {totalRecords} links
              </div>

              <div className={styles.paginationControls}>
                <div className={styles.rowsPerPage}>
                  <span>Rows:</span>
                  <select
                    className={styles.rowsSelect}
                    value={pageSize}
                    onChange={(e) => {
                      handlePageSizeChange(Number(e.target.value));
                    }}
                    aria-label="Rows per page"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                <button
                  type="button"
                  className={styles.pageBtn}
                  disabled={page <= 1 || isLoading}
                  onClick={() => handlePageChange(page - 1)}
                  aria-label="Previous page"
                >
                  ‹
                </button>

                {getPageNumbers(page, totalPages).map((p, idx) =>
                  p === -1 ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className={styles.pageEllipsis}
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      type="button"
                      className={`${styles.pageBtn} ${
                        page === p ? styles.pageBtnActive : ""
                      }`}
                      onClick={() => handlePageChange(p)}
                      aria-label={`Page ${p}`}
                      aria-current={page === p ? "page" : undefined}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  type="button"
                  className={styles.pageBtn}
                  disabled={page >= totalPages || totalRecords === 0 || isLoading}
                  onClick={() => handlePageChange(page + 1)}
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
