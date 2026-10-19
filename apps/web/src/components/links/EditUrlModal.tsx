"use client";

import React, { useState, useEffect } from "react";
import { useUpdateUrl } from "@/hooks/useUrls";
import { formatShortUrl, UrlItem } from "@/lib/urls-api";
import { validateUrl } from "@/lib/utils";
import styles from "./url-modals.module.css";

interface EditUrlModalProps {
  isOpen: boolean;
  url: UrlItem | null;
  onClose: () => void;
  onSuccess?: (updated: UrlItem) => void;
}

export function EditUrlModal({
  isOpen,
  url,
  onClose,
  onSuccess,
}: EditUrlModalProps) {
  const [destination, setDestination] = useState("");
  const [error, setError] = useState<string | null>(null);
  const updateMutation = useUpdateUrl();

  useEffect(() => {
    if (url) {
      setDestination(url.originalUrl);
      setError(null);
    }
  }, [url]);

  if (!isOpen || !url) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateUrl(destination, "Destination URL cannot be empty");
    if (!validation.isValid) {
      setError(validation.error || "Invalid URL");
      return;
    }

    try {
      const updated = await updateMutation.mutateAsync({
        id: url.id,
        payload: { originalUrl: destination.trim() },
      });
      onSuccess?.(updated);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update URL";
      setError(msg);
    }
  };

  const shortUrl = formatShortUrl(url.shortCode);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>Edit Destination URL</h3>
        <p className={styles.modalDesc}>
          Update the destination URL for short link <strong>{shortUrl}</strong>.
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalField}>
            <label htmlFor="editDestinationInput" className={styles.modalLabel}>
              Destination URL
            </label>
            <input
              id="editDestinationInput"
              type="url"
              className={styles.modalInput}
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                if (error) setError(null);
              }}
              autoFocus
              disabled={updateMutation.isPending}
            />
            {error && <p className={styles.modalError}>{error}</p>}
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.modalCancel}
              onClick={onClose}
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
  );
}
