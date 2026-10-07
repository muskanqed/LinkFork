"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./create.module.css";

// ── Icons ────────────────────────────────────────────────────────────────────

function ChainIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l1.88 5.76a1 1 0 0 0 .95.68h6.06l-4.9 3.56a1 1 0 0 0-.36 1.12L17.51 20 12 16.44 6.49 20l1.88-5.88a1 1 0 0 0-.36-1.12L3.11 9.44h6.06a1 1 0 0 0 .95-.68L12 3z" />
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
      style={{ transform: rotated ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function CreateLinkPage() {
  const router = useRouter();

  const [destination, setDestination] = useState("");
  const [alias, setAlias] = useState("");
  const [linkName, setLinkName] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Simple alias availability: show "Available" when alias is non-empty and passes basic chars
  const aliasAvailable = alias.length > 0 && /^[a-z0-9-]+$/.test(alias);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!destination.trim()) {
      setError("Destination URL is required.");
      return;
    }

    try {
      new URL(destination);
    } catch {
      setError("Please enter a valid URL including https://");
      return;
    }

    setSubmitting(true);
    // TODO: wire to POST /api/urls
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    router.push("/links");
  };

  return (
    <div className={styles.page}>
      {/* Page heading */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Create a Short Link</h1>
        <p className={styles.pageSubtitle}>Turn a long URL into a short, trackable link.</p>
      </div>

      {/* Form */}
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* Card */}
        <div className={styles.card}>
          {/* Card header */}
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Link details</h2>
            <p className={styles.cardSubtitle}>Set where your short link should lead.</p>
          </div>

          <div className={styles.divider} />

          {/* Destination URL */}
          <div className={styles.fieldGroup}>
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
                onChange={(e) => setDestination(e.target.value)}
                autoFocus
              />
            </div>
            <p className={styles.hint}>Enter the URL you want visitors to reach.</p>
          </div>

          {/* Custom alias */}
          <div className={styles.fieldGroup}>
            <label htmlFor="alias" className={styles.label}>
              Custom alias
            </label>
            <div className={styles.aliasRow}>
              <span className={styles.aliasPrefix}>linkfork.io/</span>
              <input
                id="alias"
                type="text"
                className={styles.aliasInput}
                placeholder="my-product"
                value={alias}
                onChange={(e) =>
                  setAlias(e.target.value.replace(/[^a-z0-9-]/gi, "").toLowerCase())
                }
                maxLength={40}
              />
            </div>
            {aliasAvailable && (
              <p className={styles.available}>
                <span className={styles.availableIcon}><CheckIcon /></span>
                Available
              </p>
            )}
          </div>

          {/* Link name */}
          <div className={styles.fieldGroup}>
            <label htmlFor="linkName" className={styles.label}>
              Link name{" "}
              <span className={styles.optional}>(optional)</span>
            </label>
            <input
              id="linkName"
              type="text"
              className={styles.input}
              placeholder="Product Launch"
              value={linkName}
              onChange={(e) => setLinkName(e.target.value)}
            />
            <p className={styles.hint}>Give your link a name to find it easily later.</p>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          {/* Advanced options */}
          <div className={styles.divider} />

          <button
            type="button"
            className={styles.advancedToggle}
            onClick={() => setAdvancedOpen((v) => !v)}
            aria-expanded={advancedOpen}
          >
            <span className={styles.advancedLeft}>
              <span className={styles.advancedIcon}><SparkleIcon /></span>
              <span className={styles.advancedLabel}>Advanced options</span>
            </span>
            <ChevronDownIcon rotated={advancedOpen} />
          </button>

          {advancedOpen && (
            <div className={styles.advancedContent}>
              {/* UTM parameters placeholder */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>UTM source <span className={styles.optional}>(optional)</span></label>
                <input type="text" className={styles.input} placeholder="e.g. newsletter" />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>UTM medium <span className={styles.optional}>(optional)</span></label>
                <input type="text" className={styles.input} placeholder="e.g. email" />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>UTM campaign <span className={styles.optional}>(optional)</span></label>
                <input type="text" className={styles.input} placeholder="e.g. product-launch" />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => router.push("/links")}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={submitting}
          >
            {submitting ? "Creating…" : "Create Short Link"}
          </button>
        </div>
      </form>
    </div>
  );
}
