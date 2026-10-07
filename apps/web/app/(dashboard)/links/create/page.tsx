"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./create.module.css";

export default function CreateLinkPage() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [alias, setAlias] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
    await new Promise((r) => setTimeout(r, 600)); // simulate network
    setSubmitting(false);
    router.push("/links");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Create Link</h1>
        <p className={styles.subtitle}>Shorten a URL and start tracking clicks.</p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.card}>
          <div className={styles.fieldGroup}>
            <label htmlFor="destination" className={styles.label}>
              Destination URL <span className={styles.required}>*</span>
            </label>
            <input
              id="destination"
              type="url"
              className={styles.input}
              placeholder="https://example.com/your-long-url"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              autoFocus
            />
            <p className={styles.hint}>The full URL you want to shorten.</p>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="alias" className={styles.label}>
              Custom alias <span className={styles.optional}>(optional)</span>
            </label>
            <div className={styles.aliasRow}>
              <span className={styles.aliasPrefix}>linkfork.io/</span>
              <input
                id="alias"
                type="text"
                className={styles.aliasInput}
                placeholder="my-link"
                value={alias}
                onChange={(e) => setAlias(e.target.value.replace(/[^a-z0-9-]/gi, "").toLowerCase())}
                maxLength={40}
              />
            </div>
            <p className={styles.hint}>Leave blank to auto-generate a short code.</p>
          </div>

          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => router.push("/links")}
            disabled={submitting}
          >
            Cancel
          </button>
          <button type="submit" className={styles.submitButton} disabled={submitting}>
            {submitting ? "Creating…" : "Create Link"}
          </button>
        </div>
      </form>
    </div>
  );
}
