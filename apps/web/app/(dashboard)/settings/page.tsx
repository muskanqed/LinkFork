"use client";

import React, { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useAuth";
import styles from "./settings.module.css";

export default function SettingsPage() {
  const { data: user } = useCurrentUser();
  const [name, setName] = useState(user?.name || "Alex Morgan");
  const [email, setEmail] = useState(user?.email || "alex@linkfork.io");
  const [workspace, setWorkspace] = useState("LinkFork");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user?.name) setName(user.name);
    if (user?.email) setEmail(user.email);
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Manage your account and workspace preferences.</p>
      </header>

      <form onSubmit={handleSave} className={styles.sections}>
        <div className={styles.grid}>
          {/* Profile */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIconBox}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <h2 className={styles.cardTitle}>Profile</h2>
                <p className={styles.cardDesc}>Update your personal information.</p>
              </div>
            </div>

            <div className={styles.fields}>
              <div className={styles.fieldGroup}>
                <label htmlFor="name" className={styles.label}>Full name</label>
                <input
                  id="name"
                  type="text"
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="email" className={styles.label}>Email address</label>
                <input
                  id="email"
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Workspace */}
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIconBox}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div>
                <h2 className={styles.cardTitle}>Workspace</h2>
                <p className={styles.cardDesc}>Configure your workspace settings.</p>
              </div>
            </div>

            <div className={styles.fields}>
              <div className={styles.fieldGroup}>
                <label htmlFor="workspace" className={styles.label}>Workspace name</label>
                <input
                  id="workspace"
                  type="text"
                  className={styles.input}
                  value={workspace}
                  onChange={(e) => setWorkspace(e.target.value)}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Default domain</label>
                <input
                  type="text"
                  className={styles.input}
                  value="linkfork.io"
                  readOnly
                  aria-readonly="true"
                />
                <p className={styles.hint}>Custom domains can be added on the Pro plan.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Danger zone */}
        <section className={`${styles.card} ${styles.dangerCard}`}>
          <div className={styles.dangerContent}>
            <div className={styles.dangerInfo}>
              <div className={styles.dangerHeaderRow}>
                <div className={styles.dangerIconBox}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <div>
                  <h2 className={`${styles.cardTitle} ${styles.dangerTitle}`}>Danger zone</h2>
                  <p className={styles.cardDesc}>Irreversible and destructive actions.</p>
                </div>
              </div>
            </div>
            <button
              type="button"
              className={styles.dangerButton}
              onClick={() => {/* TODO: implement delete flow */}}
            >
              Delete account
            </button>
          </div>
        </section>

        <div className={styles.saveRow}>
          {saved && <span className={styles.savedMsg}>✓ Changes saved</span>}
          <button type="submit" className={styles.saveButton}>Save changes</button>
        </div>
      </form>
    </div>
  );
}
