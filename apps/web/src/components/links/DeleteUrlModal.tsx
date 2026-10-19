"use client";

import React, { useState } from "react";
import { useDeleteUrl } from "@/hooks/useUrls";
import { formatShortUrl, UrlItem } from "@/lib/urls-api";
import styles from "./url-modals.module.css";

interface DeleteUrlModalProps {
  isOpen: boolean;
  url: UrlItem | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeleteUrlModal({
  isOpen,
  url,
  onClose,
  onSuccess,
}: DeleteUrlModalProps) {
  const [error, setError] = useState<string | null>(null);
  const deleteMutation = useDeleteUrl();

  if (!isOpen || !url) return null;

  const shortUrl = formatShortUrl(url.shortCode);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(url.id);
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete URL";
      setError(msg);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>Delete Short Link</h3>
        <p className={styles.modalDesc}>
          Are you sure you want to delete <strong>{shortUrl}</strong>? This will permanently remove the short link and redirect. This action cannot be undone.
        </p>

        {error && <p className={styles.modalError}>{error}</p>}

        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.modalCancel}
            onClick={onClose}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`${styles.modalConfirm} ${styles.modalDanger}`}
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting…" : "Delete link"}
          </button>
        </div>
      </div>
    </div>
  );
}
