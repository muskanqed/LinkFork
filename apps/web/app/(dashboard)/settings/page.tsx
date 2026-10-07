"use client";

import React, { useState } from "react";
import styles from "./settings.module.css";

export default function SettingsPage() {
  const [name, setName] = useState("Alex Morgan");
  const [email, setEmail] = useState("alex@acme.dev");
  const [workspace, setWorkspace] = useState("Acme");
  const [saved, setSaved] = useState(false);

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
        {/* Profile */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Profile</h2>
          <p className={styles.cardDesc}>Update your personal information.</p>

          <div className={styles.fields}>
            <div className={styles.fieldRow}>
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
          </div>
        </section>

        {/* Workspace */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Workspace</h2>
          <p className={styles.cardDesc}>Configure your workspace settings.</p>

          <div className={styles.fields}>
            <div className={styles.fieldGroup} style={{ maxWidth: 360 }}>
              <label htmlFor="workspace" className={styles.label}>Workspace name</label>
              <input
                id="workspace"
                type="text"
                className={styles.input}
                value={workspace}
                onChange={(e) => setWorkspace(e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup} style={{ maxWidth: 360 }}>
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

        {/* Danger zone */}
        <section className={`${styles.card} ${styles.dangerCard}`}>
          <h2 className={`${styles.cardTitle} ${styles.dangerTitle}`}>Danger zone</h2>
          <p className={styles.cardDesc}>Irreversible and destructive actions.</p>
          <button
            type="button"
            className={styles.dangerButton}
            onClick={() => {/* TODO: implement delete flow */}}
          >
            Delete account
          </button>
        </section>

        <div className={styles.saveRow}>
          {saved && <span className={styles.savedMsg}>✓ Changes saved</span>}
          <button type="submit" className={styles.saveButton}>Save changes</button>
        </div>
      </form>
    </div>
  );
}
