"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateUrl } from "@/hooks/useUrls";
import styles from "./create.module.css";

// ── Icons ────────────────────────────────────────────────────────────────────

function ChainIcon() {
  return (
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
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.3L12 17l-6.2 4.2 2.4-7.3L2 9.4h7.6z" />
    </svg>
  );
}

function ChevronDownIcon({ rotated }: { rotated: boolean }) {
  return (
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
      style={{
        transform: rotated ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.2s ease",
        flexShrink: 0,
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function CreateLinkPage() {
  const router = useRouter();
  const createUrlMutation = useCreateUrl();

  const [destination, setDestination] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = destination.trim();
    if (!trimmed) {
      setError("Destination URL is required.");
      return;
    }

    try {
      const parsed = new URL(trimmed);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        setError("URL must start with http:// or https://");
        return;
      }
    } catch {
      setError("Please enter a valid URL including https://");
      return;
    }

    setError(null);

    try {
      await createUrlMutation.mutateAsync({
        originalUrl: trimmed,
      });
      router.push("/links");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create short URL";
      setError(message);
    }
  };

  const isPending = createUrlMutation.isPending;

  return (
    <form className={styles.page} onSubmit={handleSubmit} noValidate>
      {/* ── 1. Page heading ── */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Create a Short Link</h1>
        <p className={styles.pageSubtitle}>
          Turn a long URL into a short, trackable link.
        </p>
      </div>

      {/* ── 2. Card ── */}
      <div className={styles.card}>
        {/* Card header */}
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Link details</h2>
          <p className={styles.cardSubtitle}>
            Set where your short link should lead.
          </p>
        </div>

        <div className={styles.divider} />

        {/* Form body */}
        <div className={styles.formBody}>
          {/* Destination URL */}
          <div className={styles.field}>
            <label htmlFor="destination" className={styles.label}>
              Destination URL
            </label>
            <div className={styles.inputWithIcon}>
              <span className={styles.inputIcon}>
                <ChainIcon />
              </span>
              <input
                id="destination"
                type="url"
                className={styles.iconInput}
                placeholder="https://example.com/your-long-url"
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  if (error) setError(null);
                }}
                autoFocus
                disabled={isPending}
              />
            </div>
            {error ? (
              <p className={styles.fieldError}>{error}</p>
            ) : (
              <p className={styles.hint}>
                Enter the full destination URL you want visitors to reach. A unique 7-character short code will be automatically generated.
              </p>
            )}
          </div>
        </div>

        {/* Advanced options */}
        <div className={styles.divider} />

        <button
          type="button"
          className={styles.advancedToggle}
          onClick={() => setAdvancedOpen((v) => !v)}
          aria-expanded={advancedOpen}
        >
          <span className={styles.advancedLeft}>
            <span className={styles.advancedIcon}>
              <SparkleIcon />
            </span>
            <span className={styles.advancedLabel}>Advanced options</span>
          </span>
          <ChevronDownIcon rotated={advancedOpen} />
        </button>

        {advancedOpen && (
          <div className={styles.advancedBody}>
            <div className={styles.advancedField}>
              <label className={styles.label}>
                UTM source <span className={styles.optional}>(optional)</span>
              </label>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. newsletter"
                disabled={isPending}
              />
            </div>
            <div className={styles.advancedField}>
              <label className={styles.label}>
                UTM medium <span className={styles.optional}>(optional)</span>
              </label>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. email"
                disabled={isPending}
              />
            </div>
            <div className={styles.advancedField}>
              <label className={styles.label}>
                UTM campaign <span className={styles.optional}>(optional)</span>
              </label>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. product-launch"
                disabled={isPending}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── 3. Action buttons ── */}
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={() => router.push("/links")}
          disabled={isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isPending}
        >
          {isPending ? "Creating…" : "Create Short Link"}
        </button>
      </div>
    </form>
  );
}
